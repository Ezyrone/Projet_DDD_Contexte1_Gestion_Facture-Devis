/**
 * <h2>Core Domain — Gestion des Devis (Négociation &amp; Vente)</h2>
 * <p>
 * Bounded context principal du domaine métier.
 * Gère le cycle de vie complet d'un devis : création, envoi, négociation, approbation, refus, expiration.
 * </p>
 *
 * <h3>Règles de dépendance :</h3>
 * <ul>
 *   <li>Peut importer : {@code sharedkernel}</li>
 *   <li>Ne peut PAS importer : {@code support.*}, {@code generic.*}</li>
 * </ul>
 *
 * <h3>Événements publiés :</h3>
 * <ul>
 *   <li>{@code DevisApprouve} → consommé par {@code support.facturation} (Customer-Supplier)</li>
 *   <li>{@code DevisCree}, {@code DevisEnvoye}, {@code DevisRefuse} → consommés par {@code support.tracabilite}</li>
 * </ul>
 */
package com.example.facturation.core.devis;
