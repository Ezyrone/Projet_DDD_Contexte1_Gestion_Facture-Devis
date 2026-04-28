package com.example.facturation.support.avoir.domain.event;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Supporting Domain (Avoir) — Événement : un avoir a été compensé sur une facture.
 * Consommé par Paiement (Domain Events).
 */
public record AvoirCompense(
        UUID avoirId,
        UUID factureId,
        float montant,
        LocalDateTime dateCompensation
) {}
