const jwt = require('jsonwebtoken')
const { UserInputError, AuthenticationError } = require('apollo-server')
const Author = require('./models/Author')
const Book = require('./models/Book')
const User = require('./models/User')
const { PubSub } = require('graphql-subscriptions')
const pubsub = new PubSub()

const resolvers = {
    Query: {
      bookCount: async () => Book.collection.countDocuments(),
      authorCount: async () => Author.collection.countDocuments(),
      allBooks: async (root, args) => {
        /*
        if(args.author && args.genre) {
          return books.filter(book => book.author === args.author && book.genres.indexOf(args.genre) != -1)
        }
        if(args.author) {
          return books.filter(book => book.author === args.author)
        }
        */
        if(args.genre) {
          return Book.find({ genres: args.genre }).populate('author')
        }
        return Book.find({}).populate('author')
      },
      allAuthors: async () => {
        return Author.find({})
      },
      me: (root, args, context) => {
        return context.currentUser
      }
    },
    Author: {
      bookCount: (root) => root.books ? root.books.length : 0
    },
    Book: {},
    Mutation: {
      addBook: async (root, args, context) => {
        if(!context.currentUser) {
          throw new AuthenticationError("you need to log in")
        }
        try {
          let author = await Author.findOne({ name: args.author })
          if (!author) {
            author = new Author({ name: args.author, books: [] })
            author = await author.save()
          }
          let book = new Book({ ...args, author: author._id })
          book = await book.save()
          author.books = author.books.concat(book._id)
          await author.save()
          book = await book.populate('author')
          pubsub.publish('BOOK_ADDED', { bookAdded: book })
          return book
        } catch (error) {
          throw new UserInputError(error.message, {
            invalidArgs: args,
          })
        }
      },
      editAuthor: async (root, args, context) => {
        if(!context.currentUser) {
          throw new AuthenticationError("you need to log in")
        }
        let author = await Author.findOne({ name: args.name })
        try {
          if (author) {
            author.born = args.setBornTo
            author = await author.save()
          }
        } catch (error) {
          throw new UserInputError(error.message, {
            invalidArgs: args,
          })
        }
        return author
      },
      createUser: async (root, args) => {
        const user = new User({ username: args.username, favoriteGenre: args.favoriteGenre })
        return user.save()
          .catch(error => {
            throw new UserInputError(error.message, {
              invalidArgs: args,
            })
          })
      },
      login: async (root, args) => {
        const user = await User.findOne({ username: args.username })
        if ( !user || args.password !== 'secret' ) {
          throw new UserInputError("wrong credentials")
        }
        const userForToken = {
          username: user.username,
          id: user._id,
        }
        return { value: jwt.sign(userForToken, process.env.JWT_SECRET) }
      },
    },
    Subscription: {
        bookAdded: {
            subscribe: () => pubsub.asyncIterator(['BOOK_ADDED'])
        },
    },
  }

  module.exports = resolvers