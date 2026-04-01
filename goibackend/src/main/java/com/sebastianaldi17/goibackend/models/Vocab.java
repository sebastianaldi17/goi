package com.sebastianaldi17.goibackend.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;

import lombok.Data;

import java.util.List;

@Entity(name = "vocabs")
@Data
public class Vocab {
    @Id
    @GeneratedValue
    @JsonIgnore
    private Long id;

    private String kanji;
    private String kana;
    private String level;

    @OneToMany(mappedBy = "vocab")
    @JsonManagedReference
    private List<Example> examples;

    @OneToMany(mappedBy = "vocab")
    @JsonManagedReference
    private List<Definition> definitions;
}
