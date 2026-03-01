package com.moviebooking.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TheatreWithShowsResponse {

    private Long theatreId;
    private String theatreName;
    private String city;
    private String address;
    private List<ShowSummaryResponse> shows;
    private Double distanceInKm;
    private Double latitude;
    private Double longitude;
}
