FROM debian:latest
ENV DEBIAN_FRONTEND=noninteractive
RUN apt-get update -y --fix-missing
RUN apt-get upgrade -y
RUN apt-get install -y wget
RUN apt-get install -y lsb-release
RUN apt-get install -y apt-transport-https
RUN apt-get install -y ca-certificates
RUN apt-get install -y gnupg2
RUN wget -O /etc/apt/trusted.gpg.d/php.gpg https://packages.sury.org/php/apt.gpg
RUN echo "deb https://packages.sury.org/php/ $(lsb_release -sc) main" | tee /etc/apt/sources.list.d/php.list
RUN wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add -
RUN sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list'
RUN wget https://www.deb-multimedia.org/pool/main/d/deb-multimedia-keyring/deb-multimedia-keyring_2016.8.1_all.deb
RUN dpkg -i deb-multimedia-keyring_2016.8.1_all.deb
RUN sh -c 'echo "deb http://www.deb-multimedia.org bullseye main non-free" >> /etc/apt/sources.list.d/deb-multimedia.list'
RUN apt-get update -y
RUN apt-get install -y deb-multimedia-keyring
RUN apt-get install -y apache2
RUN apt-get install -y php8.2
RUN apt-get install -y php8.2-dev
RUN apt-get install -y php8.2-mysql
RUN apt-get install -y libapache2-mod-php8.2
RUN apt-get install -y php8.2-curl
RUN apt-get install -y php8.2-common
RUN apt-get install -y php8.2-mbstring
RUN apt-get install -y php8.2-sqlite3
RUN apt-get install -y php8.2-zip
RUN apt-get install -y php8.2-ssh2
RUN apt-get install -y php8.2-gd
RUN apt-get install -y composer
#RUN apt-get install -y ffmpeg
RUN apt-get update -y --fix-missing
RUN apt-get install -y cron
RUN apt-get install -y vim
RUN apt-get install -y google-chrome-stable
RUN apt-get install -y curl
RUN rm -rfv /etc/apache2/sites-enabled/*.conf
COPY .docker/vhost/999-gibsonOs.conf /etc/apache2/sites-available/999-gibsonOs.conf
RUN ln -s /etc/apache2/sites-available/999-gibsonOs.conf /etc/apache2/sites-enabled/999-gibsonOs.conf
RUN crontab -l | { cat; echo "* * * * * php /home/gibsonOS/bin/command core:cronjob:run"; } | crontab
# New Relic
#RUN curl -L https://download.newrelic.com/php_agent/release/newrelic-php5-10.11.0.3-linux.tar.gz | tar -C /tmp -zx
#RUN \
#  export NR_INSTALL_USE_CP_NOT_LN=1 && \
#  export NR_INSTALL_SILENT=1 && \
#  /tmp/newrelic-php5-*/newrelic-install install
#RUN rm -rf /tmp/newrelic-php5-* /tmp/nrinstall*
#RUN sed -i \
#      -e 's/"REPLACE_WITH_REAL_KEY"/"YOUR_LICENSE_KEY"/' \
#      -e 's/newrelic.appname = "PHP Application"/newrelic.appname = "GibsonOS dev"/' \
#      -e 's/;newrelic.daemon.app_connect_timeout =.*/newrelic.daemon.app_connect_timeout=15s/' \
#      -e 's/;newrelic.daemon.start_timeout =.*/newrelic.daemon.start_timeout=5s/' \
#      /etc/php/8.2/cli/conf.d/newrelic.ini
# OpenTelemetry
RUN apt-get install -y gcc
RUN apt-get install -y make
RUN apt-get install -y autoconf
RUN pecl install opentelemetry-beta
RUN echo "" >> /etc/php/8.2/cli/php.ini
RUN echo "[opentelemetry]" >> /etc/php/8.2/cli/php.ini
RUN echo "extension=opentelemetry.so" >> /etc/php/8.2/cli/php.ini
RUN echo "" >> /etc/php/8.2/apache2/php.ini
RUN echo "[opentelemetry]" >> /etc/php/8.2/apache2/php.ini
RUN echo "extension=opentelemetry.so" >> /etc/php/8.2/apache2/php.ini-

#CMD google-chrome-stable --disable-gpu --headless --remote-debugging-address=0.0.0.0 --remote-debugging-port=9222 --no-sandbox &
CMD apachectl -D FOREGROUND
RUN a2enmod rewrite
EXPOSE 80
EXPOSE 443
EXPOSE 42000-43000/udp