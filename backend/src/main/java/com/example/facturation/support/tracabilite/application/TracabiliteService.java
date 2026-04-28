package com.example.facturation.support.tracabilite.application;

import com.example.facturation.core.devis.domain.event.DevisApprouve;
import com.example.facturation.core.devis.domain.event.DevisCree;
import com.example.facturation.core.devis.domain.event.DevisEnvoye;
import com.example.facturation.core.devis.domain.event.DevisRefuse;
import com.example.facturation.support.avoir.domain.event.AvoirCompense;
import com.example.facturation.support.avoir.domain.event.AvoirRembourse;
import com.example.facturation.support.facturation.domain.event.AvenantValide;
import com.example.facturation.support.facturation.domain.event.FactureAnnulee;
import com.example.facturation.support.facturation.domain.event.FactureEmise;
import com.example.facturation.support.paiement.domain.event.EcheanceDepassee;
import com.example.facturation.support.paiement.domain.event.PaiementEnregistre;
import com.example.facturation.support.paiement.domain.event.PaiementRejete;
import com.example.facturation.support.paiement.domain.event.RappelPaiementEnvoye;
import com.example.facturation.support.tracabilite.domain.model.EvenementDomaine;
import com.example.facturation.support.tracabilite.domain.repository.EvenementDomaineRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

/**
 * Supporting Domain (Traçabilité) — Service applicatif.
 * Consomme TOUS les événements de domaine pour journalisation (audit trail).
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class TracabiliteService {

    private final EvenementDomaineRepository evenementDomaineRepository;

    // ── API publique ─────────────────────────────────

    public List<EvenementDomaine> listerEvenementsParDocument(String documentId) {
        return evenementDomaineRepository.findByDocumentId(documentId);
    }

    public List<EvenementDomaine> listerTousEvenements() {
        return evenementDomaineRepository.findAll();
    }

    // ── Événements Devis (Core Domain) ───────────────

    @EventListener
    public void onDevisCree(DevisCree e) {
        trace("DevisCree", e.devisId().toString(), "Devis créé : " + e.titre());
    }

    @EventListener
    public void onDevisEnvoye(DevisEnvoye e) {
        trace("DevisEnvoye", e.devisId().toString(), "Devis envoyé au client " + e.clientId());
    }

    @EventListener
    public void onDevisApprouve(DevisApprouve e) {
        trace("DevisApprouve", e.devisId().toString(), "Devis approuvé — montant : " + e.montantTotal());
    }

    @EventListener
    public void onDevisRefuse(DevisRefuse e) {
        trace("DevisRefuse", e.devisId().toString(), "Devis refusé");
    }

    // ── Événements Facturation (Supporting Domain) ───

    @EventListener
    public void onFactureEmise(FactureEmise e) {
        trace("FactureEmise", e.factureId().toString(), "Facture émise — montant : " + e.montantTotal());
    }

    @EventListener
    public void onFactureAnnulee(FactureAnnulee e) {
        trace("FactureAnnulee", e.factureId().toString(), "Facture annulée");
    }

    @EventListener
    public void onAvenantValide(AvenantValide e) {
        trace("AvenantValide", e.factureId().toString(), "Avenant " + e.avenantId() + " — correction : " + e.montantCorrection());
    }

    // ── Événements Paiement (Supporting Domain) ──────

    @EventListener
    public void onPaiementEnregistre(PaiementEnregistre e) {
        trace("PaiementEnregistre", e.factureId().toString(), "Paiement " + e.paiementId() + " — montant : " + e.montant());
    }

    @EventListener
    public void onPaiementRejete(PaiementRejete e) {
        trace("PaiementRejete", e.factureId().toString(), "Paiement " + e.paiementId() + " rejeté");
    }

    @EventListener
    public void onEcheanceDepassee(EcheanceDepassee e) {
        trace("EcheanceDepassee", e.factureId().toString(), "Échéance dépassée — reste : " + e.montantRestant());
    }

    @EventListener
    public void onRappelPaiementEnvoye(RappelPaiementEnvoye e) {
        trace("RappelPaiementEnvoye", e.factureId().toString(), "Rappel niveau " + e.niveauRelance());
    }

    // ── Événements Avoir (Supporting Domain) ─────────

    @EventListener
    public void onAvoirCompense(AvoirCompense e) {
        trace("AvoirCompense", e.avoirId().toString(), "Avoir compensé sur facture " + e.factureId() + " — montant : " + e.montant());
    }

    @EventListener
    public void onAvoirRembourse(AvoirRembourse e) {
        trace("AvoirRembourse", e.avoirId().toString(), "Avoir remboursé — montant : " + e.montant());
    }

    // ── Méthode interne de journalisation ────────────

    private void trace(String type, String documentId, String payload) {
        log.info("[Traçabilité] {} — doc:{} — {}", type, documentId, payload);
        EvenementDomaine evt = new EvenementDomaine();
        evt.setId(UUID.randomUUID());
        evt.setType(type);
        evt.setHorodatage(LocalDateTime.now());
        evt.setActeur("SYSTEME");
        evt.setDocumentId(documentId);
        evt.setPayload(payload);
        evenementDomaineRepository.save(evt);
    }
}
