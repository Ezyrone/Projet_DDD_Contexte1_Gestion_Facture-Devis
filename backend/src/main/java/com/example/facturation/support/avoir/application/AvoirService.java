package com.example.facturation.support.avoir.application;

import com.example.facturation.support.avoir.domain.model.Avoir;
import com.example.facturation.support.avoir.domain.repository.AvoirRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

/**
 * Supporting Domain (Avoir) — Service applicatif.
 * Orchestre les cas d'utilisation liés aux avoirs.
 */
@Service
@RequiredArgsConstructor
public class AvoirService {

    private final AvoirRepository avoirRepository;

    public Avoir creerAvoir(Avoir avoir) {
        avoir.setId(UUID.randomUUID());
        return avoirRepository.save(avoir);
    }

    public Avoir compenserAvoir(UUID avoirId) {
        Avoir avoir = avoirRepository.findById(avoirId)
                .orElseThrow(() -> new IllegalArgumentException("Avoir introuvable : " + avoirId));
        avoir.compenser();
        return avoirRepository.save(avoir);
    }

    public Avoir rembourserAvoir(UUID avoirId) {
        Avoir avoir = avoirRepository.findById(avoirId)
                .orElseThrow(() -> new IllegalArgumentException("Avoir introuvable : " + avoirId));
        avoir.rembourser();
        return avoirRepository.save(avoir);
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
}
