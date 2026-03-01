package com.moviebooking.controller;

import com.moviebooking.model.Theatre;
import com.moviebooking.repository.TheatreRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/theatres")
public class TheatreController {

    @Autowired
    private TheatreRepository theatreRepository;

    @GetMapping
    public ResponseEntity<List<Theatre>> getTheatres(
            @RequestParam(required = false) String city) {

        if (StringUtils.hasText(city)) {
            return ResponseEntity.ok(theatreRepository.findByCity(city));
        }
        return ResponseEntity.ok(theatreRepository.findAll());
    }

    @GetMapping("/{movieId}")
    public ResponseEntity<List<Theatre>> getTheatresByMovie(
            @PathVariable Long movieId,
            @RequestParam(required = false) String city) {

        if (StringUtils.hasText(city)) {
            return ResponseEntity.ok(theatreRepository.findByMovieIdAndCity(movieId, city));
        }
        return ResponseEntity.ok(theatreRepository.findByMovieId(movieId));
    }
}
