import React from "react";
import MUIDataTable, { MUIDataTableOptions } from "mui-datatables";
import { useQuery, useMutation } from "@apollo/react-hooks";
import { CircularLoading } from "./CircularLoading";
import { ErrorLoading } from "./ErrorLoading";
import { Button, Typography } from "@material-ui/core";
import * as R from "ramda";
import { USERS_QUERY } from "../graphql-queries-mutations/queries";
import { REMOVE_USER_MUTATION } from "../graphql-queries-mutations/mutations";
import { green, red } from "@material-ui/core/colors";

export const MUITableUsers: React.FC = () => {
  const { data, loading } = useQuery(USERS_QUERY, {
    fetchPolicy: "cache-and-network",
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
    { label: "Is Admin", name: "isAdmin" },
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
                  update: (proxy) => {
                    const data = proxy.readQuery({
                      query: USERS_QUERY,
                    });
                    const updatedData = R.over(
                      R.lensProp("users"),
                      R.reject(R.propEq("_id", userId)),
                      data
                    );

                    proxy.writeQuery({ query: USERS_QUERY, data: updatedData });
                  },
                })
              }
            >
              Delete
            </Button>
          );
        },
      },
    },
  ];

  const options: MUIDataTableOptions = {
    filterType: "dropdown",
    responsive: "stacked",
    fixedHeader: true,
  };

  return (
    <div
      style={{
        display: "block",
        marginLeft: "auto",
        marginRight: "auto",
        width: "50%",
        marginTop: "3%",
        marginBottom: "5%",
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
            isAdmin: boolean;
          }) => {
            return [
              user.first_name,
              user.last_name,
              user.email,
              user.isAdmin === true ? (
                <Typography style={{ color: green[500] }}>YES</Typography>
              ) : (
                <Typography style={{ color: red[500] }}>NO</Typography>
              ),
            ];
          }
        )}
        columns={columns}
        options={options}
      />
    </div>
  );
};
