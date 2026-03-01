-- ============================================================
-- Sample Data for Movie Booking Application
-- Note: Movies will be loaded from TMDB sync
-- ============================================================

-- Theatres
INSERT INTO theatres (theatre_name, city, address) VALUES
('PVR Cinemas Phoenix',  'Mumbai',    'Phoenix Marketcity, Kurla West, Mumbai 400070'),
('INOX R-City',          'Mumbai',    'R City Mall, LBS Marg, Ghatkopar, Mumbai 400086'),
('PVR Select Citywalk',  'Delhi',     'Select Citywalk Mall, Saket, New Delhi 110017'),
('DT Cinemas Saket',     'Delhi',     'DT Mega Mall, Saket District Centre, New Delhi 110017'),
('PVR INOX Hyderabad',   'Hyderabad', 'GVK One Mall, Road No 1, Banjara Hills, Hyderabad 500034'),
('Cinepolis Hyderabad',  'Hyderabad', 'Inorbit Mall, HITEC City, Hyderabad 500081');

-- Screens for Mumbai theatres
INSERT INTO screens (theatre_id, screen_name, total_seats) VALUES
(1, 'Screen 1', 60),
(1, 'Screen 2', 60),
(2, 'Screen 1', 60),
(2, 'Screen 2', 60);

-- Screens for Delhi theatres
INSERT INTO screens (theatre_id, screen_name, total_seats) VALUES
(3, 'Screen 1', 60),
(3, 'Screen 2', 60),
(4, 'Screen 1', 60),
(4, 'Screen 2', 60);

-- Screens for Hyderabad theatres
INSERT INTO screens (theatre_id, screen_name, total_seats) VALUES
(5, 'Screen 1', 60),
(5, 'Screen 2', 60),
(6, 'Screen 1', 60),
(6, 'Screen 2', 60);

-- Seats for Screen 1 (screen_id=1): rows A-F, 10 seats each
-- Rows A-C: NORMAL, Rows D-F: PREMIUM
INSERT INTO seats (screen_id, row_no, seat_number, seat_type) VALUES
(1,'A',1,'NORMAL'),(1,'A',2,'NORMAL'),(1,'A',3,'NORMAL'),(1,'A',4,'NORMAL'),(1,'A',5,'NORMAL'),
(1,'A',6,'NORMAL'),(1,'A',7,'NORMAL'),(1,'A',8,'NORMAL'),(1,'A',9,'NORMAL'),(1,'A',10,'NORMAL'),
(1,'B',1,'NORMAL'),(1,'B',2,'NORMAL'),(1,'B',3,'NORMAL'),(1,'B',4,'NORMAL'),(1,'B',5,'NORMAL'),
(1,'B',6,'NORMAL'),(1,'B',7,'NORMAL'),(1,'B',8,'NORMAL'),(1,'B',9,'NORMAL'),(1,'B',10,'NORMAL'),
(1,'C',1,'NORMAL'),(1,'C',2,'NORMAL'),(1,'C',3,'NORMAL'),(1,'C',4,'NORMAL'),(1,'C',5,'NORMAL'),
(1,'C',6,'NORMAL'),(1,'C',7,'NORMAL'),(1,'C',8,'NORMAL'),(1,'C',9,'NORMAL'),(1,'C',10,'NORMAL'),
(1,'D',1,'PREMIUM'),(1,'D',2,'PREMIUM'),(1,'D',3,'PREMIUM'),(1,'D',4,'PREMIUM'),(1,'D',5,'PREMIUM'),
(1,'D',6,'PREMIUM'),(1,'D',7,'PREMIUM'),(1,'D',8,'PREMIUM'),(1,'D',9,'PREMIUM'),(1,'D',10,'PREMIUM'),
(1,'E',1,'PREMIUM'),(1,'E',2,'PREMIUM'),(1,'E',3,'PREMIUM'),(1,'E',4,'PREMIUM'),(1,'E',5,'PREMIUM'),
(1,'E',6,'PREMIUM'),(1,'E',7,'PREMIUM'),(1,'E',8,'PREMIUM'),(1,'E',9,'PREMIUM'),(1,'E',10,'PREMIUM'),
(1,'F',1,'PREMIUM'),(1,'F',2,'PREMIUM'),(1,'F',3,'PREMIUM'),(1,'F',4,'PREMIUM'),(1,'F',5,'PREMIUM'),
(1,'F',6,'PREMIUM'),(1,'F',7,'PREMIUM'),(1,'F',8,'PREMIUM'),(1,'F',9,'PREMIUM'),(1,'F',10,'PREMIUM');

-- Seats for Screen 2 (screen_id=2)
INSERT INTO seats (screen_id, row_no, seat_number, seat_type) VALUES
(2,'A',1,'NORMAL'),(2,'A',2,'NORMAL'),(2,'A',3,'NORMAL'),(2,'A',4,'NORMAL'),(2,'A',5,'NORMAL'),
(2,'A',6,'NORMAL'),(2,'A',7,'NORMAL'),(2,'A',8,'NORMAL'),(2,'A',9,'NORMAL'),(2,'A',10,'NORMAL'),
(2,'B',1,'NORMAL'),(2,'B',2,'NORMAL'),(2,'B',3,'NORMAL'),(2,'B',4,'NORMAL'),(2,'B',5,'NORMAL'),
(2,'B',6,'NORMAL'),(2,'B',7,'NORMAL'),(2,'B',8,'NORMAL'),(2,'B',9,'NORMAL'),(2,'B',10,'NORMAL'),
(2,'C',1,'NORMAL'),(2,'C',2,'NORMAL'),(2,'C',3,'NORMAL'),(2,'C',4,'NORMAL'),(2,'C',5,'NORMAL'),
(2,'C',6,'NORMAL'),(2,'C',7,'NORMAL'),(2,'C',8,'NORMAL'),(2,'C',9,'NORMAL'),(2,'C',10,'NORMAL'),
(2,'D',1,'PREMIUM'),(2,'D',2,'PREMIUM'),(2,'D',3,'PREMIUM'),(2,'D',4,'PREMIUM'),(2,'D',5,'PREMIUM'),
(2,'D',6,'PREMIUM'),(2,'D',7,'PREMIUM'),(2,'D',8,'PREMIUM'),(2,'D',9,'PREMIUM'),(2,'D',10,'PREMIUM'),
(2,'E',1,'PREMIUM'),(2,'E',2,'PREMIUM'),(2,'E',3,'PREMIUM'),(2,'E',4,'PREMIUM'),(2,'E',5,'PREMIUM'),
(2,'E',6,'PREMIUM'),(2,'E',7,'PREMIUM'),(2,'E',8,'PREMIUM'),(2,'E',9,'PREMIUM'),(2,'E',10,'PREMIUM'),
(2,'F',1,'PREMIUM'),(2,'F',2,'PREMIUM'),(2,'F',3,'PREMIUM'),(2,'F',4,'PREMIUM'),(2,'F',5,'PREMIUM'),
(2,'F',6,'PREMIUM'),(2,'F',7,'PREMIUM'),(2,'F',8,'PREMIUM'),(2,'F',9,'PREMIUM'),(2,'F',10,'PREMIUM');

-- Seats for Screens 3-12 (same pattern)
INSERT INTO seats (screen_id, row_no, seat_number, seat_type) VALUES
(3,'A',1,'NORMAL'),(3,'A',2,'NORMAL'),(3,'A',3,'NORMAL'),(3,'A',4,'NORMAL'),(3,'A',5,'NORMAL'),
(3,'A',6,'NORMAL'),(3,'A',7,'NORMAL'),(3,'A',8,'NORMAL'),(3,'A',9,'NORMAL'),(3,'A',10,'NORMAL'),
(3,'B',1,'NORMAL'),(3,'B',2,'NORMAL'),(3,'B',3,'NORMAL'),(3,'B',4,'NORMAL'),(3,'B',5,'NORMAL'),
(3,'B',6,'NORMAL'),(3,'B',7,'NORMAL'),(3,'B',8,'NORMAL'),(3,'B',9,'NORMAL'),(3,'B',10,'NORMAL'),
(3,'C',1,'NORMAL'),(3,'C',2,'NORMAL'),(3,'C',3,'NORMAL'),(3,'C',4,'NORMAL'),(3,'C',5,'NORMAL'),
(3,'C',6,'NORMAL'),(3,'C',7,'NORMAL'),(3,'C',8,'NORMAL'),(3,'C',9,'NORMAL'),(3,'C',10,'NORMAL'),
(3,'D',1,'PREMIUM'),(3,'D',2,'PREMIUM'),(3,'D',3,'PREMIUM'),(3,'D',4,'PREMIUM'),(3,'D',5,'PREMIUM'),
(3,'D',6,'PREMIUM'),(3,'D',7,'PREMIUM'),(3,'D',8,'PREMIUM'),(3,'D',9,'PREMIUM'),(3,'D',10,'PREMIUM'),
(3,'E',1,'PREMIUM'),(3,'E',2,'PREMIUM'),(3,'E',3,'PREMIUM'),(3,'E',4,'PREMIUM'),(3,'E',5,'PREMIUM'),
(3,'E',6,'PREMIUM'),(3,'E',7,'PREMIUM'),(3,'E',8,'PREMIUM'),(3,'E',9,'PREMIUM'),(3,'E',10,'PREMIUM'),
(3,'F',1,'PREMIUM'),(3,'F',2,'PREMIUM'),(3,'F',3,'PREMIUM'),(3,'F',4,'PREMIUM'),(3,'F',5,'PREMIUM'),
(3,'F',6,'PREMIUM'),(3,'F',7,'PREMIUM'),(3,'F',8,'PREMIUM'),(3,'F',9,'PREMIUM'),(3,'F',10,'PREMIUM'),

(4,'A',1,'NORMAL'),(4,'A',2,'NORMAL'),(4,'A',3,'NORMAL'),(4,'A',4,'NORMAL'),(4,'A',5,'NORMAL'),
(4,'A',6,'NORMAL'),(4,'A',7,'NORMAL'),(4,'A',8,'NORMAL'),(4,'A',9,'NORMAL'),(4,'A',10,'NORMAL'),
(4,'B',1,'NORMAL'),(4,'B',2,'NORMAL'),(4,'B',3,'NORMAL'),(4,'B',4,'NORMAL'),(4,'B',5,'NORMAL'),
(4,'B',6,'NORMAL'),(4,'B',7,'NORMAL'),(4,'B',8,'NORMAL'),(4,'B',9,'NORMAL'),(4,'B',10,'NORMAL'),
(4,'C',1,'NORMAL'),(4,'C',2,'NORMAL'),(4,'C',3,'NORMAL'),(4,'C',4,'NORMAL'),(4,'C',5,'NORMAL'),
(4,'C',6,'NORMAL'),(4,'C',7,'NORMAL'),(4,'C',8,'NORMAL'),(4,'C',9,'NORMAL'),(4,'C',10,'NORMAL'),
(4,'D',1,'PREMIUM'),(4,'D',2,'PREMIUM'),(4,'D',3,'PREMIUM'),(4,'D',4,'PREMIUM'),(4,'D',5,'PREMIUM'),
(4,'D',6,'PREMIUM'),(4,'D',7,'PREMIUM'),(4,'D',8,'PREMIUM'),(4,'D',9,'PREMIUM'),(4,'D',10,'PREMIUM'),
(4,'E',1,'PREMIUM'),(4,'E',2,'PREMIUM'),(4,'E',3,'PREMIUM'),(4,'E',4,'PREMIUM'),(4,'E',5,'PREMIUM'),
(4,'E',6,'PREMIUM'),(4,'E',7,'PREMIUM'),(4,'E',8,'PREMIUM'),(4,'E',9,'PREMIUM'),(4,'E',10,'PREMIUM'),
(4,'F',1,'PREMIUM'),(4,'F',2,'PREMIUM'),(4,'F',3,'PREMIUM'),(4,'F',4,'PREMIUM'),(4,'F',5,'PREMIUM'),
(4,'F',6,'PREMIUM'),(4,'F',7,'PREMIUM'),(4,'F',8,'PREMIUM'),(4,'F',9,'PREMIUM'),(4,'F',10,'PREMIUM');

-- Sample shows with future dates (screens 1-4, placeholder movie_id=1 - update after TMDB sync)
-- These are placeholder shows; update movie_id after syncing movies from TMDB
INSERT INTO shows (movie_id, screen_id, show_time, price) VALUES
(1, 1, '2026-03-05 10:00:00', 200.00),
(1, 1, '2026-03-05 13:30:00', 200.00),
(1, 1, '2026-03-05 17:00:00', 250.00),
(1, 2, '2026-03-05 11:00:00', 200.00),
(1, 2, '2026-03-05 14:30:00', 200.00),
(1, 3, '2026-03-05 10:30:00', 180.00),
(1, 3, '2026-03-05 14:00:00', 180.00),
(1, 4, '2026-03-05 16:00:00', 220.00);
