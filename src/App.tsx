import React, { useState } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import "./index.css";
import { Home } from "./pages/Home";
import { AuthorizePage } from "./pages/AuthorizePage";
import ApolloClient from "apollo-boost";
import { ApolloProvider } from "@apollo/react-hooks";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { ComponentArticle } from "./pages/ComponentArticle";
import { AddBlogPost } from "./pages/AddBlogPost";
import { BlogList } from "./components/BlogList";
import { UserList } from "./components/UserList";
import { Error } from "./pages/Error";
import { SingleBlog } from "./pages/SingleBlog";
import { SignUpPage } from "./pages/SignUpPage";
import Navbar from "./components/Navbar";
import { ForgotPage } from "./pages/ForgotPage";
import { ResetPage } from "./pages/ResetPage";
import { CheckResetEmailPage } from "./pages/CheckResetEmailPage";

export const client = new ApolloClient({
  uri: "http://localhost:8080/graphql",
  onError: ({ graphQLErrors, networkError }) => {
    if (graphQLErrors)
      graphQLErrors.map(
        ({ message, locations, path }) =>
          console.log(
            `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
          ),
        console.log("GRAPHQL ERRORS", graphQLErrors)
      );

    if (networkError) console.log(`[Network error]: ${networkError}`);
  },
  request: (operation) => {
    const token = localStorage.getItem("token");
    console.log("TOKEN APP", token);
    if (token) {
      operation.setContext({
        headers: {
          authorization: token ? `Bearer ${token}` : "",
        },
      });
    }
  },
});

export const TabContext = React.createContext<{
  tabIndex: number;
  setTabIndex: Function;
}>({ tabIndex: 0, setTabIndex: () => {} });

export const CurrentUserContext = React.createContext<{
  userId: string;
  token: string;
  authorized: boolean;
  first_name: string;
  last_name: string;
  setAuthorized: Function;
}>({
  userId: "",
  token: "",
  first_name: "",
  last_name: "",
  authorized: false,
  setAuthorized: () => {},
});

const App: React.FC = () => {
  const [tabIndex, setTabIndex] = useState(0);
  const [
    { userId, token, first_name, last_name, authorized },
    setAuthorized,
  ] = useState({
    userId: "",
    token: "",
    first_name: "",
    last_name: "",
    authorized: false,
  });
  // console.log("TAB INDEX APP", tabIndex);
  console.log("USER CONTEXT", userId, token, first_name, last_name, authorized);
  return (
    <CurrentUserContext.Provider
      value={{
        userId,
        token,
        first_name,
        last_name,
        authorized,
        setAuthorized,
      }}
    >
      <TabContext.Provider value={{ tabIndex, setTabIndex }}>
        <ApolloProvider client={client}>
          <div
            className="App"
            style={{
              background: "#edf1f5af",
              overflow: "hidden",
              position: "relative",
              minHeight: "100%",
            }}
          >
            <BrowserRouter>
              <Header />
              <Navbar />
              <Switch>
                <Route exact path="/" component={Home} />
                <Route exact path="/article" component={ComponentArticle} />
                <Route exact path="/addblogpost" component={AddBlogPost} />
                <Route exact path="/singleblog/:id" component={SingleBlog} />
                <Route exact path="/bloglist" component={BlogList} />
                <Route exact path="/userlist" component={UserList} />
                <Route exact path="/signup" component={SignUpPage} />
                <Route exact path="/forgot" component={ForgotPage} />
                <Route exact path="/authorize" component={AuthorizePage} />
                <Route
                  exact
                  path="/resetcheck/:token"
                  component={CheckResetEmailPage}
                />
                <Route exact path="/reset" component={ResetPage} />
                <Route render={() => <Error />} />
              </Switch>
              <Footer
                title="Created by Sanel Pajic"
                description="Blog Posts React App"
              />
            </BrowserRouter>
          </div>
        </ApolloProvider>
      </TabContext.Provider>
    </CurrentUserContext.Provider>
  );
};

export default App;
