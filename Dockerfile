# base image
FROM adoptopenjdk/openjdk11:jre-11.0.8_10-alpine

# env
ENV LANG='en_US.UTF-8' LANGUAGE='en_US:en' LC_ALL='en_US.UTF-8'

# set working directory
WORKDIR /opt/vedaweb

# copy files to image
COPY vedaweb-backend/target/vedaweb-0.1.0-SNAPSHOT.jar /opt/vedaweb/vedaweb.jar
COPY vedaweb-backend/src/main/resources/application.properties /opt/vedaweb/application.properties

# hint to expose port 8080
EXPOSE 8080

# run application
CMD ["java", "-Dserver.servlet.context-path=/rigveda", "-Dserver.port=8080", "-Dspring.data.mongodb.host=mongodb", "-Des.host=elastic", "-jar", "/opt/vedaweb/vedaweb.jar"]
