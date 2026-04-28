package com.example.facturation.core.devis.domain.model;

import com.example.facturation.sharedkernel.model.Produit;
import com.example.facturation.sharedkernel.model.Taxe;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.UUID;

/**
 * Core Domain (Devis) — Entité enfant LigneDevis.
 * Représente une ligne de produit dans un devis.
 * Composée dans l'agrégat Devis.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class LigneDevis {

    private UUID id;
    private int quantite;
    private float prixUnitaire;
    private float remise;
    private float montantTotal;

    /** Référence vers le produit du Shared Kernel */
    private UUID produitId;

    /** Référence optionnelle vers une taxe */
    private UUID taxeId;

    /**
     * Calcule le montant total de la ligne :
     * (quantité × prixUnitaire) − remise
     */
    public void calculerMontant() {
        this.montantTotal = (this.quantite * this.prixUnitaire) - this.remise;
    }
}
