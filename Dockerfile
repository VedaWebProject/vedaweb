#### intermediate for building frontend

# pick base image
FROM node:12.19.0-alpine3.12 as frontend-build-env

# copy frontend source project
COPY vedaweb-frontend /opt/vedaweb-frontend

# set workdir
WORKDIR /opt/vedaweb-frontend

# build frontend
RUN npm install --silent &> /dev/null \
 && npm run build --silent &> /dev/null



#### intermediate for building backend (and full app)

# pick base image
FROM maven:3.6.3-adoptopenjdk-11 as backend-build-env

# create project dir
RUN mkdir -p /opt/vedaweb

# set wirk dir
WORKDIR /opt/vedaweb

# copy frontend build
COPY --from=frontend-build-env /opt/vedaweb-frontend/build vedaweb-frontend/build

# copy backend source project
COPY vedaweb-backend vedaweb-backend

# build backend and full app into fat jar
RUN cd vedaweb-backend \
 && mvn clean install -DskipTests --quiet


#### image to run the application from

# pick base image
FROM adoptopenjdk/openjdk11:jre-11.0.8_10-alpine

# set encoding and locales
ENV LANG='en_US.UTF-8' LANGUAGE='en_US:en' LC_ALL='en_US.UTF-8'

# ensure www-data user exists
RUN set -x \
  && addgroup -g 82 -S www-data \
  && adduser -u 82 -D -S -G www-data www-data

# create app dir
RUN mkdir -p /opt/vedaweb && chown 82:82 /opt/vedaweb

# set working directory
WORKDIR /opt/vedaweb

# download updated application import data into "resources" directory
COPY scripts scripts
RUN scripts/update-data.sh

# use www-data as user from here on
USER www-data

# copy app build to image
COPY --from=backend-build-env /opt/vedaweb/vedaweb-backend/target/vedaweb.jar vedaweb.jar

# copy needed configs, scripts etc. to image
COPY vedaweb-backend/src/main/resources/application.properties application.properties
COPY resources/snippets resources/snippets
COPY resources/help resources/help
COPY resources/references resources/references

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
