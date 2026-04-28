package com.example.facturation.support.facturation.domain.repository;

import com.example.facturation.support.facturation.domain.model.Facture;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * Supporting Domain (Facturation) — Port de persistance pour les factures.
 */
public interface FactureRepository {

    Optional<Facture> findById(UUID id);

    List<Facture> findAll();

    Facture save(Facture facture);

    void deleteById(UUID id);
}
