package com.example.facturation.presentation.paiement;

import com.example.facturation.support.paiement.application.PaiementService;
import com.example.facturation.support.paiement.domain.model.Echeancier;
import com.example.facturation.support.paiement.domain.model.Paiement;
import com.example.facturation.support.paiement.domain.model.Relance;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/paiements")
@RequiredArgsConstructor
public class PaiementController {

    private final PaiementService paiementService;

    @PostMapping
    public Paiement creer(@RequestBody Paiement paiement) {
        return paiementService.enregistrerPaiement(paiement);
    }

    @PostMapping("/{id}/rejeter")
    public Paiement rejeter(@PathVariable UUID id) {
        return paiementService.rejeterPaiement(id);
    }

    @PostMapping("/{id}/rembourser")
    public Paiement rembourser(@PathVariable UUID id) {
        return paiementService.rembourserPaiement(id);
    }

    @GetMapping("/facture/{factureId}")
    public List<Paiement> parFacture(@PathVariable UUID factureId) {
        return paiementService.listerPaiementsParFacture(factureId);
    }

    @PostMapping("/echeancier")
    public Echeancier creerEcheancier(@RequestBody Echeancier echeancier) {
        return paiementService.creerEcheancier(echeancier);
    }

    @PostMapping("/relance")
    public Relance envoyerRelance(@RequestBody Relance relance) {
        return paiementService.envoyerRelance(relance);
    }

    @GetMapping("/relances/{factureId}")
    public List<Relance> relances(@PathVariable UUID factureId) {
        return paiementService.listerRelancesParFacture(factureId);
    }
}
