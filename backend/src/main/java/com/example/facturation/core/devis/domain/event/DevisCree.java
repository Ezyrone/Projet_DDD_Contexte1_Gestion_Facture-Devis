package com.example.facturation.core.devis.domain.event;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Core Domain (Devis) — Événement de domaine : un devis a été créé.
 */
public record DevisCree(
        UUID devisId,
        String titre,
        UUID clientId,
        LocalDateTime dateCreation
) {}
