

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
    <?php $action = 'requirements'; ?>
    <?php echo $this->partial('../../Core/View//Install/navigation'); ?>

    <div>
        <table>
            <thead>
            <tr>
                <th class="table-column-left">
                    <?php echo $this->i18n->query('Requirement'); ?>
                </th>
                <th class="requirement_passed">
                    <?php echo $this->i18n->query('Passed'); ?>
                </th>
            </tr>
            </thead>
            <tbody>
            <?php foreach ($reqs as $req) { ?>
                <tr>
                    <td class="table-column-name table-column-left">
                        <?php echo $req['name']; ?>
                    </td>
                    <td class="requirement_passed">
                        <?php if ($req['passed']) { ?>
                            <span class="glyphicon glyphicon-ok"></span>
                        <?php } else { ?>
                            <span class="glyphicon glyphicon-remove"></span>
                        <?php } ?>
                    </td>
                </tr>
            <?php } ?>
            <?php foreach ($pathInfo as $path) { ?>
                <tr>
                    <td class="table-column-name table-column-left">
                        <?php echo $this->i18n->query('Writable'); ?> "<?php echo $path['name']; ?>"
                    </td>
                    <td class="requirement_passed">
                        <?php if ($path['is_writable']) { ?>
                            <span class="glyphicon glyphicon-ok"></span>
                        <?php } else { ?>
                            <span class="glyphicon glyphicon-remove"></span>
                        <?php } ?>
                    </td>
                </tr>
            <?php } ?>
            </tbody>
        </table>

        <?php if ($passed) { ?>
            <a href="<?php echo $this->url->get('install/database'); ?> " class="proceed btn-primary"><?php echo $this->i18n->query('Next'); ?></a>
        <?php } else { ?>
            <div class="error"><?php echo $this->i18n->query('Please, check all requirements and check pathes.'); ?></div>
        <?php } ?>
    </div>
</div>

    <div id="footer">
        <?php if (!isset($disableFooter)) { ?>
        <?php echo \Engine\Helper::getInstance('renderer', 'core')->renderContent('footer'); ?>
        <?php } ?></div>
</div>

</body>
</html>