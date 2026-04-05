package com.sebastianaldi17.goibackend.controllers;

import com.sebastianaldi17.goibackend.dtos.ErrorDto;
import com.sebastianaldi17.goibackend.dtos.PaginatedVocabDto;
import com.sebastianaldi17.goibackend.dtos.VocabDto;
import com.sebastianaldi17.goibackend.models.Vocab;
import com.sebastianaldi17.goibackend.services.VocabService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@CrossOrigin(origins = "*")
public class VocabController {
    private final VocabService vocabService;

    public VocabController(VocabService vocabService) {
        this.vocabService = vocabService;
    }

    @GetMapping(path = "/vocabs/{id}")
    public ResponseEntity<Object> getVocabByID(
            @PathVariable("id") long id
    ) {
        Optional<Vocab> vocab = vocabService.getVocabByID(id);
        return vocab.<ResponseEntity<Object>>map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ErrorDto("vocab not found")));
    }

    @GetMapping(path = "/vocabs/{level}/list")
    public ResponseEntity<Object> getVocabsByLevel(
        @PathVariable("level") String level,
        @RequestParam(defaultValue = "10") int count,
        @RequestParam(defaultValue = "0") int page
    ) {
        if (page < 0) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ErrorDto("page should be at least 0"));
        }

        if (count <= 0) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ErrorDto("count should be at least 1"));
        }

        if (count > 20) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ErrorDto("count is limited to 20"));
        }

        Pageable pageable = PageRequest.of(page, count, Sort.by("id"));
        Page<Vocab> vocabs = vocabService.listByLevel(level, pageable);
        List<Vocab> vocabList = vocabs.toList();
        PaginatedVocabDto response = new PaginatedVocabDto(vocabs.getTotalElements(), vocabs.getTotalPages(), page, vocabList.size(), vocabList);
        return ResponseEntity.ok(response);
    }

    @GetMapping(path = "/vocabs/counts")
    public ResponseEntity<Object> getCounts() {
        return ResponseEntity.ok(vocabService.getCounts());
    }

    @GetMapping(path = "/vocabs/{level}/random")
    public ResponseEntity<Object> getRandomVocabsByLevel(
            @PathVariable("level") String level,
            @RequestParam(defaultValue = "20") long count
    ) {
        if (count <= 0) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ErrorDto("count should be at least 1"));
        }

        if (count > 20) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ErrorDto("count is limited to 20"));
        }

        List<Vocab> vocabs = vocabService.randomListByLevel(level, count);
        VocabDto response = new VocabDto((long) vocabs.size(), vocabs);
        return ResponseEntity.ok(response);
    }
}
