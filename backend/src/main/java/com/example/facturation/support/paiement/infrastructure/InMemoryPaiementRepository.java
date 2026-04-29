package com.example.facturation.support.paiement.infrastructure;

import com.example.facturation.support.paiement.domain.model.Paiement;
import com.example.facturation.support.paiement.domain.repository.PaiementRepository;
import org.springframework.stereotype.Repository;

import java.util.*;

@Repository
public class InMemoryPaiementRepository implements PaiementRepository {

    private final Map<UUID, Paiement> storage = new HashMap<>();

    @Override
    public Optional<Paiement> findById(UUID id) {
        return Optional.ofNullable(storage.get(id));
    }

    @Override
    public List<Paiement> findAll() {
        return new ArrayList<>(storage.values());
    }

    @Override
    public List<Paiement> findByFactureId(UUID factureId) {
        return storage.values()
                .stream()
                .filter(p -> p.getFactureId().equals(factureId))
                .toList();
    }

    @Override
    public Paiement save(Paiement paiement) {
        storage.put(paiement.getId(), paiement);
        return paiement;
    }

    @Override
    public void deleteById(UUID id) {
        storage.remove(id);
    }
}
