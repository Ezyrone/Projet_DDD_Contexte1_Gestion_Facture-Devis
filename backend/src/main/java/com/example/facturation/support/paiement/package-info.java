/**
 * <h2>Supporting Domain — Paiements &amp; Relances (Trésorerie &amp; Recouvrement)</h2>
 * <p>
 * Gère les paiements, échéanciers et relances liés aux factures.
 * </p>
 *
 * <h3>Règles de dépendance :</h3>
 * <ul>
 *   <li>Peut importer : {@code sharedkernel}</li>
 *   <li>Ne peut PAS importer : {@code core.*}, {@code support.facturation}, etc.</li>
 * </ul>
 *
 * <h3>Événements consommés :</h3>
 * <ul>
 *   <li>{@code FactureEmise} (depuis {@code support.facturation}) — Conformist</li>
 *   <li>{@code AvoirCompense}, {@code AvoirRembourse} (depuis {@code support.avoir}) — Domain Events</li>
 * </ul>
 *
 * <h3>Événements publiés :</h3>
 * <ul>
 *   <li>{@code EcheanceDepassee}, {@code RappelPaiementEnvoye} → consommés par {@code support.notification}</li>
 * </ul>
 */
package com.example.facturation.support.paiement;
