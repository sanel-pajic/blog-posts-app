import React from "react";
import "./App.css";
import ApolloClient from "apollo-boost";
import { ApolloProvider } from "@apollo/react-hooks";
//import { EditableTable } from "./components/EditableTable";
//import { InputBlogComponent } from "./components/InputBlogComponent";
import { BlogPosts } from "./pages/BlogPosts";
//import { TableMUITest } from "./components/TableMUITest";
import { Navbar } from "./components/Navbar";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { Home } from "./pages/Home";
import { About } from "./pages/About";
import { Error } from "./pages/Error";
import { BlogGridList } from "./BlogGridList";

const client = new ApolloClient({
  uri: "http://localhost:8080/graphql"
});

const App: React.FC = () => {
  return (
    <ApolloProvider client={client}>
      <Router>
        <div className="App">
          <Navbar />
          <Switch>
            <Route exact path="/" component={Home} />
            <Route exact path="/BlogPosts/" component={BlogPosts} />
            <Route exact path="/about/" component={About} />
            <Route exact path="/list/" component={BlogGridList} />
            <Route component={Error} />
          </Switch>
          <div
            style={{
              position: "fixed",
              left: 0,
              bottom: 0,
              width: "100%",
              height: "15%",
              background: "linear-gradient(60deg,#29323c 0%,#485563 100%)",
              color: "white",
              textAlign: "center"
            }}
          >
            <p style={{ marginTop: "4%" }}>Created by Sanel Pajic</p>
          </div>
        </div>
      </Router>
    </ApolloProvider>
  );
};

export default App;
