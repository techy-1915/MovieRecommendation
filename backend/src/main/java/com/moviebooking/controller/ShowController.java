package com.moviebooking.controller;

import com.moviebooking.dto.ShowDetailsResponse;
import com.moviebooking.dto.ShowResponse;
import com.moviebooking.service.ShowService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/shows")
public class ShowController {

    @Autowired
    private ShowService showService;

    @GetMapping("/{movieId}")
    public ResponseEntity<List<ShowResponse>> getShows(
            @PathVariable Long movieId,
            @RequestParam(required = false) String city) {

        if (StringUtils.hasText(city)) {
            return ResponseEntity.ok(showService.getShowsByMovieAndCity(movieId, city));
        }
        return ResponseEntity.ok(showService.getShowsByMovie(movieId));
    }

    @GetMapping("/detail/{showId}")
    public ResponseEntity<ShowDetailsResponse> getShowDetails(@PathVariable Long showId) {
        return ResponseEntity.ok(showService.getShowById(showId));
    }
}
