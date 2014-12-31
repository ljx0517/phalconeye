
<?php foreach ($grid->getColumns() as $columnName => $column) { ?>
    <td>
        <?php if (isset($column[constant('\Engine\Grid\AbstractGrid::COLUMN_PARAM_OUTPUT_LOGIC')])) { ?>
            <?php echo $column[constant('\Engine\Grid\AbstractGrid::COLUMN_PARAM_OUTPUT_LOGIC')]($item, $grid->getDI()); ?>
        <?php } else { ?>
            <?php echo $item[$columnName]; ?>
        <?php } ?>
    </td>
<?php } ?>

<?php if ($grid->hasActions()) { ?>
    <td class="actions">
        <?php foreach ($grid->getItemActions($item) as $key => $action) { ?>
            <a
                    href="<?php if (isset($action['href'])) { ?><?php echo $this->url->get($action['href']); ?><?php } else { ?>javascript:;<?php } ?>"
            <?php if (isset($action['attr'])) { ?>
                <?php foreach ($action['attr'] as $attrName => $attrValue) { ?>
                    <?php echo $attrName; ?>="<?php echo $attrValue; ?>"
                <?php } ?>
            <?php } ?>
            >
            <?php echo $this->i18n->query($key); ?>
            </a>
        <?php } ?>
    </td>
<?php } ?>

