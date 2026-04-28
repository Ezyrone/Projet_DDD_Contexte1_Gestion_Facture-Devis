package com.example.facturation.sharedkernel.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.UUID;

/**
 * Shared Kernel — Value Object Taxe.
 * Représente une taxe applicable à une ligne de devis.
 */
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class Taxe {

    private UUID id;
    private String libelle;
    private float taux;
}
