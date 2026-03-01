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

-- Seats for Screens 5-12 (Delhi screens 5-8, Hyderabad screens 9-12)
INSERT INTO seats (screen_id, row_no, seat_number, seat_type) VALUES
(5,'A',1,'NORMAL'),(5,'A',2,'NORMAL'),(5,'A',3,'NORMAL'),(5,'A',4,'NORMAL'),(5,'A',5,'NORMAL'),
(5,'A',6,'NORMAL'),(5,'A',7,'NORMAL'),(5,'A',8,'NORMAL'),(5,'A',9,'NORMAL'),(5,'A',10,'NORMAL'),
(5,'B',1,'NORMAL'),(5,'B',2,'NORMAL'),(5,'B',3,'NORMAL'),(5,'B',4,'NORMAL'),(5,'B',5,'NORMAL'),
(5,'B',6,'NORMAL'),(5,'B',7,'NORMAL'),(5,'B',8,'NORMAL'),(5,'B',9,'NORMAL'),(5,'B',10,'NORMAL'),
(5,'C',1,'NORMAL'),(5,'C',2,'NORMAL'),(5,'C',3,'NORMAL'),(5,'C',4,'NORMAL'),(5,'C',5,'NORMAL'),
(5,'C',6,'NORMAL'),(5,'C',7,'NORMAL'),(5,'C',8,'NORMAL'),(5,'C',9,'NORMAL'),(5,'C',10,'NORMAL'),
(5,'D',1,'PREMIUM'),(5,'D',2,'PREMIUM'),(5,'D',3,'PREMIUM'),(5,'D',4,'PREMIUM'),(5,'D',5,'PREMIUM'),
(5,'D',6,'PREMIUM'),(5,'D',7,'PREMIUM'),(5,'D',8,'PREMIUM'),(5,'D',9,'PREMIUM'),(5,'D',10,'PREMIUM'),
(5,'E',1,'PREMIUM'),(5,'E',2,'PREMIUM'),(5,'E',3,'PREMIUM'),(5,'E',4,'PREMIUM'),(5,'E',5,'PREMIUM'),
(5,'E',6,'PREMIUM'),(5,'E',7,'PREMIUM'),(5,'E',8,'PREMIUM'),(5,'E',9,'PREMIUM'),(5,'E',10,'PREMIUM'),
(5,'F',1,'PREMIUM'),(5,'F',2,'PREMIUM'),(5,'F',3,'PREMIUM'),(5,'F',4,'PREMIUM'),(5,'F',5,'PREMIUM'),
(5,'F',6,'PREMIUM'),(5,'F',7,'PREMIUM'),(5,'F',8,'PREMIUM'),(5,'F',9,'PREMIUM'),(5,'F',10,'PREMIUM'),
(6,'A',1,'NORMAL'),(6,'A',2,'NORMAL'),(6,'A',3,'NORMAL'),(6,'A',4,'NORMAL'),(6,'A',5,'NORMAL'),
(6,'A',6,'NORMAL'),(6,'A',7,'NORMAL'),(6,'A',8,'NORMAL'),(6,'A',9,'NORMAL'),(6,'A',10,'NORMAL'),
(6,'B',1,'NORMAL'),(6,'B',2,'NORMAL'),(6,'B',3,'NORMAL'),(6,'B',4,'NORMAL'),(6,'B',5,'NORMAL'),
(6,'B',6,'NORMAL'),(6,'B',7,'NORMAL'),(6,'B',8,'NORMAL'),(6,'B',9,'NORMAL'),(6,'B',10,'NORMAL'),
(6,'C',1,'NORMAL'),(6,'C',2,'NORMAL'),(6,'C',3,'NORMAL'),(6,'C',4,'NORMAL'),(6,'C',5,'NORMAL'),
(6,'C',6,'NORMAL'),(6,'C',7,'NORMAL'),(6,'C',8,'NORMAL'),(6,'C',9,'NORMAL'),(6,'C',10,'NORMAL'),
(6,'D',1,'PREMIUM'),(6,'D',2,'PREMIUM'),(6,'D',3,'PREMIUM'),(6,'D',4,'PREMIUM'),(6,'D',5,'PREMIUM'),
(6,'D',6,'PREMIUM'),(6,'D',7,'PREMIUM'),(6,'D',8,'PREMIUM'),(6,'D',9,'PREMIUM'),(6,'D',10,'PREMIUM'),
(6,'E',1,'PREMIUM'),(6,'E',2,'PREMIUM'),(6,'E',3,'PREMIUM'),(6,'E',4,'PREMIUM'),(6,'E',5,'PREMIUM'),
(6,'E',6,'PREMIUM'),(6,'E',7,'PREMIUM'),(6,'E',8,'PREMIUM'),(6,'E',9,'PREMIUM'),(6,'E',10,'PREMIUM'),
(6,'F',1,'PREMIUM'),(6,'F',2,'PREMIUM'),(6,'F',3,'PREMIUM'),(6,'F',4,'PREMIUM'),(6,'F',5,'PREMIUM'),
(6,'F',6,'PREMIUM'),(6,'F',7,'PREMIUM'),(6,'F',8,'PREMIUM'),(6,'F',9,'PREMIUM'),(6,'F',10,'PREMIUM'),
(7,'A',1,'NORMAL'),(7,'A',2,'NORMAL'),(7,'A',3,'NORMAL'),(7,'A',4,'NORMAL'),(7,'A',5,'NORMAL'),
(7,'A',6,'NORMAL'),(7,'A',7,'NORMAL'),(7,'A',8,'NORMAL'),(7,'A',9,'NORMAL'),(7,'A',10,'NORMAL'),
(7,'B',1,'NORMAL'),(7,'B',2,'NORMAL'),(7,'B',3,'NORMAL'),(7,'B',4,'NORMAL'),(7,'B',5,'NORMAL'),
(7,'B',6,'NORMAL'),(7,'B',7,'NORMAL'),(7,'B',8,'NORMAL'),(7,'B',9,'NORMAL'),(7,'B',10,'NORMAL'),
(7,'C',1,'NORMAL'),(7,'C',2,'NORMAL'),(7,'C',3,'NORMAL'),(7,'C',4,'NORMAL'),(7,'C',5,'NORMAL'),
(7,'C',6,'NORMAL'),(7,'C',7,'NORMAL'),(7,'C',8,'NORMAL'),(7,'C',9,'NORMAL'),(7,'C',10,'NORMAL'),
(7,'D',1,'PREMIUM'),(7,'D',2,'PREMIUM'),(7,'D',3,'PREMIUM'),(7,'D',4,'PREMIUM'),(7,'D',5,'PREMIUM'),
(7,'D',6,'PREMIUM'),(7,'D',7,'PREMIUM'),(7,'D',8,'PREMIUM'),(7,'D',9,'PREMIUM'),(7,'D',10,'PREMIUM'),
(7,'E',1,'PREMIUM'),(7,'E',2,'PREMIUM'),(7,'E',3,'PREMIUM'),(7,'E',4,'PREMIUM'),(7,'E',5,'PREMIUM'),
(7,'E',6,'PREMIUM'),(7,'E',7,'PREMIUM'),(7,'E',8,'PREMIUM'),(7,'E',9,'PREMIUM'),(7,'E',10,'PREMIUM'),
(7,'F',1,'PREMIUM'),(7,'F',2,'PREMIUM'),(7,'F',3,'PREMIUM'),(7,'F',4,'PREMIUM'),(7,'F',5,'PREMIUM'),
(7,'F',6,'PREMIUM'),(7,'F',7,'PREMIUM'),(7,'F',8,'PREMIUM'),(7,'F',9,'PREMIUM'),(7,'F',10,'PREMIUM'),
(8,'A',1,'NORMAL'),(8,'A',2,'NORMAL'),(8,'A',3,'NORMAL'),(8,'A',4,'NORMAL'),(8,'A',5,'NORMAL'),
(8,'A',6,'NORMAL'),(8,'A',7,'NORMAL'),(8,'A',8,'NORMAL'),(8,'A',9,'NORMAL'),(8,'A',10,'NORMAL'),
(8,'B',1,'NORMAL'),(8,'B',2,'NORMAL'),(8,'B',3,'NORMAL'),(8,'B',4,'NORMAL'),(8,'B',5,'NORMAL'),
(8,'B',6,'NORMAL'),(8,'B',7,'NORMAL'),(8,'B',8,'NORMAL'),(8,'B',9,'NORMAL'),(8,'B',10,'NORMAL'),
(8,'C',1,'NORMAL'),(8,'C',2,'NORMAL'),(8,'C',3,'NORMAL'),(8,'C',4,'NORMAL'),(8,'C',5,'NORMAL'),
(8,'C',6,'NORMAL'),(8,'C',7,'NORMAL'),(8,'C',8,'NORMAL'),(8,'C',9,'NORMAL'),(8,'C',10,'NORMAL'),
(8,'D',1,'PREMIUM'),(8,'D',2,'PREMIUM'),(8,'D',3,'PREMIUM'),(8,'D',4,'PREMIUM'),(8,'D',5,'PREMIUM'),
(8,'D',6,'PREMIUM'),(8,'D',7,'PREMIUM'),(8,'D',8,'PREMIUM'),(8,'D',9,'PREMIUM'),(8,'D',10,'PREMIUM'),
(8,'E',1,'PREMIUM'),(8,'E',2,'PREMIUM'),(8,'E',3,'PREMIUM'),(8,'E',4,'PREMIUM'),(8,'E',5,'PREMIUM'),
(8,'E',6,'PREMIUM'),(8,'E',7,'PREMIUM'),(8,'E',8,'PREMIUM'),(8,'E',9,'PREMIUM'),(8,'E',10,'PREMIUM'),
(8,'F',1,'PREMIUM'),(8,'F',2,'PREMIUM'),(8,'F',3,'PREMIUM'),(8,'F',4,'PREMIUM'),(8,'F',5,'PREMIUM'),
(8,'F',6,'PREMIUM'),(8,'F',7,'PREMIUM'),(8,'F',8,'PREMIUM'),(8,'F',9,'PREMIUM'),(8,'F',10,'PREMIUM'),
(9,'A',1,'NORMAL'),(9,'A',2,'NORMAL'),(9,'A',3,'NORMAL'),(9,'A',4,'NORMAL'),(9,'A',5,'NORMAL'),
(9,'A',6,'NORMAL'),(9,'A',7,'NORMAL'),(9,'A',8,'NORMAL'),(9,'A',9,'NORMAL'),(9,'A',10,'NORMAL'),
(9,'B',1,'NORMAL'),(9,'B',2,'NORMAL'),(9,'B',3,'NORMAL'),(9,'B',4,'NORMAL'),(9,'B',5,'NORMAL'),
(9,'B',6,'NORMAL'),(9,'B',7,'NORMAL'),(9,'B',8,'NORMAL'),(9,'B',9,'NORMAL'),(9,'B',10,'NORMAL'),
(9,'C',1,'NORMAL'),(9,'C',2,'NORMAL'),(9,'C',3,'NORMAL'),(9,'C',4,'NORMAL'),(9,'C',5,'NORMAL'),
(9,'C',6,'NORMAL'),(9,'C',7,'NORMAL'),(9,'C',8,'NORMAL'),(9,'C',9,'NORMAL'),(9,'C',10,'NORMAL'),
(9,'D',1,'PREMIUM'),(9,'D',2,'PREMIUM'),(9,'D',3,'PREMIUM'),(9,'D',4,'PREMIUM'),(9,'D',5,'PREMIUM'),
(9,'D',6,'PREMIUM'),(9,'D',7,'PREMIUM'),(9,'D',8,'PREMIUM'),(9,'D',9,'PREMIUM'),(9,'D',10,'PREMIUM'),
(9,'E',1,'PREMIUM'),(9,'E',2,'PREMIUM'),(9,'E',3,'PREMIUM'),(9,'E',4,'PREMIUM'),(9,'E',5,'PREMIUM'),
(9,'E',6,'PREMIUM'),(9,'E',7,'PREMIUM'),(9,'E',8,'PREMIUM'),(9,'E',9,'PREMIUM'),(9,'E',10,'PREMIUM'),
(9,'F',1,'PREMIUM'),(9,'F',2,'PREMIUM'),(9,'F',3,'PREMIUM'),(9,'F',4,'PREMIUM'),(9,'F',5,'PREMIUM'),
(9,'F',6,'PREMIUM'),(9,'F',7,'PREMIUM'),(9,'F',8,'PREMIUM'),(9,'F',9,'PREMIUM'),(9,'F',10,'PREMIUM'),
(10,'A',1,'NORMAL'),(10,'A',2,'NORMAL'),(10,'A',3,'NORMAL'),(10,'A',4,'NORMAL'),(10,'A',5,'NORMAL'),
(10,'A',6,'NORMAL'),(10,'A',7,'NORMAL'),(10,'A',8,'NORMAL'),(10,'A',9,'NORMAL'),(10,'A',10,'NORMAL'),
(10,'B',1,'NORMAL'),(10,'B',2,'NORMAL'),(10,'B',3,'NORMAL'),(10,'B',4,'NORMAL'),(10,'B',5,'NORMAL'),
(10,'B',6,'NORMAL'),(10,'B',7,'NORMAL'),(10,'B',8,'NORMAL'),(10,'B',9,'NORMAL'),(10,'B',10,'NORMAL'),
(10,'C',1,'NORMAL'),(10,'C',2,'NORMAL'),(10,'C',3,'NORMAL'),(10,'C',4,'NORMAL'),(10,'C',5,'NORMAL'),
(10,'C',6,'NORMAL'),(10,'C',7,'NORMAL'),(10,'C',8,'NORMAL'),(10,'C',9,'NORMAL'),(10,'C',10,'NORMAL'),
(10,'D',1,'PREMIUM'),(10,'D',2,'PREMIUM'),(10,'D',3,'PREMIUM'),(10,'D',4,'PREMIUM'),(10,'D',5,'PREMIUM'),
(10,'D',6,'PREMIUM'),(10,'D',7,'PREMIUM'),(10,'D',8,'PREMIUM'),(10,'D',9,'PREMIUM'),(10,'D',10,'PREMIUM'),
(10,'E',1,'PREMIUM'),(10,'E',2,'PREMIUM'),(10,'E',3,'PREMIUM'),(10,'E',4,'PREMIUM'),(10,'E',5,'PREMIUM'),
(10,'E',6,'PREMIUM'),(10,'E',7,'PREMIUM'),(10,'E',8,'PREMIUM'),(10,'E',9,'PREMIUM'),(10,'E',10,'PREMIUM'),
(10,'F',1,'PREMIUM'),(10,'F',2,'PREMIUM'),(10,'F',3,'PREMIUM'),(10,'F',4,'PREMIUM'),(10,'F',5,'PREMIUM'),
(10,'F',6,'PREMIUM'),(10,'F',7,'PREMIUM'),(10,'F',8,'PREMIUM'),(10,'F',9,'PREMIUM'),(10,'F',10,'PREMIUM'),
(11,'A',1,'NORMAL'),(11,'A',2,'NORMAL'),(11,'A',3,'NORMAL'),(11,'A',4,'NORMAL'),(11,'A',5,'NORMAL'),
(11,'A',6,'NORMAL'),(11,'A',7,'NORMAL'),(11,'A',8,'NORMAL'),(11,'A',9,'NORMAL'),(11,'A',10,'NORMAL'),
(11,'B',1,'NORMAL'),(11,'B',2,'NORMAL'),(11,'B',3,'NORMAL'),(11,'B',4,'NORMAL'),(11,'B',5,'NORMAL'),
(11,'B',6,'NORMAL'),(11,'B',7,'NORMAL'),(11,'B',8,'NORMAL'),(11,'B',9,'NORMAL'),(11,'B',10,'NORMAL'),
(11,'C',1,'NORMAL'),(11,'C',2,'NORMAL'),(11,'C',3,'NORMAL'),(11,'C',4,'NORMAL'),(11,'C',5,'NORMAL'),
(11,'C',6,'NORMAL'),(11,'C',7,'NORMAL'),(11,'C',8,'NORMAL'),(11,'C',9,'NORMAL'),(11,'C',10,'NORMAL'),
(11,'D',1,'PREMIUM'),(11,'D',2,'PREMIUM'),(11,'D',3,'PREMIUM'),(11,'D',4,'PREMIUM'),(11,'D',5,'PREMIUM'),
(11,'D',6,'PREMIUM'),(11,'D',7,'PREMIUM'),(11,'D',8,'PREMIUM'),(11,'D',9,'PREMIUM'),(11,'D',10,'PREMIUM'),
(11,'E',1,'PREMIUM'),(11,'E',2,'PREMIUM'),(11,'E',3,'PREMIUM'),(11,'E',4,'PREMIUM'),(11,'E',5,'PREMIUM'),
(11,'E',6,'PREMIUM'),(11,'E',7,'PREMIUM'),(11,'E',8,'PREMIUM'),(11,'E',9,'PREMIUM'),(11,'E',10,'PREMIUM'),
(11,'F',1,'PREMIUM'),(11,'F',2,'PREMIUM'),(11,'F',3,'PREMIUM'),(11,'F',4,'PREMIUM'),(11,'F',5,'PREMIUM'),
(11,'F',6,'PREMIUM'),(11,'F',7,'PREMIUM'),(11,'F',8,'PREMIUM'),(11,'F',9,'PREMIUM'),(11,'F',10,'PREMIUM'),
(12,'A',1,'NORMAL'),(12,'A',2,'NORMAL'),(12,'A',3,'NORMAL'),(12,'A',4,'NORMAL'),(12,'A',5,'NORMAL'),
(12,'A',6,'NORMAL'),(12,'A',7,'NORMAL'),(12,'A',8,'NORMAL'),(12,'A',9,'NORMAL'),(12,'A',10,'NORMAL'),
(12,'B',1,'NORMAL'),(12,'B',2,'NORMAL'),(12,'B',3,'NORMAL'),(12,'B',4,'NORMAL'),(12,'B',5,'NORMAL'),
(12,'B',6,'NORMAL'),(12,'B',7,'NORMAL'),(12,'B',8,'NORMAL'),(12,'B',9,'NORMAL'),(12,'B',10,'NORMAL'),
(12,'C',1,'NORMAL'),(12,'C',2,'NORMAL'),(12,'C',3,'NORMAL'),(12,'C',4,'NORMAL'),(12,'C',5,'NORMAL'),
(12,'C',6,'NORMAL'),(12,'C',7,'NORMAL'),(12,'C',8,'NORMAL'),(12,'C',9,'NORMAL'),(12,'C',10,'NORMAL'),
(12,'D',1,'PREMIUM'),(12,'D',2,'PREMIUM'),(12,'D',3,'PREMIUM'),(12,'D',4,'PREMIUM'),(12,'D',5,'PREMIUM'),
(12,'D',6,'PREMIUM'),(12,'D',7,'PREMIUM'),(12,'D',8,'PREMIUM'),(12,'D',9,'PREMIUM'),(12,'D',10,'PREMIUM'),
(12,'E',1,'PREMIUM'),(12,'E',2,'PREMIUM'),(12,'E',3,'PREMIUM'),(12,'E',4,'PREMIUM'),(12,'E',5,'PREMIUM'),
(12,'E',6,'PREMIUM'),(12,'E',7,'PREMIUM'),(12,'E',8,'PREMIUM'),(12,'E',9,'PREMIUM'),(12,'E',10,'PREMIUM'),
(12,'F',1,'PREMIUM'),(12,'F',2,'PREMIUM'),(12,'F',3,'PREMIUM'),(12,'F',4,'PREMIUM'),(12,'F',5,'PREMIUM'),
(12,'F',6,'PREMIUM'),(12,'F',7,'PREMIUM'),(12,'F',8,'PREMIUM'),(12,'F',9,'PREMIUM'),(12,'F',10,'PREMIUM');

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
(1, 4, '2026-03-05 16:00:00', 220.00),
(1, 5, '2026-03-05 10:00:00', 200.00),
(1, 5, '2026-03-05 14:00:00', 200.00),
(1, 6, '2026-03-05 11:00:00', 200.00),
(1, 7, '2026-03-05 10:00:00', 180.00),
(1, 8, '2026-03-05 15:00:00', 220.00),
(1, 9, '2026-03-05 10:00:00', 200.00),
(1, 9, '2026-03-05 13:30:00', 200.00),
(1, 10, '2026-03-05 11:00:00', 200.00),
(1, 11, '2026-03-05 14:00:00', 220.00),
(1, 12, '2026-03-05 16:30:00', 220.00);
