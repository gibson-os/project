# Install
```shell
composer create-project gibson-os/project path-to-install --ignore-platform-reqs --no-dev
cd path-to-install
```

## Use docker
```shell
docker-compose -f .docker/docker-compose.yaml build
docker-compose -f .docker/docker-compose.yaml up -d
```

```shell
docker exec -it gibson_os-webserver-1 /bin/bash
cd home/gibsonOS/
bin/command core:install
```

http://localhost

!!! Cronjobs !!!