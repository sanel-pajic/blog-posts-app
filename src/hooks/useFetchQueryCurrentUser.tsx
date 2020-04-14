import { useQuery } from "@apollo/react-hooks";
import { CURRENT_USER_QUERY_ID } from "../queries/queries";
import { CircularLoading } from "../components/CircularLoading";
import React from "react";

export const useFetchQueryCurrentUser = () => {
  const { data, loading } = useQuery(CURRENT_USER_QUERY_ID, {
    fetchPolicy: "cache-and-network"
  });
  if (loading || !data) {
    return <CircularLoading />;
  }
  const currentUserID = data.currentUser._id;

  return [currentUserID];
};
