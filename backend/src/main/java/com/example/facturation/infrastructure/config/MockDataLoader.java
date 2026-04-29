package com.example.facturation.infrastructure.config;

import com.example.facturation.core.devis.domain.model.Devis;
import com.example.facturation.core.devis.domain.model.StatutDevis;
import com.example.facturation.core.devis.domain.repository.DevisRepository;
import com.example.facturation.sharedkernel.model.Produit;
import com.example.facturation.sharedkernel.model.TypeUser;
import com.example.facturation.sharedkernel.model.User;
import com.example.facturation.sharedkernel.repository.ProduitRepository;
import com.example.facturation.sharedkernel.repository.UserRepository;
import com.example.facturation.support.avoir.domain.model.Avoir;
import com.example.facturation.support.avoir.domain.model.StatutAvoir;
import com.example.facturation.support.avoir.domain.repository.AvoirRepository;
import com.example.facturation.support.facturation.domain.model.Facture;
import com.example.facturation.support.facturation.domain.model.StatutFacture;
import com.example.facturation.support.facturation.domain.repository.FactureRepository;
import com.example.facturation.support.paiement.domain.model.Paiement;
import com.example.facturation.support.paiement.domain.model.StatutPaiement;
import com.example.facturation.support.paiement.domain.repository.PaiementRepository;
import com.example.facturation.support.tracabilite.domain.model.EvenementDomaine;
import com.example.facturation.support.tracabilite.domain.repository.EvenementDomaineRepository;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.*;

@Component
@RequiredArgsConstructor
public class MockDataLoader {

    private final UserRepository userRepository;
    private final ProduitRepository produitRepository;
    private final DevisRepository devisRepository;
    private final FactureRepository factureRepository;
    private final PaiementRepository paiementRepository;
    private final AvoirRepository avoirRepository;
    private final EvenementDomaineRepository eventRepository;

    @PostConstruct
    public void init() {

        // ───────── USERS ─────────
        User admin = new User(
                UUID.randomUUID(),
                "Admin",
                "System",
                "admin@test.com",
                "Paris",
                TypeUser.ADMIN
        );

        User client = new User(
                UUID.randomUUID(),
                "Ali",
                "Client",
                "ali@test.com",
                "Paris",
                TypeUser.CLIENT
        );

        User comptable = new User(
                UUID.randomUUID(),
                "Sara",
                "Compta",
                "sara@test.com",
                "Paris",
                TypeUser.COMPTABLE
        );

        userRepository.save(admin);
        userRepository.save(client);
        userRepository.save(comptable);

        // ───────── PRODUITS ─────────
        Produit p1 = new Produit(UUID.randomUUID(), "Laptop", 1200f, "Dell XPS");
        Produit p2 = new Produit(UUID.randomUUID(), "Souris", 50f, "Logitech");
        Produit p3 = new Produit(UUID.randomUUID(), "Clavier", 80f, "Mechanical");

        produitRepository.save(p1);
        produitRepository.save(p2);
        produitRepository.save(p3);

        // ───────── DEVIS ─────────
        Devis devis = new Devis();
        devis.setId(UUID.randomUUID());
        devis.setTitre("Devis matériel informatique");
        devis.setDateCreation(LocalDateTime.now());
        devis.setStatut(StatutDevis.ENVOYE);
        devis.setClientId(client.getId());

        devisRepository.save(devis);

        // ───────── FACTURE ─────────
        Facture facture = new Facture();
        facture.setId(UUID.randomUUID());
        facture.setTitre("Facture DEV-001");
        facture.setDateCreation(LocalDateTime.now());
        facture.setClientId(client.getId());
        facture.setMontantTotal(1330f);
        facture.setStatut(StatutFacture.EMISE);
        facture.setDevisId(devis.getId());

        factureRepository.save(facture);

        // ───────── PAIEMENT ─────────
        Paiement paiement = new Paiement();
        paiement.setId(UUID.randomUUID());
        paiement.setFactureId(facture.getId());
        paiement.setMontant(500f);
        paiement.setDatePaiement(LocalDateTime.now());
        paiement.setStatut(StatutPaiement.ENREGISTRE);

        paiementRepository.save(paiement);

        // ───────── AVOIR ─────────
        Avoir avoir = new Avoir();
        avoir.setId(UUID.randomUUID());
        avoir.setFactureId(facture.getId());
        avoir.setMontant(100f);
        avoir.setDateCreation(LocalDateTime.now());
        avoir.setStatut(StatutAvoir.DISPONIBLE);

        avoirRepository.save(avoir);

        // ───────── EVENTS ─────────
        addEvent("DevisCree", devis.getId());
        addEvent("FactureEmise", facture.getId());
        addEvent("PaiementEnregistre", paiement.getId());
        addEvent("AvoirCree", avoir.getId());
    }

    private void addEvent(String type, UUID docId) {
        EvenementDomaine e = new EvenementDomaine();
        e.setId(UUID.randomUUID());
        e.setType(type);
        e.setDocumentId(docId.toString());
        e.setHorodatage(LocalDateTime.now());
        e.setPayload("Mock event " + type);

        eventRepository.save(e);
    }

    @Repository
    public static class InMemoryUserRepository implements UserRepository {

        private final Map<UUID, User> storage = new HashMap<>();

        @Override
        public Optional<User> findById(UUID id) {
            return Optional.ofNullable(storage.get(id));
        }

        @Override
        public List<User> findAll() {
            return new ArrayList<>(storage.values());
        }

        @Override
        public User save(User user) {
            storage.put(user.getId(), user);
            return user;
        }

        @Override
        public void deleteById(UUID id) {
            storage.remove(id);
        }
    }

    @Repository
    public static class InMemoryProduitRepository implements ProduitRepository {

        private final Map<UUID, Produit> store = new HashMap<>();

        @Override
        public Optional<Produit> findById(UUID id) {
            return Optional.ofNullable(store.get(id));
        }

        @Override
        public Produit save(Produit produit) {
            if (produit.getId() == null) {
                produit.setId(UUID.randomUUID());
            }
            store.put(produit.getId(), produit);
            return produit;
        }

        @Override
        public void deleteById(UUID id) {
            store.remove(id);
        }

        public List<Produit> findAll() {
            return new ArrayList<>(store.values());
        }
    }
}
