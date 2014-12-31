

<?php if ($paginator->total_pages > 1) { ?>
    <?php $startIndex = 1; ?>

    <?php if ($paginator->total_pages > 10) { ?>
        <?php if ($paginator->current > 4) { ?>
            <?php $startIndex = $startIndex + $paginator->current - 4; ?>
        <?php } ?>
        <?php if ($paginator->total_pages - $paginator->current < 10) { ?>
            <?php $startIndex = $paginator->total_pages - 9; ?>
        <?php } ?>
    <?php } ?>

    <div class="pagination-container">
        <ul class="pagination">
            <?php if ($paginator->current > 1) { ?>
                <li>
                    <a href="<?php echo \Engine\Helper::getInstance('url')->paginatorUrl(); ?>" data-page="1"><?php echo $this->i18n->query('First'); ?></a>
                </li>
                <li>
                    <a href="<?php echo \Engine\Helper::getInstance('url')->paginatorUrl($paginator->before); ?>" data-page="<?php echo $paginator->before; ?>">&laquo;</a>
                </li>
            <?php } ?>

            <?php foreach (range($startIndex, $paginator->total_pages) as $pageIndex) { ?>
                <?php if ($pageIndex == $startIndex + 10) { ?>
                    <?php break; ?>
                <?php } ?>

                <li <?php if ($pageIndex == $paginator->current) { ?>class="active"<?php } ?>>
                    <a href="<?php echo \Engine\Helper::getInstance('url')->paginatorUrl($pageIndex); ?>" data-page="<?php echo $pageIndex; ?>"><?php echo $pageIndex; ?></a>
                </li>
            <?php } ?>

            <?php if ($paginator->current < $paginator->total_pages) { ?>
                <li>
                    <a href="<?php echo \Engine\Helper::getInstance('url')->paginatorUrl($paginator->current + 1); ?>" data-page="<?php echo $paginator->current + 1; ?>">&raquo;</a>
                </li>
                <li>
                    <a href="<?php echo \Engine\Helper::getInstance('url')->paginatorUrl($paginator->last); ?>" data-page="<?php echo $paginator->last; ?>"><?php echo $this->i18n->query('Last'); ?></a>
                </li>
            <?php } ?>
        </ul>
    </div>
<?php } ?>