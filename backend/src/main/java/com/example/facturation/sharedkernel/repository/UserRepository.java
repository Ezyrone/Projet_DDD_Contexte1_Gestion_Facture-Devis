package com.example.facturation.sharedkernel.repository;

import com.example.facturation.sharedkernel.model.User;

import java.util.Optional;
import java.util.UUID;

/**
 * Shared Kernel — Port de persistance pour les utilisateurs.
 */
public interface UserRepository {

    Optional<User> findById(UUID id);

    User save(User user);

    void deleteById(UUID id);
}
