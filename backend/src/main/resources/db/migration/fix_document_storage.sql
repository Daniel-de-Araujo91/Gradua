-- Altera armazenamento de documentos de filesystem para base64 no banco
ALTER TABLE tb_document ADD COLUMN IF NOT EXISTS file_data TEXT;
