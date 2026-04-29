package com.example.facturation.support.tracabilite.infrastructure;

import com.example.facturation.support.tracabilite.domain.model.EvenementDomaine;
import com.example.facturation.support.tracabilite.domain.repository.EvenementDomaineRepository;
import org.springframework.stereotype.Repository;

import java.util.*;

@Repository
public class InMemoryEvenementDomaineRepository implements EvenementDomaineRepository {

    private final Map<UUID, EvenementDomaine> storage = new HashMap<>();

    @Override
    public Optional<EvenementDomaine> findById(UUID id) {
        return Optional.ofNullable(storage.get(id));
    }

    @Override
    public List<EvenementDomaine> findAll() {
        return new ArrayList<>(storage.values());
    }

    @Override
    public EvenementDomaine save(EvenementDomaine evenement) {
        storage.put(evenement.getId(), evenement);
        return evenement;
    }

    @Override
    public List<EvenementDomaine> findByDocumentId(String documentId) {
        return storage.values()
                .stream()
                .filter(e -> e.getDocumentId() != null
                        && e.getDocumentId().equals(documentId))
                .sorted(Comparator.comparing(EvenementDomaine::getHorodatage))
                .toList();
    }
}
