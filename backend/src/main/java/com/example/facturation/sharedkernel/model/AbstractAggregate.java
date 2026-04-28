package com.example.facturation.sharedkernel.model;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

/**
 * Shared Kernel — Classe de base pour les Aggregate Roots.
 * <p>
 * Permet aux agrégats d'enregistrer des événements de domaine en interne,
 * qui seront publiés par le service applicatif après la persistance.
 * C'est le mécanisme central du monolithe modulaire : les modules communiquent
 * exclusivement via des événements de domaine, jamais par import direct.
 * </p>
 */
public abstract class AbstractAggregate {

    private final List<Object> domainEvents = new ArrayList<>();

    /**
     * Enregistre un événement de domaine à publier ultérieurement.
     *
     * @param event l'événement de domaine à enregistrer
     */
    protected void registerEvent(Object event) {
        this.domainEvents.add(event);
    }

    /**
     * Retourne la liste immuable des événements de domaine enregistrés.
     *
     * @return liste des événements en attente de publication
     */
    public List<Object> getDomainEvents() {
        return Collections.unmodifiableList(domainEvents);
    }

    /**
     * Vide la liste des événements de domaine après publication.
     */
    public void clearDomainEvents() {
        this.domainEvents.clear();
    }
}
