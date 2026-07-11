# Plano de Implementação Técnica Específico
Módulos de Monitoria, Agenda Semanal e Fórum Orientado a Objetivos

## 1. Arquitetura Geral de Permissões e Perfis (RBAC)
Definição estrita das capacidades operacionais de cada tipo de usuário no ecossistema acadêmico, mitigando falhas de elevação de privilégio.

### 1.1. Perfil: Aluno
- **Consumo de Dados:** Visualização estática da agenda unificada contendo horários de aulas oficiais da sua respectiva turma.
- **Central de Notificações (Dashboard do Aluno):** Painel integrado de leitura de avisos e atualizações emitidos pelos monitores das disciplinas nas quais o aluno está regularmente matriculado. **Nota de Escopo:** Este painel não concede permissões administrativas de criação ou deleção.
- **Interação no Fórum:** Capacidade de criar discussões de dúvidas gerais, adicionar comentários em tópicos existentes, realizar upvotes/downvotes em discussões e editar suas próprias interações.

### 1.2. Perfil: Monitor
- **Painel do Monitor (Comunicação de Monitoria):** Interface exclusiva e restrita apenas para a disciplina sob sua responsabilidade direta.
- **Gerenciamento de Encontros:** Permissão para criar e disponibilizar horários de monitoria especificando obrigatoriamente local (sala física ou link de videoconferência), data, horário de início e término.
- **Disparo de Avisos:** Capacidade de publicar avisos prioritários que geram notificações automáticas na interface de todos os alunos integrados à disciplina.

## 2. Engenharia de Dados e Unificação do Modelo de Comunicação
Modelagem conceitual do banco de dados projetada para maximizar a reutilização de tabelas e garantir a integridade dos dados e o histórico das interações.

### 2.1. Estrutura Lógica de Entidades
- **Usuários e Perfis:** Armazenamento de informações básicas de identificação vinculadas a um atributo lógico de papel operacional (Aluno ou Monitor), prevenindo duplicação de cadastros.
- **Matrículas e Vínculos:** Tabela intermediária associando usuários e disciplinas, especificando se a relação é de aprendizado (aluno matriculado) ou de suporte (monitor responsável).
- **Postagens Unificadas (Fórum e Avisos):** Uma única entidade centraliza as comunicações, utilizando uma flag de tipagem para diferenciar o comportamento na interface.
- **Comentários:** Entidade vinculada diretamente a uma postagem do fórum, suportando encadeamento simples para respostas organizadas.
- **Notificações Acadêmicas:** Registro de eventos gerados por monitores, mapeados por ID de aluno para consumo sob demanda no dashboard principal.

### 2.2. Regras de Negócio no Banco de Dados
- **Avisos do Monitor:** Não possuem votação (Upvote/Downvote). Interface oculta botões. Atributo de tipagem define o post como estático. Contadores de voto permanecem nulos ou inativos.
- **Discussões do Fórum:** Permitem votação e interação aberta entre alunos e monitores. Atributo de tipagem habilita incremento e decremento numérico de votos.
- **Edição (Update) no Fórum:** Usuários podem corrigir erros em suas postagens e comentários. Atualização do campo de texto original e ativação de um marcador lógico de modificação.

## 3. Cronograma Horário Oficial (Período 2026.1)
Mapeamento estruturado dos horários de aulas síncronas que servirão de base para a população automática do calendário interno do sistema.

- **Segunda-feira:**
  - 13h30 - 15h10 (T1/T2): Teoria da Computação (TEORIA DA COMP)
  - 15h20 - 17h00 (T3/T4): Atividade Curricular de Extensão 1 (ACE 1)
  - 17h10 - 18h50 (T5/T6): Projeto e Análise de Algoritmos (PAA)
- **Terça-feira:**
  - 13h30 - 15h10 (T1/T2): Programação 2 (PROG 2)
  - 15h20 - 17h00 (T3/T4): Programação 3 (PROG 3)
- **Quarta-feira:**
  - 13h30 - 15h10 (T1/T2): Teoria da Computação (TEORIA DA COMP)
  - 15h20 - 17h00 (T3/T4): Programação 3 (PROG 3)
- **Quinta-feira:**
  - 13h30 - 15h10 (T1/T2): Programação 2 (PROG 2)
  - 17h10 - 18h50 (T5/T6): Projeto e Análise de Algoritmos (PAA)
- **Sexta-feira:**
  - Nenhum bloco letivo (Horário Livre / Reservado para Atividades de Monitoria)

## 4. Especificação de Módulos de Interface (UI/UX)
Detalhamento lógico do comportamento visual das telas adaptadas de acordo com as diretrizes acordadas.

### 4.1. Módulo de Agenda Semanal Integrada
A tela de agenda consumirá a matriz horária fixa do período 2026.1. Alunos e monitores visualizarão os blocos ocupados por padrão. No perfil do Monitor, os blocos identificados como livres (ex: turnos matutinos ou sexta-feira) exibirão um acionador visual para "Agendar Sessão de Monitoria".

### 4.2. Módulo de Comunicação e Painel do Monitor
Formulário exclusivo contendo validações rígidas de preenchimento. O monitor especificará a data do encontro, hora de início e fim, e o local exato. Ao submeter, o sistema executará uma busca interna por todos os IDs de alunos matriculados na respectiva disciplina para gerar os registros correspondentes na tabela de notificações.

### 4.3. Central de Notificações e Fórum Avançado
Na visualização do aluno, cartões dinâmicos alertarão sobre novas sessões de monitoria agendadas. No módulo de fórum, as postagens do tipo "Discussão" renderizarão componentes de engajamento (votos e comentários). A ação de edição (Update) verificará se o ID do usuário logado confere com o ID do criador da postagem antes de habilitar a interface de edição de texto.

## 5. Plano de Execução e Desenvolvimento (Fases)

**Fase 1: Ajuste de Infraestrutura de Dados**
- Modificação das definições de tabelas para incluir as flags de tipagem de postagem (`tipo: AVISO | DISCUSSAO`).
- Criação da tabela de notificações associada por ID de destino.
- Inclusão do campo lógico de verificação de modificação (`isEdited`) na entidade de postagens e comentários.

**Fase 2: Construção da Camada de Serviços (Back-End)**
- Desenvolvimento do endpoint de criação de monitorias com gatilho automático de inserção de notificações em lote para alunos vinculados.
- Criação de rotas de atualização protegidas que validam a posse da postagem antes de aplicar mutações de texto.
- Filtros otimizados de busca de postagens que retornam estados booleanos para ocultação de elementos de votação.

**Fase 3: Desenvolvimento de Componentes Visuais (Front-End)**
- Adaptação da tela de Agenda para renderizar os blocos fixos do período 2026.1 e permitir interações contextuais.
- Construção do formulário do Monitor com feedbacks de validação de campos.
- Implementação da renderização condicional baseada no papel do usuário autenticado para proteção visual de rotas.

**Fase 4: Garantia de Qualidade e Segurança**
- Testes automatizados de validação de rotas (Garantir que requisições de criação de avisos vindas de perfis de alunos sejam rejeitadas com erro de falta de autorização).
- Homologação da persistência de dados de edições e ordenação cronológica dos blocos de horários.

**Fase 5: Calculadora Automática de Nota para Aprovação (Predição)**

Funcionalidade preditiva que calcula e exibe ao estudante, no modal de detalhes da disciplina, quantos pontos precisa de obter na(s) próxima(s) avaliação(ões) para ser aprovado, sem reavaliação.

**Decisão Arquitetural:** A lógica de cálculo reside exclusivamente no Backend (`GradeService`), garantindo centralização das regras de negócio, segurança (lógica não exposta ao browser) e testabilidade isolada. O Frontend (React) é puramente apresentacional.

**Regras de Negócio:**
- Média aritmética simples de AB1 e AB2 para aprovação direta (≥ 7.0).
- Nota máxima possível por avaliação: 10.0.
- REAV substitui `min(AB1, AB2)` apenas se o valor da REAV for superior à menor nota.
- Acesso à Reavaliação Final: média efetiva entre 5.0 e 6.9 (inclusive).
- Aprovação na Final: `0.6 × médiaParcial + 0.4 × notaFinal ≥ 5.5`.

**Passo 5.1 — Criação dos DTOs**
- Criar `ApprovalForecastDTO` em `dtos/grade/` com campos: `status`, `message`, `currentAvg`, `effectiveAvg`, `neededScore`, `neededScoreType`, `finalWeightedScore`.
- Estender `DashboardSubjectDTO` com o campo `ApprovalForecastDTO approvalForecast`.

**Passo 5.2 — Lógica de Cálculo (`GradeService`)**
- Declarar constantes: `PASSING_GRADE=7.0`, `MAX_GRADE=10.0`, `FINAL_PASSING_SCORE=5.5`, `FINAL_WEIGHT_PARTIAL=0.6`, `FINAL_WEIGHT_EXAM=0.4`, `MIN_AVG_FOR_FINAL=5.0`, `TARGET_SUM=14.0`.
- Implementar `calculateApprovalForecast(Map<String, BigDecimal> grades)` com 8 estados:
  `NO_GRADES` | `NEEDS_SCORE` | `REEVALUATION_CERTAIN` | `APPROVED` | `NEEDS_REAV` | `REAV_MAY_SAVE` | `NEEDS_FINAL` | `FAILED`.

**Passo 5.3 — Integração (`DashboardService`)**
- Injetar `GradeService` no `DashboardService`.
- Invocar `calculateApprovalForecast(gradeMap)` em `getSubjectsForCurrentUser()` após construir o mapa de notas.
- Passar o resultado ao construtor do `DashboardSubjectDTO`.

**Passo 5.4 — Interface Visual (`MySubjects.jsx`)**
- Criar subcomponente `ApprovalForecastAlert` com mapeamento de estados para estilos visuais (cor + ícone).
- Renderizar abaixo do grid de notas AB1/AB2/REAV/FINAL no modal de detalhes.
- Zero lógica de cálculo no frontend — a mensagem é lida directamente do campo `message` do backend.

**Passo 5.5 — Testes Unitários (Backend)**
- Testes JUnit para `calculateApprovalForecast()` cobrindo os 12 cenários: todos os estados, edge-cases de REAV inferior à menor nota, e acesso à Final.
