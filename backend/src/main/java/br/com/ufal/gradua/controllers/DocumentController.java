package br.com.ufal.gradua.controllers;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import br.com.ufal.gradua.models.document.DocumentModel;
import br.com.ufal.gradua.models.user.UserModel;
import br.com.ufal.gradua.repositories.DocumentRepository;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/documents")
@RequiredArgsConstructor
public class DocumentController {

    private final DocumentRepository documentRepository;

    @Value("${api.upload.dir:uploads}")
    private String uploadDir;

    private UserModel getUserByToken() {
        var authentication = SecurityContextHolder.getContext().getAuthentication();
        return (UserModel) authentication.getPrincipal();
    }

    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> listMyDocuments() {
        UserModel user = getUserByToken();
        List<DocumentModel> docs = documentRepository.findByUserOrderByCreatedAtDesc(user);
        List<Map<String, Object>> result = docs.stream().map(doc -> {
            java.util.Map<String, Object> m = new java.util.HashMap<>();
            m.put("documentId", doc.getDocumentId().toString());
            m.put("docType", doc.getDocType());
            m.put("fileName", doc.getFileName());
            m.put("fileType", doc.getFileType());
            m.put("fileSize", doc.getFileSize());
            m.put("createdAt", doc.getCreatedAt().toString());
            return m;
        }).collect(Collectors.toList());
        return ResponseEntity.ok(result);
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Map<String, Object>> uploadDocument(
            @RequestParam("file") MultipartFile file,
            @RequestParam("docType") String docType) {
        UserModel user = getUserByToken();

        if (file.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Arquivo vazio");
        }

        if (!List.of("RG", "CPF", "COMPROVANTE").contains(docType.toUpperCase())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Tipo de documento inválido");
        }

        try {
            String originalName = file.getOriginalFilename();
            String extension = "";
            if (originalName != null && originalName.contains(".")) {
                extension = originalName.substring(originalName.lastIndexOf("."));
            }
            String fileName = "doc_" + user.getUserId() + "_" + docType.toLowerCase() + extension;
            Path uploadPath = Paths.get(uploadDir, "documents");
            Files.createDirectories(uploadPath);
            Path filePath = uploadPath.resolve(fileName);
            file.transferTo(filePath.toFile());

            documentRepository.findByUserAndDocType(user, docType.toUpperCase()).ifPresent(existing -> {
                try {
                    Path oldPath = Paths.get(existing.getFilePath());
                    Files.deleteIfExists(oldPath);
                } catch (IOException e) {
                }
                documentRepository.delete(existing);
            });

            DocumentModel doc = new DocumentModel();
            doc.setUser(user);
            doc.setDocType(docType.toUpperCase());
            doc.setFileName(originalName != null ? originalName : "documento" + extension);
            doc.setFileType(file.getContentType());
            doc.setFileSize(file.getSize());
            doc.setFilePath(filePath.toString());
            doc.setCreatedAt(LocalDateTime.now(ZoneOffset.of("-3")));
            doc.setUpdatedAt(LocalDateTime.now(ZoneOffset.of("-3")));
            documentRepository.save(doc);

            String url = "/uploads/documents/" + fileName;

            java.util.Map<String, Object> resultMap = new java.util.HashMap<>();
            resultMap.put("documentId", doc.getDocumentId().toString());
            resultMap.put("docType", doc.getDocType());
            resultMap.put("fileName", doc.getFileName());
            resultMap.put("fileType", doc.getFileType());
            resultMap.put("fileSize", doc.getFileSize());
            resultMap.put("url", url);
            resultMap.put("createdAt", doc.getCreatedAt().toString());
            return ResponseEntity.ok(resultMap);
        } catch (IOException e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Erro ao salvar documento");
        }
    }

    @GetMapping("/{docType}/download")
    public ResponseEntity<Resource> downloadDocument(@PathVariable String docType) {
        UserModel user = getUserByToken();
        DocumentModel doc = documentRepository.findByUserAndDocType(user, docType.toUpperCase())
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Documento não encontrado"));

        try {
            Path filePath = Paths.get(doc.getFilePath());
            Resource resource = new UrlResource(filePath.toUri());
            if (!resource.exists()) {
                throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Arquivo não encontrado");
            }

            String contentType = doc.getFileType() != null ? doc.getFileType() : "application/octet-stream";
            return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(contentType))
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + doc.getFileName() + "\"")
                .body(resource);
        } catch (IOException e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Erro ao ler arquivo");
        }
    }

    @DeleteMapping("/{docType}")
    public ResponseEntity<Void> deleteDocument(@PathVariable String docType) {
        UserModel user = getUserByToken();
        DocumentModel doc = documentRepository.findByUserAndDocType(user, docType.toUpperCase())
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Documento não encontrado"));

        try {
            Path filePath = Paths.get(doc.getFilePath());
            Files.deleteIfExists(filePath);
        } catch (IOException e) {
        }

        documentRepository.delete(doc);
        return ResponseEntity.noContent().build();
    }
}
