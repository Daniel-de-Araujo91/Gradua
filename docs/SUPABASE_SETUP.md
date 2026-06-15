Supabase quick setup (minimal, fast approach)

This project uses Spring Boot with JPA. For a quick integration with Supabase (Postgres) follow these steps:

1) Create a Supabase project and copy connection info (host, database, user, password).
2) In the repo, copy backend/.env.supabase.example -> backend/.env and fill the values.
   - Ensure DB_URL uses the JDBC format and includes ?sslmode=require
3) Start the backend: from project root run: backend\mvnw.cmd spring-boot:run
4) The app uses spring.jpa.hibernate.ddl-auto=update so Hibernate creates/updates tables.
5) DataSeeder runs when app.seed.enabled=true in backend/.env and will populate demo data.
6) Update frontend/.env.local with VITE_API_URL pointing to your backend (example in frontend/.env.local.example).

Notes:
- Do not commit backend/.env with credentials. It's listed in backend/.gitignore.
- For production, consider using migrations (Flyway) and disabling app.seed.enabled.
