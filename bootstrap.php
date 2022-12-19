<?php
declare(strict_types=1);

use GibsonOS\Core\Manager\ServiceManager;
use GibsonOS\Core\Service\EnvService;

require_once __DIR__ . DIRECTORY_SEPARATOR . 'vendor' . DIRECTORY_SEPARATOR . 'autoload.php';

function initServiceManager(): ServiceManager
{
    $interfaces = [];
    $abstracts = [];

    $serviceManager = new ServiceManager();
    require_once __DIR__ . DIRECTORY_SEPARATOR . 'config' . DIRECTORY_SEPARATOR . 'services.php';

    foreach ($interfaces as $interface => $class) {
        $serviceManager->setInterface($interface, $class);
    }

    foreach ($abstracts as $abstract => $class) {
        $serviceManager->setAbstract($abstract, $class);
    }

    $envService = $serviceManager->get(EnvService::class);
    $envService->loadFile(__DIR__ . DIRECTORY_SEPARATOR . '.env');
    $mysqlDatabase = new mysqlDatabase(
        $envService->getString('MYSQL_HOST'),
        $envService->getString('MYSQL_USER'),
        $envService->getString('MYSQL_PASS')
    );
    $mysqlDatabase->openDB($envService->getString('MYSQL_DATABASE'));
    $serviceManager->setService(EnvService::class, $envService);
    $serviceManager->setService(mysqlDatabase::class, $mysqlDatabase);
    mysqlRegistry::getInstance()->set('database', $mysqlDatabase);

    return $serviceManager;
}