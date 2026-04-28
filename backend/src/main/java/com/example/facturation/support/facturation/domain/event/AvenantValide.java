package com.example.facturation.support.facturation.domain.event;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Supporting Domain (Facturation) — Événement : un avenant a été validé.
 * Consommé par le bounded context Avoir (Customer-Supplier).
 */
public record AvenantValide(
        UUID avenantId,
        UUID factureId,
        float montantCorrection,
        String motif,
        LocalDateTime dateValidation
) {}
