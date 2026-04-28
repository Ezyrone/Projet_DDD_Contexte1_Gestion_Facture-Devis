package com.example.facturation.support.avoir.domain.repository;

import com.example.facturation.support.avoir.domain.model.Avoir;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * Supporting Domain (Avoir) — Port de persistance pour les avoirs.
 */
public interface AvoirRepository {

    Optional<Avoir> findById(UUID id);

    List<Avoir> findAll();

    Avoir save(Avoir avoir);

    void deleteById(UUID id);
}
