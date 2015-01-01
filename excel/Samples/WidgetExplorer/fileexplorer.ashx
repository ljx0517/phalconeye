<%@ WebHandler Language="C#" Class="fileexplorer" %>

using System;
using System.IO;
using System.Collections.Specialized;
using System.Runtime.Serialization.Json;
using System.Web;
using System.Web.UI.WebControls;
using System.Runtime.Serialization;
using System.ComponentModel;
using System.Collections.Generic;
using System.Text.RegularExpressions;
using System.Linq;

public static class Utils
{
    public static TEnum SafeParseEnum<TEnum>(this string strValue) where TEnum : struct, System.IConvertible
    {
        if (!typeof(TEnum).IsEnum)
        {
            throw new System.ArgumentException("T must be an enumerated type");
        }

        try
        {
            return (TEnum)System.Enum.Parse(typeof(TEnum), strValue, true);
        }
        catch (System.Exception)
        {
            return default(TEnum);
        }
    }

    public static string[] SafeParseStrings(this string strValue)
    {
        return string.IsNullOrEmpty(strValue)
            ? null
            : strValue.Split(',').Where(s => !string.IsNullOrEmpty(s)).ToArray();
    }

    public static bool SafeParseBool(this string strValue, bool defaultValue = false)
    {
        bool value;
        return bool.TryParse(strValue, out value) ? value : defaultValue;
    }

    public static int SafeParseInt(this string strValue, int defaultValue = 0)
    {
        int value;
        return int.TryParse(strValue, out value) ? value : defaultValue;
    }
}

public class fileexplorer : IHttpHandler
{

    public enum FileCommand
    {
        /// <summary>
        /// open a file or folder
        /// </summary>
        Open,
        /// <summary>
        /// paste a file or folder to a location
        /// </summary>
        Paste,
        /// <summary>
        /// get sub folders and files contained in
        /// </summary>
        GetItems,
        /// <summary>
        /// create a new directory
        /// </summary>
        CreateDirectory,
        /// <summary>
        /// delete files or folders
        /// </summary>
        Delete,
        /// <summary>
        /// rename a file or directory
        /// </summary>
        Rename,
        /// <summary>
        /// Move files or folders to a new folder
        /// </summary>
        Move,
        /// <summary>
        /// Get the root uri of the web site.
        /// </summary>
        GetHostUri
    }

    public enum SortField
    {
        /// <summary>
        /// The name field.
        /// </summary>
        Name,

        /// <summary>
        /// The size field.
        /// </summary>
        Size
    }
    
    public interface IItemOperationResult
    {
        /// <summary>
        /// The path of the item.
        /// </summary>
        string Path { get; }
    }

    [DataContract]
    public class ItemOperationResult : IItemOperationResult
    {
        public ItemOperationResult(string path)
        {
            Path = path;
        }

        /// <summary>
        /// Gets whether the operation succeeds.
        /// </summary>
        [DataMember(Name = "success", EmitDefaultValue = false)]
        public bool Success
        {
            get;
            set;
        }

        /// <summary>
        /// Gets the error.
        /// </summary>
        [DataMember(Name = "error", EmitDefaultValue = false)]
        public string Error
        {
            get;
            set;
        }

        /// <summary>
        /// Gets the item's path.
        /// </summary>
        [DataMember(Name = "path", EmitDefaultValue = false)]
        public string Path
        {
            get;
            private set;
        }
    }

    [DataContract]
    public class FileExplorerItem : IItemOperationResult
    {
        /// <summary>
        /// Create a FileExplorerItem with the specified path.
        /// </summary>
        public FileExplorerItem(string path)
        {
            var localPath = Helper.MapPath(path);
            if (Helper.IsDirectory(localPath))
            {
                var dirInfo = new DirectoryInfo(localPath);
                InitByDirInfo(dirInfo);
            }
            else
            {
                var fileInfo = new FileInfo(localPath);
                InitByDirInfo(fileInfo);

            }
            Path = path;
        }

        /// <summary>
        /// Create a FileExplorerItem with the specified parent path and DirectoryInfo.
        /// </summary>
        public FileExplorerItem(string virtualParentPath, DirectoryInfo dirInfo)
        {
            InitByDirInfo(dirInfo);
            Path = System.IO.Path.Combine(virtualParentPath, Name).Replace("\\", "/");
        }

        /// <summary>
        /// Create a FileExplorerItem with the specified parent path and FileInfo.
        /// </summary>
        public FileExplorerItem(string virtualParentPath, FileInfo fileInfo)
        {
            InitByDirInfo(fileInfo);
            Path = System.IO.Path.Combine(virtualParentPath, Name).Replace("\\", "/");
        }

        private void InitByDirInfo(FileInfo fileInfo)
        {
            Name = fileInfo.Name;
            NameWithoutExtension = System.IO.Path.GetFileNameWithoutExtension(fileInfo.FullName);
            Size = fileInfo.Length;
        }

        private void InitByDirInfo(DirectoryInfo dirInfo)
        {
            IsFolder = true;
            HasChildren = dirInfo.GetFileSystemInfos().Length > 0;
            HasSubFolders = dirInfo.GetDirectories().Length > 0;
            Name = dirInfo.Name;
            NameWithoutExtension = dirInfo.Name;
        }

        /// <summary>
        /// Gets current item's path.
        /// </summary>
        [DataMember(Name = "path")]
        public string Path { get; private set; }

        internal string NameWithoutExtension { get; private set; }

        internal string Name { get; private set; }

        /// <summary>
        /// Gets whether current item has subfolders.
        /// </summary>
        [DataMember(Name = "hasSubFolders", EmitDefaultValue = false)]
        public bool? HasSubFolders { get; private set; }

        /// <summary>
        /// Gets whether current item has children.
        /// </summary>
        [DataMember(Name = "hasChildren", EmitDefaultValue = false)]
        public bool? HasChildren { get; private set; }

        /// <summary>
        /// Gets whether current item is a folder.
        /// </summary>
        [DataMember(Name = "isFolder")]
        public bool IsFolder { get; private set; }

        /// <summary>
        /// Gets whether current item's size.
        /// </summary>
        [DataMember(Name = "size", EmitDefaultValue = false)]
        public long? Size { get; private set; }
    }

    public class FileExplorerAction
    {
        private const string AllFilesSearchPattern = "*.*";

        public ActionResult Process(ActionParam param)
        {
            try
            {
                switch (param.CommandName)
                {
                    case FileCommand.Open:
                    case FileCommand.GetItems:
                        return ProcessGetItems(param);
                    case FileCommand.CreateDirectory:
                        return ProcessNewFolder(param);
                    case FileCommand.Delete:
                        return ProcessDelete(param);
                    case FileCommand.Move:
                        return ProcessMove(param);
                    case FileCommand.Paste:
                        return ProcessPaste(param);
                    case FileCommand.Rename:
                        return ProcessRename(param);
                    case FileCommand.GetHostUri:
                        return ProcessGetHostUri(param);
                }
            }
            catch (Exception ex)
            {
                return CreateErrorResponse(ex);
            }

            return CreateErrorResponse("Unknow commad name.");
        }

        private ActionResult ProcessRename(ActionParam param)
        {
            var sourcePath = param.SourcePaths[0];
            var localSourcePath = Helper.MapPath(sourcePath);
            var localNewPath = Helper.MapPath(param.Path);
            Directory.Move(localSourcePath, localNewPath);
            return CreateSuccessResponse();
        }

        private ActionResult ProcessPaste(ActionParam param)
        {
            var desLocalPath = Helper.MapPath(param.Path);
            var items = new List<ItemOperationResult>();
            foreach (var path in param.SourcePaths)
            {
                var item = new ItemOperationResult(path);
                try
                {
                    Copy(Helper.MapPath(path), desLocalPath);
                    item.Success = true;
                }
                catch (Exception ex)
                {
                    item.Error = ex.Message;
                }

                items.Add(item);
            }

            var responseData = CreateSuccessResponse();
            responseData.ItemOperationResults = items.Cast<IItemOperationResult>().ToList();
            return responseData;
        }

        private ActionResult ProcessMove(ActionParam param)
        {
            var desLocalPath = Helper.MapPath(param.Path);
            var items = new List<ItemOperationResult>();
            foreach (var path in param.SourcePaths)
            {
                var item = new ItemOperationResult(path);

                try
                {
                    var localPath = Helper.MapPath(path);
                    var fileName = Path.GetFileName(localPath);
                    Directory.Move(localPath, Path.Combine(desLocalPath, fileName));
                    item.Success = true;
                }
                catch (Exception ex)
                {
                    item.Error = ex.Message;
                }
                items.Add(item);
            }

            var responseData = CreateSuccessResponse();
            responseData.ItemOperationResults = items.Cast<IItemOperationResult>().ToList();
            return responseData;
        }

        private ActionResult ProcessDelete(ActionParam param)
        {
            var itemOperations = param.SourcePaths.Select(ProcessDeleteItem).ToList();
            var responseData = CreateSuccessResponse();
            responseData.ItemOperationResults = itemOperations.Cast<IItemOperationResult>().ToList();
            return responseData;
        }

        private ItemOperationResult ProcessDeleteItem(string path)
        {
            var itemOperation = new ItemOperationResult(path);

            try
            {
                var localPath = Helper.MapPath(path);
                if (Helper.IsDirectory(localPath))
                {
                    Directory.Delete(localPath, true);
                }
                else
                {
                    File.Delete(localPath);
                }
                itemOperation.Success = true;
            }
            catch (Exception ex)
            {
                itemOperation.Error = ex.Message;
            }

            return itemOperation;
        }

        private ActionResult ProcessNewFolder(ActionParam param)
        {
            var dirInfo = new DirectoryInfo(Helper.MapPath(param.Path));
            dirInfo.Create();
            return CreateSuccessResponse();
        }

        private static ActionResult CreateSuccessResponse()
        {
            return new ActionResult { Success = true };
        }

        private static ActionResult CreateErrorResponse(Exception ex)
        {
            return CreateErrorResponse(ex.Message);
        }

        private static ActionResult CreateErrorResponse(string msg)
        {
            return new ActionResult
            {
                Success = false,
                Error = msg
            };
        }

        protected virtual string GetHostUri()
        {
            var request = HttpContext.Current.Request;
            var url = request.Url;
            return "http://" + url.Host + (url.Port == 80 ? string.Empty : ":" + url.Port) + request.ApplicationPath;
        }

        private ActionResult ProcessGetHostUri(ActionParam param)
        {
            var responseData = CreateSuccessResponse();
            responseData.HostUri = GetHostUri();

            return responseData;
        }

        private ActionResult ProcessGetItems(ActionParam param)
        {
            var localPath = Helper.MapPath(param.Path);
            var responseData = CreateSuccessResponse();
            var items = new List<FileExplorerItem>();

            var fileItems = new List<FileExplorerItem>();
            if (!param.OnlyFolder)
            {
                var searchPatterns = (param.SearchPatterns != null && param.SearchPatterns.Length > 0)
                    ? param.SearchPatterns
                    : new[] { AllFilesSearchPattern };

                foreach (var searchPattern in searchPatterns)
                {
                    foreach (var item in Directory.GetFiles(localPath, searchPattern, SearchOption.TopDirectoryOnly))
                    {
                        var fileItem = Helper.CreateFileExplorerItem(param.Path, item);
                        if (CheckFilter(fileItem.Name, param))
                        {
                            fileItems.Add(fileItem);
                        }
                    }
                }

                if (param.SortExpression == SortField.Name)
                {
                    fileItems.Sort(Helper.ComparisonWithName);
                }
                else
                {
                    fileItems.Sort(((x, y) =>
                    {
                        if (x.Size == y.Size)
                        {
                            return 0;
                        }

                        if (!x.Size.HasValue)
                        {
                            return -1;
                        }

                        if (!y.Size.HasValue)
                        {
                            return 1;
                        }

                        return (int)(x.Size.Value - y.Size.Value);
                    }));
                }

                if (param.SortDirection == SortDirection.Descending)
                {
                    fileItems.Reverse();
                }
            }

            var folderItems = new List<FileExplorerItem>();
            foreach (var item in Directory.GetDirectories(localPath))
            {
                var foldItem = Helper.CreateFileExplorerItem(param.Path, item);
                if (CheckFilter(foldItem.Name, param))
                {
                    folderItems.Add(foldItem);
                }
            }

            if (param.SortExpression == SortField.Name)
            {
                folderItems.Sort(Helper.ComparisonWithName);

                if (param.SortDirection == SortDirection.Descending)
                {
                    folderItems.Reverse();
                }
            }

            if (param.SortDirection == SortDirection.Descending)
            {
                items.AddRange(fileItems);
                items.AddRange(folderItems);
            }
            else
            {
                items.AddRange(folderItems);
                items.AddRange(fileItems);
            }

            if (param.PageSize > 0)
            {
                responseData.PageCount = Math.Max(1, (int)Math.Ceiling((float)items.Count / param.PageSize));
                responseData.PageIndex = Math.Max(0, Math.Min(responseData.PageCount - 1, param.PageIndex));
                items = items.Skip(param.PageSize * responseData.PageIndex).Take(param.PageSize).ToList();
            }

            responseData.ItemOperationResults = items.Cast<IItemOperationResult>().ToList();
            return responseData;
        }

        private static bool CheckFilter(string name, ActionParam param)
        {
            return name.IndexOf(param.FilterExpression, StringComparison.OrdinalIgnoreCase) > -1;
        }

        private static void Copy(string sourcePath, string targetDir)
        {
            var fileName = Path.GetFileName(sourcePath);
            var newDirName = Path.Combine(targetDir, fileName);
            if (!Helper.IsDirectory(sourcePath))
            {
                File.Copy(sourcePath, newDirName);
                return;
            }

            Directory.CreateDirectory(newDirName);
            foreach (var item in Directory.GetFileSystemEntries(sourcePath))
            {
                Copy(item, newDirName);
            }
        }
    }

    public static class Helper
    {
        private const char FolderSeparator = '/';

        public static int ComparisonWithName(FileExplorerItem a, FileExplorerItem b)
        {
            var aNameWithoutExtension = a.NameWithoutExtension;
            var bNameWithoutExtension = b.NameWithoutExtension;

            if (string.Equals(aNameWithoutExtension, bNameWithoutExtension, StringComparison.OrdinalIgnoreCase))
            {
                return String.Compare(a.Name, b.Name, StringComparison.OrdinalIgnoreCase);
            }

            var numRegex = new Regex("\\d+");
            var matches = numRegex.Matches(aNameWithoutExtension + bNameWithoutExtension).Cast<Match>().ToList();
            if (matches.Any())
            {
                var maxLen = matches.Max(num => num.Length);
                aNameWithoutExtension = numRegex.Replace(aNameWithoutExtension, (m => m.Value.PadLeft(maxLen, '0')));
                bNameWithoutExtension = numRegex.Replace(bNameWithoutExtension, (m => m.Value.PadLeft(maxLen, '0')));
            }

            return String.Compare(aNameWithoutExtension, bNameWithoutExtension, StringComparison.OrdinalIgnoreCase);
        }


        public static string MapPath(string path)
        {
            return HttpContext.Current.Server.MapPath(path);
        }

        public static bool IsDirectory(string path)
        {
            return (File.GetAttributes(path) & FileAttributes.Directory) == FileAttributes.Directory;
        }

        public static FileExplorerItem CreateFileExplorerItem(string parentPath, string localPath)
        {
            if (IsDirectory(localPath))
            {
                var dirInfo = new DirectoryInfo(localPath);
                return new FileExplorerItem(parentPath, dirInfo);
            }

            var fileInfo = new FileInfo(localPath);
            return new FileExplorerItem(parentPath, fileInfo);
        }

        public static bool IsAncestorFolder(string mayAncestorPath, string mayDescendantPath)
        {
            return mayDescendantPath.IndexOf(EnsureFolderSeparator(mayAncestorPath), StringComparison.OrdinalIgnoreCase) == 0;
        }

        public static string EnsureFolderSeparator(string path)
        {
            return path[path.Length - 1] == FolderSeparator ? path : path + FolderSeparator;
        }
    }

    /// <summary>
    /// The param of the FileExplorer action.
    /// </summary>
    public class ActionParam
    {
        private static readonly string[] DefaultSearchPatterns = { "*.*" };
        private string[] _searchPatterns;
        private string _filterExpression;
        private string[] _sourcePaths;

        /// <summary>
        /// The FileCommand.
        /// </summary>
        public FileCommand CommandName
        {
            get;
            set;
        }

        /// <summary>
        /// The search patterns.
        /// </summary>
        public string[] SearchPatterns
        {
            get
            {
                return _searchPatterns ?? DefaultSearchPatterns;
            }
            set
            {
                _searchPatterns = value;
            }
        }

        /// <summary>
        /// The filter expression.
        /// </summary>
        public string FilterExpression
        {
            get
            {
                return _filterExpression ?? string.Empty;
            }
            set
            {
                _filterExpression = value;
            }
        }

        /// <summary>
        /// The page size.
        /// </summary>
        public int PageSize
        {
            get;
            set;
        }

        /// <summary>
        /// The page index.
        /// </summary>
        public int PageIndex
        {
            get;
            set;
        }

        /// <summary>
        /// The sort expression.
        /// </summary>
        public SortField SortExpression
        {
            get;
            set;
        }

        /// <summary>
        /// The sort direction.
        /// </summary>
        public SortDirection SortDirection
        {
            get;
            set;
        }

        /// <summary>
        /// Gets and sets whether only get the folders.
        /// </summary>
        public bool OnlyFolder
        {
            get;
            set;
        }

        /// <summary>
        /// The path or target path.
        /// </summary>
        public string Path
        {
            get;
            set;
        }

        /// <summary>
        /// The source paths.
        /// </summary>
        public string[] SourcePaths
        {
            get { return _sourcePaths ?? (_sourcePaths = new string[] { }); }
            set { _sourcePaths = value; }
        }
    }

    [DataContract]
    public class ActionResult
    {
        private int _pageCount = 1;

        /// <summary>
        /// The page count.
        /// </summary>
		[DataMember(Name = "pageCount", EmitDefaultValue = false)]
        public int PageCount
        {
            get
            {
                return _pageCount;
            }
            set
            {
                _pageCount = value;
            }
        }

        /// <summary>
        /// The page index.
        /// </summary>
		[DataMember(Name = "pageIndex", EmitDefaultValue = false)]
        public int PageIndex
        {
            get;
            set;
        }

        /// <summary>
        /// Gets and sets whether the action is success.
        /// </summary>
		[DataMember(Name = "success", EmitDefaultValue = false)]
        public bool Success
        {
            get;
            set;
        }

        /// <summary>
        /// The error.
        /// </summary>
		[DataMember(Name = "error", EmitDefaultValue = false)]
        public string Error
        {
            get;
            set;
        }

        /// <summary>
        /// The results of operating items.
        /// </summary>
		[DataMember(Name = "itemOperationResults", EmitDefaultValue = false)]
        public IList<IItemOperationResult> ItemOperationResults
        {
            get;
            set;
        }

        /// <summary>
        /// The host uri for this application.
        /// </summary>
		[DataMember(Name = "hostUri", EmitDefaultValue = false)]
        public string HostUri
        {
            get;
            set;
        }
    }

    internal static ActionParam Parse(NameValueCollection param)
    {
        return new ActionParam
        {
            CommandName = param["commandName"].SafeParseEnum<FileCommand>(),
            Path = param["path"],
            SourcePaths = param["sourcePaths[]"].SafeParseStrings(),
            SearchPatterns = param["searchPatterns"].SafeParseStrings(),
            FilterExpression = param["filterExpression"],
            SortExpression = param["SortExpression"].SafeParseEnum<SortField>(),
            SortDirection = param["SortDirection"].SafeParseEnum<SortDirection>(),
            PageSize = param["PageSize"].SafeParseInt(),
            PageIndex = param["PageIndex"].SafeParseInt(),
        };
    }

    public void ProcessRequest(HttpContext context)
    {
        var param = Parse(context.Request.QueryString);
        var response = Action.Process(param);
        context.Response.ContentType = "text/plain";
        var serializer = new DataContractJsonSerializer(typeof(ActionResult), new List<Type>{typeof(FileExplorerItem), typeof(ItemOperationResult)});
        serializer.WriteObject(context.Response.OutputStream, response);
    }

    private FileExplorerAction _action;
    private FileExplorerAction Action
    {
        get
        {
            return _action ?? (_action = new FileExplorerAction());
        }
    }

    public bool IsReusable
    {
        get
        {
            return false;
        }
    }
}