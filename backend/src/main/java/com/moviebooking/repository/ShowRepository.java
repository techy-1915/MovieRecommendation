package com.moviebooking.repository;

import com.moviebooking.model.Show;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ShowRepository extends JpaRepository<Show, Long> {

    List<Show> findByMovie_MovieId(Long movieId);

    List<Show> findByMovie_MovieIdAndScreen_Theatre_City(Long movieId, String city);

    boolean existsByMovie_MovieIdAndScreen_ScreenIdAndShowTime(Long movieId, Long screenId, LocalDateTime showTime);
}
