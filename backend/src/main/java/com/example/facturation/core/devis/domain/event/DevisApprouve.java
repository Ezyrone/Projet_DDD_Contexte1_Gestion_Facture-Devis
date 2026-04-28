package com.example.facturation.core.devis.domain.event;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Core Domain (Devis) — Événement de domaine : un devis a été approuvé.
 * Déclenche la création d'une facture (Customer-Supplier → Facturation).
 */
public record DevisApprouve(
        UUID devisId,
        UUID clientId,
        float montantTotal,
        LocalDateTime dateApprobation
) {}
