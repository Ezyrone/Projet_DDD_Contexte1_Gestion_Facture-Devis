package com.example.facturation.presentation.facturation;

import com.example.facturation.support.facturation.application.FactureService;
import com.example.facturation.support.facturation.domain.model.Facture;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/factures")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class FactureController {

    private final FactureService factureService;

    @GetMapping
    public ResponseEntity<List<Facture>> listerFactures() {
        return ResponseEntity.ok(factureService.listerFactures());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Facture> trouverFacture(@PathVariable UUID id) {
        try {
            return ResponseEntity.ok(factureService.trouverFacture(id));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/{id}/annuler")
    public ResponseEntity<Facture> annulerFacture(@PathVariable UUID id) {
        try {
            return ResponseEntity.ok(factureService.annulerFacture(id));
        } catch (IllegalArgumentException | IllegalStateException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/{id}/realisee")
    public ResponseEntity<Facture> marquerRealisee(@PathVariable UUID id) {
        try {
            return ResponseEntity.ok(factureService.marquerRealisee(id));
        } catch (IllegalArgumentException | IllegalStateException e) {
            return ResponseEntity.badRequest().build();
        }
    }
}
