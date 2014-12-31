

<div class="widget_wrapper">
    <?php if (isset($title) && $title == !null) { ?>
    <div class="widget_header">
        <h3><?php echo $this->i18n->query($title); ?></h3>
    </div>
    <?php } ?>

    <div class="widget_container">
        
<?php echo $html; ?>

    </div>
</div>
