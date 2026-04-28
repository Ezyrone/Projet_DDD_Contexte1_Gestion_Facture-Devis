Feature: Gestion des factures

  Scenario: Génération automatique d'une facture depuis un devis approuvé
    Given un devis approuvé pour "Lucie Martin" d'un montant de 500€
    When le devis est approuvé
    Then une facture est générée avec le statut "Émise"

  Scenario: Une facture est immuable après émission
    Given une facture émise pour "Lucie Martin"
    When on tente de modifier la facture directement
    Then une erreur est levée

  Scenario: Modification d'une facture via avenant
    Given une facture émise pour "Lucie Martin"
    When un avenant est créé pour modifier le montant
    Then une nouvelle version de la facture est générée

  Scenario: Cycle de vie complet d'une facture
    Given une facture émise pour "Lucie Martin"
    When la prestation est réalisée
    Then le statut de la facture est "Réalisée"
    When le paiement total est reçu
    Then le statut de la facture est "Soldée"
    When la facture est clôturée
    Then le statut de la facture est "Clôturée"
