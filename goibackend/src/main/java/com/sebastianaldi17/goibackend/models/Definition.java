package com.sebastianaldi17.goibackend.models;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;

@Entity(name = "definitions")
@Data
public class Definition {
    @Id
    @GeneratedValue
    @JsonIgnore
    private Long id;

    private String[] parts_of_speech;
    private String[] meanings;
    private String[] tags;

    @ManyToOne
    @JoinColumn(name = "vocab_id")
    @JsonBackReference
    private Vocab vocab;
}
