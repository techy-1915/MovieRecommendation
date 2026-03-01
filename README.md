# 🎬 Movie Ticket Booking Application

A full-stack Movie Ticket Booking Web Application built with **Spring Boot** (backend) and **React + Tailwind CSS** (frontend). Movies are fetched from the **TMDB API** and users can browse, search, filter, and book tickets with seat selection.

---

## 🏗️ Project Structure

```
MovieRecommendation/
├── backend/                        # Spring Boot application
│   ├── src/main/java/com/moviebooking/
│   │   ├── controller/             # REST API controllers
│   │   ├── service/                # Business logic
│   │   ├── repository/             # Spring Data JPA repositories
│   │   ├── model/                  # JPA entities
│   │   ├── dto/                    # Data Transfer Objects
│   │   ├── config/                 # Security, JWT, CORS config
│   │   └── exception/              # Global exception handling
│   ├── src/main/resources/
│   │   ├── application.properties  # App configuration
│   │   ├── schema.sql              # Database schema
│   │   └── sample_data.sql         # Sample theatres, screens, seats
│   └── pom.xml
└── frontend/                       # React application
    ├── src/
    │   ├── pages/                  # Home, MovieDetails, SeatSelection, Auth, BookingConfirmation
    │   ├── components/             # Navbar, MovieCard, FilterBar, SeatGrid, ShowTimeCard
    │   ├── services/               # API client (axios) and auth helpers
    │   └── context/                # AuthContext (JWT stored in localStorage)
    └── package.json
```

---

## ⚙️ Prerequisites

| Tool | Version |
|------|---------|
| Java | 17+ |
| Maven | 3.8+ |
| MySQL | 8.0+ |
| Node.js | 18+ |
| npm | 9+ |

---

## 🗄️ Database Setup

```sql
CREATE DATABASE moviebooking CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

Then update `backend/src/main/resources/application.properties`:

```properties
spring.datasource.username=root
spring.datasource.password=<your_mysql_password>
```

The schema is auto-created by Hibernate (`ddl-auto=update`). Load sample data manually:

```bash
mysql -u root -p moviebooking < backend/src/main/resources/sample_data.sql
```

---

## 🚀 Backend Setup

```bash
cd backend
mvn clean install
mvn spring-boot:run
```

The API server starts at **http://localhost:8080**.

### Configuration

Edit `backend/src/main/resources/application.properties` to set:

```properties
# TMDB API Key (get from https://www.themoviedb.org/settings/api)
tmdb.api.key=YOUR_TMDB_API_KEY

# JWT secret (change in production)
jwt.secret=movieBookingSecretKey2026VerySecureAndLong

# CORS origin for frontend
cors.allowed.origins=http://localhost:3000
```

---

## 🌐 Frontend Setup

```bash
cd frontend
npm install
npm start
```

The React app starts at **http://localhost:3000**.

---

## 🎬 Initial Data Setup (TMDB Sync)

After both backend and frontend are running, sync movies from TMDB:

1. **Register/Login** to get a JWT token
2. Call the sync endpoints:

```bash
# Sync genres first
curl -X POST http://localhost:8080/api/sync/genres \
  -H "Authorization: Bearer <your_jwt_token>"

# Then sync movies
curl -X POST http://localhost:8080/api/sync/movies \
  -H "Authorization: Bearer <your_jwt_token>"
```

---

## 📡 API Documentation

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login and get JWT |
| GET | `/api/auth/profile` | Get current user profile |

### Movies
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/movies` | List all movies |
| GET | `/api/movies?genre=Action` | Filter by genre |
| GET | `/api/movies?language=en` | Filter by language |
| GET | `/api/movies?city=Mumbai` | Filter by city |
| GET | `/api/movies/trending` | Get trending movies |
| GET | `/api/movies/{id}` | Get movie details |

### Shows
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/shows/{movieId}` | Get shows for a movie |
| GET | `/api/shows/{movieId}?city=Mumbai` | Filter shows by city |

### Theatres
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/theatres` | List all theatres |
| GET | `/api/theatres?city=Hyderabad` | Filter theatres by city |

### Seats
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/seats/{showId}` | Get seat layout with availability |

### Bookings *(requires JWT)*
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/bookings` | Create booking |
| POST | `/api/bookings/{id}/cancel` | Cancel booking |
| GET | `/api/bookings/{id}` | Get booking details |
| GET | `/api/bookings/user/{userId}` | Get user bookings |

### Sync *(requires JWT)*
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/sync/genres` | Sync genres from TMDB |
| POST | `/api/sync/movies` | Sync movies from TMDB (now_playing region=IN, trending/week, te/hi/ta discover) |

> **Automatic sync:** The server also syncs genres and movies automatically every **6 hours** via `@Scheduled`.

---

## 🗺️ Database Schema

10 tables: `users`, `movies`, `genres`, `movie_genres`, `theatres`, `screens`, `shows`, `seats`, `bookings`, `booking_seats`

Key relationships:
- Movies ↔ Genres (many-to-many via `movie_genres`)
- Screen → Theatre (many-to-one)
- Show → Movie + Screen (many-to-one each)
- Seat → Screen (many-to-one)
- Booking → User + Show (many-to-one each)
- BookingSeat → Booking + Seat (many-to-one each)

---

## 🔒 Security

- JWT-based authentication (JJWT 0.11.5, HS256)
- BCrypt password hashing
- Stateless session (Spring Security `STATELESS`)
- Public endpoints: movies, shows, seats, auth
- Protected endpoints: bookings, sync

---

## 🛠️ Tech Stack

**Backend:** Java 17, Spring Boot 3.2.0, Spring Security, Spring Data JPA, MySQL 8, JJWT 0.11.5, Lombok

**Frontend:** React 18, React Router v6, Axios, Tailwind CSS 3

**External API:** TMDB (The Movie Database)
