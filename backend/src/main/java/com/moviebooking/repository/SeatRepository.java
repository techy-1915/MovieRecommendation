package com.moviebooking.repository;

import com.moviebooking.model.Seat;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SeatRepository extends JpaRepository<Seat, Long> {

    List<Seat> findByScreen_ScreenId(Long screenId);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT s FROM Seat s WHERE s.screen.screenId = :screenId AND s.seatId IN :seatIds")
    List<Seat> findByScreen_ScreenIdAndSeatIdIn(@Param("screenId") Long screenId,
                                                @Param("seatIds") List<Long> seatIds);
}
