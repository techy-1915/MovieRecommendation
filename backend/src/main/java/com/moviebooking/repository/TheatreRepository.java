package com.moviebooking.repository;

import com.moviebooking.model.Theatre;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TheatreRepository extends JpaRepository<Theatre, Long> {

    List<Theatre> findByCity(String city);

    @Query("SELECT DISTINCT s.screen.theatre FROM Show s WHERE s.movie.movieId = :movieId AND s.screen.theatre.city = :city")
    List<Theatre> findByMovieIdAndCity(@Param("movieId") Long movieId, @Param("city") String city);

    @Query("SELECT DISTINCT s.screen.theatre FROM Show s WHERE s.movie.movieId = :movieId")
    List<Theatre> findByMovieId(@Param("movieId") Long movieId);
}
