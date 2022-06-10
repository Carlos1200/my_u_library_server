const pool = require("../db");
const format = require("pg-format");

const createBook = async (req, res, next) => {
  try {
    const { title, authorId, genreId, published_year, stock } = req.body;

    //check if authorIds exist on db
    const author = await pool.query(
      format("SELECT name FROM authors WHERE id IN (%L)", authorId)
    );
    if (author.rows.length !== authorId.length) {
      next({
        status: 404,
        message: "Author not found",
      });
    }
    //genreId exists
    const genre = await pool.query(
      format("SELECT name FROM genres WHERE id IN (%L)", genreId)
    );
    if (genre.rows.length !== genreId.length) {
      next({
        status: 404,
        message: "Genre not found",
      });
    }

    const book = await pool.query(
      "INSERT INTO books(title, published_year, stock) VALUES($1, $2, $3) RETURNING *",
      [title, published_year, stock]
    );
    const bookId = book.rows[0].id;

    //insert array of authorIds
    const authorIds = authorId.map((id) => [bookId, id]);
    await pool.query(
      format("INSERT INTO author_book(book_id, author_id) VALUES %L", authorIds)
    );

    //insert array of genreIds
    const genreIds = genreId.map((id) => [bookId, id]);
    await pool.query(
      format("INSERT INTO genre_book(book_id, genre_id) VALUES %L", genreIds)
    );

    res.status(201).json({
      book: book.rows[0],
      authors: author.rows,
      genres: genre.rows,
    });
  } catch (error) {
    next(error);
  }
};

const updateBook = async (req, res, next) => {
  try {
    const { title, authorId, genreId, published_year, stock } = req.body;

    //check if authorIds exist on db
    const author = await pool.query(
      format("SELECT name FROM authors WHERE id IN (%L)", authorId)
    );
    if (author.rows.length !== authorId.length) {
      next({
        status: 404,
        message: "Author not found",
      });
    }
    //genreId exists
    const genre = await pool.query(
      format("SELECT name FROM genres WHERE id IN (%L)", genreId)
    );
    if (genre.rows.length !== genreId.length) {
      next({
        status: 404,
        message: "Genre not found",
      });
    }

    const book = await pool.query(
      "UPDATE books SET title=$1, published_year=$2, stock=$3 WHERE id=$4 RETURNING *",
      [title, published_year, stock, req.params.id]
    );
    const bookId = book.rows[0].id;

    //insert array of authorIds
    const authorIds = authorId.map((id) => [bookId, id]);
    await pool.query(
      format("DELETE FROM author_book WHERE book_id=$1", bookId)
    );
    await pool.query(
      format("INSERT INTO author_book(book_id, author_id) VALUES %L", authorIds)
    );

    //insert array of genreIds
    const genreIds = genreId.map((id) => [bookId, id]);
    await pool.query(format("DELETE FROM genre_book WHERE book_id=$1", bookId));
    await pool.query(
      format("INSERT INTO genre_book(book_id, genre_id) VALUES %L", genreIds)
    );

    res.status(200).json({
      book: book.rows[0],
      authors: author.rows,
      genres: genre.rows,
    });
  } catch (error) {
    next(error);
  }
};

const deleteBook = async (req, res, next) => {
  try {
    const bookId = req.params.id;
    //delete references
    await pool.query(
      format("DELETE FROM author_book WHERE book_id=$1", bookId)
    );
    await pool.query(format("DELETE FROM genre_book WHERE book_id=$1", bookId));
    //delete book
    const book = await pool.query(
      format("DELETE FROM books WHERE id=$1 RETURNING *", bookId)
    );
    res.status(200).json({
      book: book.rows[0],
    });
  } catch (error) {
    next(error);
  }
};

const getBooks = async (req, res, next) => {
  try {
    //get books merging authors and genres into an array
    const books = await pool.query(
      "SELECT books.id AS id,books.title AS title,books.published_year AS published_year, ARRAY_AGG(authors.name) AS author, ARRAY_AGG(genres.name) AS genre FROM books JOIN author_book ON books.id=author_book.book_id JOIN authors ON authors.id=author_book.author_id JOIN genre_book ON books.id=genre_book.book_id JOIN genres ON genres.id=genre_book.genre_id GROUP BY books.id"
    );
    res.status(200).json({
      books: books.rows,
    });
  } catch (error) {
    next(error);
  }
};

const getBook = async (req, res, next) => {
  try {
    //get only book with authors and genres
    const book = await pool.query(
      "SELECT books.*, ARRAY_AGG(authors.name) AS author, ARRAY_AGG(genres.name) AS genre FROM books JOIN author_book ON books.id=author_book.book_id JOIN authors ON authors.id=author_book.author_id JOIN genre_book ON books.id=genre_book.book_id JOIN genres ON genres.id=genre_book.genre_id WHERE books.id=$1 GROUP BY books.id",
      [req.params.id]
    );
    res.status(200).json({
      book: book.rows[0],
    });
  } catch (error) {
    next(error);
  }
};

const getBooksByFilter = async (req, res, next) => {
  try {
    const { author, genre,title } = req.query;
    let query = "SELECT books.id AS id,books.title AS title,books.published_year AS published_year, ARRAY_AGG(authors.name) AS author, ARRAY_AGG(genres.name) AS genre FROM books JOIN author_book ON books.id=author_book.book_id JOIN authors ON authors.id=author_book.author_id JOIN genre_book ON books.id=genre_book.book_id JOIN genres ON genres.id=genre_book.genre_id";
    let value ;
    if (author) {
      value = author;
      query += " WHERE LOWER(authors.name) LIKE LOWER($1)";
    }
    else if (genre) {
      value = genre;
      query += "WHERE LOWER(genres.name) LIKE LOWER($1)"
    }
    else if (title) {
      value = title;
      query += " WHERE LOWER(books.title) LIKE LOWER($1)";
    }
    query += " GROUP BY books.id";
    const books = await pool.query(query,value?[`%${value}%`]:[]);
    res.status(200).json({
      books: books.rows,
    });
  } catch (error) {
    console.log({ error });
    next(error);
  }
}

module.exports = {
  createBook,
  deleteBook,
  getBook,
  getBooks,
  updateBook,
  getBooksByFilter,
};
