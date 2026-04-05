package com.sebastianaldi17.goibackend.services;

import com.sebastianaldi17.goibackend.dtos.VocabCountByLevelDto;
import com.sebastianaldi17.goibackend.models.Vocab;
import com.sebastianaldi17.goibackend.repositories.VocabRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class VocabService {
    @Autowired
    private VocabRepository vocabRepository;

    public List<Vocab> randomListByLevel(String level, long count) {
        List<Vocab> vocabs = vocabRepository.findRandomByLevel(level, count);
        if (vocabs.size() < count) {
            List<Vocab> additionalVocabs = vocabRepository.findRandomByLevel(level, count);
            vocabs.addAll(additionalVocabs);
        }
        return vocabs;
    }

    public Page<Vocab> listByLevel(String level, Pageable pageable) {
        return vocabRepository.findByLevel(level, pageable);
    }

    public List<VocabCountByLevelDto> getCounts() {
        return vocabRepository.findGroupedCount();
    }

    public Optional<Vocab> getVocabByID(long id) {
        return vocabRepository.findById(id);
    }
}
