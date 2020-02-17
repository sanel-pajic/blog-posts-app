import React from "react";
import MUIDataTable, { MUIDataTableOptions } from "mui-datatables";
import { useQuery, useMutation } from "@apollo/react-hooks";
import { CircularLoading } from "./CircularLoading";
import { ErrorLoading } from "./ErrorLoading";
import { Button } from "@material-ui/core";
import * as R from "ramda";
import { USERS_QUERY } from "../queries/queries";
import { REMOVE_USER_MUTATION } from "../queries/mutations";

export const MUITableVjezba: React.FC = () => {
  const { data, loading } = useQuery(USERS_QUERY, {
    fetchPolicy: "cache-and-network"
  });

  console.log("DOCS", data);

  const [removeUser, { error }] = useMutation(REMOVE_USER_MUTATION);

  if (loading || !data) {
    return <CircularLoading />;
  }
  if (error) {
    console.log("error", error);
    return <ErrorLoading />;
  }

  const columns = [
    { label: "First Name", name: "first_name" },
    { label: "Last Name", name: "last_name" },
    { label: "Email", name: "email" },
    { label: "Password", name: "password" },
    {
      name: "Delete",

      sort: false,
      filter: false,
      options: {
        customBodyRender: function deleteGymButton(userId: string) {
          return (
            <Button
              variant="contained"
              color="primary"
              onClick={() =>
                removeUser({
                  variables: { _id: userId },
                  update: proxy => {
                    const data = proxy.readQuery({
                      query: USERS_QUERY
                    });
                    const updatedData = R.over(
                      R.lensProp("users"),
                      R.reject(R.propEq("_id", userId)),
                      data
                    );

                    proxy.writeQuery({ query: USERS_QUERY, data: updatedData });
                  }
                })
              }
            >
              Delete
            </Button>
          );
        }
      }
    }
  ];

  const options: MUIDataTableOptions = {
    filterType: "dropdown",
    responsive: "stacked",
    fixedHeader: true
  };

  return (
    <div
      style={{
        width: "70%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
      }}
    >
      <MUIDataTable
        title="Users"
        data={data.users.map(
          (user: {
            _id: string;
            first_name: string;
            last_name: string;
            email: string;
            password: string;
          }) => {
            return [
              user.first_name,
              user.last_name,
              user.email,
              user.password,
              user._id
            ];
          }
        )}
        columns={columns}
        options={options}
      />
    </div>
  );
};
