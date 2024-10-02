require("./db");
const express = require("express");
const app = express();

const cors = require("cors");
const coreOptions = {
  origin: "*",
  credentials: true,
};
app.use(cors(coreOptions));

const Movie = require("./models/movies.models");

app.use(express.json());
// Find a movie with a particular title
async function readMovieByTitle(movieTitle) {
  try {
    const movie = await Movie.findOne({ title: movieTitle });
    // console.log(movie);
    return movie;
  } catch (error) {
    console.log(error);
  }
}
async function createMovie(data) {
  try {
    const movieData = new Movie(data);
    const savedMovieData = await movieData.save();
    return savedMovieData;
  } catch (error) {
    throw new Error("Error saving the movie: " + error.message); // Pass the error back
  }
}

app.post("/movies", async (req, res) => {
  try {
    const savedMovieData = await createMovie(req.body);
    if (savedMovieData) {
      res.status(201).json({
        message: "Movie added successfully",
        movie: savedMovieData,
      });
    } else {
      res.status(400).json({ error: "Failed to add movie" });
    }
  } catch (error) {
    console.error(error.message); // Log the error
    res
      .status(500)
      .json({ error: "Failed to add the movie: " + error.message });
  }
});

app.get("/movies/:title", async (req, res) => {
  try {
    const movie = await readMovieByTitle(req.params.title);
    if (movie) {
      res.json(movie);
    } else {
      res.status(404).json({ error: "Movie not found." });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch movie." });
  }
});
// readMovieByTitle("Dilwale Dulhania Le Jayenge");

// To get all the movies
async function getAllMovies() {
  try {
    const allMovies = await Movie.find();
    // console.log(allMovies);
    return allMovies;
  } catch (error) {
    console.log(error);
  }
}
app.get("/movies", async (req, res) => {
  try {
    const allMovies = await getAllMovies();
    if (allMovies.length != 0) {
      res.json(allMovies);
    } else {
      res.status(404).json({ error: "Movie not found." });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch movie." });
  }
});
getAllMovies();

// Get a movie by director movie
async function getMovieByDirector(directorName) {
  try {
    const movieByDirector = await Movie.findOne({ director: directorName });
    // console.log(movieByDirector);
    return movieByDirector;
  } catch (error) {
    console.log(movieByDirector);
  }
}
app.get("/movies/director/:directorName", async (req, res) => {
  try {
    const movies = await getMovieByDirector(req.params.directorName);
    if (movies.length != 0) {
      res.json(movies);
    } else {
      res.status(404).json({ error: "Movie not found." });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch movie." });
  }
});
// getMovieByDirector("Aditya Roy Chopra");

async function readMovieByGenre(genreName) {
  try {
    const movieByGenre = await Movie.find({ genre: genreName });
    return movieByGenre;
  } catch (err) {
    console.log(error);
  }
}
app.get("/movies/genre/:genreName", async (req, res) => {
  try {
    const movieByGenre = await readMovieByGenre(req.params.genreName);
    if (movieByGenre.length != 0) {
      res.json(movieByGenre);
    } else {
      res.status(500).json({ error: "Failed to fetch movie." });
    }
  } catch (err) {
    console.log(error);
  }
});

async function deleteMovie(movieId) {
  try {
    const deletedMovie = await Movie.findByIdAndDelete(movieId);
    return deletedMovie;
  } catch (error) {
    console.log(error);
  }
}
app.delete("/movies/:movieId", async (req, res) => {
  try {
    const movieDelete = await deleteMovie(req.params.movieId);
    if (movieDelete) {
      res.status(200).json({ message: "Movie deleted successfully." });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to delete movie." });
  }
});

async function updateMovie(movieId, dataToUpdate) {
  try {
    const updatedMovie = await Movie.findByIdAndUpdate(movieId, dataToUpdate, {
      new: true,
    });
    return updatedMovie;
    // console.log(updatedMovie);
  } catch (error) {
    console.log("Error in updating movie rating ", error);
  }
}
// updateMovie("66ba89548f1694ab2f22d16c", { releaseYear: 2040
app.post("/movies/:movieId", async (req, res) => {
  try {
    const updatedMovie = await updateMovie(req.params.movieId, req.body);
    if (updatedMovie) {
      res.status(200).json({
        message: "Movie updated successfully",
        updateMovie: updatedMovie,
      });
    } else {
      res.status(404).json({ error: "Movie not found." });
    }
  } catch (error) {
    res.status(500).json({ error: "failed to update movie." });
  }
});

const port = 3000;

app.listen(port, () => {
  console.log(`Server is running on the port ${port}`);
});
