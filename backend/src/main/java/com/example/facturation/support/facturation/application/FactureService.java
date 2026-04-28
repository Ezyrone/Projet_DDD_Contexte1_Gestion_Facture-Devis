package com.example.facturation.support.facturation.application;

import com.example.facturation.support.facturation.domain.model.Facture;
import com.example.facturation.support.facturation.domain.repository.FactureRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

/**
 * Supporting Domain (Facturation) — Service applicatif.
 * Orchestre les cas d'utilisation liés au cycle de vie d'une facture.
 */
@Service
@RequiredArgsConstructor
public class FactureService {

    private final FactureRepository factureRepository;

    public Facture emettreFacture(Facture facture) {
        facture.emettre();
        return factureRepository.save(facture);
    }

    public Facture annulerFacture(UUID factureId) {
        Facture facture = factureRepository.findById(factureId)
                .orElseThrow(() -> new IllegalArgumentException("Facture introuvable : " + factureId));
        facture.annuler();
        return factureRepository.save(facture);
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

    public List<Facture> listerFactures() {
        return factureRepository.findAll();
    }

    public Facture trouverFacture(UUID factureId) {
        return factureRepository.findById(factureId)
                .orElseThrow(() -> new IllegalArgumentException("Facture introuvable : " + factureId));
    }
}
