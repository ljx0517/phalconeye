

<?php if ($form->hasNotices()) { ?>
    <ul class="form_notices">
    <?php foreach ($form->getNotices() as $msg) { ?>
        <li class="alert alert-success"><?php echo $msg; ?></li>
    <?php } ?>
    </ul>
<?php } ?>