package com.example.facturation.presentation.tracabilite;

import com.example.facturation.support.tracabilite.application.TracabiliteService;
import com.example.facturation.support.tracabilite.domain.model.EvenementDomaine;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/traces")
@RequiredArgsConstructor
public class TracabiliteController {

    private final TracabiliteService tracabiliteService;

    @GetMapping
    public List<EvenementDomaine> all() {
        return tracabiliteService.listerTousEvenements();
    }

    @GetMapping("/{documentId}")
    public List<EvenementDomaine> byDocument(@PathVariable String documentId) {
        return tracabiliteService.listerEvenementsParDocument(documentId);
    }
}
