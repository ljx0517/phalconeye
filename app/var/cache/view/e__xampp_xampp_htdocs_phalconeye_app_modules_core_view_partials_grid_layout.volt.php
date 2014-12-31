

<table id="<?php echo $grid->getId(); ?>" class="table grid-table" data-widget="grid">
    <thead>
    <tr>
        <?php foreach ($grid->getColumns() as $name => $column) { ?>
            <th>
                <?php if (isset($column[constant('\Engine\Grid\AbstractGrid::COLUMN_PARAM_SORTABLE')]) && $column[constant('\Engine\Grid\AbstractGrid::COLUMN_PARAM_SORTABLE')]) { ?>
                    <a href="javascript:;" class="grid-sortable" data-sort="<?php echo $name; ?>" data-direction="">
                        <?php echo $this->i18n->query($column[constant('\Engine\Grid\AbstractGrid::COLUMN_PARAM_LABEL')]); ?>
                    </a>
                <?php } else { ?>
                    <?php echo $this->i18n->query($column[constant('\Engine\Grid\AbstractGrid::COLUMN_PARAM_LABEL')]); ?>
                <?php } ?>
            </th>
        <?php } ?>
        <?php if ($grid->hasActions()) { ?>
            <th class="actions"><?php echo $this->i18n->query('Actions'); ?></th>
        <?php } ?>
    </tr>
    <?php if ($grid->hasFilterForm()) { ?>
        <tr class="grid-filter">
            <?php foreach ($grid->getColumns() as $column) { ?>
                <th>
                    <?php if (isset($column[constant('\Engine\Grid\AbstractGrid::COLUMN_PARAM_FILTER')]) && $column[constant('\Engine\Grid\AbstractGrid::COLUMN_PARAM_FILTER')] instanceof Engine\Form\AbstractElement) { ?>
                        <?php $element = $column[constant('\Engine\Grid\AbstractGrid::COLUMN_PARAM_FILTER')]; ?>
                        <?php echo $element->setAttribute('autocomplete', 'off')->render(); ?>
                    <?php } ?>
                    <div class="clear-filter"></div>
                </th>
            <?php } ?>
            <th class="actions">
                <button class="btn btn-filter btn-primary"><?php echo $this->i18n->query('Filter'); ?></button>
                <button class="btn btn-warning"><?php echo $this->i18n->query('Reset'); ?></button>
            </th>
        </tr>
    <?php } ?>
    </thead>
    <?php echo $this->partial($grid->getTableBodyView(), array('grid' => $grid)); ?>
</table>