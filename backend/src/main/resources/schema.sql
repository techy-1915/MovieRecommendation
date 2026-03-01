CREATE TABLE IF NOT EXISTS users (
    user_id    BIGINT AUTO_INCREMENT PRIMARY KEY,
    name       VARCHAR(100),
    email      VARCHAR(150) UNIQUE NOT NULL,
    password   VARCHAR(255) NOT NULL,
    phone      VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS movies (
    movie_id     BIGINT AUTO_INCREMENT PRIMARY KEY,
    tmdb_id      INT UNIQUE NOT NULL,
    title        VARCHAR(255) NOT NULL,
    duration     INT,
    rating       DECIMAL(3,1),
    language     VARCHAR(50),
    release_date DATE,
    certificate  VARCHAR(20),
    description  TEXT,
    poster_url   VARCHAR(500)
);

CREATE TABLE IF NOT EXISTS genres (
    genre_id   BIGINT AUTO_INCREMENT PRIMARY KEY,
    genre_name VARCHAR(100) UNIQUE
);

CREATE TABLE IF NOT EXISTS movie_genres (
    movie_id BIGINT NOT NULL,
    genre_id BIGINT NOT NULL,
    PRIMARY KEY (movie_id, genre_id),
    CONSTRAINT fk_mg_movie FOREIGN KEY (movie_id) REFERENCES movies(movie_id) ON DELETE CASCADE,
    CONSTRAINT fk_mg_genre FOREIGN KEY (genre_id) REFERENCES genres(genre_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS theatres (
    theatre_id   BIGINT AUTO_INCREMENT PRIMARY KEY,
    theatre_name VARCHAR(200) NOT NULL,
    city         VARCHAR(100) NOT NULL,
    address      VARCHAR(500)
);

CREATE TABLE IF NOT EXISTS screens (
    screen_id   BIGINT AUTO_INCREMENT PRIMARY KEY,
    theatre_id  BIGINT NOT NULL,
    screen_name VARCHAR(100),
    total_seats INT,
    CONSTRAINT fk_screen_theatre FOREIGN KEY (theatre_id) REFERENCES theatres(theatre_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS shows (
    show_id   BIGINT AUTO_INCREMENT PRIMARY KEY,
    movie_id  BIGINT NOT NULL,
    screen_id BIGINT NOT NULL,
    show_time DATETIME NOT NULL,
    price     DECIMAL(10,2) NOT NULL,
    CONSTRAINT fk_show_movie  FOREIGN KEY (movie_id)  REFERENCES movies(movie_id)  ON DELETE CASCADE,
    CONSTRAINT fk_show_screen FOREIGN KEY (screen_id) REFERENCES screens(screen_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS seats (
    seat_id     BIGINT AUTO_INCREMENT PRIMARY KEY,
    screen_id   BIGINT NOT NULL,
    row_no      VARCHAR(5),
    seat_number INT,
    seat_type   ENUM('NORMAL','PREMIUM') DEFAULT 'NORMAL',
    CONSTRAINT fk_seat_screen FOREIGN KEY (screen_id) REFERENCES screens(screen_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS bookings (
    booking_id   BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id      BIGINT NOT NULL,
    show_id      BIGINT NOT NULL,
    booking_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    total_amount DECIMAL(10,2),
    status       ENUM('CONFIRMED','CANCELLED') DEFAULT 'CONFIRMED',
    CONSTRAINT fk_booking_user FOREIGN KEY (user_id) REFERENCES users(user_id)   ON DELETE CASCADE,
    CONSTRAINT fk_booking_show FOREIGN KEY (show_id) REFERENCES shows(show_id)   ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS booking_seats (
    booking_seat_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    booking_id      BIGINT NOT NULL,
    seat_id         BIGINT NOT NULL,
    status          ENUM('AVAILABLE','BOOKED','SELECTED') DEFAULT 'BOOKED',
    CONSTRAINT fk_bs_booking FOREIGN KEY (booking_id) REFERENCES bookings(booking_id) ON DELETE CASCADE,
    CONSTRAINT fk_bs_seat    FOREIGN KEY (seat_id)    REFERENCES seats(seat_id)       ON DELETE CASCADE
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_users_email      ON users(email);
CREATE INDEX IF NOT EXISTS idx_movies_tmdb_id   ON movies(tmdb_id);
CREATE INDEX IF NOT EXISTS idx_theatres_city    ON theatres(city);
CREATE INDEX IF NOT EXISTS idx_shows_show_time  ON shows(show_time);
