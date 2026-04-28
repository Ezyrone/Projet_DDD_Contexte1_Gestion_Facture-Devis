package com.example.facturation.support.notification.application;

import com.example.facturation.support.facturation.domain.event.FactureEmise;
import com.example.facturation.support.notification.domain.model.Notification;
import com.example.facturation.support.paiement.domain.event.EcheanceDepassee;
import com.example.facturation.support.paiement.domain.event.RappelPaiementEnvoye;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Service;

import java.util.UUID;

/**
 * Supporting Domain (Notification) — Service applicatif.
 * Consomme les événements de domaine via @EventListener (communication découplée).
 */
@Slf4j
@Service
public class NotificationService {

    public Notification envoyerNotification(String destinataire, String sujet, String contenu) {
        Notification notification = new Notification();
        notification.setId(UUID.randomUUID());
        notification.setDestinataire(destinataire);
        notification.setSujet(sujet);
        notification.setContenu(contenu);
        notification.marquerEnvoyee();
        log.info("[Notification] Envoyée à {} : {}", destinataire, sujet);
        return notification;
    }

    @EventListener
    public void onFactureEmise(FactureEmise event) {
        log.info("[Notification] Facture émise : {} — Notification client {}", event.factureId(), event.clientId());
        envoyerNotification(event.clientId().toString(), "Nouvelle facture émise",
                "Facture de " + event.montantTotal() + " € émise.");
    }

    @EventListener
    public void onEcheanceDepassee(EcheanceDepassee event) {
        log.info("[Notification] Échéance dépassée facture {} — Client {}", event.factureId(), event.clientId());
        envoyerNotification(event.clientId().toString(), "Échéance dépassée",
                "Échéance du " + event.dateEcheance() + " dépassée. Montant : " + event.montantRestant() + " €");
    }

    @EventListener
    public void onRappelPaiementEnvoye(RappelPaiementEnvoye event) {
        log.info("[Notification] Rappel niveau {} facture {} — Client {}", event.niveauRelance(), event.factureId(), event.clientId());
        envoyerNotification(event.clientId().toString(), "Rappel paiement niveau " + event.niveauRelance(),
                "Rappel de niveau " + event.niveauRelance() + " pour la facture " + event.factureId());
    }
}
