package com.example.facturation.support.paiement.domain.event;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Supporting Domain (Paiement) — Événement : un rappel de paiement a été envoyé.
 * Consommé par Notification (Customer-Supplier).
 */
public record RappelPaiementEnvoye(
        UUID factureId,
        UUID clientId,
        int niveauRelance,
        LocalDateTime dateEnvoi
) {}
