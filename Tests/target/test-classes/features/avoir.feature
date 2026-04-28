Feature: Gestion des avoirs

  Scenario: Création d'un avoir suite à un avenant
    Given une facture émise de 500€ pour "Lucie Martin"
    When un avenant réduit le montant à 400€
    Then un avoir de 100€ est créé

  Scenario: Remboursement d'un avoir
    Given un avoir de 100€ pour "Lucie Martin"
    When le remboursement est déclenché
    Then l'avoir est marqué comme "Remboursé"

  Scenario: Compensation d'un avoir sur une prochaine facture
    Given un avoir de 100€ pour "Lucie Martin"
    And une nouvelle facture de 300€ pour "Lucie Martin"
    When l'avoir est compensé sur la nouvelle facture
    Then le montant restant à payer est de 200€
    And l'avoir est marqué comme "Compensé"

  Scenario: Un avoir ne peut pas être utilisé deux fois
    Given un avoir de 100€ déjà compensé pour "Lucie Martin"
    When on tente d'utiliser l'avoir à nouveau
    Then une erreur est levée
