package com.example.facturation.sharedkernel.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * Shared Kernel — Value Object Devise.
 * Représente une devise monétaire (EUR, USD, etc.).
 */
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class Devise {

    private String code;
    private String symbole;
}
