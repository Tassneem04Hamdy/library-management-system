# Library Management System
A simple library management system to manage books and borrowers.

<br/>

## Used Technologies
* [NodeJS](https://nodejs.org/)
* [ExpressJS](https://www.expresjs.org/)
* [PostgreSQL Database](https://www.postgresql.org/)
* [node-postgres](https://node-postgres.com/) 
* [JSON Web Token](https://jwt.io/)
* [Bcrypt.js](https://www.npmjs.com/package/bcrypt)
* [zod](https://www.npmjs.com/package/zod)

<br/>

## Running the server
1. To run the server, the first step is downloading and installing [NodeJS](https://nodejs.org/en/download) and [Postgresql](https://www.postgresql.org/download/) on your machine. <br/>

2. Run the database script in the [database.sql](https://github.com/Tassneem04Hamdy/library-management-system/blob/main/src/database/database.sql) file.

3. Open a terminal, navigate to the project's directory, and run the following command to install the needed packages:
``` bash
npm i
```

4. Create a `.env` file in the project's root directory and fill in the data according to the [.env.example](https://github.com/Tassneem04Hamdy/library-management-system/blob/main/.env.example) file.

5. Now, run the server through:
``` bash
npm start
```
<br/>

## API Endpoints
| HTTP Method | Endpoint | Required fields | Optional fields | Action | Response |
| :---------- | :------- | :-------------- | :-------------- | :----- | :------- |
| POST   | /auth/signUp | - libraryName: string <br/> - username: string <br/> - password: string | None | SignUp | - Created `libraryAdmin` object |
| POST   | /auth/signIp | - username: string <br/> - password: string | None | SignIn | - `username` and `libraryName` <br/> - jwt access token in auth-token header |

> **Note: The following endpoints require an access token (bearer token)**

| HTTP Method | Endpoint | Required fields | Optional fields | Action | Response |
| :---------- | :------- | :-------------- | :-------------- | :----- | :------- |
| POST   | /books | - isbn: string <br/> - title: string <br/> - author: string <br/> - availableQuantity: number <br/> - shelfLocation: string | None | Add Book | - The created `book` object |
| PATCH    | /books/:bookIsbn | None | - title: string <br/> - author: string <br/> - availableQuantity: number <br/> - shelfLocation: string | Edit Book | - The `updatedBook` object |
| DELETE  | /books/:bookIsbn | None | None | Delete Book | - 'Book with ISBN: `${bookIsbn}` is successfully deleted' message |
| GET   | /books/?title=<>&author=<>&isbn=<> | None | None | Get all Library Books OR Specific One Depending on Optional Query Parameters | - Array of books `data` |
| POST   | /borrowers | - nid: string <br/> - name: string | - email: string | Register a Borrower | - The created `borrower` object |
| PATCH    | /borrowers/:borrowerId | None | - name: string <br/> - email: string | Edit Borrower | - The `updatedBorrower` object |
| DELETE  | /borrowers/:borrowerId | None | None | Delete Borrower | - 'Borrower with ID: `${borrowerId}` is successfully deleted' message |
| GET   | /borrowers | None | None | Get all Library Borrowers | - `borrowers` array |
| POST   | /borrowings/borrowers/:borrowerId/books/:bookIsbn | None | None | Add Book to Borrower's Borrowings | - The created `borrowing` and `updatedBook` objects |
| DELETE  | /borrowings/borrowers/:borrowerId/books/:bookIsbn | None | None | Remove Book from Borrower's Borrowings | - 'Borrowed book is successfully returned' message |
| GET   | /borrowings/borrowers/:borrowerId | None | None | Get All Borrowings of Specific Borrower | - `borrowings` array |
| GET   | /borrowings/overdue | - dueDaysNum | None | Get All Books that are Overdue | - `overdueBorrowings` array |

<br/>

## Returned objects format
> **Note: optional fields could be undefined**

``` js
libraryAdmin = {
	library_id,
	library_name,
	admin_id,
	username
}
```

``` js
{
	username,
    libraryName
}
```

``` js
book = {
    isbn,
    title,
    author,
    available_quantity,
    library_id,
    shelf_location
}
```

``` js
updatedBook = {
    isbn,
    title,
    author,
    available_quantity,
    library_id,
    shelf_location
}
```

``` js
data = [
    {
        isbn,
        title,
        author,
        available_quantity,
        library_id,
        shelf_location
    },
    etc...
]
```

``` js
borrower = {
    borrower_id,
    nid,
    name,
    email,
    library_id,
    registered_date
}
```

``` js
updatedBorrower = {
    borrower_id,
    nid,
    name,
    email,
    library_id,
    registered_date
}
```

``` js
borrowers = [
    {
        borrower_id,
        nid,
        name,
        email,
        library_id,
        registered_date
    },
    etc...
]
```

``` js
borrowing = {
    borrowing_id,
    borrower_id,
    book_isbn,
    library_id,
    borrowing_date
}
```

``` js
borrowings = [
    {
        borrowing_id,
        borrower_id,
        book_isbn,
        library_id,
        borrowing_date
    },
    etc...
]
```

``` js
overdueBorrowings = [
    {
        borrowing_id,
        borrower_id,
        book_isbn,
        library_id,
        borrowing_date
    },
    etc...
]
```

<br/>

## License
The back-end is available under the [MIT License](https://github.com/Tassneem04Hamdy/library-management-system/blob/main/LICENSE).
