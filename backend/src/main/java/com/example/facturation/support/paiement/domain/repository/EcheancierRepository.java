package com.example.facturation.support.paiement.domain.repository;

import com.example.facturation.support.paiement.domain.model.Echeancier;

import java.util.Optional;
import java.util.UUID;

/**
 * Supporting Domain (Paiement) — Port de persistance pour les échéanciers.
 */
public interface EcheancierRepository {

    Optional<Echeancier> findById(UUID id);

    Optional<Echeancier> findByFactureId(UUID factureId);

    Echeancier save(Echeancier echeancier);

    void deleteById(UUID id);
}
