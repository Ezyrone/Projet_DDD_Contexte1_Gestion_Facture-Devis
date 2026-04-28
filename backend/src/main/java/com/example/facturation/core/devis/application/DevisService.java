package com.example.facturation.core.devis.application;

import com.example.facturation.core.devis.domain.model.Devis;
import com.example.facturation.core.devis.domain.model.NoteDevis;
import com.example.facturation.core.devis.domain.repository.DevisRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

/**
 * Core Domain (Devis) — Service applicatif.
 * Orchestre les cas d'utilisation liés au cycle de vie d'un devis.
 * <p>
 * Publie les événements de domaine collectés par l'agrégat via {@link ApplicationEventPublisher}.
 * Les modules consommateurs (Facturation, Traçabilité) réagissent via {@code @EventListener}.
 * </p>
 */
@Service
@RequiredArgsConstructor
public class DevisService {

    private final DevisRepository devisRepository;
    private final ApplicationEventPublisher eventPublisher;

    public Devis creerDevis(Devis devis) {
        devis.creer();
        Devis saved = devisRepository.save(devis);
        publishEvents(devis);
        return saved;
    }

    public Devis modifierDevis(UUID devisId, Devis devisMaj) {
        Devis devis = devisRepository.findById(devisId)
                .orElseThrow(() -> new IllegalArgumentException("Devis introuvable : " + devisId));
        devis.setTitre(devisMaj.getTitre());
        devis.setDateValidite(devisMaj.getDateValidite());
        devis.setLignes(devisMaj.getLignes());
        devis.modifier();
        return devisRepository.save(devis);
    }

    public Devis envoyerAuClient(UUID devisId) {
        Devis devis = devisRepository.findById(devisId)
                .orElseThrow(() -> new IllegalArgumentException("Devis introuvable : " + devisId));
        devis.envoyerAuClient();
        Devis saved = devisRepository.save(devis);
        publishEvents(devis);
        return saved;
    }

    public Devis approuverDevis(UUID devisId) {
        Devis devis = devisRepository.findById(devisId)
                .orElseThrow(() -> new IllegalArgumentException("Devis introuvable : " + devisId));
        devis.approuver();
        Devis saved = devisRepository.save(devis);
        publishEvents(devis);
        return saved;
    }

    public Devis refuserDevis(UUID devisId) {
        Devis devis = devisRepository.findById(devisId)
                .orElseThrow(() -> new IllegalArgumentException("Devis introuvable : " + devisId));
        devis.refuser();
        Devis saved = devisRepository.save(devis);
        publishEvents(devis);
        return saved;
    }

    public Devis ajouterNote(UUID devisId, NoteDevis note) {
        Devis devis = devisRepository.findById(devisId)
                .orElseThrow(() -> new IllegalArgumentException("Devis introuvable : " + devisId));
        devis.ajouterNote(note);
        return devisRepository.save(devis);
    }

    public List<Devis> listerDevis() {
        return devisRepository.findAll();
    }

    public Devis trouverDevis(UUID devisId) {
        return devisRepository.findById(devisId)
                .orElseThrow(() -> new IllegalArgumentException("Devis introuvable : " + devisId));
    }

    // ── Publication des événements de domaine ────────

    private void publishEvents(Devis devis) {
        devis.getDomainEvents().forEach(eventPublisher::publishEvent);
        devis.clearDomainEvents();
    }
}
