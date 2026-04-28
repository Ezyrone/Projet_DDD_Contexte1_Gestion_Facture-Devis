package com.example.facturation.support.facturation.domain.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.UUID;

/**
 * Supporting Domain (Facturation) — Entité enfant LigneFacture.
 * Représente une ligne de produit/service dans une facture.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class LigneFacture {

    private UUID id;
    private String designation;
    private int quantite;
    private float prixUnitaire;
    private float remise;
    private float montantTotal;
}
