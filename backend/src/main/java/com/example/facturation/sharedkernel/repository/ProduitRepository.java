package com.example.facturation.sharedkernel.repository;

import com.example.facturation.sharedkernel.model.Produit;

import java.util.Optional;
import java.util.UUID;

/**
 * Shared Kernel — Port de persistance pour les produits.
 */
public interface ProduitRepository {

    Optional<Produit> findById(UUID id);

    Produit save(Produit produit);

    void deleteById(UUID id);
}
