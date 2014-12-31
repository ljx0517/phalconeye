

<!DOCTYPE html>
<html>
<head>
    <title><?php echo $this->i18n->query('Languages'); ?></title>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link href="favicon.ico" rel="shortcut icon" type="image/x-icon" />

    <?php echo $this->assets->outputCss(); ?>

    <?php echo $this->assets->outputInline(); ?>

    <script type="text/javascript">
        <?php echo \Engine\Helper::getInstance('i18n', 'core')->render(); ?>
    </script>

    
    <?php echo \Engine\Helper::getInstance('assets')->addJs('assets/js/core/admin/languages.js'); ?>


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
        <?php echo $navigation->render(); ?>
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
            <h2><?php echo $this->i18n->query('Languages'); ?> (<?php echo $grid->getTotalCount(); ?>)</h2>

            <div class="list-actions">
                <a href="<?php echo $this->url->get(array('for' => 'admin-languages-compile')); ?>"
                   class="btn btn-primary"><?php echo $this->i18n->query('Compile languages'); ?></a>
                <button class="btn btn-primary btn-import"><?php echo $this->i18n->query('Import...'); ?></button>
                <?php echo $form->render(); ?>
            </div>

            <?php echo $grid->render(); ?>
        </div>
    </div>

    </div>
    <!--/row-->
</div>

<div id="footer">
    PhalconEye v.<?php echo PHALCONEYE_VERSION ?> <br/>[<?php echo date('d-m-Y H:i:s'); ?>]
</div>

<?php echo $this->assets->outputJs(); ?>

</body>
</html>