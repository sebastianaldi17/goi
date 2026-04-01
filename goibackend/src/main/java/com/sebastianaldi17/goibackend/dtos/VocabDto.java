package com.sebastianaldi17.goibackend.dtos;

import com.sebastianaldi17.goibackend.models.Vocab;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class VocabDto {
    private Long size;
    private List<Vocab> vocabs;
}
