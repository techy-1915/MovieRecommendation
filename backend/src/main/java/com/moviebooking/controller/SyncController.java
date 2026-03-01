package com.moviebooking.controller;

import com.moviebooking.service.TMDBService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/sync")
public class SyncController {

    @Autowired
    private TMDBService tmdbService;

    @PostMapping("/genres")
    public ResponseEntity<Map<String, String>> syncGenres() {
        tmdbService.syncGenres();
        return ResponseEntity.ok(Map.of("message", "Genre sync initiated"));
    }

    @PostMapping("/movies")
    public ResponseEntity<Map<String, String>> syncMovies() {
        tmdbService.syncMovies();
        return ResponseEntity.ok(Map.of("message", "Movie sync initiated"));
    }
}
