import React from "react";
import "./App.css";
import ApolloClient from "apollo-boost";
import { ApolloProvider } from "@apollo/react-hooks";
import { Navbar } from "./components/Navbar";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { Home } from "./pages/Home";
import { About } from "./pages/About";
import { Error } from "./pages/Error";
import { BlogList } from "./components/BlogList";
import { Footer } from "./components/Footer";
import { Header } from "./components/Header";
import { SingleBlog } from "./pages/SingleBlog";
import { LoginPage } from "./pages/LoginPage";
import { SignUpPage } from "./pages/SignUpPage";
import { AuthorizePage } from "./pages/AuthorizePage";
import { AddBlogPost } from "./pages/AddBlogPost";
import { UserList } from "./components/UserList";

const client = new ApolloClient({
  uri: "http://localhost:8080/graphql"
});

const App: React.FC = () => {
  return (
    <ApolloProvider client={client}>
      <Router>
        <div className="App">
          <Header />
          <Navbar />
          <Switch>
            <Route exact path="/" component={Home} />
            <Route exact path="/about/" component={About} />
            <Route exact path="/bloglist/" component={BlogList} />
            <Route exact path="/singleblog/:id" component={SingleBlog} />
            <Route exact path="/login/" component={LoginPage} />
            <Route exact path="/signup/" component={SignUpPage} />
            <Route exact path="/authorize/" component={AuthorizePage} />
            <Route exact path="/addblogpost/" component={AddBlogPost} />
            <Route exact path="/userlist/" component={UserList} />
            <Route render={() => <Error />} />
          </Switch>
          <Footer
            title="Created by Sanel Pajic"
            description="Blog Posts React App"
          />
        </div>
      </Router>
    </ApolloProvider>
  );
};

export default App;
