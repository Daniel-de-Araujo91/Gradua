FROM maven:3.9-eclipse-temurin-17 AS build

WORKDIR /workspace

COPY mvnw ./
COPY .mvn .mvn
COPY pom.xml ./

RUN mvn -B dependency:go-offline

COPY src ./src
RUN mvn -B package -DskipTests


FROM eclipse-temurin:17-jre

WORKDIR /app

COPY --from=build /workspace/target/*.jar app.jar

RUN addgroup -S app && adduser -S app -G app
USER app

EXPOSE 8080

ENTRYPOINT ["java","-Xms256m","-Xmx512m","-jar","app.jar"]