Feature: Gestion des devis

  Scenario: Création valide d'un devis
    Given un client "Lucie Martin"
    And un produit "Audit DDD" à 500€
    When un devis est créé
    Then il est enregistré avec le statut "BROUILLON"

  Scenario: Un devis sans ligne ne peut pas être envoyé
    Given un client "Lucie Martin"
    And un devis vide créé pour ce client
    When on tente d'envoyer le devis
    Then une erreur est levée avec le message "Un devis doit contenir au moins une ligne"

  Scenario: Un devis approuvé devient immuable
    Given un devis approuvé pour "Lucie Martin"
    When on tente de modifier le devis
    Then une erreur est levée avec le message "Le devis ne peut plus être modifié"
