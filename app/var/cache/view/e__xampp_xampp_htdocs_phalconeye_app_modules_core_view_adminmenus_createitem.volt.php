
<div class="modal-header">
    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
    <h3 id="modal_label">
        
    <?php echo $this->i18n->query('Create new menu item'); ?>

    </h3>
</div>
<div class="modal-body">
    

    <script type="text/javascript">
        var checkUrlType = function () {
            var value = $('input[name="url_type"]:checked').val();
            if (value == undefined || value == 0) {
                $('#url').parent().parent().show();
                $('#page').parent().parent().hide();
            }
            else {
                $('#url').parent().parent().hide();
                $('#page').parent().parent().show();
            }
        };

        $(document).ready(function () {
            $('input[name="url_type"]').click(function () {
                checkUrlType();
            });
            checkUrlType();
        });
    </script>

    <?php echo $form->render(); ?>


</div>


<?php if (!isset($disableFooter)) { ?>
    <div class="modal-footer">
        <?php if (!isset($hideClose)) { ?>
            <button class="btn" data-dismiss="modal" aria-hidden="true"><?php echo $this->i18n->query('Close'); ?></button>
        <?php } ?>

        <?php if (!isset($hideSave)) { ?>
            <button class="btn btn-primary btn-save"><?php echo $this->i18n->query('Save'); ?></button>
        <?php } ?>
    </div>
<?php } ?>

