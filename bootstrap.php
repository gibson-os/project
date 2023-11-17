<?php
declare(strict_types=1);

use GibsonOS\Core\Exception\GetError;
use GibsonOS\Core\Manager\ServiceManager;
use GibsonOS\Core\Service\EnvService;
use GibsonOS\Core\Service\TracerService;
use MDO\Client;

require_once __DIR__ . DIRECTORY_SEPARATOR . 'vendor' . DIRECTORY_SEPARATOR . 'autoload.php';

function initServiceManager(): ServiceManager
{
    $interfaces = [];
    $abstracts = [];

    $serviceManager = new ServiceManager();
    $envService = $serviceManager->get(EnvService::class);
    $envService->loadFile(__DIR__ . DIRECTORY_SEPARATOR . '.env');
    $serviceManager->get(TracerService::class);

    require_once __DIR__ . DIRECTORY_SEPARATOR . 'config' . DIRECTORY_SEPARATOR . 'services.php';

    foreach ($interfaces as $interface => $class) {
        $serviceManager->setInterface($interface, $class);
    }

    foreach ($abstracts as $abstract => $class) {
        $serviceManager->setAbstract($abstract, $class);
    }

    $client = new Client(
        $envService->getString('MYSQL_HOST'),
        $envService->getString('MYSQL_USER'),
        $envService->getString('MYSQL_PASS'),
        $envService->getString('MYSQL_DATABASE')
    );
    $serviceManager->setService(EnvService::class, $envService);
    $serviceManager->setService(Client::class, $client);

    try {
        date_default_timezone_set($envService->getString('TIMEZONE'));
    } catch (GetError) {
    }

    return $serviceManager;
}
