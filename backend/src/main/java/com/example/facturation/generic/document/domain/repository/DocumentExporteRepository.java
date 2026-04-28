package com.example.facturation.generic.document.domain.repository;

import com.example.facturation.generic.document.domain.model.DocumentExporte;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * Generic Domain (Document) — Port de persistance pour les documents exportés.
 */
public interface DocumentExporteRepository {

    Optional<DocumentExporte> findById(UUID id);

    List<DocumentExporte> findAll();

    DocumentExporte save(DocumentExporte document);

    void deleteById(UUID id);
}
