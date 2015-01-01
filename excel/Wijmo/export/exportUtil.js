/*
 *
 * Wijmo Library 3.20143.59
 * http://wijmo.com/
 *
 * Copyright(c) GrapeCity, Inc.  All rights reserved.
 * 
 * Licensed under the Wijmo Commercial License. Also available under the GNU GPL Version 3 license.
 * licensing@wijmo.com
 * http://wijmo.com/widgets/license/
 *
 */
/// <reference path="../external/declarations/jquery.d.ts" />
var wijmo;
(function (wijmo) {
    (function (exporter) {
        "use strict";

        var $ = jQuery;

        function toJSON(obj, replacer) {
            var originDateToJSON = Date.prototype.toJSON;

            // Use local time to json instead of UTC time.
            Date.prototype.toJSON = _localDateTimeToJSON;
            try  {
                return JSON.stringify(obj, replacer);
            } finally {
                Date.prototype.toJSON = originDateToJSON;
            }
        }
        exporter.toJSON = toJSON;

        function _formatUint(uint, length) {
            // Format unsigned integer to have at least specified digits.
            var uintStr = uint.toString();
            while (uintStr.length < length) {
                uintStr = '0' + uintStr;
            }

            return uintStr;
        }

        function _localDateTimeToJSON() {
            var date = this;
            return _formatUint(date.getFullYear(), 4) + '-' + _formatUint(date.getMonth() + 1, 2) + '-' + _formatUint(date.getDate(), 2) + 'T' + _formatUint(date.getHours(), 2) + ':' + _formatUint(date.getMinutes(), 2) + ':' + _formatUint(date.getSeconds(), 2) + "." + _formatUint(date.getMilliseconds(), 3);
        }

        function exportFile(setting, content) {
            var sender = setting.sender, contentType = setting.contentType, serviceUrl = setting.serviceUrl;
            if (sender) {
                sender(content, setting);
            } else if (contentType == "application/json") {
                _exportByXMLHttpRequest(content, serviceUrl, setting);
            } else {
                _exportByForm(content, serviceUrl);
            }
        }
        exporter.exportFile = exportFile;

        function _exportByForm(content, serviceUrl) {
            var formInnerHtml = '<input type="hidden" name="type" value="application/json"/>';
            formInnerHtml += '<input type="hidden" name="data" value="' + _htmlSpecialCharsEntityEncode(content) + '" />';
            var $iframe = $("<iframe style='display: none' src='about:blank'></iframe>").appendTo("body");
            $iframe.ready(function () {
                var formDoc = _getiframeDocument($iframe);
                formDoc.write("<html><head><meta http-equiv='Content-Type' content='text/html; charset=utf-8'></head><body><form method='Post' accept-charset='utf-8' action='" + serviceUrl + "'>" + formInnerHtml + "</form>dummy windows for postback</body></html>");
                var $form = $(formDoc).find('form');
                $form.submit();
            });
        }

        function _getiframeDocument($iframe) {
            var iframeDoc = $iframe[0].contentWindow || $iframe[0].contentDocument;
            if (iframeDoc.document) {
                iframeDoc = iframeDoc.document;
            }
            return iframeDoc;
        }

        var _htmlSpecialCharsRegEx = /[<>&\r\n"']/gm;
        var _htmlSpecialCharsPlaceHolders = {
            '<': 'lt;',
            '>': 'gt;',
            '&': 'amp;',
            '\r': "#13;",
            '\n': "#10;",
            '"': 'quot;',
            "'": 'apos;'
        };

        function _htmlSpecialCharsEntityEncode(str) {
            return str.replace(_htmlSpecialCharsRegEx, function (match) {
                return '&' + _htmlSpecialCharsPlaceHolders[match];
            });
        }

        function _exportByXMLHttpRequest(content, serviceUrl, setting) {
            var xmlhttp = new XMLHttpRequest();
            xmlhttp.open("post", serviceUrl);
            xmlhttp.send(content);
            xmlhttp.responseType = "blob";
            xmlhttp.onreadystatechange = function () {
                if (xmlhttp.response && setting.receiver) {
                    setting.receiver(xmlhttp.response, setting);
                }
            };
        }

        /** Export file type options: Xls, Xlsx, Cvs, Pdf, Png, Jpg,Bmp,Gif and Tiff. */
        (function (ExportFileType) {
            ExportFileType[ExportFileType["Xls"] = 0] = "Xls";
            ExportFileType[ExportFileType["Xlsx"] = 1] = "Xlsx";
            ExportFileType[ExportFileType["Csv"] = 2] = "Csv";
            ExportFileType[ExportFileType["Pdf"] = 3] = "Pdf";
            ExportFileType[ExportFileType["Png"] = 4] = "Png";
            ExportFileType[ExportFileType["Jpg"] = 5] = "Jpg";
            ExportFileType[ExportFileType["Bmp"] = 6] = "Bmp";
            ExportFileType[ExportFileType["Gif"] = 7] = "Gif";
            ExportFileType[ExportFileType["Tiff"] = 8] = "Tiff";
        })(exporter.ExportFileType || (exporter.ExportFileType = {}));
        var ExportFileType = exporter.ExportFileType;

        

        /**  The font type */
        (function (FontType) {
            /**  Use only standard Pdf fonts (Helvetica, Times, Symbol). */
            FontType[FontType["Standard"] = 0] = "Standard";

            /**  Use TrueType fonts, no embedding (viewer must have fonts installed). */
            FontType[FontType["TrueType"] = 1] = "TrueType";

            /**  Use embedded TrueType fonts. */
            FontType[FontType["Embedded"] = 2] = "Embedded";
        })(exporter.FontType || (exporter.FontType = {}));
        var FontType = exporter.FontType;

        /**  The image quality. */
        (function (ImageQuality) {
            /**  Low quality, small file size. */
            ImageQuality[ImageQuality["Low"] = 0] = "Low";

            /**  Medium quality, medium file size. */
            ImageQuality[ImageQuality["Medium"] = 1] = "Medium";

            /**  High quality, medium/large file size. */
            ImageQuality[ImageQuality["Default"] = 2] = "Default";

            /**  Highest quality, largest file size. */
            ImageQuality[ImageQuality["High"] = 3] = "High";
        })(exporter.ImageQuality || (exporter.ImageQuality = {}));
        var ImageQuality = exporter.ImageQuality;

        /**  The compression type. */
        (function (CompressionType) {
            /**  High compression, fast save. */
            CompressionType[CompressionType["Default"] = -1] = "Default";

            /**  No compression (useful for debugging). */
            CompressionType[CompressionType["None"] = 0] = "None";

            /**  Low compression, fastest save. */
            CompressionType[CompressionType["BestSpeed"] = 1] = "BestSpeed";

            /**  Highest compression, slowest save. */
            CompressionType[CompressionType["BestCompression"] = 9] = "BestCompression";
        })(exporter.CompressionType || (exporter.CompressionType = {}));
        var CompressionType = exporter.CompressionType;

        /** The Pdf encryption type. */
        (function (PdfEncryptionType) {
            /**  Encryption is unavailable due to FIPS compliance (MD5 and AES128 are not FIPS-compliant). */
            PdfEncryptionType[PdfEncryptionType["NotPermit"] = 0] = "NotPermit";

            /**  Standard 40 bit encryption algorithm. */
            PdfEncryptionType[PdfEncryptionType["Standard40"] = 2] = "Standard40";

            /**  Standard 128 bit encryption algorithm. */
            PdfEncryptionType[PdfEncryptionType["Standard128"] = 3] = "Standard128";

            /**  AES 128 bit encryption algorithm. */
            PdfEncryptionType[PdfEncryptionType["Aes128"] = 4] = "Aes128";
        })(exporter.PdfEncryptionType || (exporter.PdfEncryptionType = {}));
        var PdfEncryptionType = exporter.PdfEncryptionType;

        

        

        /**  Specifies the standard paper sizes. */
        (function (PaperKind) {
            /**  The paper size is defined by the user.*/
            PaperKind[PaperKind["Custom"] = 0] = "Custom";

            /** Letter paper (8.5 in. by 11 in.).*/
            PaperKind[PaperKind["Letter"] = 1] = "Letter";

            /** Letter small paper (8.5 in. by 11 in.).*/
            PaperKind[PaperKind["LetterSmall"] = 2] = "LetterSmall";

            /** Tabloid paper (11 in. by 17 in.).*/
            PaperKind[PaperKind["Tabloid"] = 3] = "Tabloid";

            /** Ledger paper (17 in. by 11 in.).*/
            PaperKind[PaperKind["Ledger"] = 4] = "Ledger";

            /** Legal paper (8.5 in. by 14 in.).*/
            PaperKind[PaperKind["Legal"] = 5] = "Legal";

            /** Statement paper (5.5 in. by 8.5 in.).*/
            PaperKind[PaperKind["Statement"] = 6] = "Statement";

            /** Executive paper (7.25 in. by 10.5 in.).*/
            PaperKind[PaperKind["Executive"] = 7] = "Executive";

            /** A3 paper (297 mm by 420 mm).*/
            PaperKind[PaperKind["A3"] = 8] = "A3";

            /** A4 paper (210 mm by 297 mm).*/
            PaperKind[PaperKind["A4"] = 9] = "A4";

            /** A4 small paper (210 mm by 297 mm).*/
            PaperKind[PaperKind["A4Small"] = 10] = "A4Small";

            /** A5 paper (148 mm by 210 mm).*/
            PaperKind[PaperKind["A5"] = 11] = "A5";

            /** B4 paper (250 mm by 353 mm).*/
            PaperKind[PaperKind["B4"] = 12] = "B4";

            /** B5 paper (176 mm by 250 mm).*/
            PaperKind[PaperKind["B5"] = 13] = "B5";

            /** Folio paper (8.5 in. by 13 in.).*/
            PaperKind[PaperKind["Folio"] = 14] = "Folio";

            /**  Quarto paper (215 mm by 275 mm).*/
            PaperKind[PaperKind["Quarto"] = 15] = "Quarto";

            /** Standard paper (10 in. by 14 in.).*/
            PaperKind[PaperKind["Standard10x14"] = 16] = "Standard10x14";

            /** Standard paper (11 in. by 17 in.).*/
            PaperKind[PaperKind["Standard11x17"] = 17] = "Standard11x17";

            /** Note paper (8.5 in. by 11 in.).*/
            PaperKind[PaperKind["Note"] = 18] = "Note";

            /**  #9 envelope (3.875 in. by 8.875 in.).*/
            PaperKind[PaperKind["Number9Envelope"] = 19] = "Number9Envelope";

            /** #10 envelope (4.125 in. by 9.5 in.).*/
            PaperKind[PaperKind["Number10Envelope"] = 20] = "Number10Envelope";

            /** #11 envelope (4.5 in. by 10.375 in.).*/
            PaperKind[PaperKind["Number11Envelope"] = 21] = "Number11Envelope";

            /** #12 envelope (4.75 in. by 11 in.).*/
            PaperKind[PaperKind["Number12Envelope"] = 22] = "Number12Envelope";

            /** #14 envelope (5 in. by 11.5 in.).*/
            PaperKind[PaperKind["Number14Envelope"] = 23] = "Number14Envelope";

            /** C paper (17 in. by 22 in.).*/
            PaperKind[PaperKind["CSheet"] = 24] = "CSheet";

            /** D paper (22 in. by 34 in.).*/
            PaperKind[PaperKind["DSheet"] = 25] = "DSheet";

            /** E paper (34 in. by 44 in.).*/
            PaperKind[PaperKind["ESheet"] = 26] = "ESheet";

            /** DL envelope (110 mm by 220 mm).*/
            PaperKind[PaperKind["DLEnvelope"] = 27] = "DLEnvelope";

            /**  C5 envelope (162 mm by 229 mm).*/
            PaperKind[PaperKind["C5Envelope"] = 28] = "C5Envelope";

            /** C3 envelope (324 mm by 458 mm). */
            PaperKind[PaperKind["C3Envelope"] = 29] = "C3Envelope";

            /** C4 envelope (229 mm by 324 mm). */
            PaperKind[PaperKind["C4Envelope"] = 30] = "C4Envelope";

            /** C6 envelope (114 mm by 162 mm). */
            PaperKind[PaperKind["C6Envelope"] = 31] = "C6Envelope";

            /** C65 envelope (114 mm by 229 mm). */
            PaperKind[PaperKind["C65Envelope"] = 32] = "C65Envelope";

            /** B4 envelope (250 mm by 353 mm). */
            PaperKind[PaperKind["B4Envelope"] = 33] = "B4Envelope";

            /** B5 envelope (176 mm by 250 mm). */
            PaperKind[PaperKind["B5Envelope"] = 34] = "B5Envelope";

            /**  B6 envelope (176 mm by 125 mm). */
            PaperKind[PaperKind["B6Envelope"] = 35] = "B6Envelope";

            /** Italy envelope (110 mm by 230 mm). */
            PaperKind[PaperKind["ItalyEnvelope"] = 36] = "ItalyEnvelope";

            /** Monarch envelope (3.875 in. by 7.5 in.). */
            PaperKind[PaperKind["MonarchEnvelope"] = 37] = "MonarchEnvelope";

            /** 6 3/4 envelope (3.625 in. by 6.5 in.). */
            PaperKind[PaperKind["PersonalEnvelope"] = 38] = "PersonalEnvelope";

            /** US standard fanfold (14.875 in. by 11 in.). */
            PaperKind[PaperKind["USStandardFanfold"] = 39] = "USStandardFanfold";

            /** German standard fanfold (8.5 in. by 12 in.). */
            PaperKind[PaperKind["GermanStandardFanfold"] = 40] = "GermanStandardFanfold";

            /** German legal fanfold (8.5 in. by 13 in.). */
            PaperKind[PaperKind["GermanLegalFanfold"] = 41] = "GermanLegalFanfold";

            /** ISO B4 (250 mm by 353 mm). */
            PaperKind[PaperKind["IsoB4"] = 42] = "IsoB4";

            /** Japanese postcard (100 mm by 148 mm). */
            PaperKind[PaperKind["JapanesePostcard"] = 43] = "JapanesePostcard";

            /** Standard paper (9 in. by 11 in.). */
            PaperKind[PaperKind["Standard9x11"] = 44] = "Standard9x11";

            /** Standard paper (10 in. by 11 in.). */
            PaperKind[PaperKind["Standard10x11"] = 45] = "Standard10x11";

            /** Standard paper (15 in. by 11 in.). */
            PaperKind[PaperKind["Standard15x11"] = 46] = "Standard15x11";

            /** Invitation envelope (220 mm by 220 mm). */
            PaperKind[PaperKind["InviteEnvelope"] = 47] = "InviteEnvelope";

            /** Letter extra paper (9.275 in. by 12 in.). This value is specific to the PostScript
            *  driver and is used only by Linotronic printers in order to conserve paper. */
            PaperKind[PaperKind["LetterExtra"] = 50] = "LetterExtra";

            /** Legal extra paper (9.275 in. by 15 in.). This value is specific to the PostScript
            *  driver and is used only by Linotronic printers in order to conserve paper. */
            PaperKind[PaperKind["LegalExtra"] = 51] = "LegalExtra";

            /** Tabloid extra paper (11.69 in. by 18 in.). This value is specific to the
            *   PostScript driver and is used only by Linotronic printers in order to conserve
            *   paper. */
            PaperKind[PaperKind["TabloidExtra"] = 52] = "TabloidExtra";

            /** A4 extra paper (236 mm by 322 mm). This value is specific to the PostScript
            *    driver and is used only by Linotronic printers to help save paper. */
            PaperKind[PaperKind["A4Extra"] = 53] = "A4Extra";

            /** Letter transverse paper (8.275 in. by 11 in.). */
            PaperKind[PaperKind["LetterTransverse"] = 54] = "LetterTransverse";

            /** A4 transverse paper (210 mm by 297 mm). */
            PaperKind[PaperKind["A4Transverse"] = 55] = "A4Transverse";

            /** Letter extra transverse paper (9.275 in. by 12 in.). */
            PaperKind[PaperKind["LetterExtraTransverse"] = 56] = "LetterExtraTransverse";

            /** SuperA/SuperA/A4 paper (227 mm by 356 mm). */
            PaperKind[PaperKind["APlus"] = 57] = "APlus";

            /** SuperB/SuperB/A3 paper (305 mm by 487 mm). */
            PaperKind[PaperKind["BPlus"] = 58] = "BPlus";

            /** Letter plus paper (8.5 in. by 12.69 in.). */
            PaperKind[PaperKind["LetterPlus"] = 59] = "LetterPlus";

            /** A4 plus paper (210 mm by 330 mm). */
            PaperKind[PaperKind["A4Plus"] = 60] = "A4Plus";

            /** A5 transverse paper (148 mm by 210 mm). */
            PaperKind[PaperKind["A5Transverse"] = 61] = "A5Transverse";

            /** JIS B5 transverse paper (182 mm by 257 mm). */
            PaperKind[PaperKind["B5Transverse"] = 62] = "B5Transverse";

            /** A3 extra paper (322 mm by 445 mm). */
            PaperKind[PaperKind["A3Extra"] = 63] = "A3Extra";

            /** A5 extra paper (174 mm by 235 mm). */
            PaperKind[PaperKind["A5Extra"] = 64] = "A5Extra";

            /** ISO B5 extra paper (201 mm by 276 mm). */
            PaperKind[PaperKind["B5Extra"] = 65] = "B5Extra";

            /** A2 paper (420 mm by 594 mm). */
            PaperKind[PaperKind["A2"] = 66] = "A2";

            /** A3 transverse paper (297 mm by 420 mm). */
            PaperKind[PaperKind["A3Transverse"] = 67] = "A3Transverse";

            /** A3 extra transverse paper (322 mm by 445 mm). */
            PaperKind[PaperKind["A3ExtraTransverse"] = 68] = "A3ExtraTransverse";

            /** Japanese double postcard (200 mm by 148 mm). Requires Windows 98, Windows
            *    NT 4.0, or later. */
            PaperKind[PaperKind["JapaneseDoublePostcard"] = 69] = "JapaneseDoublePostcard";

            /** A6 paper (105 mm by 148 mm). Requires Windows 98, Windows NT 4.0, or later. */
            PaperKind[PaperKind["A6"] = 70] = "A6";

            /** Japanese Kaku #2 envelope. Requires Windows 98, Windows NT 4.0, or later. */
            PaperKind[PaperKind["JapaneseEnvelopeKakuNumber2"] = 71] = "JapaneseEnvelopeKakuNumber2";

            /** Japanese Kaku #3 envelope. Requires Windows 98, Windows NT 4.0, or later. */
            PaperKind[PaperKind["JapaneseEnvelopeKakuNumber3"] = 72] = "JapaneseEnvelopeKakuNumber3";

            /** Japanese Chou #3 envelope. Requires Windows 98, Windows NT 4.0, or later. */
            PaperKind[PaperKind["JapaneseEnvelopeChouNumber3"] = 73] = "JapaneseEnvelopeChouNumber3";

            /** Japanese Chou #4 envelope. Requires Windows 98, Windows NT 4.0, or later. */
            PaperKind[PaperKind["JapaneseEnvelopeChouNumber4"] = 74] = "JapaneseEnvelopeChouNumber4";

            /** Letter rotated paper (11 in. by 8.5 in.). */
            PaperKind[PaperKind["LetterRotated"] = 75] = "LetterRotated";

            /** A3 rotated paper (420 mm by 297 mm). */
            PaperKind[PaperKind["A3Rotated"] = 76] = "A3Rotated";

            /**  A4 rotated paper (297 mm by 210 mm). Requires Windows 98, Windows NT 4.0,
            *   or later. */
            PaperKind[PaperKind["A4Rotated"] = 77] = "A4Rotated";

            /** A5 rotated paper (210 mm by 148 mm). Requires Windows 98, Windows NT 4.0,
            *   or later. */
            PaperKind[PaperKind["A5Rotated"] = 78] = "A5Rotated";

            /** JIS B4 rotated paper (364 mm by 257 mm). Requires Windows 98, Windows NT
            *   4.0, or later. */
            PaperKind[PaperKind["B4JisRotated"] = 79] = "B4JisRotated";

            /** JIS B5 rotated paper (257 mm by 182 mm). Requires Windows 98, Windows NT
            *   4.0, or later. */
            PaperKind[PaperKind["B5JisRotated"] = 80] = "B5JisRotated";

            /** Japanese rotated postcard (148 mm by 100 mm). Requires Windows 98, Windows
            *   NT 4.0, or later.*/
            PaperKind[PaperKind["JapanesePostcardRotated"] = 81] = "JapanesePostcardRotated";

            /** Japanese rotated double postcard (148 mm by 200 mm). Requires Windows 98,
            *  Windows NT 4.0, or later.*/
            PaperKind[PaperKind["JapaneseDoublePostcardRotated"] = 82] = "JapaneseDoublePostcardRotated";

            /** A6 rotated paper (148 mm by 105 mm). Requires Windows 98, Windows NT 4.0,
            *   or later.*/
            PaperKind[PaperKind["A6Rotated"] = 83] = "A6Rotated";

            /** Japanese rotated Kaku #2 envelope. Requires Windows 98, Windows NT 4.0, or
            *   later.*/
            PaperKind[PaperKind["JapaneseEnvelopeKakuNumber2Rotated"] = 84] = "JapaneseEnvelopeKakuNumber2Rotated";

            /** Japanese rotated Kaku #3 envelope. Requires Windows 98, Windows NT 4.0, or
            *   later.*/
            PaperKind[PaperKind["JapaneseEnvelopeKakuNumber3Rotated"] = 85] = "JapaneseEnvelopeKakuNumber3Rotated";

            /** Japanese rotated Chou #3 envelope. Requires Windows 98, Windows NT 4.0, or
            *   later.*/
            PaperKind[PaperKind["JapaneseEnvelopeChouNumber3Rotated"] = 86] = "JapaneseEnvelopeChouNumber3Rotated";

            /** Japanese rotated Chou #4 envelope. Requires Windows 98, Windows NT 4.0, or
            *   later.*/
            PaperKind[PaperKind["JapaneseEnvelopeChouNumber4Rotated"] = 87] = "JapaneseEnvelopeChouNumber4Rotated";

            /** JIS B6 paper (128 mm by 182 mm). Requires Windows 98, Windows NT 4.0, or
            *   later.*/
            PaperKind[PaperKind["B6Jis"] = 88] = "B6Jis";

            /** JIS B6 rotated paper (182 mm by 128 mm). Requires Windows 98, Windows NT
            *   4.0, or later.*/
            PaperKind[PaperKind["B6JisRotated"] = 89] = "B6JisRotated";

            /** Standard paper (12 in. by 11 in.). Requires Windows 98, Windows NT 4.0, or
            *   later.*/
            PaperKind[PaperKind["Standard12x11"] = 90] = "Standard12x11";

            /** Japanese You #4 envelope. Requires Windows 98, Windows NT 4.0, or later.*/
            PaperKind[PaperKind["JapaneseEnvelopeYouNumber4"] = 91] = "JapaneseEnvelopeYouNumber4";

            /** Japanese You #4 rotated envelope. Requires Windows 98, Windows NT 4.0, or
            *   later.*/
            PaperKind[PaperKind["JapaneseEnvelopeYouNumber4Rotated"] = 92] = "JapaneseEnvelopeYouNumber4Rotated";

            /** People's Republic of China 16K paper (146 mm by 215 mm). Requires Windows
            98, Windows NT 4.0, or later.*/
            PaperKind[PaperKind["Prc16K"] = 93] = "Prc16K";

            /** People's Republic of China 32K paper (97 mm by 151 mm). Requires Windows
            98, Windows NT 4.0, or later.*/
            PaperKind[PaperKind["Prc32K"] = 94] = "Prc32K";

            /** People's Republic of China 32K big paper (97 mm by 151 mm). Requires Windows
            *   98, Windows NT 4.0, or later.*/
            PaperKind[PaperKind["Prc32KBig"] = 95] = "Prc32KBig";

            /** People's Republic of China #1 envelope (102 mm by 165 mm). Requires Windows
            *   98, Windows NT 4.0, or later.*/
            PaperKind[PaperKind["PrcEnvelopeNumber1"] = 96] = "PrcEnvelopeNumber1";

            /** People's Republic of China #2 envelope (102 mm by 176 mm). Requires Windows
            98, Windows NT 4.0, or later.*/
            PaperKind[PaperKind["PrcEnvelopeNumber2"] = 97] = "PrcEnvelopeNumber2";

            /** People's Republic of China #3 envelope (125 mm by 176 mm). Requires Windows
            *   98, Windows NT 4.0, or later.*/
            PaperKind[PaperKind["PrcEnvelopeNumber3"] = 98] = "PrcEnvelopeNumber3";

            /** People's Republic of China #4 envelope (110 mm by 208 mm). Requires Windows
            *   98, Windows NT 4.0, or later.*/
            PaperKind[PaperKind["PrcEnvelopeNumber4"] = 99] = "PrcEnvelopeNumber4";

            /** People's Republic of China #5 envelope (110 mm by 220 mm). Requires Windows
            98, Windows NT 4.0, or later.*/
            PaperKind[PaperKind["PrcEnvelopeNumber5"] = 100] = "PrcEnvelopeNumber5";

            /** People's Republic of China #6 envelope (120 mm by 230 mm). Requires Windows
            *   98, Windows NT 4.0, or later.
            PrcEnvelopeNumber6 = 101,
            /** People's Republic of China #7 envelope (160 mm by 230 mm). Requires Windows
            *   98, Windows NT 4.0, or later.*/
            PaperKind[PaperKind["PrcEnvelopeNumber7"] = 102] = "PrcEnvelopeNumber7";

            /** People's Republic of China #8 envelope (120 mm by 309 mm). Requires Windows
            *   98, Windows NT 4.0, or later.*/
            PaperKind[PaperKind["PrcEnvelopeNumber8"] = 103] = "PrcEnvelopeNumber8";

            /** People's Republic of China #9 envelope (229 mm by 324 mm). Requires Windows
            *   98, Windows NT 4.0, or later.*/
            PaperKind[PaperKind["PrcEnvelopeNumber9"] = 104] = "PrcEnvelopeNumber9";

            /** People's Republic of China #10 envelope (324 mm by 458 mm). Requires Windows
            *   98, Windows NT 4.0, or later.*/
            PaperKind[PaperKind["PrcEnvelopeNumber10"] = 105] = "PrcEnvelopeNumber10";

            /** People's Republic of China 16K rotated paper (146 mm by 215 mm). Requires
            *   Windows 98, Windows NT 4.0, or later.*/
            PaperKind[PaperKind["Prc16KRotated"] = 106] = "Prc16KRotated";

            /** People's Republic of China 32K rotated paper (97 mm by 151 mm). Requires
            *   Windows 98, Windows NT 4.0, or later.*/
            PaperKind[PaperKind["Prc32KRotated"] = 107] = "Prc32KRotated";

            /** People's Republic of China 32K big rotated paper (97 mm by 151 mm). Requires
            *   Windows 98, Windows NT 4.0, or later.*/
            PaperKind[PaperKind["Prc32KBigRotated"] = 108] = "Prc32KBigRotated";

            /**  People's Republic of China #1 rotated envelope (165 mm by 102 mm). Requires
            *    Windows 98, Windows NT 4.0, or later.*/
            PaperKind[PaperKind["PrcEnvelopeNumber1Rotated"] = 109] = "PrcEnvelopeNumber1Rotated";

            /** People's Republic of China #2 rotated envelope (176 mm by 102 mm). Requires
            *  Windows 98, Windows NT 4.0, or later.*/
            PaperKind[PaperKind["PrcEnvelopeNumber2Rotated"] = 110] = "PrcEnvelopeNumber2Rotated";

            /** People's Republic of China #3 rotated envelope (176 mm by 125 mm). Requires
            *   Windows 98, Windows NT 4.0, or later.*/
            PaperKind[PaperKind["PrcEnvelopeNumber3Rotated"] = 111] = "PrcEnvelopeNumber3Rotated";

            /** People's Republic of China #4 rotated envelope (208 mm by 110 mm). Requires
            *   Windows 98, Windows NT 4.0, or later.*/
            PaperKind[PaperKind["PrcEnvelopeNumber4Rotated"] = 112] = "PrcEnvelopeNumber4Rotated";

            /** People's Republic of China Envelope #5 rotated envelope (220 mm by 110 mm).
            *   Requires Windows 98, Windows NT 4.0, or later.*/
            PaperKind[PaperKind["PrcEnvelopeNumber5Rotated"] = 113] = "PrcEnvelopeNumber5Rotated";

            /** People's Republic of China #6 rotated envelope (230 mm by 120 mm). Requires
            *   Windows 98, Windows NT 4.0, or later.*/
            PaperKind[PaperKind["PrcEnvelopeNumber6Rotated"] = 114] = "PrcEnvelopeNumber6Rotated";

            /** People's Republic of China #7 rotated envelope (230 mm by 160 mm). Requires
            Windows 98, Windows NT 4.0, or later.*/
            PaperKind[PaperKind["PrcEnvelopeNumber7Rotated"] = 115] = "PrcEnvelopeNumber7Rotated";

            /** People's Republic of China #8 rotated envelope (309 mm by 120 mm). Requires
            *   Windows 98, Windows NT 4.0, or later.*/
            PaperKind[PaperKind["PrcEnvelopeNumber8Rotated"] = 116] = "PrcEnvelopeNumber8Rotated";

            /** People's Republic of China #9 rotated envelope (324 mm by 229 mm). Requires
            *   Windows 98, Windows NT 4.0, or later.*/
            PaperKind[PaperKind["PrcEnvelopeNumber9Rotated"] = 117] = "PrcEnvelopeNumber9Rotated";

            /** People's Republic of China #10 rotated envelope (458 mm by 324 mm). Requires
            *   Windows 98, Windows NT 4.0, or later.*/
            PaperKind[PaperKind["PrcEnvelopeNumber10Rotated"] = 118] = "PrcEnvelopeNumber10Rotated";
        })(exporter.PaperKind || (exporter.PaperKind = {}));
        var PaperKind = exporter.PaperKind;
    })(wijmo.exporter || (wijmo.exporter = {}));
    var exporter = wijmo.exporter;
})(wijmo || (wijmo = {}));
