package com.sebastianaldi17.goibackend.controllers;

import com.sebastianaldi17.goibackend.dtos.VocabDto;
import com.sebastianaldi17.goibackend.models.Vocab;
import com.sebastianaldi17.goibackend.services.VocabService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class VocabController {
    private final VocabService vocabService;

    public VocabController(VocabService vocabService) {
        this.vocabService = vocabService;
    }

    @GetMapping(path = "/vocabs/{level}")
    public ResponseEntity<VocabDto> getVocabsByLevel(
            @PathVariable("level") String level
    ) {
        List<Vocab> vocabs = vocabService.randomListByLevel(level);
        VocabDto response = new VocabDto((long) vocabs.size(), vocabs);
        return ResponseEntity.ok(response);
    }
}
