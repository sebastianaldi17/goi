package com.sebastianaldi17.goibackend.services;

import com.sebastianaldi17.goibackend.models.Vocab;
import com.sebastianaldi17.goibackend.repositories.VocabRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Random;

@Service
public class VocabService {
    @Autowired
    private VocabRepository vocabRepository;

    public List<Vocab> randomListByLevel(String level) {
        Long minId = vocabRepository.findMinIdByLevel(level);
        if (minId == null) {
            return new ArrayList<Vocab>();
        }

        Long maxId = vocabRepository.findMaxIdByLevel(level);
        if (maxId == null) {
            return new ArrayList<Vocab>();
        }

        long count = 20L; // TODO: set this as query parameter with predefined maximum

        Random random = new Random();
        Long randomSeed = minId + (long) (random.nextDouble() * (maxId - minId));

        List<Vocab> vocabs = vocabRepository.findRandomByLevel(level, randomSeed, count);
        if (vocabs.size() < count) {
            List<Vocab> additionalVocabs = vocabRepository.findRandomByLevelWrapAround(level, randomSeed, count - vocabs.size());
            vocabs.addAll(additionalVocabs);
        }
        return vocabs;
    }
}
