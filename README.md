# Gestion Factures & Devis — Projet DDD

Modélisation d'une application métier couvrant le cycle commercial complet :
**Devis → Facture → Paiement → Clôture**

---

## 🛠️ Stack technique

| Couche | Technologie | Rôle dans l'architecture DDD |
| --- | --- | --- |
| **Frontend** | Angular | Couche présentation — traduit les intentions utilisateur en commandes métier |
| **Backend** | Java Spring Boot | Couche application & domaine — héberge les agrégats, services et événements |
| **Tests** | Cucumber | Validation BDD — les scénarios Gherkin s'exécutent directement en tests d'acceptance |

> L'architecture suit une approche **Hexagonale (Ports & Adapters)** : le domaine métier est isolé au centre, Angular et Spring Boot en sont des adaptateurs.

---

## 👥 Équipe

CENGO Killian · BARRY Mamadou · FRIOUICHEN Mohammed · CALAIS Adrien · CHEDAD Mehdi · ZOUINE Sanaa · GRZESZCZAK Jory

M2 AL – ESGI Grenoble

---

## 🎯 Objectif

Ce projet applique les principes du **Domain-Driven Design (DDD)** pour structurer une application de gestion commerciale. Les axes principaux sont :

- Réduire les erreurs humaines par l'automatisation des processus
- Améliorer le suivi financier via des règles métier explicites
- Organiser le code autour du domaine métier, non de la technique

L'approche repose sur :

- Une séparation claire en **bounded contexts**
- Un **langage ubiquitaire** partagé entre métier et développeurs
- Une modélisation orientée **événements métier**

---

## 🧩 Bounded Contexts

### Core Domains

| Contexte | Responsabilités |
| --- | --- |
| **Négociation & Vente** | Création, modification, versioning, envoi et validation des devis |
| **Facturation** | Génération des factures, gestion des statuts, échéances et avenants |

### Supporting Domains

| Contexte | Responsabilités |
| --- | --- |
| **Paiements & Relances** | Suivi des règlements, détection des retards, relances automatiques |
| **Gestion des avoirs** | Remboursements et compensations suite à corrections |
| **Import / Export** | Échange de données (Excel, PDF, CSV) |

### Infrastructure / Shared

| Contexte | Responsabilités |
| --- | --- |
| **Catalogue & Tiers** | Référentiel clients, produits et services |
| **Notifications** | Envoi d'emails (devis, factures, relances) |
| **Traçabilité & Preuve** | Historique, audit, journalisation des événements |

---

## 📡 Événements métier

| Domaine | Événements |
| --- | --- |
| Devis | `DevisCree` `DevisEnvoye` `DevisApprouve` `DevisExpire` |
| Facturation | `FactureEmise` `FactureEnvoyee` `FactureRealisee` `FactureCloturee` |
| Paiements | `PaiementEnregistre` `FacturePartiellementPayee` |
| Relances | `EcheanceDepassee` `RappelPaiementEnvoye` `MiseEnDemeureEmise` |
| Avoirs | `AvenantValide` `AvoirCree` `AvoirRembourse` `AvoirCompense` |

---

## 📋 Règles métier

### Devis

- Doit contenir : titre, client et au moins une ligne de montant ≥ 0
- Versionné à chaque modification importante
- Seule la dernière version peut être approuvée
- Un devis approuvé devient **immuable** et déclenche la génération d'une facture

### Facture

- Générée automatiquement depuis un devis approuvé
- Cycle de statuts : `Émise → Réalisée → Soldée → Clôturée`
- Immuable après émission — toute modification passe par un **avenant**

### Paiements

- Paiement partiel → calcul du reste à charge
- Paiement total → facture soldée
- Retard → déclenchement automatique des relances

### Avoirs

- Émis suite à un avenant ou une correction
- Peuvent être remboursés ou compensés sur une prochaine facture
- Utilisation unique (pas de double emploi)

---

## 🏗️ Architecture & interactions

```text
Négociation & Vente  →  produit les devis
Facturation          →  consomme DevisApprouve
Paiements            →  suit les règlements
Notifications        →  envoie les documents
Traçabilité          →  enregistre tous les événements
```

La communication entre contextes se fait via **événements asynchrones**.

---

## 🧪 BDD — Behavior-Driven Development

Les comportements métier sont spécifiés en **Gherkin** pour assurer une compréhension commune entre les développeurs et les parties prenantes.

```gherkin
Scenario: Création valide d'un devis
  Given un client "Lucie Martin"
  And un produit "Audit DDD" à 500€
  When un devis est créé
  Then il est enregistré avec le statut "Brouillon"
```

Le BDD permet :

- Une validation claire des règles métier
- Une compréhension partagée entre métier et développement
- Une base directement exploitable pour les tests automatisés

---

## 🚀 Installation & lancement

### Prérequis

| Outil | Version minimale | Vérification |
| --- | --- | --- |
| Java JDK | 17 | `java -version` |
| Maven | 3.9+ | `mvn -version` |
| Node.js | 18 LTS | `node -v` |
| Angular CLI | 17+ | `ng version` |

```bash
# Installer Angular CLI si absent
npm install -g @angular/cli
```

### Structure du projet

```text
Projet/
├── Backend/
│   └── src/
│       ├── main/java/com/esgi/ddd/
│       │   ├── domain/
│       │   │   ├── devis/          # Agrégat Devis, value objects, repository (port)
│       │   │   ├── facture/        # Agrégat Facture
│       │   │   └── shared/         # Interfaces communes (DomainEvent...)
│       │   ├── application/        # Services applicatifs, commands
│       │   ├── infrastructure/     # Implémentations des repositories (adaptateurs)
│       │   └── interfaces/rest/    # Contrôleurs REST (adaptateurs)
│       └── test/
│           ├── java/.../cucumber/  # Step definitions Cucumber
│           └── resources/features/ # Scénarios Gherkin
└── Frontend/
    └── src/app/                    # Composants Angular
```

### Backend — Spring Boot

```bash
cd Backend
mvn spring-boot:run
```

> API disponible sur `http://localhost:8080`

### Frontend — Angular

```bash
cd Frontend
npm install
ng serve
```

> Application disponible sur `http://localhost:4200`

### Tests — Cucumber

Les scénarios Gherkin sont exécutés via Maven depuis le Backend :

```bash
cd Backend
mvn test
```

Les fichiers `.feature` se trouvent dans `Backend/src/test/resources/features/`.

---

## 🗺️ Context Map

La Context Map formalise les relations entre bounded contexts et les patterns DDD employés :

| Pattern | Description |
| --- | --- |
| **Customer / Supplier** | Relation contractuelle entre deux contextes |
| **Conformist** | Le downstream adopte le modèle de l'upstream |
| **Shared Kernel** | Modèle partagé entre deux contextes |
| **Anti-Corruption Layer** | Isolation d'un contexte externe par une couche de traduction |
