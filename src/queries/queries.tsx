import gql from "graphql-tag";

// BLOG POST QUERIES
// Query for displaying all blog posts
export const BLOGS_QUERY = gql`
  query {
    blogPosts {
      _id
      title
      description_short
      description
      image
    }
  }
`;
// ARTICLES QUERIES
// Query for displaying all articles component
export const ARTICLES_QUERY = gql`
  query {
    componentArticles {
      _id
      code
      description
      quantity
      price
    }
  }
`;
//USERS QUERIES
// Query for displaying all users
export const USERS_QUERY = gql`
  query {
    users {
      _id
      first_name
      last_name
      email
      password
    }
  }
`;