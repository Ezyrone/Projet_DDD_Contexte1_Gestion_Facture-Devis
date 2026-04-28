package com.example.facturation.support.avoir.application;

import com.example.facturation.support.avoir.domain.model.Avoir;
import com.example.facturation.support.avoir.domain.model.StatutAvoir;
import com.example.facturation.support.avoir.domain.repository.AvoirRepository;
import com.example.facturation.support.facturation.domain.event.AvenantValide;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

/**
 * Supporting Domain (Avoir) — Service applicatif.
 * Orchestre les cas d'utilisation liés aux avoirs.
 * <p>
 * <strong>Événements consommés :</strong>
 * <ul>
 *   <li>{@link AvenantValide} (depuis support.facturation) — Customer-Supplier : crée automatiquement un avoir</li>
 * </ul>
 * <strong>Événements publiés :</strong>
 * <ul>
 *   <li>AvoirCompense, AvoirRembourse → support.paiement (Domain Events)</li>
 * </ul>
 * </p>
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class AvoirService {

    private final AvoirRepository avoirRepository;
    private final ApplicationEventPublisher eventPublisher;

    // ── Cas d'utilisation ────────────────────────────

    public Avoir creerAvoir(Avoir avoir) {
        avoir.setId(UUID.randomUUID());
        return avoirRepository.save(avoir);
    }

    public Avoir compenserAvoir(UUID avoirId) {
        Avoir avoir = avoirRepository.findById(avoirId)
                .orElseThrow(() -> new IllegalArgumentException("Avoir introuvable : " + avoirId));
        avoir.compenser();
        Avoir saved = avoirRepository.save(avoir);
        publishEvents(avoir);
        return saved;
    }

    public Avoir rembourserAvoir(UUID avoirId) {
        Avoir avoir = avoirRepository.findById(avoirId)
                .orElseThrow(() -> new IllegalArgumentException("Avoir introuvable : " + avoirId));
        avoir.rembourser();
        Avoir saved = avoirRepository.save(avoir);
        publishEvents(avoir);
        return saved;
    }

    public Avoir annulerAvoir(UUID avoirId) {
        Avoir avoir = avoirRepository.findById(avoirId)
                .orElseThrow(() -> new IllegalArgumentException("Avoir introuvable : " + avoirId));
        avoir.annuler();
        return avoirRepository.save(avoir);
    }

    public List<Avoir> listerAvoirs() {
        return avoirRepository.findAll();
    }

    // ── Événements consommés (Customer-Supplier depuis support.facturation) ──

    /**
     * Réagit à la validation d'un avenant en créant automatiquement un avoir.
     * Relation Customer-Supplier : INVOICE → CREDIT (AvenantValide).
     */
    @EventListener
    public void onAvenantValide(AvenantValide event) {
        log.info("[Avoir] Avenant validé reçu : {} sur facture {} — Création d'un avoir de {}",
                event.avenantId(), event.factureId(), event.montantCorrection());

        Avoir avoir = new Avoir();
        avoir.setId(UUID.randomUUID());
        avoir.setMontant(event.montantCorrection());
        avoir.setDateCreation(LocalDateTime.now());
        avoir.setDateExpiration(LocalDateTime.now().plusMonths(12));
        avoir.setStatut(StatutAvoir.DISPONIBLE);
        avoir.setAvenantId(event.avenantId());
        avoir.setFactureId(event.factureId());

        avoirRepository.save(avoir);
    }

    // ── Publication des événements de domaine ────────

    private void publishEvents(Avoir avoir) {
        avoir.getDomainEvents().forEach(eventPublisher::publishEvent);
        avoir.clearDomainEvents();
    }
}
