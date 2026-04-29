package com.example.facturation.presentation.avoir;

import com.example.facturation.support.avoir.application.AvoirService;
import com.example.facturation.support.avoir.domain.model.Avoir;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/avoirs")
@RequiredArgsConstructor
public class AvoirController {

    private final AvoirService avoirService;

    @PostMapping
    public Avoir creer(@RequestBody Avoir avoir) {
        return avoirService.creerAvoir(avoir);
    }

    @PostMapping("/{id}/compenser")
    public Avoir compenser(@PathVariable UUID id) {
        return avoirService.compenserAvoir(id);
    }

    @PostMapping("/{id}/rembourser")
    public Avoir rembourser(@PathVariable UUID id) {
        return avoirService.rembourserAvoir(id);
    }

    @PostMapping("/{id}/annuler")
    public Avoir annuler(@PathVariable UUID id) {
        return avoirService.annulerAvoir(id);
    }

    @GetMapping
    public List<Avoir> lister() {
        return avoirService.listerAvoirs();
    }
}
