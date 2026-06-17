# Lista de Tarefas

## Header
- [x] Puxar a matrícula
- [x] Corrigir persistência das notificações (Daniel: Acredito que resolveu)
  - Problema: ao recarregar a página, as notificações desaparecem.
- 

---

## Início
- [x] Corrigir erro visual da agenda
  - Problema: a agenda "sobe" após alguns segundos.
  - Possível causa: erro no front-end.
- [ ] Revisar consistência dos dados da agenda 
  - (Daniel: Tentei mexer mais ainda não esta fucionado)
    - Verificar se os dados exibidos correspondem aos dados reais.
- [x] Corrigir integralização com horas zeradas. 
  - (Daniel: corrigi a logica das horas restantes)
- [x] Adicionar sistema de comunicados
  - Armazenamento no banco de dados.

---

## Agenda
- [ ] Validar acurácia dos dados exibidos
  - (Daniel: Todos os dados estavam mocados tentei mexer porem nao funcionou )
    - Conferir informações retornadas pela API/banco.

---

## Fórum
- [x] Implementar carregamento dos comentários.
- [x] Melhorar desempenho do carregamento
  - (Daniel: Modifiquei um pouco umas opçoes de carregamento acho que melhorou)
    - Atualmente demora alguns segundos para exibir os comentários.
- [x] Corrigir persistência de likes e dislikes
  - Problema: são perdidos ao recarregar a página.
- [ ] Corrigir filtro por tópicos
  - Tentativa anterior não funcionou.

---

## Perfil
- [x] Melhorar acurácia dos dados exibidos.
- [ ] Revisar lógica de manutenção do fórum.

---

## Código
- [ ] Remover comentários desnecessários do código.

---

# Pendências Prioritárias 
1. Persistência das notificações.
2. AgendaPage sem função real
3.Consistência/acurácia dos dados da agenda.
4. Filtro por tópicos do fórum.
5. Lógica de manutenção do fórum.
6. Limpeza de comentários desnecessários no código.
7. Otimização do carregamento dos comentários.
