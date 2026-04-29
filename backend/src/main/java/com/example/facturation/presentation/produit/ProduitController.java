package com.example.facturation.presentation.produit;

import com.example.facturation.sharedkernel.model.Produit;
import com.example.facturation.sharedkernel.repository.ProduitRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProduitController {

    private final ProduitRepository produitRepository;

    @GetMapping
    public List<Produit> getAll() {
        return produitRepository.findAll();
    }

    @GetMapping("/{id}")
    public Produit getById(@PathVariable UUID id) {
        return produitRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Produit introuvable"));
    }
}
