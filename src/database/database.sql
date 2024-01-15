CREATE DATABASE library_management_system;

CREATE TABLE library (
	library_id BIGSERIAL NOT NULL PRIMARY KEY,
	library_name VARCHAR(150) NOT NULL UNIQUE,
	admin_id BIGSERIAL NOT NULL,
	username VARCHAR(50) NOT NULL UNIQUE,
	password VARCHAR(250) NOT NULL
);

CREATE TABLE book (
	isbn VARCHAR(100) NOT NULL PRIMARY KEY,
	title VARCHAR(150) NOT NULL,
	author VARCHAR(50) NOT NULL,
	available_quantity INT NOT NULL,
	library_id BIGINT REFERENCES library(library_id),
	shelf_location VARCHAR(50) NOT NULL
);

CREATE TABLE borrower (
    borrower_id BIGSERIAL NOT NULL PRIMARY KEY,
	nid VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(50) NOT NULL,
    email VARCHAR(150),
	library_id BIGINT REFERENCES library(library_id),
    registered_date DATE NOT NULL DEFAULT NOW()::DATE
);

CREATE TABLE borrowing (
    borrowing_id BIGSERIAL NOT NULL PRIMARY KEY,
	borrower_id BIGINT REFERENCES borrower(borrower_id),
	book_isbn VARCHAR(100) REFERENCES book(isbn),
	library_id BIGINT REFERENCES library(library_id),
	borrowing_date DATE NOT NULL DEFAULT NOW()::DATE
);
