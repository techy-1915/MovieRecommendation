package com.moviebooking.service;

import com.moviebooking.dto.MovieResponse;
import com.moviebooking.exception.ResourceNotFoundException;
import com.moviebooking.model.Movie;
import com.moviebooking.repository.MovieRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class MovieService {

    @Autowired
    private MovieRepository movieRepository;

    public List<MovieResponse> getAllMovies() {
        return movieRepository.findAll().stream()
                .map(this::toMovieResponse)
                .collect(Collectors.toList());
    }

    public MovieResponse getMovieById(Long id) {
        Movie movie = movieRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Movie not found with id: " + id));
        return toMovieResponse(movie);
    }

    public List<MovieResponse> getMoviesByGenre(String genre) {
        return movieRepository.findByGenres_GenreName(genre).stream()
                .map(this::toMovieResponse)
                .collect(Collectors.toList());
    }

    public List<MovieResponse> getMoviesByLanguage(String language) {
        return movieRepository.findByLanguage(language).stream()
                .map(this::toMovieResponse)
                .collect(Collectors.toList());
    }

    public List<MovieResponse> getMoviesByRegion(String region) {
        return movieRepository.findByRegion(region).stream()
                .map(this::toMovieResponse)
                .collect(Collectors.toList());
    }

    public List<MovieResponse> getMoviesByRegionAndLanguage(String region, String language) {
        return movieRepository.findByRegionAndLanguage(region, language).stream()
                .map(this::toMovieResponse)
                .collect(Collectors.toList());
    }

    public List<MovieResponse> getMoviesByCity(String city) {
        return movieRepository.findMoviesByCity(city).stream()
                .map(this::toMovieResponse)
                .collect(Collectors.toList());
    }

    public List<MovieResponse> getTrendingMovies() {
        LocalDateTime since = LocalDateTime.now().minusDays(30);
        List<Movie> trending = movieRepository.findTrendingMovies(since);
        if (trending.isEmpty()) {
            // Fall back to all movies if no trending data
            return getAllMovies();
        }
        return trending.stream()
                .map(this::toMovieResponse)
                .collect(Collectors.toList());
    }

    public MovieResponse toMovieResponse(Movie movie) {
        List<String> genreNames = movie.getGenres().stream()
                .map(g -> g.getGenreName())
                .collect(Collectors.toList());

        return new MovieResponse(
                movie.getMovieId(),
                movie.getTmdbId(),
                movie.getTitle(),
                movie.getDuration(),
                movie.getRating(),
                movie.getLanguage(),
                movie.getReleaseDate(),
                movie.getCertificate(),
                movie.getDescription(),
                movie.getPosterUrl(),
                genreNames,
                movie.getRegion()
        );
    }
}
