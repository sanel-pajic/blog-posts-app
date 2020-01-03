import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import "./index.css";
import { Navbar } from "./components/Navbar";
import { Home } from "./pages/Home";
import { AuthorizePage } from "./pages/AuthorizePage";
import ApolloClient from "apollo-boost";
import { ApolloProvider } from "@apollo/react-hooks";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { About } from "./pages/About";
import { AddBlogPost } from "./pages/AddBlogPost";
import { BlogList } from "./components/BlogList";
import { UserList } from "./components/UserList";
import { Error } from "./pages/Error";
import { SingleBlog } from "./pages/SingleBlog";

const client = new ApolloClient({
  uri: "http://localhost:8080/graphql"
});

const App: React.FC = () => {
  return (
    <ApolloProvider client={client}>
      <BrowserRouter>
        <Header />
        <Navbar />
        <main>
          <Switch>
            <Route exact path="/" component={Home} />
            <Route exact path="/about/" component={About} />
            <Route exact path="/addblogpost" component={AddBlogPost} />
            <Route exact path="/singleblog/:id" component={SingleBlog} />
            <Route exact path="/bloglist" component={BlogList} />
            <Route exact path="/userlist" component={UserList} />
            <Route exact path="/authorize" component={AuthorizePage} />
            <Route render={() => <Error />} />
          </Switch>
          <Footer
            title="Created by Sanel Pajic"
            description="Blog Posts React App"
          />
        </main>
      </BrowserRouter>
    </ApolloProvider>
  );
};

export default App;
