package com.example.facturation.presentation.devis;

import com.example.facturation.core.devis.application.DevisService;
import com.example.facturation.core.devis.domain.model.Devis;
import com.example.facturation.core.devis.domain.model.NoteDevis;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/devis")
@RequiredArgsConstructor
public class DevisController {

    private final DevisService devisService;

    @PostMapping
    public Devis creer(@RequestBody Devis devis) {
        return devisService.creerDevis(devis);
    }

    @PutMapping("/{id}")
    public Devis modifier(@PathVariable UUID id, @RequestBody Devis devis) {
        return devisService.modifierDevis(id, devis);
    }

    @PostMapping("/{id}/envoyer")
    public Devis envoyer(@PathVariable UUID id) {
        return devisService.envoyerAuClient(id);
    }

    @PostMapping("/{id}/approuver")
    public Devis approuver(@PathVariable UUID id) {
        return devisService.approuverDevis(id);
    }

    @PostMapping("/{id}/refuser")
    public Devis refuser(@PathVariable UUID id) {
        return devisService.refuserDevis(id);
    }

    @PostMapping("/{id}/notes")
    public Devis ajouterNote(@PathVariable UUID id, @RequestBody NoteDevis note) {
        return devisService.ajouterNote(id, note);
    }

    @GetMapping
    public List<Devis> lister() {
        return devisService.listerDevis();
    }

    @GetMapping("/{id}")
    public Devis getById(@PathVariable UUID id) {
        return devisService.trouverDevis(id);
    }
}
