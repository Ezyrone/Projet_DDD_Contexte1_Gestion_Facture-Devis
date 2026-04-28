package com.example.facturation.generic.document.domain.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Generic Domain (Document) — Entité DocumentExporte.
 * Représente un document exporté (devis ou facture) dans un format donné.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class DocumentExporte {

    private UUID id;
    private FormatExport format;
    private LocalDateTime dateExport;
    private String chemin;
    private String acteur;

    /** Référence optionnelle vers le devis exporté */
    private UUID devisId;

    /** Référence optionnelle vers la facture exportée */
    private UUID factureId;
}
