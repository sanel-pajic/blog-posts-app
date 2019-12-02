import React from "react";
import "./App.css";
import ApolloClient from "apollo-boost";
import { ApolloProvider } from "@apollo/react-hooks";
//import { EditableTable } from "./components/EditableTable";
import { InputBlogComponent } from "./components/InputBlogComponent";
import { TableBlogPosts } from "./components/TableBlogPosts";
//import { TableMUITest } from "./components/TableMUITest";
import Example from "./components/Example"
import Form from "./components/Form";

const client = new ApolloClient({
  uri: "http://localhost:8080/graphql"
});

const App: React.FC = () => {
  return (
    <ApolloProvider client={client}>
      <div
        className="App"
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          margin: 0,
          padding: 0
        }}
      >
        <InputBlogComponent/>
        
        <TableBlogPosts/>
     
      </div>
    </ApolloProvider>
  );
};

export default App;
