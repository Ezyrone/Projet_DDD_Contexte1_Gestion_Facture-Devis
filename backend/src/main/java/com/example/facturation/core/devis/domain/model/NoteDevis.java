package com.example.facturation.core.devis.domain.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Core Domain (Devis) — Entité enfant NoteDevis.
 * Note attachée à un devis (interne ou visible client).
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class NoteDevis {

    private UUID id;
    private String contenu;
    private LocalDateTime dateCreation;
    private boolean interne;
}
