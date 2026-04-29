package com.example.facturation.presentation.document;

import com.example.facturation.generic.document.application.DocumentService;
import com.example.facturation.generic.document.domain.model.DocumentExporte;
import com.example.facturation.generic.document.domain.model.FormatExport;
import com.example.facturation.generic.document.domain.model.ImportDocument;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/documents")
@RequiredArgsConstructor
public class DocumentController {

    private final DocumentService documentService;

    @PostMapping("/export")
    public DocumentExporte exporter(
            @RequestParam FormatExport format,
            @RequestParam String chemin,
            @RequestParam String acteur,
            @RequestParam(required = false) UUID devisId,
            @RequestParam(required = false) UUID factureId
    ) {
        return documentService.exporterDocument(format, chemin, acteur, devisId, factureId);
    }

    @GetMapping("/download/{id}")
    public ResponseEntity<Resource> download(@PathVariable UUID id) {
        String mockContent = "%PDF-1.4\n%Mock PDF Document for ID: " + id + "\n1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n";
        ByteArrayResource resource = new ByteArrayResource(mockContent.getBytes(StandardCharsets.UTF_8));

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"export_" + id + ".pdf\"")
                .contentType(MediaType.APPLICATION_PDF)
                .body(resource);
    }

    @PostMapping("/import")
    public ImportDocument importer(@RequestParam String fichier) {
        return documentService.importerDocument(fichier);
    }

    @GetMapping("/exports")
    public List<DocumentExporte> exports() {
        return documentService.listerExports();
    }

    @GetMapping("/imports")
    public List<ImportDocument> imports() {
        return documentService.listerImports();
    }
}
