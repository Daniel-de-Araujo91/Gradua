# Multi-stage Dockerfile for building and running the Spring Boot backend
# Stage 1: build with Maven + JDK 21
FROM maven:3.9.5-eclipse-temurin-21 AS build
WORKDIR /workspace

# Copy mvnw and wrapper if present to preserve reproducible build
COPY mvnw ./
COPY .mvn .mvn
COPY pom.xml ./

# Download dependencies
RUN mvn -B dependency:go-offline

# Copy source and package
COPY src ./src
RUN mvn -B package -DskipTests

# Stage 2: runtime image
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Copy jar from build stage (use wildcard to be resilient to artifact name)
COPY --from=build /workspace/target/*-SNAPSHOT.jar app.jar
COPY --from=build /workspace/target/*.jar app.jar

# Create non-root user
RUN addgroup -S app && adduser -S app -G app
USER app

EXPOSE 8080
ENTRYPOINT ["java","-Xms256m","-Xmx512m","-jar","/app/app.jar"]
