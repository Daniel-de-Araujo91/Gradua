package br.com.ufal.gradua.controllers;

import java.io.IOException;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.Base64;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

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
            String contentType = file.getContentType() != null ? file.getContentType() : "application/octet-stream";
            byte[] bytes = file.getBytes();
            String base64 = Base64.getEncoder().encodeToString(bytes);
            String dataUri = "data:" + contentType + ";base64," + base64;

            String originalName = file.getOriginalFilename();
            if (originalName == null) originalName = "documento";

            documentRepository.findByUserAndDocType(user, docType.toUpperCase())
                .ifPresent(existing -> documentRepository.delete(existing));

            DocumentModel doc = new DocumentModel();
            doc.setUser(user);
            doc.setDocType(docType.toUpperCase());
            doc.setFileName(originalName);
            doc.setFileType(contentType);
            doc.setFileSize(file.getSize());
            doc.setFileData(dataUri);
            doc.setCreatedAt(LocalDateTime.now(ZoneOffset.of("-3")));
            doc.setUpdatedAt(LocalDateTime.now(ZoneOffset.of("-3")));
            documentRepository.save(doc);

            java.util.Map<String, Object> resultMap = new java.util.HashMap<>();
            resultMap.put("documentId", doc.getDocumentId().toString());
            resultMap.put("docType", doc.getDocType());
            resultMap.put("fileName", doc.getFileName());
            resultMap.put("fileType", doc.getFileType());
            resultMap.put("fileSize", doc.getFileSize());
            resultMap.put("url", dataUri);
            resultMap.put("createdAt", doc.getCreatedAt().toString());
            return ResponseEntity.ok(resultMap);
        } catch (IOException e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Erro ao salvar documento");
        }
    }

    @GetMapping("/{docType}/download")
    public ResponseEntity<byte[]> downloadDocument(@PathVariable String docType) {
        UserModel user = getUserByToken();
        DocumentModel doc = documentRepository.findByUserAndDocType(user, docType.toUpperCase())
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Documento não encontrado"));

        if (doc.getFileData() == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Arquivo não encontrado");
        }

        try {
            String base64Data = doc.getFileData();
            if (base64Data.contains(",")) {
                base64Data = base64Data.substring(base64Data.indexOf(",") + 1);
            }
            byte[] fileBytes = Base64.getDecoder().decode(base64Data);

            String contentType = doc.getFileType() != null ? doc.getFileType() : "application/octet-stream";
            return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(contentType))
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + doc.getFileName() + "\"")
                .body(fileBytes);
        } catch (IllegalArgumentException e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Erro ao ler arquivo");
        }
    }

    @DeleteMapping("/{docType}")
    public ResponseEntity<Void> deleteDocument(@PathVariable String docType) {
        UserModel user = getUserByToken();
        DocumentModel doc = documentRepository.findByUserAndDocType(user, docType.toUpperCase())
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Documento não encontrado"));

        documentRepository.delete(doc);
        return ResponseEntity.noContent().build();
    }
}
