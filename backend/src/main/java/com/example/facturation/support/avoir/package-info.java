/**
 * <h2>Supporting Domain — Gestion des Avoirs</h2>
 * <p>
 * Gère le cycle de vie des avoirs : compensation, remboursement, expiration.
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
 *   <li>{@code AvenantValide} (depuis {@code support.facturation}) — Customer-Supplier</li>
 * </ul>
 *
 * <h3>Événements publiés :</h3>
 * <ul>
 *   <li>{@code AvoirCompense}, {@code AvoirRembourse} → consommés par {@code support.paiement}</li>
 * </ul>
 */
package com.example.facturation.support.avoir;
