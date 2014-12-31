


<?php if ($this->isIncluded('top', (array_keys($content)))) { ?>
    <div id="general-content-full-top">
        <?php foreach ($content['top'] as $widget) { ?>
            <?php echo $widget; ?>
        <?php } ?>
    </div>
<?php } ?>


<?php if ($this->isIncluded('left', (array_keys($content)))) { ?>
    <div id="general-content-left">
        <?php foreach ($content['left'] as $widget) { ?>
            <?php echo $widget; ?>
        <?php } ?>
    </div>
<?php } ?>


<?php if ($this->isIncluded('right', (array_keys($content)))) { ?>
    <div id="general-content-right">
        <?php foreach ($content['right'] as $widget) { ?>
            <?php echo $widget; ?>
        <?php } ?>
    </div>
<?php } ?>


<?php if ($this->isIncluded('middle', (array_keys($content)))) { ?>

    
    <?php if (($this->isIncluded('right', (array_keys($content)))) && ($this->isIncluded('left', (array_keys($content))))) { ?>
        <div id="general-content">
            <?php foreach ($content['middle'] as $widget) { ?>
                <?php echo $widget; ?>
            <?php } ?>
        </div>
    <?php } ?>
    
    <?php if (($this->isIncluded('right', (array_keys($content)))) && (!$this->isIncluded('left', (array_keys($content))))) { ?>
        <div id="general-content-column-left">
            <?php foreach ($content['middle'] as $widget) { ?>
                <?php echo $widget; ?>
            <?php } ?>
        </div>
    <?php } ?>
    
    <?php if (($this->isIncluded('left', (array_keys($content)))) && (!$this->isIncluded('right', (array_keys($content))))) { ?>
        <div id="general-content-column-right">
            <?php foreach ($content['middle'] as $widget) { ?>
                <?php echo $widget; ?>
            <?php } ?>
        </div>

        
    <?php } ?>

    <?php if ((!$this->isIncluded('right', (array_keys($content)))) && (!$this->isIncluded('left', (array_keys($content))))) { ?>
        <div id="general-content-full">
            <?php foreach ($content['middle'] as $widget) { ?>
                <?php echo $widget; ?>
            <?php } ?>
        </div>
    <?php } ?>

<?php } ?>


<?php if ($this->isIncluded('bottom', (array_keys($content)))) { ?>
    <div id="general-content-full-bottom">
        <?php foreach ($content['bottom'] as $widget) { ?>
            <?php echo $widget; ?>
        <?php } ?>
    </div>
<?php } ?>