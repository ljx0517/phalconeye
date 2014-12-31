

<tbody>
<?php if ($grid->getTotalCount()) { ?>
    <?php foreach ($grid->getItems() as $item) { ?>
        <tr>
            <?php echo $this->partial($grid->getItemView(), array('grid' => $grid, 'item' => $item)); ?>
        </tr>
    <?php } ?>
    <tr>
        <td colspan="<?php echo ($this->length($grid->getColumns())) + 1; ?>">
            <?php echo $this->partial('../../Core/View/partials/paginator'); ?>
        </td>
    </tr>
<?php } else { ?>
    <tr>
        <td class="grid-no-items" colspan="<?php echo ($this->length($grid->getColumns())) + 1; ?>">
            <?php echo $this->i18n->query('No items'); ?>
        </td>
    </tr>
<?php } ?>
</tbody>