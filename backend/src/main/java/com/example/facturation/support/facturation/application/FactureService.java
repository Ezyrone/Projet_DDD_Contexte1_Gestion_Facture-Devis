package com.example.facturation.support.facturation.application;

import com.example.facturation.core.devis.domain.event.DevisApprouve;
import com.example.facturation.support.facturation.domain.model.Avenant;
import com.example.facturation.support.facturation.domain.model.Facture;
import com.example.facturation.support.facturation.domain.repository.FactureRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

/**
 * Supporting Domain (Facturation) — Service applicatif.
 * Orchestre les cas d'utilisation liés au cycle de vie d'une facture.
 * <p>
 * <strong>Événements consommés :</strong>
 * <ul>
 *   <li>{@link DevisApprouve} (depuis core.devis) — Customer-Supplier : crée automatiquement une facture</li>
 * </ul>
 * <strong>Événements publiés :</strong>
 * <ul>
 *   <li>FactureEmise → support.paiement (Conformist), support.notification (Customer-Supplier)</li>
 *   <li>AvenantValide → support.avoir (Customer-Supplier)</li>
 * </ul>
 * </p>
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class FactureService {

    private final FactureRepository factureRepository;
    private final ApplicationEventPublisher eventPublisher;

    // ── Cas d'utilisation ────────────────────────────

    public Facture emettreFacture(Facture facture) {
        facture.emettre();
        Facture saved = factureRepository.save(facture);
        publishEvents(facture);
        return saved;
    }

    public Facture annulerFacture(UUID factureId) {
        Facture facture = factureRepository.findById(factureId)
                .orElseThrow(() -> new IllegalArgumentException("Facture introuvable : " + factureId));
        facture.annuler();
        Facture saved = factureRepository.save(facture);
        publishEvents(facture);
        return saved;
    }

    public Facture marquerRealisee(UUID factureId) {
        Facture facture = factureRepository.findById(factureId)
                .orElseThrow(() -> new IllegalArgumentException("Facture introuvable : " + factureId));
        facture.marquerRealisee();
        return factureRepository.save(facture);
    }

    public Facture verifierCloture(UUID factureId) {
        Facture facture = factureRepository.findById(factureId)
                .orElseThrow(() -> new IllegalArgumentException("Facture introuvable : " + factureId));
        facture.verifierCloture();
        return factureRepository.save(facture);
    }

    public Facture validerAvenant(UUID factureId, Avenant avenant) {
        Facture facture = factureRepository.findById(factureId)
                .orElseThrow(() -> new IllegalArgumentException("Facture introuvable : " + factureId));
        facture.validerAvenant(avenant);
        Facture saved = factureRepository.save(facture);
        publishEvents(facture);
        return saved;
    }

    public List<Facture> listerFactures() {
        return factureRepository.findAll();
    }

    public Facture trouverFacture(UUID factureId) {
        return factureRepository.findById(factureId)
                .orElseThrow(() -> new IllegalArgumentException("Facture introuvable : " + factureId));
    }

    // ── Événements consommés (Customer-Supplier depuis core.devis) ──

    /**
     * Réagit à l'approbation d'un devis en créant automatiquement une facture.
     * Relation Customer-Supplier : SALES → INVOICE (DevisApprouve).
     */
    @EventListener
    public void onDevisApprouve(DevisApprouve event) {
        log.info("[Facturation] Devis approuvé reçu : {} — Création de la facture", event.devisId());

        Facture facture = new Facture();
        facture.setDevisId(event.devisId());
        facture.setClientId(event.clientId());
        facture.setMontantTotal(event.montantTotal());
        facture.setTitre("Facture issue du devis " + event.devisId());
        facture.emettre();

        factureRepository.save(facture);
        publishEvents(facture);
    }

    // ── Publication des événements de domaine ────────

    private void publishEvents(Facture facture) {
        facture.getDomainEvents().forEach(eventPublisher::publishEvent);
        facture.clearDomainEvents();
    }
}
