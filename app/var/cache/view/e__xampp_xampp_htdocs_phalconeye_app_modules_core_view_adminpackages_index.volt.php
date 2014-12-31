

<!DOCTYPE html>
<html>
<head>
    <title><?php echo $this->i18n->query('Packages management - Modules'); ?></title>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link href="favicon.ico" rel="shortcut icon" type="image/x-icon" />

    <?php echo $this->assets->outputCss(); ?>

    <?php echo $this->assets->outputInline(); ?>

    <script type="text/javascript">
        <?php echo \Engine\Helper::getInstance('i18n', 'core')->render(); ?>
    </script>

    
    <script type="text/javascript">
        var removePackage = function (type, name) {
            if (confirm('<?php echo $this->i18n->query('Are you really want to remove this package? Once removed, it can not be restored.'); ?>')){
                window.location.href = '<?php echo $this->url->get(array('for' => 'admin-packages-uninstall', 'type' => '%type%', 'name' => '%name%', 'return' => 'admin-packages')); ?>'.replace('%type%', type).replace('%name%', name);
            }
        }
    </script>


</head>

<body data-base-url="<?php echo $this->url->get(); ?>" data-debug="<?php echo $this->config->application->debug; ?>">

<div class="navbar navbar_panel">
    <div class="navbar-inner">
        <a class="brand" href="<?php echo $this->url->get('admin'); ?>"><img alt="Phalcon Eye"
                                                        src="<?php echo $this->url->get('assets/img/core/pe_logo_white.png'); ?>"/></a>

        <div class="nav-collapse">
            <?php echo $headerNavigation->render(); ?>
        </div>
    </div>

    <div class="navbar-text">
        <a href="<?php echo $this->url->get(); ?>" class="btn btn-primary"><?php echo $this->i18n->query('Back to site'); ?></a>
        <a href="<?php echo $this->url->get('logout'); ?>" class="btn btn-danger"><?php echo $this->i18n->query('Logout'); ?></a>
    </div>
</div>

<div class="content">

    
    <div class="navbar navbar-header">
        <div class="navbar-inner">
            <?php echo $navigation->render(); ?>
        </div>
    </div>


    <div class="row-fluid row-after-header">
        <div>
            <?php echo $this->getContent(); ?>
            <?php echo $this->flashSession->output(); ?>
        </div>
    </div>

    <div class="row-fluid main-content">
        <!--/row-->
    <div class="span12">
        <div class="row-fluid">
            <ul class="package_list">
                <?php foreach ($packages as $package) { ?>
                    <li <?php if (!$package->enabled) { ?>class="disabled"<?php } ?>>
                        <div class="package_info">
                            <h3><?php echo $package->title; ?> <span>v.<?php echo $package->version; ?></span></h3>

                            <div class="author"><?php echo $package->author; ?></div>
                            <div class="website"><a href="<?php echo $package->website; ?>"><?php echo $package->website; ?></a>
                            </div>
                            <div class="description"><?php echo $package->description; ?></div>
                        </div>
                        <?php if (!$package->is_system) { ?>
                        <div class="package_options">
                            <?php echo $this->tag->linkTo(array(array('for' => 'admin-packages-edit', 'type' => $package->type, 'name' => $package->name, 'return' => 'admin-packages'), $this->i18n->query('Edit'), 'class' => 'btn btn-default')); ?>
                            <?php echo $this->tag->linkTo(array(array('for' => 'admin-packages-events', 'type' => $package->type, 'name' => $package->name, 'return' => 'admin-packages'), $this->i18n->query('Events'), 'class' => 'btn btn-default')); ?>
                            <?php echo $this->tag->linkTo(array(array('for' => 'admin-packages-export', 'type' => $package->type, 'name' => $package->name), $this->i18n->query('Export'), 'class' => 'btn btn-default', 'data-widget' => 'modal')); ?>
                            <?php if ($package->enabled) { ?>
                                <?php echo $this->tag->linkTo(array(array('for' => 'admin-packages-disable', 'type' => $package->type, 'name' => $package->name, 'return' => 'admin-packages'), $this->i18n->query('Disable'), 'class' => 'btn btn-warning')); ?>
                            <?php } else { ?>
                                <?php echo $this->tag->linkTo(array(array('for' => 'admin-packages-enable', 'type' => $package->type, 'name' => $package->name, 'return' => 'admin-packages'), $this->i18n->query('Enable'), 'class' => 'btn btn-success')); ?>
                            <?php } ?>
                            <a class="btn btn-danger" href="javascript:;" onclick="removePackage('<?php echo $package->type; ?>', '<?php echo $package->name; ?>');"><?php echo $this->i18n->query('Uninstall'); ?></a>
                        </div>
                        <?php } ?>
                        <div class="clear"></div>
                    </li>
                <?php } ?>
                <?php if ($packages->count() == 0) { ?>
                <li>
                    <h2 style="text-align: center;"><?php echo $this->i18n->query('No packages'); ?></h2>
                </li>
                <?php } ?>
            </ul>
        </div>
        <!--/row-->
    </div><!--/span-->

    </div>
    <!--/row-->
</div>

<div id="footer">
    PhalconEye v.<?php echo PHALCONEYE_VERSION ?> <br/>[<?php echo date('d-m-Y H:i:s'); ?>]
</div>

<?php echo $this->assets->outputJs(); ?>

</body>
</html>