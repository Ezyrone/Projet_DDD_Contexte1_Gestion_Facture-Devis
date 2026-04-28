package com.example.facturation.sharedkernel.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.UUID;

/**
 * Shared Kernel — Entité User.
 * Représente un utilisateur partagé entre les bounded contexts (Devis, Facturation, etc.).
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class User {

    private UUID id;
    private String nom;
    private String prenom;
    private String email;
    private String adresse;
    private TypeUser type;
}
