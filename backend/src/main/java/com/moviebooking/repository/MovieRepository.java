package com.moviebooking.repository;

import com.moviebooking.model.Movie;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface MovieRepository extends JpaRepository<Movie, Long> {

    Optional<Movie> findByTmdbId(Integer tmdbId);

    List<Movie> findByGenres_GenreName(String genreName);

    List<Movie> findByLanguage(String language);

    @Query("SELECT DISTINCT m FROM Movie m JOIN m.shows s JOIN s.screen sc JOIN sc.theatre t WHERE t.city = :city")
    List<Movie> findMoviesByCity(@Param("city") String city);

    @Query("SELECT m FROM Movie m JOIN Booking b ON b.show.movie = m WHERE b.bookingTime >= :since GROUP BY m ORDER BY COUNT(b) DESC")
    List<Movie> findTrendingMovies(@Param("since") LocalDateTime since);
}
