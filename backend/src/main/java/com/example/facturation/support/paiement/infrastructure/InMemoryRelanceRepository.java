package com.example.facturation.support.paiement.infrastructure;

import com.example.facturation.support.paiement.domain.model.Relance;
import com.example.facturation.support.paiement.domain.repository.RelanceRepository;
import org.springframework.stereotype.Repository;

import java.util.*;

@Repository
public class InMemoryRelanceRepository implements RelanceRepository {

    private final Map<UUID, Relance> storage = new HashMap<>();

    @Override
    public Optional<Relance> findById(UUID id) {
        return Optional.ofNullable(storage.get(id));
    }

    @Override
    public List<Relance> findAll() {
        return new ArrayList<>(storage.values());
    }

    @Override
    public List<Relance> findByFactureId(UUID factureId) {
        return storage.values()
                .stream()
                .filter(r -> r.getFactureId().equals(factureId))
                .toList();
    }

    @Override
    public Relance save(Relance relance) {
        storage.put(relance.getId(), relance);
        return relance;
    }

    @Override
    public void deleteById(UUID id) {
        storage.remove(id);
    }
}
