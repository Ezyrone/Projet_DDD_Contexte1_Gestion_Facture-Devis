package com.example.facturation.support.facturation.domain.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Supporting Domain (Facturation) — Entité enfant HistoriqueStatutFacture.
 * Trace chaque changement de statut d'une facture.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class HistoriqueStatutFacture {

    private UUID id;
    private StatutFacture statut;
    private LocalDateTime dateChangement;
    private String acteur;
}
