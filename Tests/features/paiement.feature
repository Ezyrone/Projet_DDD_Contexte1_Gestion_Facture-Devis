Feature: Gestion des paiements

  Scenario: Paiement total d'une facture
    Given une facture émise de 500€ pour "Lucie Martin"
    When un paiement de 500€ est enregistré
    Then le statut de la facture est "Soldée"
    And le reste à charge est de 0€

  Scenario: Paiement partiel d'une facture
    Given une facture émise de 500€ pour "Lucie Martin"
    When un paiement de 200€ est enregistré
    Then le statut de la facture est "Partiellement payée"
    And le reste à charge est de 300€

  Scenario: Déclenchement automatique d'une relance en cas de retard
    Given une facture émise de 500€ pour "Lucie Martin"
    And la date d'échéance est dépassée
    When le système vérifie les échéances
    Then une relance est envoyée à "Lucie Martin"

  Scenario: Mise en demeure après plusieurs relances sans réponse
    Given une facture en retard pour "Lucie Martin"
    And 3 relances ont déjà été envoyées sans réponse
    When le système vérifie les relances
    Then une mise en demeure est émise
