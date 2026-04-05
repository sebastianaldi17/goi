package com.sebastianaldi17.goibackend.dtos;

import com.sebastianaldi17.goibackend.models.Vocab;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class PaginatedVocabDto {
    private long totalElements;
    private int totalPages;
    private int currentPage;
    private int totalInPage;
    private List<Vocab> vocabs;
}
