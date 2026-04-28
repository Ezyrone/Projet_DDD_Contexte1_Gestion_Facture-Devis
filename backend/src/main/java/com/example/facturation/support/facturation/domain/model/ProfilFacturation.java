package com.example.facturation.support.facturation.domain.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * Supporting Domain (Facturation) — Value Object ProfilFacturation.
 * Informations de personnalisation de facture (logo, SIRET, mentions légales, IBAN).
 */
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class ProfilFacturation {

    private String logo;
    private String siret;
    private String mentionsLegales;
    private String iban;
}
