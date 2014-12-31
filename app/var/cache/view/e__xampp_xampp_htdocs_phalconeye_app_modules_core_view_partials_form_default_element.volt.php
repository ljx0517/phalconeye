

<?php if ($element instanceof Engine\Form\FieldSet) { ?>
    <?php echo $this->partial($form->getFieldSetView(), array('fieldSet' => $element)); ?>
<?php } else { ?>
    <?php if ($element->useDefaultLayout()) { ?>

        <?php if (!isset($combined) || !$combined) { ?>
            <div class="form_element_container<?php if ($form->hasErrors($element->getName())) { ?> validation_failed<?php } ?>">
        <?php } ?>

        <?php if ($element->getOption('label') || $element->getOption('description')) { ?>
            <div class="form_label">
                <?php if ($element->getOption('label')) { ?>
                    <label for="<?php echo $element->getName(); ?>">
                        <?php echo $this->i18n->query($element->getOption('label')); ?>
                        <?php if ($element->getOption('required')) { ?>
                            *
                        <?php } ?>
                    </label>
                <?php } ?>
                <?php if ($element->getOption('description')) { ?>
                    <p><?php echo $this->i18n->query($element->getOption('description')); ?></p>
                <?php } ?>
            </div>
        <?php } ?>
        <div class="form_element">
            <?php if ($element instanceof Engine\Form\Element\File && $element->getOption('isImage') && $element->getValue() != '/') { ?>
                <div class="form_element_file_image">
                    <img alt="" src="<?php echo $element->getValue(); ?>"/>
                </div>
            <?php } ?>
            <?php echo $element->render(); ?>
        </div>

        <?php if (!isset($combined) || !$combined) { ?>
            </div>
        <?php } ?>

    <?php } else { ?>
        <?php echo $element->render(); ?>
    <?php } ?>
<?php } ?>
