package com.sebastianaldi17.goibackend.repositories;

import com.sebastianaldi17.goibackend.models.Vocab;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VocabRepository extends JpaRepository<Vocab, Long> {
    @Query("SELECT MIN(v.id) FROM vocabs v WHERE v.level = :level")
    Long findMinIdByLevel(
            @Param("level") String level
    );

    @Query("SELECT MAX(v.id) FROM vocabs v WHERE v.level = :level")
    Long findMaxIdByLevel(
            @Param("level") String level
    );

    @Query("""
            SELECT v
            FROM vocabs v
            WHERE v.level = :level
            AND v.id >= :randomId
            LIMIT :count
            """)
    List<Vocab> findRandomByLevel(
            @Param("level") String level,
            @Param("randomId") Long randomId,
            @Param("count") Long count
    );

    @Query("""
            SELECT v
            FROM vocabs v
            WHERE v.level = :level
            AND v.id < :randomId
            LIMIT :count
            """)
    List<Vocab> findRandomByLevelWrapAround(
            @Param("level") String level,
            @Param("randomId") Long randomId,
            @Param("count") Long count
    );
}