

<?php if ($form->hasErrors()) { ?>
    <ul class="form_errors">
        <?php foreach ($form->getErrors() as $msg) { ?>
            <li class="alert alert-danger"><?php echo $msg->getMessage(); ?></li>
        <?php } ?>
    </ul>
<?php } ?>
