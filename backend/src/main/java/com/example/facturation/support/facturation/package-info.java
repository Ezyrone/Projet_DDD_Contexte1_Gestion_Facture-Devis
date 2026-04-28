/**
 * <h2>Supporting Domain — Facturation</h2>
 * <p>
 * Gère le cycle de vie des factures : émission, annulation, clôture, avenants.
 * </p>
 *
 * <h3>Règles de dépendance :</h3>
 * <ul>
 *   <li>Peut importer : {@code sharedkernel}</li>
 *   <li>Ne peut PAS importer : {@code core.*}, {@code support.paiement}, {@code support.avoir}, etc.</li>
 * </ul>
 *
 * <h3>Événements consommés :</h3>
 * <ul>
 *   <li>{@code DevisApprouve} (depuis {@code core.devis}) → crée une facture</li>
 * </ul>
 *
 * <h3>Événements publiés :</h3>
 * <ul>
 *   <li>{@code FactureEmise} → consommé par {@code support.paiement} (Conformist), {@code support.notification} (Customer-Supplier)</li>
 *   <li>{@code AvenantValide} → consommé par {@code support.avoir} (Customer-Supplier)</li>
 *   <li>{@code FactureAnnulee} → consommé par {@code support.tracabilite}</li>
 * </ul>
 */
package com.example.facturation.support.facturation;
