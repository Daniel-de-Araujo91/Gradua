# Running with Docker

This project includes Dockerfiles for the backend and frontend and a docker-compose.yml to run the full stack (Postgres, Spring Boot backend, and React frontend served by nginx).

Quick start (development / local):

1. Copy the environment template and fill secrets locally:

   cp .env.example .env
   # Edit .env and set POSTGRES_PASSWORD and API_KEY at minimum

2. Build and start everything:

   docker compose up --build -d

3. Access the apps:

   - Frontend (Vite build served by nginx): http://localhost (port 80)
   - Backend (Spring Boot): http://localhost:8080

4. Logs and troubleshooting:

   - Show logs: docker compose logs -f backend
   - Stop: docker compose down
   - Remove volumes (Postgres data): docker compose down -v

Notes and tips:

- The backend reads DB connection values from environment variables. docker-compose.yml sets DB_URL to point to the `db` service. If you want to run Postgres elsewhere, update DB_URL accordingly.
- Do not commit real secrets to the repository. Use .env locally or your platform's secret management for production.
- The backend Dockerfile expects a Maven build; it runs `mvn package -DskipTests`. If you need tests run in CI, change the Dockerfile or run tests before building the image.
- The frontend is built with Node (npm run build) and served with nginx for production. For local development using Vite's dev server, consider running `npm install` and `npm run dev` inside frontend/ instead of using Docker for hot reload.
- If the backend jar name differs from the default artifact pattern, the Dockerfile uses a wildcard to copy the jar; verify the jar is present in target/ after a local Maven build.

Advanced ideas:

- Add healthcheck for the backend (expose /actuator/health via Spring Actuator) and add depends_on health for more robust orchestration.
- Create docker-compose.override.yml to mount source directories and run development servers (Vite, mvn spring-boot:run) instead of building images.
- Use a CI workflow to build and push production images to a registry (GitHub Actions, GitLab CI, etc.).
