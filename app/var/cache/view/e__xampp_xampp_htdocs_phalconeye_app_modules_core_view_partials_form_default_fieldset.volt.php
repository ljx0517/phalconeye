

<fieldset<?php echo $fieldSet->renderAttributes(); ?>>
    <?php if ($fieldSet->hasLegend()) { ?>
        <legend><?php echo $this->i18n->query($fieldSet->getLegend()); ?></legend>
    <?php } ?>

    <?php foreach ($fieldSet->getAll() as $element) { ?>
        <?php echo $this->partial($form->getElementView(), array('element' => $element, 'combined' => $fieldSet->isCombined())); ?>
    <?php } ?>
</fieldset>
