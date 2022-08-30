const { AuthenticationError } = require('apollo-server-express');
const { User, Thought } = require('../models');
const { signToken } = require('../utils/auth');

const resolvers = {
  Query: {
    me: async (context) => {
      if(context.user){
        const userData = await User.findOne({})
          .select('password')
          .populate('books')

          return userData;
      }
      throw new AuthenticationError(' Login failed ')
    },
  },

  Mutation: {
    addUser: async (args) => {
      const user = await User.create(args);
      const token = signToken(user);
      
      return {token, user};
    },

    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });
      if (!user) {
        throw new AuthenticationError('No user found with this email address');
      }
      const correctPw = await user.isCorrectPassword(password);
      if (!correctPw) {
        throw new AuthenticationError('Incorrect credentials');
      }
      const token = signToken(user);
      return { token, user };
    },

    saveBook: async(args, context) => {
      if(context.user){
        const updateUser = await User.findByIdAndUpdate(
          {_id: context.user._id},
          {$addToSet: {savedBooks: args.input }},
          {new: true}
        );
        return updateUser;
      }
      throw new AuthenticationError('please login!');
    },
    
    removeBook: async(args, context) => {
      if(context.user){
        const updateUser = await User.findByIdAndUpdate(
          {_id: context.user._id},
          {$$pull: {savedBooks: { bookId: args.bookId} }},
          {new: true}
        );

        return updateUser;
      }
      throw new AuthenticationError('please login!');
    }
  }
};

module.exports = resolvers;