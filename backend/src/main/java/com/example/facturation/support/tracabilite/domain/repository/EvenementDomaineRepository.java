package com.example.facturation.support.tracabilite.domain.repository;

import com.example.facturation.support.tracabilite.domain.model.EvenementDomaine;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * Supporting Domain (Traçabilité) — Port de persistance pour les événements de domaine.
 */
public interface EvenementDomaineRepository {

    Optional<EvenementDomaine> findById(UUID id);

    List<EvenementDomaine> findByDocumentId(String documentId);

    List<EvenementDomaine> findAll();

    EvenementDomaine save(EvenementDomaine evenement);
}
