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
