#### intermediate for building frontend

# pick base image
FROM node:12.19.0-alpine3.12 as frontend-build-env

# copy frontend source project
COPY vedaweb-frontend /vedaweb-frontend

# set workdir
WORKDIR /vedaweb-frontend

# build frontend
RUN npm install --silent &> /dev/null \
 && npm run build



#### intermediate for building backend (and full app)

# pick base image
FROM maven:3.6.3-adoptopenjdk-11 as backend-build-env

# create project dir
RUN mkdir -p /vedaweb

# set wirk dir
WORKDIR /vedaweb

# copy frontend build
COPY --from=frontend-build-env /vedaweb-frontend/build vedaweb-frontend/build

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
RUN mkdir -p /vedaweb/resources && chown -R 82:82 /vedaweb

# set working directory
WORKDIR /vedaweb

# use www-data as user from here on
USER www-data

# copy app build
COPY --from=backend-build-env /vedaweb/vedaweb-backend/target/vedaweb.jar vedaweb.jar

# define resources data volume
VOLUME /vedaweb/resources

# hint to expose port 8080
EXPOSE 8080

# app entrypoint
ENTRYPOINT [ "java", "-jar", "/vedaweb/vedaweb.jar", "--spring.config.location=file:///vedaweb/resources/application.properties" ]

# optional arguments
#CMD [""] # no optional arguments ATM
