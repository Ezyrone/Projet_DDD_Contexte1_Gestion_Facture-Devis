package com.example.facturation.support.avoir.infrastructure;

import com.example.facturation.support.avoir.domain.model.Avoir;
import com.example.facturation.support.avoir.domain.repository.AvoirRepository;
import org.springframework.stereotype.Repository;

import java.util.*;

@Repository
public class InMemoryAvoirRepository implements AvoirRepository {

    private final Map<UUID, Avoir> storage = new HashMap<>();

    @Override
    public Avoir save(Avoir avoir) {
        storage.put(avoir.getId(), avoir);
        return avoir;
    }

    @Override
    public void deleteById(UUID id) {
        storage.remove(id);
    }

    @Override
    public Optional<Avoir> findById(UUID id) {
        return Optional.ofNullable(storage.get(id));
    }

    @Override
    public List<Avoir> findAll() {
        return new ArrayList<>(storage.values());
    }
}
