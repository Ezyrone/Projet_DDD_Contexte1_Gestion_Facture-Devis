package com.example.facturation.support.facturation.domain.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Supporting Domain (Facturation) — Entité enfant Avenant.
 * Correction appliquée à une facture (montant et motif).
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Avenant {

    private UUID id;
    private LocalDateTime dateCreation;
    private float montantCorrection;
    private String motif;

    /**
     * Valide l'avenant.
     */
    public void valider() {
        // Logique de validation métier
    }

    /**
     * Publie un événement de domaine suite à la validation de l'avenant.
     */
    public void publierEvenement() {
        // Délégué à l'infrastructure
    }
}
