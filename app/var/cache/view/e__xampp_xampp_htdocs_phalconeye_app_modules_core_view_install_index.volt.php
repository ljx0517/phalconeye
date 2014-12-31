

<!DOCTYPE html>
<html>
<head>
    <title>PhalconEye | 
    <?php echo $this->i18n->query('Installation | Database'); ?>
</title>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="generator" content="PhalconEye - Open Source Content Management System"/>

    <?php echo $this->assets->outputCss(); ?>

    <?php echo $this->assets->outputJs(); ?></head>
<body>
<div id="wrapper">

    <div id="header">
        <?php if (!isset($disableHeader)) { ?>
        <?php echo \Engine\Helper::getInstance('renderer', 'core')->renderContent('header'); ?>
        <?php } ?></div>

    <div class="system-container">
        <?php echo $this->i18n->query($this->getContent()); ?>
    </div>

    <div class="container">
    <?php $action = 'license'; ?>
    <?php echo $this->partial('../../Core/View//Install/navigation'); ?>

    <div class="content">
        <pre><?php echo $license; ?></pre>
    </div>
    <a href="<?php echo $this->url->get('install/requirements'); ?> " class="proceed"><?php echo $this->i18n->query('Accept'); ?></a>
</div>

    <div id="footer">
        <?php if (!isset($disableFooter)) { ?>
        <?php echo \Engine\Helper::getInstance('renderer', 'core')->renderContent('footer'); ?>
        <?php } ?></div>
</div>

</body>
</html>