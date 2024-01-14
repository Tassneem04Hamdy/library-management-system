CREATE DATABASE library_management_system;

CREATE TABLE book (
	isbn VARCHAR(100) NOT NULL PRIMARY KEY,
	title VARCHAR(150) NOT NULL,
	author VARCHAR(50) NOT NULL,
	available_quantity INT NOT NULL,
	shelf_location VARCHAR(50) NOT NULL
);

CREATE TABLE borrower (
    borrower_id BIGSERIAL NOT NULL PRIMARY KEY,
	nid VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(50) NOT NULL,
    email VARCHAR(150),
    registered_date DATE NOT NULL DEFAULT NOW()::DATE
);

CREATE TABLE borrowing (
    borrowing_id BIGSERIAL NOT NULL PRIMARY KEY,
	borrower_id BIGINT REFERENCES borrower(borrower_id),
	book_isbn VARCHAR(100) REFERENCES book(isbn),
	borrowing_date DATE NOT NULL DEFAULT NOW()::DATE
);
