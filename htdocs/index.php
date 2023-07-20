<?php
declare(strict_types=1);

use GibsonOS\Core\Exception\RequestError;
use GibsonOS\Core\Exception\UserError;
use GibsonOS\Core\Service\ControllerService;
use GibsonOS\Core\Service\RequestService;
use GibsonOS\Core\Service\UserService;

require __DIR__ . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR . 'bootstrap.php';

$serviceManager = initServiceManager();

$userService = $serviceManager->get(UserService::class);
$requestService = $serviceManager->get(RequestService::class);

try {
    $userDevice = $userService->deviceLogin($requestService->getHeader('X-Device-Token'));
} catch (UserError|RequestError $e) {
    // Login error
}

$controllerService = $serviceManager->get(ControllerService::class);
$controllerService->runAction();
