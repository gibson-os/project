<?php

use GibsonOS\Core\Exception\RequestError;
use GibsonOS\Core\Exception\UserError;
use GibsonOS\Core\Model\User\Permission;
use GibsonOS\Core\Service\ControllerService;
use GibsonOS\Core\Service\PermissionService;
use GibsonOS\Core\Service\RequestService;
use GibsonOS\Core\Service\SessionService;
use GibsonOS\Core\Service\UserService;

require __DIR__ . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR . 'bootstrap.php';

$serviceManager = initServiceManager();


// Module, Task, Action ermitteln und Parameter trennen
$params = [];
$baseDir = preg_replace('|^(.*/).+?$|', '$1', $_SERVER['SCRIPT_NAME']);
$queryString = mb_substr(
    $_SERVER['REQUEST_URI'],
    mb_strpos(
        $_SERVER['REQUEST_URI'],
        $baseDir
    ) + mb_strlen($baseDir)
);
$queryString = (string) preg_replace('/\?.*/', '', $queryString);

$module = 'core';
$task = 'index';
$action = 'index';

if (mb_strlen($queryString)) {
    $params = explode('/', $queryString);

    if (count($params) > 0) {
        $module = array_shift($params);
    }

    if (count($params) > 0) {
        $task = array_shift($params);
    }

    if (count($params) > 0) {
        $action = array_shift($params);
    }
}

// Params
$get = [];

for ($i = 0; $i < count($params) - 1; $i += 2) {
    $get[$params[$i]] = $params[$i + 1];
}

$_SERVER['QUERY_STRING'] = implode('/', $params);
$_GET = array_merge($_GET, $get);
$_REQUEST = array_merge($_GET, $_POST);

$userService = $serviceManager->get(UserService::class);
$requestService = $serviceManager->get(RequestService::class);

try {
    $userDevice = $userService->deviceLogin($requestService->getHeader('X-Device-Token'));
} catch (UserError|RequestError $e) {
    // Login error
}

$controllerService = $serviceManager->get(ControllerService::class);
$controllerService->runAction();