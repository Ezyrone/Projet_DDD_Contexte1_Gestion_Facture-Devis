package com.example.facturation.generic.document.domain.repository;

import com.example.facturation.generic.document.domain.model.ImportDocument;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * Generic Domain (Document) — Port de persistance pour les documents importés.
 */
public interface ImportDocumentRepository {

    Optional<ImportDocument> findById(UUID id);

    List<ImportDocument> findAll();

    ImportDocument save(ImportDocument document);

    void deleteById(UUID id);
}
