-- =====================================================================
-- Migration: Corrigir conflito de tabelas tb_forum_comment / tb_forum_vote
-- Contexto: O ForumVoteModel estava incorretamente mapeado para
-- tb_forum_comment, criando a tabela com estrutura de votos.
-- Agora ForumCommentModel usa tb_forum_comment e ForumVoteModel usa tb_forum_vote.
-- =====================================================================

-- 1. Dropar a tabela tb_forum_comment antiga (era ForumVoteModel com vote_id)
DROP TABLE IF EXISTS tb_forum_comment CASCADE;

-- 2. Se existir tb_forum_vote com estrutura errada, dropar também
DROP TABLE IF EXISTS tb_forum_vote CASCADE;

-- 3. O Hibernate (ddl-auto=update) vai recriar ambas as tabelas
--    com a estrutura correta ao reiniciar a aplicação:
--      tb_forum_comment → ForumCommentModel (comment_id, author_id, topic_id, content, creation_date, is_edited, updated_at)
--      tb_forum_vote    → ForumVoteModel    (vote_id, user_id, topic_id, vote_type)
