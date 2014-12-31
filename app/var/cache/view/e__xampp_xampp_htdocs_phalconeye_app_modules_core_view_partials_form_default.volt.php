

<?php echo $form->openTag(); ?>
<div>
    <?php if ($form->getTitle() || $form->getDescription()) { ?>
        <div class="form_header">
            <h3><?php echo $form->getTitle(); ?></h3>

            <p><?php echo $form->getDescription(); ?></p>
        </div>
    <?php } ?>
    <?php echo $this->partial($form->getErrorsView(), array('form' => $form)); ?>
    <?php echo $this->partial($form->getNoticesView(), array('form' => $form)); ?>

    <div class="form_elements">
        <?php foreach ($form->getAll() as $element) { ?>
            <?php echo $this->partial($form->getElementView(), array('element' => $element)); ?>
        <?php } ?>
    </div>
    <div class="clear"></div>

    <?php if ($form->useToken()) { ?>
        <input type="hidden" name="<?php echo $this->security->getTokenKey(); ?>" value="<?php echo $this->security->getToken(); ?>">
    <?php } ?>
</div>
<?php echo $form->closeTag(); ?>