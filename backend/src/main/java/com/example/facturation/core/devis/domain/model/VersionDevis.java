package com.example.facturation.core.devis.domain.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Core Domain (Devis) — Entité enfant VersionDevis.
 * Représente une version archivable d'un devis.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class VersionDevis {

    private UUID id;
    private String numeroVersion;
    private LocalDateTime dateCreation;
    private boolean archivee;

    /**
     * Archive cette version du devis.
     */
    public void archiver() {
        this.archivee = true;
    }
}
