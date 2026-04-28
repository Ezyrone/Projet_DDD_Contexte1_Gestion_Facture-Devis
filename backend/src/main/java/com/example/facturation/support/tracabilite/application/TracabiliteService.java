package com.example.facturation.support.tracabilite.application;

import com.example.facturation.support.tracabilite.domain.model.EvenementDomaine;
import com.example.facturation.support.tracabilite.domain.repository.EvenementDomaineRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

/**
 * Supporting Domain (Traçabilité) — Service applicatif.
 * Enregistre les événements de domaine provenant de tous les bounded contexts.
 */
@Service
@RequiredArgsConstructor
public class TracabiliteService {

    private final EvenementDomaineRepository evenementDomaineRepository;

    /**
     * Enregistre un nouvel événement de domaine.
     *
     * @param type       type de l'événement (ex: "DevisApprouve", "FactureEmise")
     * @param acteur     identifiant de l'acteur ayant déclenché l'événement
     * @param documentId identifiant du document concerné (devis, facture, etc.)
     * @param payload    données JSON de l'événement
     * @return l'événement enregistré
     */
    public EvenementDomaine enregistrerEvenement(String type, String acteur, String documentId, String payload) {
        EvenementDomaine evenement = new EvenementDomaine();
        evenement.setId(UUID.randomUUID());
        evenement.setType(type);
        evenement.setHorodatage(LocalDateTime.now());
        evenement.setActeur(acteur);
        evenement.setDocumentId(documentId);
        evenement.setPayload(payload);
        return evenementDomaineRepository.save(evenement);
    }

    public List<EvenementDomaine> listerEvenementsParDocument(String documentId) {
        return evenementDomaineRepository.findByDocumentId(documentId);
    }

    public List<EvenementDomaine> listerTousEvenements() {
        return evenementDomaineRepository.findAll();
    }
}
