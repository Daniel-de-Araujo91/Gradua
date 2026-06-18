# Documentação de Atualizações do Sistema — Projeto Gradua

Este documento apresenta de forma detalhada todas as melhorias e novos recursos implementados no sistema **Gradua** desde a última grande atualização do GitHub, cobrindo as modificações estruturais realizadas no **Backend** (Spring Boot) e no **Frontend** (React).

A atualização foca principalmente na **implantação de segurança corporativa baseada em JWT**, **padronização de tratamento de erros global**, **integração robusta de variáveis de ambiente** e a **segregação lógica de funcionalidades sensíveis (Fórum e Painel Administrativo)**.

---

## ─── 1. MODIFICAÇÕES NO BACKEND (Spring Boot) ───

As alterações no backend elevaram o nível de segurança do sistema, preparando a API para operações de produção e facilitando o desenvolvimento seguro por meio da modularização das credenciais.

### A. Novo Filtro e Fluxo de Autenticação JWT (`SecurityFilter.java` & `TokenService.java`)
- **Validação Stateful para Stateless:** A API foi convertida para o modelo Stateless, onde o estado da sessão não é armazenado em memória no servidor, aumentando a escalabilidade da aplicação.
- **Intercepção de Requisições:** O novo `SecurityFilter` intercepta cada requisição HTTP recebida pela API:
  - Recupera o token Bearer no cabeçalho `Authorization: Bearer <token>`.
  - Valida sua assinatura digital e prazo de expiração no `TokenService`.
  - Carrega dinamicamente os detalhes do usuário a partir do seu CPF ou Passaporte (para estrangeiros) no `UserRepository`.
  - Configura os papéis e permissões no contexto global do Spring Security (`SecurityContextHolder`).
- **Tratamento de Token Inválido/Expirado:** Caso a validação do token falhe (assinatura incorreta ou token expirado), o filtro intercepta a falha imediatamente, cancela o pipeline e retorna um status **401 Unauthorized** com um JSON legível para o frontend:
  ```json
  {
    "message": "Token inválido ou expirado"
  }
  ```

### B. Arquitetura de Segurança Centralizada (`SecurityConfig.java`)
- **Políticas de Acesso Dinâmicas:**
  - **Permitidos Sem Autenticação:** Acesso aberto apenas às rotas `/auth/login`, `/auth/register`, à rota de erro padrão `/error` e a qualquer requisição com método `OPTIONS` (essencial para preflight requests e resolução de bloqueios de CORS).
  - **Área do Administrador:** Bloqueio estrito de qualquer rota `/admin/**` para usuários que não possuam a role `ROLE_ADMIN`.
  - **Funcionalidades do Fórum:** Exigência de usuário autenticado (`authenticated()`) para as rotas `/forum/**`.
  - **Demais Endpoints:** Configuração padrão restritiva de segurança (`anyRequest().authenticated()`).
- **Codificação de Senhas Segura:** Integração do codificador `BCryptPasswordEncoder` para gerar hashes criptográficos irreversíveis das senhas durante o registro e login dos usuários.
- **Resolução de CORS (`CorsConfig.java`):** Configuração refinada de CORS permitindo conexões diretas do frontend local e liberando explicitamente os cabeçalhos de autenticação.

### C. Tratamento Global de Exceções (`GlobalExceptionHandler.java`)
- Criado um manipulador de exceções global anotado com `@RestControllerAdvice`.
- Intercepta e padroniza erros comuns em DTOs uniformes (`ErrorResponseDTO`):
  - **Erros de Validação (`MethodArgumentNotValidException`):** Captura campos inválidos que falharam nas regras do `@Valid` (como campos vazios ou formatos incorretos) e retorna uma lista formatada contendo a lista exata dos campos com problemas.
  - **Erros de Estado de Resposta (`ResponseStatusException`):** Converte erros HTTP específicos do Spring para o DTO padronizado.
  - **Erros Inesperados (`RuntimeException` e `Exception`):** Captura falhas internas, impedindo o vazamento de stack traces detalhados e garantindo segurança operacional.

### D. Variáveis de Ambiente e Configurações (`application.properties` & `.env`)
- **Externalização de Segredos:** Removidas todas as credenciais expostas no código e no `application.properties`.
- **Importação Dinâmica de `.env`:** Configurada a importação dinâmica nativa de arquivos `.env` localizados na raiz do projeto ou no diretório do backend por meio de:
  ```properties
  spring.config.import=optional:file:.env[.properties],optional:file:backend/.env[.properties]
  ```
- **Placeholders Dinâmicos:** Conexão com banco de dados e segredo de tokens utilizam placeholders seguros:
  - Banco de Dados: `${DB_URL}`, `${DB_USER}`, `${DB_PASSWORD}`
  - Segredo de Assinatura JWT: `${API_KEY}`

### E. Controle de Acesso no Fórum (`ForumTopicService.java`)
- **Segurança ao Nível de Registro:** Todas as operações do fórum agora interagem com a autenticação atual:
  - Criação de tópico associa automaticamente o usuário autenticado como autor.
  - **Editar (`update`) e Excluir (`delete`) protegidos:** O serviço valida se o ID do autor do tópico corresponde ao ID do usuário autenticado. Se um usuário tentar modificar tópicos de terceiros, uma exceção **403 Forbidden** é lançada imediatamente com a mensagem `"Apenas o autor pode editar/excluir este tópico"`.

---

## ─── 2. MODIFICAÇÕES NO FRONTEND (React) ───

No frontend, a arquitetura foi modularizada para lidar de forma transparente e resiliente com o novo ecossistema seguro do backend.

### A. Contexto Global de Autenticação (`AuthContext.jsx`)
- Criado o provedor global `<AuthProvider>` para compartilhar o estado de autenticação entre as páginas.
- **Persistência de Sessão:** O estado recupera automaticamente os tokens e dados salvos no `localStorage` ao carregar a página, prevenindo a perda de sessão no refresh.
- **Ações Centralizadas:**
  - `login(userData, token)`: Salva os dados do usuário, armazena o JWT no `localStorage` e muda o estado da aplicação.
  - `logout()`: Limpa todos os dados salvos e invalida a autenticação ativa.

### B. Proteção de Rotas Imperativa (`PrivateRoute.jsx` & `App.jsx`)
- Desenvolvido o componente de barreira `<PrivateRoute />` que consome as informações do `AuthContext`.
- Protege as rotas internas da aplicação contra acessos por URL direta. Se o usuário tentar acessar qualquer rota interna sem token, ele é redirecionado de forma instantânea para `/login`.
- As seguintes rotas foram agrupadas no fluxo de proteção:
  - Painel Administrativo (`/admin`)
  - Feed e Fórum de Discussões (`/forum`)
  - Gerenciamento de Perfil (`/perfil`)
  - Área de Documentos (`/documentos`)
  - Agenda Acadêmica (`/agenda`)
  - Painel Geral (`/`)

### C. Cliente HTTP Inteligente e Centralizado (`apiClient.js`)
- Criado um invólucro (wrapper) sobre a API nativa `fetch` para automatizar as requisições.
- **Interceção Automática de Token:** Injeta o token JWT automaticamente no cabeçalho `Authorization: Bearer <token>` em todas as requisições, caso ele exista no cache local.
- **Expiração de Token Inteligente (Auto-Logout):** Caso o backend retorne status **401 Unauthorized** (token expirou ou foi invalidado), o `apiClient` intercepta a resposta, limpa automaticamente o cache local de login e redireciona o navegador para `/login`.
- **Tratamento Uniforme de Respostas e Erros:** Formata as respostas de sucesso em formato JSON nativo e extrai de forma transparente as mensagens de erro retornadas pela infraestrutura do backend.

### D. Serviços Desacoplados (`authService.js` & `forumService.js`)
- Criação de bibliotecas de serviço isoladas para comunicação com a API.
- Modularização das ações de login, registro de novos usuários e manipulação de tópicos (CRUD) usando o cliente de API configurado.

### E. Telas de Login e Cadastro Atualizadas (`LoginForm.jsx` & `Cadastro.jsx`)
- **LoginForm.jsx:**
  - Integrado ao serviço `authService` e ao `AuthContext`.
  - Apresenta máscara dinâmica de CPF em tempo real no campo de entrada para o usuário.
  - Trata erros de requisição e exibe mensagens amigáveis na tela em um bloco de alerta estilizado em cor vermelha.
- **Cadastro.jsx:**
  - Reformulado para suportar o cadastro dinâmico integrado ao backend.
  - Suporta seleção entre usuários nativos (CPF) e estrangeiros (Passaporte).
  - Envia os payloads devidamente estruturados e encaminha o usuário de volta ao fluxo de entrada em caso de sucesso.

---

## ─── 3. COMO CONFIGURAR E RODAR APÓS AS ATUALIZAÇÕES ───

Com a nova arquitetura baseada em variáveis de ambiente, os passos a seguir devem ser executados para o funcionamento local:

### 1. Configurando as Variáveis no Backend
1. Navegue até a pasta `backend/`.
2. Renomeie o arquivo `env-exemple.txt` para `.env` (ou crie um arquivo `.env` contendo a seguinte estrutura):
   ```properties
   DB_URL=jdbc:postgresql://localhost:5432/gradua
   DB_USER=seu_usuario_do_banco
   DB_PASSWORD=sua_senha_do_banco
   API_KEY=sua_chave_secreta_jwt_longa_e_segura
   ```
3. O Spring Boot carregará este arquivo automaticamente ao iniciar.

### 2. Configurando o Frontend
1. Na pasta `frontend/`, verifique a existência do arquivo `.env`.
2. Certifique-se de que ele aponta corretamente para a URL base do backend:
   ```env
   VITE_API_URL=http://localhost:8080
   ```

### 3. Rodando o Projeto
- **Backend:** Execute o projeto normalmente via sua IDE (Eclipse/VSCode) ou através do terminal usando:
  ```bash
  mvn spring-boot:run
  ```
- **Frontend:** Instale as novas dependências e execute o servidor local:
  ```bash
  npm install
  npm run dev
  ```

---

*Documentação gerada com base nas revisões de código dos últimos commits do projeto.*

## ─── 4. COMO UTILIZAR O DOCKER PARA COMPILAR A APLICAÇÃO ───

- É necessário ter o **Docker Desktop** instalado e ativo na máquina.
- Certifique-se que os **.envs** estão configurados corretamente.

Com isso é muito simples, basta seguir o passo a passo a seguir:

### 1. No terminal dentro do projeto, rode para criar o container:
```powershell
docker compose --env-file backend/.env up -d --build   
```
ou 

```powershell
docker compose up -d --build      
```

### 2. No seu navegador procure pelo endereço `http://localhost/`

### 3. Para parar a aplicação, use (vai permanecer no disco):

```poweshell
docker compose stop
```

Se desejar reativar, basta executar:

```powershell
docker compose start
```

### 4. Caso queira encerrar completamente o processo, use:

```powershell
docker compose down     
```