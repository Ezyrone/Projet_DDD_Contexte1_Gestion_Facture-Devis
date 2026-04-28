package com.example.facturation.support.facturation.domain.event;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Supporting Domain (Facturation) — Événement : une facture a été émise.
 * Consommé par Paiement (Conformist) et Notification (Customer-Supplier).
 */
public record FactureEmise(
        UUID factureId,
        UUID clientId,
        float montantTotal,
        LocalDateTime dateEmission
) {}
