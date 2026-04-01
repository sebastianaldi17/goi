package com.sebastianaldi17.goibackend.repositories;

import com.sebastianaldi17.goibackend.models.Definition;
import com.sebastianaldi17.goibackend.models.Vocab;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface DefinitionRepository extends JpaRepository<Definition, Long> {

}