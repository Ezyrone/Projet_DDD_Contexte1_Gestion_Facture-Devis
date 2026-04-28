/**
 * <h2>Shared Kernel — Catalogue &amp; Tiers</h2>
 * <p>
 * Module partagé entre tous les bounded contexts.
 * Contient les entités communes : User, Produit, Taxe, Devise.
 * </p>
 *
 * <h3>Règles de dépendance :</h3>
 * <ul>
 *   <li>Peut être importé par TOUS les modules</li>
 *   <li>Ne doit importer AUCUN autre module</li>
 * </ul>
 */
package com.example.facturation.sharedkernel;
