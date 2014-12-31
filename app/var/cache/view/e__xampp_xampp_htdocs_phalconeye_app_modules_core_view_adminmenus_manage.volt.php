

<!DOCTYPE html>
<html>
<head>
    <title><?php echo $this->i18n->query('Manage menu'); ?></title>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link href="favicon.ico" rel="shortcut icon" type="image/x-icon" />

    <?php echo $this->assets->outputCss(); ?>

    <?php echo $this->assets->outputInline(); ?>

    <script type="text/javascript">
        <?php echo \Engine\Helper::getInstance('i18n', 'core')->render(); ?>
    </script>

    
    <?php echo \Engine\Helper::getInstance('assets')->addJs('assets/js/core/admin/menu.js'); ?>
    <?php echo \Engine\Helper::getInstance('assets')->addJs('assets/js/core/widgets/modal.js'); ?>
    <?php echo \Engine\Helper::getInstance('assets')->addJs('assets/js/core/widgets/ckeditor.js'); ?>

    <script type="text/javascript">
        var menuItemsData = {
            'menu_id': <?php echo $menu->id; ?>,
            'link_create': '<?php echo $this->url->get(array('for' => 'admin-menus-create-item')); ?>',
            'link_edit': '<?php echo $this->url->get(array('for' => 'admin-menus-edit-item')); ?>',
            'link_delete': '<?php echo $this->url->get(array('for' => 'admin-menus-delete-item')); ?>',
            'link_order': '<?php echo $this->url->get(array('for' => 'admin-menus-order')); ?>'
            <?php if (isset($parent)) { ?>, 'parent_id': <?php echo $parent->id; ?>
            <?php } ?>
        };
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
        <div class="menu_manage_header">
            <h3>
                <a href="<?php echo $this->url->get('admin/menus'); ?>"><?php echo $this->i18n->query('Menus'); ?></a> >
                <?php if (isset($parent)) { ?>
                    <?php foreach ($parents as $p) { ?>
                        <a href="<?php echo $this->url->get(array('for' => 'admin-menus-manage')); ?><?php echo $menu->id; ?><?php if ($p->parent_id == !null) { ?>?parent_id=<?php echo $p->parent_id; ?><?php } ?>"
                           class='btn'><?php echo $p->title; ?></a>
                        >
                    <?php } ?>
                <?php } ?>
                <?php echo $this->i18n->query('Manage menu'); ?>
                "<?php echo $menu->name; ?>"
            </h3>
            <button id="add-new-item" class="btn btn-primary"><?php echo $this->i18n->query('Add new item'); ?></button>
            <div id="label-saved" class="label label-success"><?php echo $this->i18n->query('Saved...'); ?></div>
        </div>
        <div class="menu_manage_body">
            <ul id="items">
                <?php foreach ($items as $item) { ?>
                    <li data-item-id="<?php echo $item->id; ?>">
                        <div class="item_title">
                            <i class="glyphicon glyphicon-move"></i>
                            <?php echo $item->title; ?>
                            | <?php echo $this->i18n->query('Items: '); ?><?php echo ($item->getMenuItems() ? $item->getMenuItems()->count() : 0); ?>
                        </div>
                        <div class="item_options">
                            <a class="btn btn-success item-manage" href="javascript:;"><?php echo $this->i18n->query('Manage'); ?></a>
                            <a class="btn btn-success item-edit" href="javascript:;"><?php echo $this->i18n->query('Edit'); ?></a>
                            <a class="btn btn-success item-delete" href="javascript:;"><?php echo $this->i18n->query('Remove'); ?></a>
                        </div>
                    </li>
                <?php } ?>
            </ul>
        </div>
    </div>

    
    <div id="default_item" style="display:none;">
        <li data-item-id="element-id">
            <div class="item_title"><i class="glyphicon glyphicon-move"></i>element-label</div>
            <div class="item_options">
                <a class="btn btn-success item-manage" href="javascript:;"><?php echo $this->i18n->query('Manage'); ?></a>
                <a class="btn btn-success item-edit" href="javascript:;"><?php echo $this->i18n->query('Edit'); ?></a>
                <a class="btn btn-success item-delete" href="javascript:;"><?php echo $this->i18n->query('Remove'); ?></a>
            </div>
        </li>
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