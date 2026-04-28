package com.example.facturation.generic.document.application;

import com.example.facturation.generic.document.domain.model.DocumentExporte;
import com.example.facturation.generic.document.domain.model.FormatExport;
import com.example.facturation.generic.document.domain.model.ImportDocument;
import com.example.facturation.generic.document.domain.repository.DocumentExporteRepository;
import com.example.facturation.generic.document.domain.repository.ImportDocumentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

/**
 * Generic Domain (Document) — Service applicatif.
 * Orchestre l'import et l'export de documents.
 * Utilise un ACL pour communiquer avec les bounded contexts Devis et Facture.
 */
@Service
@RequiredArgsConstructor
public class DocumentService {

    private final DocumentExporteRepository documentExporteRepository;
    private final ImportDocumentRepository importDocumentRepository;

    /**
     * Exporte un document dans un format donné.
     */
    public DocumentExporte exporterDocument(FormatExport format, String chemin, String acteur,
                                            UUID devisId, UUID factureId) {
        DocumentExporte doc = new DocumentExporte();
        doc.setId(UUID.randomUUID());
        doc.setFormat(format);
        doc.setDateExport(LocalDateTime.now());
        doc.setChemin(chemin);
        doc.setActeur(acteur);
        doc.setDevisId(devisId);
        doc.setFactureId(factureId);
        return documentExporteRepository.save(doc);
    }

    /**
     * Importe un document, le valide et le transforme.
     */
    public ImportDocument importerDocument(String fichierSource) {
        ImportDocument doc = new ImportDocument();
        doc.setId(UUID.randomUUID());
        doc.setFichierSource(fichierSource);
        doc.setDateImport(LocalDateTime.now());

        if (doc.valider()) {
            doc.transformer();
        }

        return importDocumentRepository.save(doc);
    }

    public List<DocumentExporte> listerExports() {
        return documentExporteRepository.findAll();
    }

    public List<ImportDocument> listerImports() {
        return importDocumentRepository.findAll();
    }
}
