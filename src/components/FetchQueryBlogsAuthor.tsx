import { useQuery } from "@apollo/react-hooks";
import { DATA_USER_QUERY } from "../queries/queries";
import { CircularLoading } from "./CircularLoading";
import React from "react";

type Props = {
  userID: string;
};

export const FetchQueryBlogsAuthor: React.FC<Props> = ({ userID }) => {
  const { data, loading } = useQuery(DATA_USER_QUERY, {
    variables: { _id: userID },
    fetchPolicy: "cache-and-network"
  });
  if (loading || !data) {
    return <CircularLoading />;
  }

  const dataFN = data.user.first_name;
  const dataLN = data.user.last_name;
  const dataUSER = dataFN + " " + dataLN;
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
      }}
    >
      <div>{dataUSER}</div>
    </div>
  );
};
