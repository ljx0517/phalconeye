a:11:{i:0;s:56:"

<!DOCTYPE html>
<html>
<head>
    <title>PhalconEye | ";s:5:"title";N;i:1;s:293:"</title>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="generator" content="PhalconEye - Open Source Content Management System"/>

    <?php echo $this->assets->outputCss(); ?>

    <?php echo $this->assets->outputJs(); ?>";s:4:"head";N;i:2;s:218:"</head>
<body>
<div id="wrapper">

    <div id="header">
        <?php if (!isset($disableHeader)) { ?>
        <?php echo \Engine\Helper::getInstance('renderer', 'core')->renderContent('header'); ?>
        <?php } ?>";s:6:"header";N;i:3;s:145:"</div>

    <div class="system-container">
        <?php echo $this->i18n->query($this->getContent()); ?>
    </div>

    <div class="container">";s:7:"content";N;i:4;s:191:"</div>

    <div id="footer">
        <?php if (!isset($disableFooter)) { ?>
        <?php echo \Engine\Helper::getInstance('renderer', 'core')->renderContent('footer'); ?>
        <?php } ?>";s:6:"footer";N;i:5;s:30:"</div>
</div>

</body>
</html>";}