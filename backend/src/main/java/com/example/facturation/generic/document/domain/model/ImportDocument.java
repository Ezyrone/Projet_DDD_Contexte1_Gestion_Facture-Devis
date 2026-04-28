package com.example.facturation.generic.document.domain.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

/**
 * Generic Domain (Document) — Entité ImportDocument.
 * Représente un document importé avec validation et transformation.
 * Utilise un ACL (Anti-Corruption Layer) pour communiquer avec Devis et Facture.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ImportDocument {

    private UUID id;
    private String fichierSource;
    private LocalDateTime dateImport;
    private List<String> erreurs = new ArrayList<>();
    private boolean succes;

    /** Référence optionnelle vers le devis créé après transformation */
    private UUID devisId;

    /**
     * Valide le document importé.
     *
     * @return true si le document est valide
     */
    public boolean valider() {
        this.erreurs.clear();
        if (this.fichierSource == null || this.fichierSource.isBlank()) {
            this.erreurs.add("Le fichier source est obligatoire.");
        }
        this.succes = this.erreurs.isEmpty();
        return this.succes;
    }

    /**
     * Transforme le document importé (placeholder pour la logique de transformation).
     */
    public void transformer() {
        if (!this.succes) {
            throw new IllegalStateException("Le document doit être validé avant transformation.");
        }
        // Logique de transformation — délégué à l'ACL
    }
}
