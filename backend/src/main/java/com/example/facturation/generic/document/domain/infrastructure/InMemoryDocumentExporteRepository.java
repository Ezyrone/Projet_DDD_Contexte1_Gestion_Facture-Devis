package com.example.facturation.generic.document.domain.infrastructure;

import com.example.facturation.generic.document.domain.model.DocumentExporte;
import com.example.facturation.generic.document.domain.repository.DocumentExporteRepository;
import org.springframework.stereotype.Repository;

import java.util.*;

@Repository
public class InMemoryDocumentExporteRepository implements DocumentExporteRepository {

    private final Map<UUID, DocumentExporte> storage = new HashMap<>();

    @Override
    public Optional<DocumentExporte> findById(UUID id) {
        return Optional.ofNullable(storage.get(id));
    }

    @Override
    public List<DocumentExporte> findAll() {
        return new ArrayList<>(storage.values());
    }

    @Override
    public DocumentExporte save(DocumentExporte document) {
        storage.put(document.getId(), document);
        return document;
    }

    @Override
    public void deleteById(UUID id) {
        if (!storage.containsKey(id)) {
            throw new IllegalArgumentException("Document exporté introuvable : " + id);
        }
        storage.remove(id);
    }
}
