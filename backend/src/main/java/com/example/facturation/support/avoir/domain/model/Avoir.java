package com.example.facturation.support.avoir.domain.model;

import com.example.facturation.sharedkernel.model.AbstractAggregate;
import com.example.facturation.support.avoir.domain.event.AvoirCompense;
import com.example.facturation.support.avoir.domain.event.AvoirRembourse;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Supporting Domain (Avoir) — Aggregate Root Avoir.
 * Gère le cycle de vie d'un avoir : compensation, remboursement, expiration.
 * <p>
 * Étend {@link AbstractAggregate} pour enregistrer les événements de domaine.
 * Les événements {@link AvoirCompense} et {@link AvoirRembourse} sont consommés par le module Paiement.
 * </p>
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Avoir extends AbstractAggregate {

    private UUID id;
    private float montant;
    private LocalDateTime dateCreation;
    private LocalDateTime dateExpiration;
    private StatutAvoir statut;

    /** Référence optionnelle vers l'avenant source */
    private UUID avenantId;

    /** Référence optionnelle vers la facture compensée */
    private UUID factureId;

    /**
     * Rembourse l'avoir — passe en statut REMBOURSE.
     */
    public void rembourser() {
        if (this.statut != StatutAvoir.DISPONIBLE) {
            throw new IllegalStateException("Seul un avoir disponible peut être remboursé.");
        }
        this.statut = StatutAvoir.REMBOURSE;
        registerEvent(new AvoirRembourse(this.id, this.montant, LocalDateTime.now()));
    }

    /**
     * Compense l'avoir sur une facture — passe en statut COMPENSE.
     */
    public void compenser() {
        if (this.statut != StatutAvoir.DISPONIBLE) {
            throw new IllegalStateException("Seul un avoir disponible peut être compensé.");
        }
        this.statut = StatutAvoir.COMPENSE;
        registerEvent(new AvoirCompense(this.id, this.factureId, this.montant, LocalDateTime.now()));
    }

    /**
     * Annule l'avoir — passe en statut ANNULE.
     */
    public void annuler() {
        if (this.statut != StatutAvoir.DISPONIBLE) {
            throw new IllegalStateException("Seul un avoir disponible peut être annulé.");
        }
        this.statut = StatutAvoir.ANNULE;
    }

    /**
     * Vérifie si l'avoir est expiré.
     */
    public void verifierExpiration() {
        if (this.dateExpiration != null && LocalDateTime.now().isAfter(this.dateExpiration)) {
            if (this.statut == StatutAvoir.DISPONIBLE) {
                this.statut = StatutAvoir.EXPIRE;
            }
        }
    }
}
