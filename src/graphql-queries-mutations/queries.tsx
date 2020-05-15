import gql from "graphql-tag";

// Query for displaying all blog posts

export const BLOGS_QUERY = gql`
  query {
    blogPosts {
      _id
      title
      description_short
      description
      image
      author
      likes {
        _id
        blogId
        userId
      }
    }
  }
`;

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

// Query for displaying all users

export const USERS_QUERY = gql`
  query {
    users {
      _id
      first_name
      last_name
      email
      isAdmin
    }
  }
`;
// Query for displaying current logged user
export const CURRENT_USER_QUERY = gql`
  query {
    currentUser {
      first_name
      last_name
      email
    }
  }
`;

export const DATA_USER_QUERY = gql`
  query($_id: ID!) {
    user(id: $_id) {
      first_name
      last_name
    }
  }
`;

// Query for displaying all likes
export const LIKES_QUERY = gql`
  query {
    likeComments {
      _id
      commentId
      userId
    }
  }
`;

// Query for displaying all comments
export const COMMENTS_QUERY = gql`
  query($postId: ID!) {
    comments(postId: $postId) {
      _id
      postId
      text
      author
      date
      likes {
        _id
        commentId
        userId
      }
    }
  }
`;

// Query for single blog
export const SINGLE_BLOG_QUERY = gql`
  query($postId: ID!) {
    blogPost(id: $postId) {
      _id
      title
      description
      description_short
      image
      date
      author
      likes {
        _id
        blogId
        userId
      }
    }
  }
`;
