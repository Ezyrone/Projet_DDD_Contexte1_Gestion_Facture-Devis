package com.example.facturation.support.avoir.domain.event;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Supporting Domain (Avoir) — Événement : un avoir a été remboursé.
 * Consommé par Paiement (Domain Events).
 */
public record AvoirRembourse(
        UUID avoirId,
        float montant,
        LocalDateTime dateRemboursement
) {}
