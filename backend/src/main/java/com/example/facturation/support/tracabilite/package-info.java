/**
 * <h2>Supporting Domain — Traçabilité &amp; Preuve</h2>
 * <p>
 * Journalise TOUS les événements de domaine de l'application.
 * Fournit un audit trail complet.
 * </p>
 *
 * <h3>Règles de dépendance :</h3>
 * <ul>
 *   <li>Peut importer : {@code sharedkernel}</li>
 *   <li>Ne peut PAS importer les classes internes des autres modules</li>
 *   <li>Consomme UNIQUEMENT les événements de domaine</li>
 * </ul>
 *
 * <h3>Événements consommés :</h3>
 * <ul>
 *   <li>TOUS les événements de domaine de tous les bounded contexts</li>
 * </ul>
 */
package com.example.facturation.support.tracabilite;
