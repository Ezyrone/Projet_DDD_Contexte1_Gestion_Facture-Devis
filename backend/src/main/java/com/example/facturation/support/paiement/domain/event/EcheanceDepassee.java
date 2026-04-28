package com.example.facturation.support.paiement.domain.event;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Supporting Domain (Paiement) — Événement : une échéance de paiement a été dépassée.
 * Consommé par Notification (Customer-Supplier).
 */
public record EcheanceDepassee(
        UUID factureId,
        UUID clientId,
        float montantRestant,
        LocalDateTime dateEcheance
) {}
