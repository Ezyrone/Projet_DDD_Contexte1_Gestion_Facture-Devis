package com.example.facturation.support.paiement.application;

import com.example.facturation.support.paiement.domain.model.Echeancier;
import com.example.facturation.support.paiement.domain.model.Paiement;
import com.example.facturation.support.paiement.domain.model.Relance;
import com.example.facturation.support.paiement.domain.repository.EcheancierRepository;
import com.example.facturation.support.paiement.domain.repository.PaiementRepository;
import com.example.facturation.support.paiement.domain.repository.RelanceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

/**
 * Supporting Domain (Paiement) — Service applicatif.
 * Orchestre les cas d'utilisation liés aux paiements, échéanciers et relances.
 */
@Service
@RequiredArgsConstructor
public class PaiementService {

    private final PaiementRepository paiementRepository;
    private final EcheancierRepository echeancierRepository;
    private final RelanceRepository relanceRepository;

    public Paiement enregistrerPaiement(Paiement paiement) {
        paiement.enregistrer();
        return paiementRepository.save(paiement);
    }

    public Paiement rejeterPaiement(UUID paiementId) {
        Paiement paiement = paiementRepository.findById(paiementId)
                .orElseThrow(() -> new IllegalArgumentException("Paiement introuvable : " + paiementId));
        paiement.rejeter();
        return paiementRepository.save(paiement);
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
}
