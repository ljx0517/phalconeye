

<!DOCTYPE html>
<html>
<head>
    <title><?php echo \Engine\Helper::getInstance('setting', 'core')->get('system_title', ''); ?> | <?php echo $this->i18n->query($page->title); ?></title>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="generator" content="PhalconEye - Open Source Content Management System"/>
    <link href="favicon.ico" rel="shortcut icon" type="image/x-icon" />

    <?php echo $this->assets->outputCss(); ?>

    <?php echo $this->assets->outputInline(); ?>

    <script type="text/javascript">
        <?php echo \Engine\Helper::getInstance('i18n', 'core')->render(); ?>
    </script>
    <?php if ($page->keywords) { ?>
        <meta name="keywords" content="<?php echo $this->i18n->query($page->keywords); ?>" />
    <?php } ?>
    <?php if ($page->description) { ?>
        <meta name="description" content="<?php echo $this->i18n->query($page->description); ?>" />
    <?php } ?>
</head>
<body data-base-url="<?php echo $this->url->get(); ?>" data-debug="<?php echo $this->config->application->debug; ?>">
<div id="wrapper">
    <div id="header" class="container">
        <?php if (!isset($disableHeader)) { ?>
        <?php echo \Engine\Helper::getInstance('renderer', 'core')->renderContent('header', '../../Core/View/partials/layout'); ?>
        <?php } ?></div>

    <div class="system-container">
        <?php echo $this->getContent(); ?>
    </div>

    <div class="container main_widget_container">

    <?php echo $this->partial('../../Core/View/partials/layout', array('page' => $page, 'content' => $content)); ?>


    
        
    

    


    <div class="clear"></div>
</div>

    <div id="footer" class="container">
        <?php if (!isset($disableFooter)) { ?>
        <?php echo \Engine\Helper::getInstance('renderer', 'core')->renderContent('footer', '../../Core/View/partials/layout'); ?>
        <?php } ?></div>
</div>

<?php echo $this->assets->outputJs(); ?>
<?php echo \Engine\Helper::getInstance('profiler', 'core')->render(); ?>
</body>
</html>