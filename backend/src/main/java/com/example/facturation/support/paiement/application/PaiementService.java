package com.example.facturation.support.paiement.application;

import com.example.facturation.support.avoir.domain.event.AvoirCompense;
import com.example.facturation.support.avoir.domain.event.AvoirRembourse;
import com.example.facturation.support.facturation.domain.event.FactureEmise;
import com.example.facturation.support.paiement.domain.model.Echeancier;
import com.example.facturation.support.paiement.domain.model.Paiement;
import com.example.facturation.support.paiement.domain.model.Relance;
import com.example.facturation.support.paiement.domain.repository.EcheancierRepository;
import com.example.facturation.support.paiement.domain.repository.PaiementRepository;
import com.example.facturation.support.paiement.domain.repository.RelanceRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

/**
 * Supporting Domain (Paiement) — Service applicatif.
 * Orchestre les cas d'utilisation liés aux paiements, échéanciers et relances.
 * <p>
 * <strong>Événements consommés :</strong>
 * <ul>
 *   <li>{@link FactureEmise} (depuis support.facturation) — Conformist</li>
 *   <li>{@link AvoirCompense} (depuis support.avoir) — Domain Events</li>
 *   <li>{@link AvoirRembourse} (depuis support.avoir) — Domain Events</li>
 * </ul>
 * </p>
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class PaiementService {

    private final PaiementRepository paiementRepository;
    private final EcheancierRepository echeancierRepository;
    private final RelanceRepository relanceRepository;
    private final ApplicationEventPublisher eventPublisher;

    // ── Cas d'utilisation ────────────────────────────

    public Paiement enregistrerPaiement(Paiement paiement) {
        paiement.enregistrer();
        Paiement saved = paiementRepository.save(paiement);
        publishEvents(paiement);
        return saved;
    }

    public Paiement rejeterPaiement(UUID paiementId) {
        Paiement paiement = paiementRepository.findById(paiementId)
                .orElseThrow(() -> new IllegalArgumentException("Paiement introuvable : " + paiementId));
        paiement.rejeter();
        Paiement saved = paiementRepository.save(paiement);
        publishEvents(paiement);
        return saved;
    }

    public Paiement rembourserPaiement(UUID paiementId) {
        Paiement paiement = paiementRepository.findById(paiementId)
                .orElseThrow(() -> new IllegalArgumentException("Paiement introuvable : " + paiementId));
        paiement.rembourser();
        return paiementRepository.save(paiement);
    }

    public List<Paiement> listerPaiementsParFacture(UUID factureId) {
        return paiementRepository.findByFactureId(factureId);
    }

    public List<Paiement> listerTousLesPaiements() {
        return paiementRepository.findAll();
    }

    public Echeancier creerEcheancier(Echeancier echeancier) {
        return echeancierRepository.save(echeancier);
    }

    public Relance envoyerRelance(Relance relance) {
        relance.envoyer();
        return relanceRepository.save(relance);
    }

    public List<Relance> listerRelancesParFacture(UUID factureId) {
        return relanceRepository.findByFactureId(factureId);
    }

    public List<Relance> listerToutesLesRelances() {
        return relanceRepository.findAll();
    }

    // ── Événements consommés ─────────────────────────

    /**
     * Réagit à l'émission d'une facture — Conformist.
     * Crée automatiquement un échéancier pour la facture émise.
     */
    @EventListener
    public void onFactureEmise(FactureEmise event) {
        log.info("[Paiement] Facture émise reçue : {} — Initialisation du suivi de paiement", event.factureId());
    }

    /**
     * Réagit à la compensation d'un avoir — met à jour le reste à charge.
     */
    @EventListener
    public void onAvoirCompense(AvoirCompense event) {
        log.info("[Paiement] Avoir compensé reçu : {} sur facture {} — Montant : {}",
                event.avoirId(), event.factureId(), event.montant());
    }

    /**
     * Réagit au remboursement d'un avoir.
     */
    @EventListener
    public void onAvoirRembourse(AvoirRembourse event) {
        log.info("[Paiement] Avoir remboursé reçu : {} — Montant : {}", event.avoirId(), event.montant());
    }

    // ── Publication des événements de domaine ────────

    private void publishEvents(Paiement paiement) {
        paiement.getDomainEvents().forEach(eventPublisher::publishEvent);
        paiement.clearDomainEvents();
    }
}
