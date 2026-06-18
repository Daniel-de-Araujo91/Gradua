Local setup (backend + frontend)

1) Backend
- Instale PostgreSQL ou rode com Docker.
- Crie um banco chamado `gradua` e um usuário com permissão.
- Copie `backend/.env.example` para `backend/.env` e preencha DB_URL, DB_USER, DB_PASSWORD e API_KEY.
- Entre em `backend/` e execute:
  - Linux/Mac: `./mvnw spring-boot:run`
  - Windows: `mvnw.cmd spring-boot:run` ou `mvn spring-boot:run`

2) Frontend
- Entre em `frontend/` e execute:
  - `npm install`
  - `npm run dev`
- Abra `http://localhost:5173` (porta padrão do Vite).

3) Usuários de teste
- O backend injeta uma conta ADMIN para dev: CPF `00000000000` / senha `admin123`.

Segurança
- Não deixe arquivos `.env` com segredos em repositórios públicos. Use `.env.example` como template.

4) Usando Docker (build e deploy local)

- Copie o template e preencha valores sensíveis localmente:

  - `cp .env.example .env` (Windows: copie manualmente ou use PowerShell `Copy-Item`)

- Suba toda a stack (Postgres, backend e frontend) com docker-compose:

  - `docker compose up --build -d`

- Verifique logs e status:

  - `docker compose logs -f backend`  # ver logs do backend em tempo real
  - `docker compose ps`               # ver containers e estado

- Parar e remover containers (opcionalmente volumes):

  - `docker compose down`             # para e remove containers
  - `docker compose down -v`          # remove também volumes (dados do Postgres)

Observações:

- O `docker-compose.yml` na raiz monta três serviços: `db` (Postgres), `backend` (Spring Boot) e `frontend` (build estático servido por nginx).
- Valores sensíveis (senha do Postgres, API_KEY) devem ser fornecidos pelo arquivo `.env` local ou pelo seu sistema de CI/CD/Secrets. Não comite `.env` com segredos.
- Se precisar de desenvolvimento com hot-reload, recomendo rodar os servidores localmente (frontend: `npm run dev`; backend: `mvn spring-boot:run`) ou criar um `docker-compose.override.yml` que monte volumes e execute `mvn spring-boot:run` e `npm run dev` dentro dos containers.
