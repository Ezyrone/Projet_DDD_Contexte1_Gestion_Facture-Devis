package com.example.facturation.sharedkernel.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.UUID;

/**
 * Shared Kernel — Entité Produit.
 * Référencé par les lignes de devis et de facture.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Produit {

    private UUID id;
    private String nom;
    private float prixUnitaire;
    private String description;
}
