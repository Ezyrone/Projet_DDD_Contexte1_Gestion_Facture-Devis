package com.example.facturation.support.facturation.domain.model;

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
 * Supporting Domain (Facturation) — Aggregate Root Facture.
 * Gère le cycle de vie d'une facture : émission, annulation, clôture.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Facture {

    private UUID id;
    private String titre;
    private LocalDateTime dateCreation;
    private LocalDateTime dateEcheance;
    private StatutFacture statut;
    private float montantTotal;
    private float resteACharge;

    /** Référence vers le client (User) du Shared Kernel */
    private UUID clientId;

    /** Référence optionnelle vers le devis source (Core Domain) */
    private UUID devisId;

    /** Devise dans laquelle la facture est libellée */
    private Devise devise;

    /** Profil de facturation optionnel (Value Object) */
    private ProfilFacturation profilFacturation;

    /** Lignes de facture (composition) */
    private List<LigneFacture> lignes = new ArrayList<>();

    /** Historique des changements de statut (composition) */
    private List<HistoriqueStatutFacture> historiqueStatuts = new ArrayList<>();

    /** Avenants correctifs (composition) */
    private List<Avenant> avenants = new ArrayList<>();

    // ── Méthodes métier ──────────────────────────────

    /**
     * Émet la facture — passe en statut EMISE.
     */
    public void emettre() {
        this.id = UUID.randomUUID();
        this.dateCreation = LocalDateTime.now();
        this.statut = StatutFacture.EMISE;
        this.resteACharge = this.montantTotal;
        enregistrerChangementStatut(StatutFacture.EMISE, "SYSTEME");
    }

    /**
     * Annule la facture — passe en statut ANNULEE.
     */
    public void annuler() {
        if (this.statut == StatutFacture.CLOTUREE) {
            throw new IllegalStateException("Impossible d'annuler une facture clôturée.");
        }
        this.statut = StatutFacture.ANNULEE;
        enregistrerChangementStatut(StatutFacture.ANNULEE, "SYSTEME");
    }

    /**
     * Marque la facture comme réalisée (prestation effectuée).
     */
    public void marquerRealisee() {
        if (this.statut != StatutFacture.EMISE) {
            throw new IllegalStateException("La facture doit être émise pour être marquée réalisée.");
        }
        this.statut = StatutFacture.REALISEE;
        enregistrerChangementStatut(StatutFacture.REALISEE, "SYSTEME");
    }

    /**
     * Vérifie si la facture peut être clôturée (reste à charge = 0).
     */
    public void verifierCloture() {
        if (this.resteACharge <= 0) {
            this.statut = StatutFacture.CLOTUREE;
            enregistrerChangementStatut(StatutFacture.CLOTUREE, "SYSTEME");
        }
    }

    /**
     * Publie un événement de domaine (placeholder pour l'infrastructure).
     */
    public void publierEvenement() {
        // Délégué à l'infrastructure — sera implémenté via le service applicatif
    }

    // ── Méthodes internes ────────────────────────────

    private void enregistrerChangementStatut(StatutFacture nouveauStatut, String acteur) {
        HistoriqueStatutFacture historique = new HistoriqueStatutFacture();
        historique.setId(UUID.randomUUID());
        historique.setStatut(nouveauStatut);
        historique.setDateChangement(LocalDateTime.now());
        historique.setActeur(acteur);
        this.historiqueStatuts.add(historique);
    }
}
