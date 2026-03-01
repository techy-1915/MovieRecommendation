package com.moviebooking.controller;

import com.moviebooking.dto.SeatResponse;
import com.moviebooking.service.SeatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/seats")
public class SeatController {

    @Autowired
    private SeatService seatService;

    @GetMapping("/{showId}")
    public ResponseEntity<List<SeatResponse>> getSeatsForShow(@PathVariable Long showId) {
        return ResponseEntity.ok(seatService.getSeatsForShow(showId));
    }
}
