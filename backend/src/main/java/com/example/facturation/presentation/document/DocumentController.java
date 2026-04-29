package com.example.facturation.presentation.document;

import com.example.facturation.generic.document.application.DocumentService;
import com.example.facturation.generic.document.domain.model.DocumentExporte;
import com.example.facturation.generic.document.domain.model.FormatExport;
import com.example.facturation.generic.document.domain.model.ImportDocument;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

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
