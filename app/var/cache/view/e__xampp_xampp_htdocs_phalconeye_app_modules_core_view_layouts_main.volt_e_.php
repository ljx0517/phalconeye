a:11:{i:0;s:132:"

<!DOCTYPE html>
<html>
<head>
    <title><?php echo \Engine\Helper::getInstance('setting', 'core')->get('system_title', ''); ?> | ";s:5:"title";N;i:1;s:497:"</title>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="generator" content="PhalconEye - Open Source Content Management System"/>
    <link href="favicon.ico" rel="shortcut icon" type="image/x-icon" />

    <?php echo $this->assets->outputCss(); ?>

    <?php echo $this->assets->outputInline(); ?>

    <script type="text/javascript">
        <?php echo \Engine\Helper::getInstance('i18n', 'core')->render(); ?>
    </script>";s:4:"head";N;i:2;s:381:"</head>
<body data-base-url="<?php echo $this->url->get(); ?>" data-debug="<?php echo $this->config->application->debug; ?>">
<div id="wrapper">
    <div id="header" class="container">
        <?php if (!isset($disableHeader)) { ?>
        <?php echo \Engine\Helper::getInstance('renderer', 'core')->renderContent('header', '../../Core/View/partials/layout'); ?>
        <?php } ?>";s:6:"header";N;i:3;s:147:"</div>

    <div class="system-container">
        <?php echo $this->getContent(); ?>
    </div>

    <div class="container main_widget_container">";s:7:"content";N;i:4;s:244:"</div>

    <div id="footer" class="container">
        <?php if (!isset($disableFooter)) { ?>
        <?php echo \Engine\Helper::getInstance('renderer', 'core')->renderContent('footer', '../../Core/View/partials/layout'); ?>
        <?php } ?>";s:6:"footer";N;i:5;s:144:"</div>
</div>

<?php echo $this->assets->outputJs(); ?>
<?php echo \Engine\Helper::getInstance('profiler', 'core')->render(); ?>
</body>
</html>";}