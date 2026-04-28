# Backend - Projet DDD (Gestion Facture/Devis)

Ce dossier contient le backend de l'application de facturation et devis.
L'application est architecturée selon les principes du **Domain-Driven Design (DDD)** avec une approche **monolithe modulaire**.

## 🏗 Architecture

Le backend est découpé en plusieurs **Bounded Contexts** :

- **Core Domain** : `devis`
- **Supporting Domains** : `facturation`, `avoir`, `paiement`, `notification`, `tracabilite`
- **Generic Domain** : `document`
- **Shared Kernel** : Modèles partagés (`Produit`, `Devise`, `Taxe`, `User`)

Chaque domaine est structuré de manière hexagonale (ou Clean Architecture) avec les couches suivantes :
- `application` : Cas d'utilisation (Services)
- `domain` : Logique métier (Modèles, Événements, Interfaces des Repositories)
- `infrastructure` : Implémentations techniques (Bases de données, APIs externes)

## 📁 Arborescence Complète du Projet

Voici l'arborescence complète du code source (`src`) et des données mockées (`data`) :

### Code Source (`src`)
```text
src
+---main
|   +---java
|   |   \---com
|   |       \---example
|   |           \---facturation
|   |               |   FacturationApplication.java
|   |               |   
|   |               +---core
|   |               |   \---devis
|   |               |       |   package-info.java
|   |               |       +---application
|   |               |       |       DevisService.java
|   |               |       +---domain
|   |               |       |   +---event
|   |               |       |   |       DevisApprouve.java
|   |               |       |   |       DevisCree.java
|   |               |       |   |       DevisEnvoye.java
|   |               |       |   |       DevisRefuse.java
|   |               |       |   +---model
|   |               |       |   |       Devis.java
|   |               |       |   |       LigneDevis.java
|   |               |       |   |       NoteDevis.java
|   |               |       |   |       StatutDevis.java
|   |               |       |   |       VersionDevis.java
|   |               |       |   \---repository
|   |               |       |           DevisRepository.java
|   |               |       \---infrastructure
|   |               +---generic
|   |               |   \---document
|   |               |       |   package-info.java
|   |               |       +---application
|   |               |       |       DocumentService.java
|   |               |       +---domain
|   |               |       |   +---model
|   |               |       |   |       DocumentExporte.java
|   |               |       |   |       FormatExport.java
|   |               |       |   |       ImportDocument.java
|   |               |       |   \---repository
|   |               |       |           DocumentExporteRepository.java
|   |               |       |           ImportDocumentRepository.java
|   |               |       \---infrastructure
|   |               +---infrastructure
|   |               +---sharedkernel
|   |               |   |   package-info.java
|   |               |   +---infrastructure
|   |               |   +---model
|   |               |   |       AbstractAggregate.java
|   |               |   |       Devise.java
|   |               |   |       Produit.java
|   |               |   |       Taxe.java
|   |               |   |       TypeUser.java
|   |               |   |       User.java
|   |               |   \---repository
|   |               |           ProduitRepository.java
|   |               |           UserRepository.java
|   |               \---support
|   |                   +---avoir
|   |                   |   |   package-info.java
|   |                   |   +---application
|   |                   |   |       AvoirService.java
|   |                   |   +---domain
|   |                   |   |   +---event
|   |                   |   |   |       AvoirCompense.java
|   |                   |   |   |       AvoirRembourse.java
|   |                   |   |   +---model
|   |                   |   |   |       Avoir.java
|   |                   |   |   |       StatutAvoir.java
|   |                   |   |   \---repository
|   |                   |   |           AvoirRepository.java
|   |                   |   \---infrastructure
|   |                   +---facturation
|   |                   |   |   package-info.java
|   |                   |   +---application
|   |                   |   |       FactureService.java
|   |                   |   +---domain
|   |                   |   |   +---event
|   |                   |   |   |       AvenantValide.java
|   |                   |   |   |       FactureAnnulee.java
|   |                   |   |   |       FactureEmise.java
|   |                   |   |   +---model
|   |                   |   |   |       Avenant.java
|   |                   |   |   |       Facture.java
|   |                   |   |   |       HistoriqueStatutFacture.java
|   |                   |   |   |       LigneFacture.java
|   |                   |   |   |       ProfilFacturation.java
|   |                   |   |   |       StatutFacture.java
|   |                   |   |   \---repository
|   |                   |   |           FactureRepository.java
|   |                   |   \---infrastructure
|   |                   +---notification
|   |                   |   |   package-info.java
|   |                   |   +---application
|   |                   |   |       NotificationService.java
|   |                   |   \---domain
|   |                   |       \---model
|   |                   |               Notification.java
|   |                   +---paiement
|   |                   |   |   package-info.java
|   |                   |   +---application
|   |                   |   |       PaiementService.java
|   |                   |   +---domain
|   |                   |   |   +---event
|   |                   |   |   |       EcheanceDepassee.java
|   |                   |   |   |       PaiementEnregistre.java
|   |                   |   |   |       PaiementRejete.java
|   |                   |   |   |       RappelPaiementEnvoye.java
|   |                   |   |   +---model
|   |                   |   |   |       Echeancier.java
|   |                   |   |   |       ModePaiement.java
|   |                   |   |   |       Paiement.java
|   |                   |   |   |       Relance.java
|   |                   |   |   |       StatutPaiement.java
|   |                   |   |   |       TypeRelance.java
|   |                   |   |   \---repository
|   |                   |   |           EcheancierRepository.java
|   |                   |   |           PaiementRepository.java
|   |                   |   |           RelanceRepository.java
|   |                   |   \---infrastructure
|   |                   \---tracabilite
|   |                       |   package-info.java
|   |                       +---application
|   |                       |       TracabiliteService.java
|   |                       +---domain
|   |                       |   +---model
|   |                       |   |       EvenementDomaine.java
|   |                       |   \---repository
|   |                       |           EvenementDomaineRepository.java
|   |                       \---infrastructure
|   \---resources
|           application.properties
\---test
    \---java
        \---com
            \---example
                \---facturation
                        FacturationApplicationTests.java
```

### Données Mockées (`data`)
```text
data
    00_metadata.json
    01_referentiels_shared_kernel.json
    02_devis_core_domain.json
    03_facturation_core_domain.json
    04_paiements_relances_supporting_domain.json
    05_avoirs_supporting_domain.json
    06_import_export_generic_domain.json
    07_tracabilite_infrastructure_domain.json
    08_dossiers_metier_50.json
    09_mock_data_normalized_full.json
    10_mock_data_aggregated_50_records.json
    README.md
    schema_aggregated_records.json
```

## 🛠 Lancement

L'application est packagée avec Maven. Pour la compiler et démarrer le serveur Spring Boot localement :

```bash
# Compiler le projet et lancer les tests
./mvnw clean install

# Démarrer l'application
./mvnw spring-boot:run
```
