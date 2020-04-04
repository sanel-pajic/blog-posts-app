import gql from "graphql-tag";

// Mutation for add new article
export const ADD_MUTATION_ARTICLE = gql`
  mutation($data: ComponentArticleInput!) {
    addComponentArticle(data: $data)
  }
`;

// Mutation for remove article
export const REMOVE_ARTICLE_MUTATION = gql`
  mutation($_id: ID!) {
    removeComponentArticle(_id: $_id) {
      _id
    }
  }
`;

// Mutation for add new blog post
export const ADD_BLOG_MUTATION = gql`
  mutation($data: BlogPostInput!) {
    addBlogPost(data: $data) {
      _id
      title
      description_short
      description
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

// Mutation for remove blog post
export const REMOVE_BLOG_MUTATION = gql`
  mutation($_id: ID!) {
    removeBlogPost(_id: $_id) {
      _id
    }
  }
`;

// Mutation for add user
export const ADD_MUTATION_USER = gql`
  mutation($data: UserInput!) {
    addUser(data: $data) {
      userId
      token
      tokenExpiration
    }
  }
`;

// Mutation for remove users
export const REMOVE_USER_MUTATION = gql`
  mutation($_id: ID!) {
    removeUser(_id: $_id) {
      _id
    }
  }
`;
// Mutation for login
export const LOGIN_MUTATION = gql`
  mutation($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      userId
      token
      tokenExpiration
    }
  }
`;
// Mutation for comment
export const ADD_COMMENT = gql`
  mutation($data: CommentInput!) {
    addComment(data: $data) {
      _id
      postId
      text
      author
    }
  }
`;

// Mutation for remove comment
export const REMOVE_COMMENT_MUTATION = gql`
  mutation($_id: ID!) {
    removeComment(_id: $_id) {
      _id
    }
  }
`;

// Mutation for liking the comment
export const ADD_COMMENT_LIKE = gql`
  mutation($data: LikeCommentInput!) {
    addLikeComment(data: $data) {
      _id
      commentId
      userId
    }
  }
`;

// Mutation for remove like of a comment
export const REMOVE_COMMENT_LIKE = gql`
  mutation($_id: ID!) {
    removeLikeComment(_id: $_id) {
      _id
    }
  }
`;

// Mutation for liking blog
export const ADD_BLOG_LIKE = gql`
  mutation($data: LikeBlogInput!) {
    addLikeBlog(data: $data) {
      _id
      blogId
      userId
    }
  }
`;

// Mutation for remove like of a comment
export const REMOVE_BLOG_LIKE = gql`
  mutation($_id: ID!) {
    removeLikeBlog(_id: $_id) {
      _id
    }
  }
`;

// Mutation for update text of a comment
export const UPDATE_COMMENT = gql`
  mutation($data: CommentInput!) {
    updateComment(data: $data) {
      _id
      text
    }
  }
`;

// Mutation for user data
export const UPDATE_USER = gql`
  mutation($data: UserInput!) {
    updateUser(data: $data) {
      _id
      first_name
      last_name
      email
      isAdmin
    }
  }
`;
