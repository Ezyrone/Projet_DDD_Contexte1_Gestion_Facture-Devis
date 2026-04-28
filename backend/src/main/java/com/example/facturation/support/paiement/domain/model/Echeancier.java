package com.example.facturation.support.paiement.domain.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

/**
 * Supporting Domain (Paiement) — Entité Echeancier.
 * Planification des échéances de paiement pour une facture.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Echeancier {

    private UUID id;
    private List<LocalDateTime> echeances = new ArrayList<>();
    private List<Float> montants = new ArrayList<>();

    /** Référence vers la facture planifiée */
    private UUID factureId;

    /**
     * Calcule la prochaine échéance non dépassée.
     *
     * @return la prochaine date d'échéance, ou null si toutes sont passées
     */
    public LocalDateTime calculerProchaine() {
        LocalDateTime maintenant = LocalDateTime.now();
        return echeances.stream()
                .filter(e -> e.isAfter(maintenant))
                .findFirst()
                .orElse(null);
    }
}
