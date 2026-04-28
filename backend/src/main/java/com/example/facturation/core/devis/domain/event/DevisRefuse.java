package com.example.facturation.core.devis.domain.event;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Core Domain (Devis) — Événement de domaine : un devis a été refusé.
 */
public record DevisRefuse(
        UUID devisId,
        UUID clientId,
        LocalDateTime dateRefus
) {}
