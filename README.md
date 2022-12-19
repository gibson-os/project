# Install
```shell
composer create-project gibson-os/project path-to-install
cd path-to-install
```

## Use docker
```shell
docker-compose -f .docker/docker-compose.yaml build
docker-compose -f .docker/docker-compose.yaml up -d
```

````shell
docker exec -it gibson_os-mysql-1 mariadb --user root -pldspFfsd8D0fds
````

````mysql
CREATE DATABASE gibson_os;
````

````shell
docker exec -it gibson_os-webserver-1 /bin/bash
cd home/gibsonOS/
composer install
bin/command core:install
````

!!! Cronjobs !!!