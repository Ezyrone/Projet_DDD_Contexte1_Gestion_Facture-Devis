package com.example.facturation.support.tracabilite.domain.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Supporting Domain (Traçabilité) — Entité EvenementDomaine.
 * Journalise tous les événements de domaine de l'application.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class EvenementDomaine {

    private UUID id;
    private String type;
    private LocalDateTime horodatage;
    private String acteur;
    private String documentId;
    private String payload;
}
