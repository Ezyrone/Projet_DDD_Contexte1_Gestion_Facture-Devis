Feature: Gestion des devis

  Scenario: Création valide d'un devis
    Given un client "Lucie Martin"
    And un produit "Audit DDD" à 500€
    When un devis est créé
    Then il est enregistré avec le statut "Brouillon"

  Scenario: Un devis doit avoir un titre
    Given un client "Lucie Martin"
    When on tente de créer un devis sans titre
    Then une erreur est levée

  Scenario: Un devis doit avoir au moins une ligne
    Given un devis en brouillon pour "Lucie Martin"
    When on tente d'envoyer le devis sans ligne
    Then une erreur est levée

  Scenario: Envoi d'un devis valide
    Given un devis en brouillon pour "Lucie Martin" avec une ligne "Audit DDD" à 500€
    When le devis est envoyé
    Then le statut du devis est "Envoyé"

  Scenario: Approbation d'un devis envoyé
    Given un devis envoyé à "Lucie Martin"
    When le client approuve le devis
    Then le statut du devis est "Approuvé"

  Scenario: Un devis approuvé est immuable
    Given un devis approuvé pour "Lucie Martin"
    When on tente d'ajouter une ligne au devis
    Then une erreur est levée

  Scenario: Seule la dernière version d'un devis peut être approuvée
    Given un devis envoyé à "Lucie Martin" en version 1
    And une nouvelle version du devis est créée
    When on tente d'approuver la version 1
    Then une erreur est levée

  Scenario: Expiration d'un devis non approuvé
    Given un devis envoyé à "Lucie Martin"
    When la date d'expiration est dépassée
    Then le statut du devis est "Expiré"
