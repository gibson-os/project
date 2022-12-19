<?php
header('Content-Type: text/css; charset=UTF-8');

include_once('../includes/config.inc.php');

// Registry
$RegistryObj = system_registry::getInstance();

// Database
$DatabaseObj = new mysqlDatabase(MYSQL_HOST, MYSQL_USER, MYSQL_PASS);
$DatabaseObj->openDB(DATABASE);
$RegistryObj->set('database', $DatabaseObj);

// Session
$SessionObj = new system_session();
$RegistryObj->set('session', $SessionObj);

// BaseDir
$baseDir = preg_replace('|^(.*/).+?$|', '$1', $_SERVER['SCRIPT_NAME']);

$Helper = new helper_module_system_icon();

if (!$icons = $Helper->getList()) {
    exit;
}

foreach ($icons as $icon) {
    echo '.customIcon' . $icon['id'] . ' {background-image: url(../img/icons/custom/icon' . $icon['id'] . '.png) !important;}';
}