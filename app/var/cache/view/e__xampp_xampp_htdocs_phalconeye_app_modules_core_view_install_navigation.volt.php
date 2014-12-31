

<ul class="navigation">
     <li <?php if ($action == 'license') { ?>class="active"<?php } ?>>
         <a href="<?php echo $this->url->get('install'); ?>">
             <span class="glyphicon glyphicon-file"></span>
             <p><?php echo $this->i18n->query('License'); ?></p>
         </a>
     </li>
     <li <?php if ($action == 'requirements') { ?>class="active"<?php } ?>>
         <a href="<?php echo $this->url->get('install/requirements'); ?>">
             <span class="glyphicon glyphicon-list"></span>
             <p><?php echo $this->i18n->query('Requirements'); ?></p>
         </a>
     </li>
     <li <?php if ($action == 'database') { ?>class="active"<?php } ?>>
         <a href="<?php echo $this->url->get('install/database'); ?> ">
             <span class="glyphicon glyphicon-hdd"></span>
             <p><?php echo $this->i18n->query('Database'); ?></p>
         </a>
     </li>
     <li <?php if ($action == 'finish') { ?>class="active"<?php } ?>>
         <a href="<?php echo $this->url->get('install/finish'); ?> ">
             <span class="glyphicon glyphicon-ok"></span>
             <p><?php echo $this->i18n->query('Final'); ?></p>
         </a>
     </li>
</ul>

<div class="header_container">
    <img alt="" src="<?php echo $this->url->get('assets/img/core/pe_logo.png'); ?>"/>
    <div>
        v.<?php echo PHALCONEYE_VERSION ?> <?php echo $this->i18n->query('installation...'); ?>
    </div>
</div>