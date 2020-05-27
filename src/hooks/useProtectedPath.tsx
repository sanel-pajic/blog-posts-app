import { useStore } from "react-stores";
import { store } from "../components/store";
import { useRouteMatch } from "react-router";
import { USERS_QUERY } from "../graphql-queries-mutations/queries";
import { useQuery } from "@apollo/react-hooks";
import React from "react";
import { CircularLoading } from "../components/CircularLoading";

const PROTECTED_PATHS = ["/addblogpost", "/article"];
const PROTECTED_PATHS_ADMIN = ["/userlist", "/muiusers"];

export const useProtectedPath = () => {
  const { authorized } = useStore(store);
  const match = useRouteMatch();
  const currentUser: string | null = localStorage.getItem("userId");

  const { data, loading } = useQuery(USERS_QUERY, {
    fetchPolicy: "cache-and-network",
  });

  if (loading || !data || !currentUser) {
    return <CircularLoading />;
  }

  const isAdminData = data.users.find(
    (user: { _id: string; isAdmin: boolean }) =>
      user._id === currentUser && user.isAdmin !== undefined
  );

  if (PROTECTED_PATHS_ADMIN.indexOf((match && match.path) || "") >= 0) {
    const accessGrantAdmin = isAdminData !== null && isAdminData !== undefined;

    return accessGrantAdmin;
  } else {
    const protectedPath =
      PROTECTED_PATHS.indexOf((match && match.path) || "") >= 0;
    const accessGrant = !protectedPath || (protectedPath && authorized);

    return accessGrant;
  }
};
