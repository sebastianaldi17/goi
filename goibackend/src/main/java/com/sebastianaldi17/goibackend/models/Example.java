package com.sebastianaldi17.goibackend.models;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;

@Entity(name = "examples")
@Data
public class Example {
    @Id
    @GeneratedValue
    @JsonIgnore
    private Long id;

    private String japanese;
    private String english;

    @ManyToOne
    @JoinColumn(name = "vocab_id")
    @JsonBackReference
    private Vocab vocab;
}
