package com.moviebooking.service;

import com.moviebooking.dto.ShowResponse;
import com.moviebooking.model.Show;
import com.moviebooking.repository.ShowRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ShowService {

    @Autowired
    private ShowRepository showRepository;

    public List<ShowResponse> getShowsByMovie(Long movieId) {
        return showRepository.findByMovie_MovieId(movieId).stream()
                .map(this::toShowResponse)
                .collect(Collectors.toList());
    }

    public List<ShowResponse> getShowsByMovieAndCity(Long movieId, String city) {
        return showRepository.findByMovie_MovieIdAndScreen_Theatre_City(movieId, city).stream()
                .map(this::toShowResponse)
                .collect(Collectors.toList());
    }

    private ShowResponse toShowResponse(Show show) {
        return new ShowResponse(
                show.getShowId(),
                show.getShowTime(),
                show.getPrice(),
                show.getScreen().getScreenName(),
                show.getScreen().getTheatre().getTheatreName(),
                show.getScreen().getTheatre().getCity()
        );
    }
}
