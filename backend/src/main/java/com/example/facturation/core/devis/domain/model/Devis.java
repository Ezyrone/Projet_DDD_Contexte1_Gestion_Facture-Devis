package com.example.facturation.core.devis.domain.model;

import com.example.facturation.core.devis.domain.event.DevisApprouve;
import com.example.facturation.core.devis.domain.event.DevisCree;
import com.example.facturation.core.devis.domain.event.DevisEnvoye;
import com.example.facturation.core.devis.domain.event.DevisRefuse;
import com.example.facturation.sharedkernel.model.AbstractAggregate;
import com.example.facturation.sharedkernel.model.Devise;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

/**
 * Core Domain (Devis) — Aggregate Root Devis.
 * Racine de l'agrégat « Devis » : gère les lignes, notes, versions et le cycle de vie d'un devis.
 * <p>
 * Étend {@link AbstractAggregate} pour enregistrer les événements de domaine
 * qui seront publiés via {@code ApplicationEventPublisher} par le service applicatif.
 * </p>
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Devis extends AbstractAggregate {

    private UUID id;
    private String titre;
    private LocalDateTime dateCreation;
    private LocalDateTime dateModification;
    private LocalDateTime dateValidite;
    private StatutDevis statut;
    private String version;

    /** Référence vers le client (User) du Shared Kernel */
    private UUID clientId;

    /** Devise dans laquelle le devis est libellé */
    private Devise devise;

    /** Lignes de devis (composition) */
    private List<LigneDevis> lignes = new ArrayList<>();

    /** Notes attachées au devis (composition) */
    private List<NoteDevis> notes = new ArrayList<>();

    /** Historique des versions (composition) */
    private List<VersionDevis> versions = new ArrayList<>();

    // ── Méthodes métier ──────────────────────────────

    /**
     * Crée un nouveau devis en statut BROUILLON.
     */
    public void creer() {
        this.id = UUID.randomUUID();
        this.dateCreation = LocalDateTime.now();
        this.dateModification = LocalDateTime.now();
        this.statut = StatutDevis.BROUILLON;
        registerEvent(new DevisCree(this.id, this.titre, this.clientId, this.dateCreation));
    }

    /**
     * Modifie le devis (met à jour la date de modification).
     */
    public void modifier() {
        this.dateModification = LocalDateTime.now();
    }

    /**
     * Envoie le devis au client — passe en statut ENVOYE.
     */
    public void envoyerAuClient() {
        if (this.statut != StatutDevis.BROUILLON && this.statut != StatutDevis.EN_NEGOCIATION) {
            throw new IllegalStateException("Le devis ne peut être envoyé que depuis le statut BROUILLON ou EN_NEGOCIATION.");
        }
        this.statut = StatutDevis.ENVOYE;
        this.dateModification = LocalDateTime.now();
        registerEvent(new DevisEnvoye(this.id, this.clientId, LocalDateTime.now()));
    }

    /**
     * Approuve le devis — passe en statut APPROUVE.
     * Publie un événement {@link DevisApprouve} consommé par le module Facturation (Customer-Supplier).
     */
    public void approuver() {
        if (this.statut != StatutDevis.ENVOYE && this.statut != StatutDevis.EN_NEGOCIATION) {
            throw new IllegalStateException("Le devis ne peut être approuvé que depuis le statut ENVOYE ou EN_NEGOCIATION.");
        }
        this.statut = StatutDevis.APPROUVE;
        this.dateModification = LocalDateTime.now();

        float montantTotal = this.lignes.stream()
                .map(l -> { l.calculerMontant(); return l.getMontantTotal(); })
                .reduce(0f, Float::sum);
        registerEvent(new DevisApprouve(this.id, this.clientId, montantTotal, LocalDateTime.now()));
    }

    /**
     * Refuse le devis — passe en statut REFUSE.
     */
    public void refuser() {
        if (this.statut != StatutDevis.ENVOYE && this.statut != StatutDevis.EN_NEGOCIATION) {
            throw new IllegalStateException("Le devis ne peut être refusé que depuis le statut ENVOYE ou EN_NEGOCIATION.");
        }
        this.statut = StatutDevis.REFUSE;
        this.dateModification = LocalDateTime.now();
        registerEvent(new DevisRefuse(this.id, this.clientId, LocalDateTime.now()));
    }

    /**
     * Vérifie si le devis est expiré en comparant la date de validité.
     */
    public void verifierExpiration() {
        if (this.dateValidite != null && LocalDateTime.now().isAfter(this.dateValidite)) {
            if (this.statut != StatutDevis.APPROUVE && this.statut != StatutDevis.REFUSE) {
                this.statut = StatutDevis.EXPIRE;
                this.dateModification = LocalDateTime.now();
            }
        }
    }

    /**
     * Ajoute une note au devis.
     */
    public void ajouterNote(NoteDevis note) {
        this.notes.add(note);
        this.dateModification = LocalDateTime.now();
    }
}
