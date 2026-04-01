# goibackend
A backend for Goi made using Spring Boot

## Running locally
This project is coded with IntelliJ IDEA Community Edition & Java 21

Before running it on IntelliJ, [add](https://www.jetbrains.com/help/objc/add-environment-variables-and-program-arguments.html#add-environment-variables) a few environment variables. The default values (for local development, assuming the `docker-compose` is used to run the DB locally) are:

```
SPRING_DATASOURCE_PASSWORD=password;
SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5432/testdb;
SPRING_DATASOURCE_USERNAME=user;
SERVER_PORT=3000
```

## Build
Since I used sdkman, the variable JAVA_HOME may not be properly defined. In that case, the actual value can be fetched via this command: `sdk home java 21.0.10-tem` (change `21.0.10-tem` with the actual JDK being used, that is what I currently use)

The commands to build the jar is
```
JAVA_HOME=[output of sdk home] ./mvnw clean package -DskipTests
```

We skip the tests here because the JDBC URL is not set via `application.properties` (use environment variables instead), but the test wants to make sure the Spring Boot application runs (it will fail by saying `Failed to determine suitable jdbc url`)

## Docker
Command to build the image
```
docker build --tag=goi-backend:latest .
```

Command to run the image with environment variables (when changing the server port, make sure the `-p3000:3000` is changed as well)
```
docker run -p 3000:3000 \
  -e SERVER_PORT=3000 \
  -e SPRING_DATASOURCE_PASSWORD=password \
  -e SPRING_DATASOURCE_URL=jdbc:postgresql://host.docker.internal:5432/testdb \
  -e SPRING_DATASOURCE_USERNAME=user \
  goi-backend:latest
```