/**
 * <h2>Generic Domain — Import / Export Documentaire</h2>
 * <p>
 * Gère l'import et l'export de documents (devis, factures) dans différents formats.
 * Utilise un ACL (Anti-Corruption Layer) pour communiquer avec les bounded contexts Devis et Facture.
 * </p>
 *
 * <h3>Règles de dépendance :</h3>
 * <ul>
 *   <li>Peut importer : {@code sharedkernel}</li>
 *   <li>Communique avec {@code core.devis} et {@code support.facturation} via ACL uniquement</li>
 * </ul>
 */
package com.example.facturation.generic.document;
