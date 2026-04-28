package com.example.facturation.support.paiement.domain.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Supporting Domain (Paiement) — Entité Relance.
 * Représente une relance de paiement envoyée à un client.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Relance {

    private UUID id;
    private int niveau;
    private LocalDateTime dateEnvoi;
    private String destinataire;
    private TypeRelance type;

    /** Référence vers la facture relancée */
    private UUID factureId;

    /**
     * Envoie la relance (met à jour la date d'envoi).
     */
    public void envoyer() {
        this.dateEnvoi = LocalDateTime.now();
    }
}
