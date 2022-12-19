<?php
declare(strict_types=1);

use GibsonOS\Core\Service\LoggerService;
use Psr\Log\LoggerInterface;

$interfaces = [LoggerInterface::class => LoggerService::class];
$abstracts = [];
