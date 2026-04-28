package com.example.facturation.support.paiement.domain.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Supporting Domain (Paiement) — Aggregate Root Paiement.
 * Représente un paiement associé à une facture.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Paiement {

    private UUID id;
    private float montant;
    private LocalDateTime datePaiement;
    private ModePaiement mode;
    private StatutPaiement statut;

    /** Référence vers la facture réglée */
    private UUID factureId;

    /**
     * Enregistre le paiement — passe en statut ENREGISTRE.
     */
    public void enregistrer() {
        this.id = UUID.randomUUID();
        this.datePaiement = LocalDateTime.now();
        this.statut = StatutPaiement.ENREGISTRE;
    }

    /**
     * Rejette le paiement — passe en statut REJETE.
     */
    public void rejeter() {
        if (this.statut != StatutPaiement.ENREGISTRE) {
            throw new IllegalStateException("Seul un paiement enregistré peut être rejeté.");
        }
        this.statut = StatutPaiement.REJETE;
    }

    /**
     * Rembourse le paiement — passe en statut REMBOURSE.
     */
    public void rembourser() {
        if (this.statut != StatutPaiement.ENREGISTRE) {
            throw new IllegalStateException("Seul un paiement enregistré peut être remboursé.");
        }
        this.statut = StatutPaiement.REMBOURSE;
    }
}
