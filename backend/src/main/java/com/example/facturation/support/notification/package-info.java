/**
 * <h2>Supporting Domain — Notification &amp; Envoi</h2>
 * <p>
 * Envoie des notifications aux clients et acteurs du système.
 * Consomme les événements de domaine de Facturation et Paiement.
 * </p>
 *
 * <h3>Règles de dépendance :</h3>
 * <ul>
 *   <li>Peut importer : {@code sharedkernel}</li>
 *   <li>Ne peut PAS importer : {@code core.*}, {@code support.facturation}, {@code support.paiement}, etc.</li>
 *   <li>Communique UNIQUEMENT via les événements de domaine</li>
 * </ul>
 *
 * <h3>Événements consommés :</h3>
 * <ul>
 *   <li>{@code FactureEmise} (depuis {@code support.facturation}) — Customer-Supplier</li>
 *   <li>{@code EcheanceDepassee}, {@code RappelPaiementEnvoye} (depuis {@code support.paiement}) — Customer-Supplier</li>
 * </ul>
 */
package com.example.facturation.support.notification;
