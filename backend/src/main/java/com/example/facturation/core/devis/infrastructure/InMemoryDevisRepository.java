package com.example.facturation.core.devis.infrastructure;

import com.example.facturation.core.devis.domain.model.Devis;
import com.example.facturation.core.devis.domain.repository.DevisRepository;
import org.springframework.stereotype.Repository;

import java.util.*;

@Repository
public class InMemoryDevisRepository implements DevisRepository {

    private final Map<UUID, Devis> storage = new HashMap<>();

    @Override
    public Optional<Devis> findById(UUID id) {
        return Optional.ofNullable(storage.get(id));
    }

    @Override
    public List<Devis> findAll() {
        return new ArrayList<>(storage.values());
    }

    @Override
    public Devis save(Devis devis) {
        storage.put(devis.getId(), devis);
        return devis;
    }

    @Override
    public void deleteById(UUID id) {
        if (!storage.containsKey(id)) {
            throw new IllegalArgumentException("Devis introuvable : " + id);
        }
        storage.remove(id);
    }
}
