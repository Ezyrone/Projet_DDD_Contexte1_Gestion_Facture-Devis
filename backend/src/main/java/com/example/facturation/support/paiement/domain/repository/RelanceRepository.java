package com.example.facturation.support.paiement.domain.repository;

import com.example.facturation.support.paiement.domain.model.Relance;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * Supporting Domain (Paiement) — Port de persistance pour les relances.
 */
public interface RelanceRepository {

    Optional<Relance> findById(UUID id);

    List<Relance> findAll();

    List<Relance> findByFactureId(UUID factureId);

    Relance save(Relance relance);

    void deleteById(UUID id);
}
