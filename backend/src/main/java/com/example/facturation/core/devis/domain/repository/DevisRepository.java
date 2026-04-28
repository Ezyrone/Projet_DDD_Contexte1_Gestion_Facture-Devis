package com.example.facturation.core.devis.domain.repository;

import com.example.facturation.core.devis.domain.model.Devis;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * Core Domain (Devis) — Port de persistance pour les devis.
 */
public interface DevisRepository {

    Optional<Devis> findById(UUID id);

    List<Devis> findAll();

    Devis save(Devis devis);

    void deleteById(UUID id);
}
