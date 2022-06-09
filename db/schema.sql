CREATE DATABASE "my_u_library";

CREATE TYPE "current_role" AS ENUM ('Student','Librarian');

CREATE TYPE "current_status" AS ENUM ('Active','Inactive');

CREATE TABLE users (
    id SERIAL,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    role "current_role" NOT NULL,
    PRIMARY KEY ("id")
);

CREATE TABLE authors (
    id SERIAL,
    name VARCHAR(255) NOT NULL,
    PRIMARY KEY ("id")
);

CREATE TABLE genres (
    id SERIAL,
    name VARCHAR(255) NOT NULL,
    PRIMARY KEY ("id")
);

CREATE TABLE books (
    id SERIAL,
    title VARCHAR(255) NOT NULL,
    published_year INT NOT NULL,
    stock INT NOT NULL,
    PRIMARY KEY ("id")
);

CREATE TABLE author_book (
    author_id INT NOT NULL,
    book_id INT NOT NULL,
    PRIMARY KEY ("author_id", "book_id"),
    FOREIGN KEY ("author_id") REFERENCES authors("id"),
    FOREIGN KEY ("book_id") REFERENCES books("id")
);

CREATE TABLE genre_book (
    genre_id INT NOT NULL,
    book_id INT NOT NULL,
    PRIMARY KEY ("genre_id", "book_id"),
    FOREIGN KEY ("genre_id") REFERENCES genres("id"),
    FOREIGN KEY ("book_id") REFERENCES books("id")
);

CREATE TABLE borrows (
    id SERIAL,
    user_id INT NOT NULL,
    book_id INT NOT NULL,
    status "current_status" NOT NULL,
    PRIMARY KEY ("id"),
    FOREIGN KEY ("user_id") REFERENCES users("id"),
    FOREIGN KEY ("book_id") REFERENCES books("id")
);

-- create admin user
INSERT INTO users (first_name, last_name, email, role) VALUES ('admin','admin','admin@admin.com','Librarian');