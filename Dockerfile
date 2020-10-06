# base image
FROM adoptopenjdk/openjdk11:jre-11.0.8_10-alpine

# env
ENV LANG='en_US.UTF-8' LANGUAGE='en_US:en' LC_ALL='en_US.UTF-8'

# install additional packages
RUN apk add git

# set working directory
WORKDIR /opt/vedaweb

# copy files to image
COPY vedaweb-backend/target/vedaweb-0.1.0-SNAPSHOT.jar vedaweb.jar
COPY vedaweb-backend/src/main/resources/application.properties application.properties

# download data
RUN git clone https://github.com/cceh/c-salt_vedaweb_tei.git res/tei
RUN git clone https://github.com/VedaWebPlatform/vedaweb-data-external.git res/references

# hint to expose port 8080
EXPOSE 8080

# app entrypoint
ENTRYPOINT [ \
    "java", \
    "-Dserver.port=8080", \
    "-Dserver.servlet.context-path=/rigveda", \
    "-Dspring.data.mongodb.host=mongodb", \
    "-Dspring.data.mongodb.port=27017", \
    "-Dspring.data.mongodb.database=vedaweb", \
    "-Des.host=elastic", \
    "-Des.port=9200", \
    "-Des.protocol=http", \
    "-Des.index.name=vedaweb", \
    "-jar", \
    "/opt/vedaweb/vedaweb.jar" \
]

# optional arguments
#CMD [""] # no optional arguments ATM
