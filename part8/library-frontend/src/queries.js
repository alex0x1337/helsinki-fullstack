import { gql } from "@apollo/client";


export const ALL_AUTHORS = gql`
query {
  allAuthors {
    name,
    born
  }
}
`
export const ALL_BOOKS = gql`
query AllBooks($genre: String) {
  allBooks(genre: $genre) {
    title
    author {
      name
      born
    }
    published
    genres
  }
}
`

export const SET_BIRTHYEAR = gql`
mutation SetBirthYear($name: String!, $born: Int!) {
  editAuthor(
    name: $name,
    setBornTo: $born
  ) {
    name
    born
  }
}
`

export const CREATE_BOOK = gql`
mutation createBook($title: String!, $author: String!, $published: Int!, $genres: [String!]) {
  addBook(
    title: $title,
    author: $author,
    published: $published,
    genres: $genres
  ) {
    title
    author {
      name
      born
    }
    published
    genres
  }
}
`

export const LOGIN = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password)  {
      value
    }
  }
`

export const ME = gql`
  query {
    me {
      username
      favoriteGenre
    }
  }
`

export const BOOK_ADDED = gql`
subscription {
  bookAdded {
    title
    author {
      name
      born
    }
    published
    genres
  }
}`