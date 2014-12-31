

<div class="widget_wrapper">
    <?php if (isset($title) && $title == !null) { ?>
    <div class="widget_header">
        <h3><?php echo $this->i18n->query($title); ?></h3>
    </div>
    <?php } ?>

    <div class="widget_container">
        <div class="header_widget">
    <?php if ($show_title == 1 || !(empty($logo))) { ?>
        <div class="header_logo">
            <a href="<?php echo $this->url->get(); ?>">
                <?php if (!(empty($logo))) { ?>
                <img alt='<?php echo $site_title; ?>' src="<?php echo $this->url->get($logo); ?>"/>
                <?php } ?>
                <?php if ($show_title == 1) { ?><?php echo $site_title; ?><?php } ?>
            </a>
        </div>
    <?php } ?>

    <?php if ($show_auth == 1) { ?>
        <div class="header_auth">
        <?php if (!\Engine\Helper::getInstance('user', 'user')->isUser()) { ?>
            <a href="<?php echo $this->url->get('login'); ?>"><?php echo $this->i18n->query('Login'); ?></a>&nbsp;
            |
            <a href="<?php echo $this->url->get('register'); ?>"><?php echo $this->i18n->query('Register'); ?></a>
        <?php } else { ?>
            <?php echo $this->i18n->query('Welcome, '); ?><?php echo \Engine\Helper::getInstance('user', 'user')->current()->username; ?>&nbsp;
            |
            <?php if (\Engine\Helper::getInstance('acl', 'core')->isAllowed('AdminArea', 'access')) { ?>
                <a href="<?php echo $this->url->get('admin'); ?>"><?php echo $this->i18n->query('Admin panel'); ?></a>
            <?php } ?>
            <a href="<?php echo $this->url->get('logout'); ?>"><?php echo $this->i18n->query('Logout'); ?></a>
        <?php } ?>
        </div>
    <?php } ?>
    <div class="clear"></div>
    </div>
    </div>
</div>
