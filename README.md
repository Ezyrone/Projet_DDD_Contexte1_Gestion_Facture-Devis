# Projet_DDD_Contexte1_Gestion_Facture-Devis


## 👥 Équipe

CENGO Killian • BARRY Mamadou • FRIOUICHEN Mohammed • CALAIS Adrien • CHEDAD Mehdi • ZOUINE Sanaa • GRZESZCZAK Jory
M2 AL – ESGI Grenoble


## 🎯 Objectif du projet

Ce projet modélise une application métier permettant de gérer l’ensemble du cycle commercial :

Devis → Facture → Paiement → Clôture

L’objectif est de :

* Réduire les erreurs humaines
* Automatiser les processus
* Améliorer le suivi financier
* Structurer une application alignée sur le métier

Le tout dans une approche DDD (Domain-Driven Design) avec :

* séparation en bounded contexts
* définition d’un langage ubiquitaire
* modélisation par événements métier

## 🧠 Approche DDD

Le système est découpé en contextes métier cohérents afin d’éviter un modèle monolithique complexe :

* Chaque contexte possède ses règles et son vocabulaire
* Les interactions se font via événements, API ou messages
* Les dépendances sont explicites (Context Map)

## 🧩 Bounded Contexts

## 🔥 Core Domains

* Négociation & Vente (Devis)
    * Création, modification, versioning, envoi, validation
* Facturation
    * Génération des factures, statuts, échéances, avenants

## ⚙️ Supporting Domains

* Paiements & Relances
    * Suivi des paiements, retards, relances
* Gestion des avoirs
    * Remboursements et compensations
* Import / Export
    * Excel, PDF, CSV

🧱 Shared / Infrastructure

* Catalogue & Tiers
    * Clients, produits, services
* Notifications
    * Envoi d’emails (devis, factures, relances)
* Traçabilité & Preuve
    * Historique, audit, événements


## 📡 Événements métier clés

Quelques événements structurants du système :

* DevisCree, DevisEnvoye, DevisApprouve, DevisExpire
* FactureEmise, FactureEnvoyee, FactureRealisee, FactureCloturee
* PaiementEnregistre, FacturePartiellementPayee
* EcheanceDepassee, RappelPaiementEnvoye, MiseEnDemeureEmise
* AvenantValide, AvoirCree, AvoirRembourse, AvoirCompense

## 📘 Règles métier principales

Devis

* Doit contenir : titre + client + au moins une ligne ≥ 0
* Versionné à chaque modification importante
* Seule la dernière version peut être approuvée
* Un devis approuvé devient immuable et génère une facture

Facture

* Générée automatiquement depuis un devis approuvé
* Statuts : Émise → Réalisée → Soldée → Clôturée
* Une facture est immuable après émission (modification via avenant)

Paiements

* Paiement partiel → reste à charge
* Paiement total → facture soldée
* Retard → relances automatiques

Avoirs

* Issus d’un avenant ou correction
* Peuvent être :
    * remboursés
    * compensés
* Pas de double utilisation

## 🧪 BDD (Behavior Driven Development)

Les comportements sont décrits en Gherkin :

Scenario: Création valide d'un devis
 ``` Given un client "Lucie Martin"
  And un produit "Audit DDD" à 500€
  When un devis est créé
  Then il est enregistré avec le statut "Brouillon" 
```
Le BDD permet :

* une compréhension commune métier/dev
* une validation claire des règles
* une base pour les tests automatisés
  

## 🧱 Architecture & interactions

* Négociation & Vente → produit les devis
* Facturation → consomme DevisApprouve
* Paiements → suit les règlements
* Notifications → envoie les documents
* Traçabilité → enregistre tout

👉 Communication via événements asynchrones


## 🗺️ Context Map

La Context Map définit :

* les relations entre contextes (upstream/downstream)
* les patterns DDD utilisés :
    * Customer/Supplier
    * Conformist
    * Shared Kernel
    * Anti-Corruption Layer