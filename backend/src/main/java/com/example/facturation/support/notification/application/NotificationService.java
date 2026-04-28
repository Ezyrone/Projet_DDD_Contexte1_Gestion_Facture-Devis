package com.example.facturation.support.notification.application;

import com.example.facturation.support.notification.domain.model.Notification;
import org.springframework.stereotype.Service;

import java.util.UUID;

/**
 * Supporting Domain (Notification) — Service applicatif.
 * Consomme les événements de domaine et orchestre l'envoi de notifications.
 * Reçoit des événements de : Facturation (FactureEmise), Paiement (EcheanceDepassee, RappelPaiementEnvoye).
 */
@Service
public class NotificationService {

    /**
     * Envoie une notification à un destinataire.
     *
     * @param destinataire adresse email du destinataire
     * @param sujet        sujet de la notification
     * @param contenu      contenu de la notification
     * @return la notification envoyée
     */
    public Notification envoyerNotification(String destinataire, String sujet, String contenu) {
        Notification notification = new Notification();
        notification.setId(UUID.randomUUID());
        notification.setDestinataire(destinataire);
        notification.setSujet(sujet);
        notification.setContenu(contenu);
        notification.marquerEnvoyee();
        return notification;
    }
}
