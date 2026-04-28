package com.example.facturation.support.notification.domain.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Supporting Domain (Notification) — Entité Notification.
 * Représente une notification envoyée à un destinataire.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Notification {

    private UUID id;
    private String destinataire;
    private String sujet;
    private String contenu;
    private LocalDateTime dateEnvoi;
    private boolean envoyee;

    /**
     * Marque la notification comme envoyée.
     */
    public void marquerEnvoyee() {
        this.envoyee = true;
        this.dateEnvoi = LocalDateTime.now();
    }
}
