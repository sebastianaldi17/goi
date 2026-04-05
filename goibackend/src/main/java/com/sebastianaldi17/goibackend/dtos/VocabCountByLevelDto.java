package com.sebastianaldi17.goibackend.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class VocabCountByLevelDto {
    private String level;
    private long count;
}
