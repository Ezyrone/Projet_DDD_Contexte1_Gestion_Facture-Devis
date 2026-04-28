package com.example.facturation.support.facturation.domain.event;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Supporting Domain (Facturation) — Événement : une facture a été annulée.
 */
public record FactureAnnulee(
        UUID factureId,
        UUID clientId,
        LocalDateTime dateAnnulation
) {}
