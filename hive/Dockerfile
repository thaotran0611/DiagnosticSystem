FROM apache/hive:4.0.0

USER root

SHELL ["/bin/bash", "-c"]

RUN apt-get update -y \
  && apt-get install -y --no-install-recommends wget

RUN wget https://dev.mysql.com/get/Downloads/Connector-J/mysql-connector-j_8.3.0-1debian12_all.deb

RUN dpkg -i mysql-connector-j_8.3.0-1debian12_all.deb

RUN cp /usr/share/java/mysql-connector-java-8.3.0.jar /opt/hive/lib/mysql.jar
