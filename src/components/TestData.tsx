import React from "react";
import gql from "graphql-tag";
import mongoID from "bson-objectid";
import { useQuery, useMutation } from "@apollo/react-hooks";

const BLOGS_QUERY = gql`
  query {
    blogPosts {
      _id
      title
      description
    }
  }
`;

const ADD_MUTATION = gql`
  mutation($data: BlogPostInput!) {
    addBlogPost(data: $data)
  }
`;

export const TestData: React.FC = () => {
  const { data, loading } = useQuery(BLOGS_QUERY);

  const [addBlogPost] = useMutation(ADD_MUTATION);
  console.log("data:", data);
  if (loading || !data) {
    return null;
  }

  return (
    <div>
      <button
        onClick={() =>
          addBlogPost({
            variables: {
              data: {
                title: Math.random(),
                _id: mongoID.generate(),
                description: `New Table Test ${Math.random()}`
              }
            },
            refetchQueries: [{ query: BLOGS_QUERY }]
          })
        }
      >
        Add new blog post
      </button>
      {data.blogPosts.map(
        (blog: {
          _id: string | number | undefined;
          title: React.ReactNode;
        }) => (
          <div key={blog._id}>{blog.title}</div>
        )
      )}
    </div>
  );
};


/*
// Test data da se izbaci na ekran blog id i title

      {data.blogPosts.map(
        (blog: {
          _id: string | number | undefined;
          title: React.ReactNode;
        }) => (
          <div key={blog._id}>{blog.title}</div>
        )
      )}

      */