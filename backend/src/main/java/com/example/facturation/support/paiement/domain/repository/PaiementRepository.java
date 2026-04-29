package com.example.facturation.support.paiement.domain.repository;

import com.example.facturation.support.paiement.domain.model.Paiement;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * Supporting Domain (Paiement) — Port de persistance pour les paiements.
 */
public interface PaiementRepository {

    Optional<Paiement> findById(UUID id);

    List<Paiement> findAll();

    List<Paiement> findByFactureId(UUID factureId);

    Paiement save(Paiement paiement);

    void deleteById(UUID id);
}
