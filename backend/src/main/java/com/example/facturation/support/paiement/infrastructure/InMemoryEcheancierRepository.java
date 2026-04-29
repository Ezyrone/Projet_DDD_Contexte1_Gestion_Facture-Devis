package com.example.facturation.support.paiement.infrastructure;

import com.example.facturation.support.paiement.domain.model.Echeancier;
import com.example.facturation.support.paiement.domain.repository.EcheancierRepository;
import org.springframework.stereotype.Repository;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@Repository
public class InMemoryEcheancierRepository implements EcheancierRepository {

    private final Map<UUID, Echeancier> storage = new HashMap<>();

    @Override
    public Optional<Echeancier> findById(UUID id) {
        return Optional.ofNullable(storage.get(id));
    }

    @Override
    public Optional<Echeancier> findByFactureId(UUID factureId) {
        return storage.values()
                .stream()
                .filter(e -> e.getFactureId().equals(factureId))
                .findFirst();
    }

    @Override
    public Echeancier save(Echeancier echeancier) {
        storage.put(echeancier.getId(), echeancier);
        return echeancier;
    }

    @Override
    public void deleteById(UUID id) {
        storage.remove(id);
    }
}
