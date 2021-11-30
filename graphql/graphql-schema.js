const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLList,
  GraphQLString,
  GraphQLID,
} = require("graphql");

const UserData = require("../data/user.data");

const userType = new GraphQLObjectType({
  name: "User",
  description: "This is the the user type",
  fields: {
    name: { type: GraphQLString, description: "Name type" },
    email: { type: GraphQLString, description: "Email type" },
  },
});

const queryType = new GraphQLObjectType({
  name: "Query",
  description: "This is the query type",
  fields: {
    users: {
      type: new GraphQLList(userType),
      description: "This is the list of users returned",
      resolve: (_, args) => {
        return UserData.getAllUsers();
      },
    },
  },
});

const mutations = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    createUser: {
      type: userType,
      args: {
        name: { type: GraphQLString },
        email: { type: GraphQLString },
      },
      resolve: (_, args) => {
        return UserData.insertNewUser({ name: args.name, email: args.email });
      },
    },
  },
});

const schema = new GraphQLSchema({
  query: queryType,
  mutation: mutations,
});

exports.schema = schema;
