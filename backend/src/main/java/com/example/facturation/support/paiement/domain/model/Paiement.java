package com.example.facturation.support.paiement.domain.model;

import com.example.facturation.sharedkernel.model.AbstractAggregate;
import com.example.facturation.support.paiement.domain.event.PaiementEnregistre;
import com.example.facturation.support.paiement.domain.event.PaiementRejete;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Supporting Domain (Paiement) — Aggregate Root Paiement.
 * Représente un paiement associé à une facture.
 * <p>
 * Étend {@link AbstractAggregate} pour enregistrer les événements de domaine.
 * </p>
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Paiement extends AbstractAggregate {

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
        registerEvent(new PaiementEnregistre(this.id, this.factureId, this.montant, this.datePaiement));
    }

    /**
     * Rejette le paiement — passe en statut REJETE.
     */
    public void rejeter() {
        if (this.statut != StatutPaiement.ENREGISTRE) {
            throw new IllegalStateException("Seul un paiement enregistré peut être rejeté.");
        }
        this.statut = StatutPaiement.REJETE;
        registerEvent(new PaiementRejete(this.id, this.factureId, LocalDateTime.now()));
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
