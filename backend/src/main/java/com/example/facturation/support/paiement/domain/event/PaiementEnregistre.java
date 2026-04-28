package com.example.facturation.support.paiement.domain.event;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Supporting Domain (Paiement) — Événement : un paiement a été enregistré.
 */
public record PaiementEnregistre(
        UUID paiementId,
        UUID factureId,
        float montant,
        LocalDateTime dateEnregistrement
) {}
