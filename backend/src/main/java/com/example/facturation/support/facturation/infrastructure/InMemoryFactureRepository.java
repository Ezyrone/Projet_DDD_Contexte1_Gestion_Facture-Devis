package com.example.facturation.support.facturation.infrastructure;

import com.example.facturation.support.facturation.domain.model.Facture;
import com.example.facturation.support.facturation.domain.repository.FactureRepository;
import org.springframework.stereotype.Repository;

import java.util.*;

@Repository
public class InMemoryFactureRepository implements FactureRepository {

    private final Map<UUID, Facture> storage = new HashMap<>();

    @Override
    public Optional<Facture> findById(UUID id) {
        return Optional.ofNullable(storage.get(id));
    }

    @Override
    public List<Facture> findAll() {
        return new ArrayList<>(storage.values());
    }

    @Override
    public Facture save(Facture facture) {
        storage.put(facture.getId(), facture);
        return facture;
    }

    @Override
    public void deleteById(UUID id) {
        if (!storage.containsKey(id)) {
            throw new IllegalArgumentException("Facture introuvable : " + id);
        }
        storage.remove(id);
    }
}
