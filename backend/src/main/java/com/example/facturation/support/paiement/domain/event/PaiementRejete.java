package com.example.facturation.support.paiement.domain.event;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Supporting Domain (Paiement) — Événement : un paiement a été rejeté.
 */
public record PaiementRejete(
        UUID paiementId,
        UUID factureId,
        LocalDateTime dateRejet
) {}
