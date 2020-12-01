const { books, authors } = require('./db');
const { BookType, AuthorType } = require('./graphqlTypes');

const express = require('express');

const { graphqlHTTP } = require('express-graphql');
const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLInt,
  GraphQLList,
  GraphQLString,
  GraphQLNonNull,
  buildSchema,
} = require('graphql');

const RootQueryType = new GraphQLObjectType({
  name: 'Query',
  description: 'Root Query',
  fields: () => ({
    books: {
      type: new GraphQLList(BookType),
      description: 'List of All Books',
      resolve: () => books,
    },
    book: {
      type: BookType,
      description: 'A Single Book',
      args: {
        id: { type: GraphQLInt },
      },
      resolve: (_, args) => books.find((book) => book.id === args.id),
    },

    authors: {
      type: new GraphQLList(AuthorType),
      description: 'List of All Authors',
      resolve: () => authors,
    },
    author: {
      type: AuthorType,
      description: 'A Single Author',
      args: {
        id: { type: GraphQLInt },
      },
      resolve: (_, args) => authors.find((author) => author.id === args.id),
    },
  }),
});

const RootMutationType = new GraphQLObjectType({
  name: 'Mutation',
  description: 'Root Mutation',
  fields: () => ({
    addBook: {
      type: BookType,
      description: 'Add a Book',
      args: {
        name: { type: GraphQLNonNull(GraphQLString) },
        authorId: { type: GraphQLNonNull(GraphQLInt) },
      },
      resolve: (_, args) => {
        const book = {
          id: books.length + 1,
          name: args.name,
          authorId: args.authorId,
        };
        books.push(book);
        return book;
      },
    },
    addAuthor: {
      type: AuthorType,
      description: 'Add an Author',
      args: {
        name: { type: GraphQLNonNull(GraphQLString) },
      },
      resolve: (_, args) => {
        const author = {
          id: authors.length + 1,
          name: args.name,
        };
        authors.push(author);
        return author;
      },
    },
  }),
});

const schema = new GraphQLSchema({
  query: RootQueryType,
  mutation: RootMutationType,
});

// const schema = buildSchema(`
//   type Book {
//     id: Int!
//     name: String!
//     authorId: Int!
//     author: Author
//   }

//   type Author {
//     id: Int!
//     name: String!
//     books: [Book]
//   }

//   type Query {
//     """
//     A list of all books
//     """
//     books: [Book]

//     """
//     Get a single book
//     """
//     book(id: Int!): Book

//     """
//     A list of all authors
//     """
//     authors: [Author]

//     """
//     Get a single author
//     """
//     author(id: Int!): Author
//   }
// `);

// const root = {
//   books: () => books,
//   book: (args) => books.find((book) => book.id === args.id),

//   authors: () => authors,
//   author: (args) => authors.find((author) => author.id === args.id),
// };

const app = express();
const PORT = 5000;

app.use(
  '/graphql',
  graphqlHTTP({
    schema: schema,
    // rootValue: root,
    graphiql: true,
  })
);
app.listen(PORT, () => console.log(`Server is running on PORT: ${PORT}`));
