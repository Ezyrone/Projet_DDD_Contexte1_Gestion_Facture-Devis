package com.example.facturation.generic.document.domain.infrastructure;

import com.example.facturation.generic.document.domain.model.ImportDocument;
import com.example.facturation.generic.document.domain.repository.ImportDocumentRepository;
import org.springframework.stereotype.Repository;

import java.util.*;

@Repository
public class InMemoryImportDocumentRepository implements ImportDocumentRepository {

    private final Map<UUID, ImportDocument> storage = new HashMap<>();

    @Override
    public Optional<ImportDocument> findById(UUID id) {
        return Optional.ofNullable(storage.get(id));
    }

    @Override
    public List<ImportDocument> findAll() {
        return new ArrayList<>(storage.values());
    }

    @Override
    public ImportDocument save(ImportDocument document) {
        storage.put(document.getId(), document);
        return document;
    }

    @Override
    public void deleteById(UUID id) {
        storage.remove(id);
    }
}
