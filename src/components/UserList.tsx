import React from "react";
import { useQuery, useMutation } from "@apollo/react-hooks";
import { CircularLoading } from "./CircularLoading";
import { ErrorLoading } from "./ErrorLoading";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import { Typography } from "@material-ui/core";
import { useProtectedPath } from "../components/useProtectedPath";
import { Redirect } from "react-router";
import { USERS_QUERY } from "../queries/queries";
import { REMOVE_USER_MUTATION } from "../queries/mutations";

const useStyles = makeStyles({
  root: {
    width: "60%",
    overflowX: "auto"
  },
  table: {
    minWidth: 650
  }
});

export const UserList: React.FC = () => {
  const classes = useStyles();
  const { data, loading } = useQuery(USERS_QUERY, {
    fetchPolicy: "cache-and-network"
  });
  const accessGrant = useProtectedPath();

  const [removeUser, { error }] = useMutation(REMOVE_USER_MUTATION);

  if (!accessGrant) {
    return <Redirect to="/authorize" />;
  }
  if (loading || !data) {
    return <CircularLoading />;
  }
  if (error) {
    console.log("error", error);
    return <ErrorLoading />;
  }

  console.log("ACCESS GRANT USER LIST", accessGrant);
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        marginTop: "2%",
        marginBottom: "15%"
      }}
    >
      <Paper className={classes.root}>
        <Table className={classes.table} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>
                <Typography variant="h5" color="primary">
                  First Name
                </Typography>
              </TableCell>
              <TableCell>
                {" "}
                <Typography variant="h5" color="primary">
                  Last Name
                </Typography>
              </TableCell>
              <TableCell>
                {" "}
                <Typography variant="h5" color="primary">
                  E-mail
                </Typography>
              </TableCell>
              <TableCell align="right">
                {" "}
                <Typography variant="h5" color="error">
                  Edit
                </Typography>
              </TableCell>
              <TableCell align="right">
                {" "}
                <Typography variant="h5" color="error">
                  Delete
                </Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.users.map(
              (user: {
                _id: string;
                first_name: string;
                last_name: string;
                email: string;
              }) => (
                <TableRow key={user._id}>
                  <TableCell component="th" scope="row">
                    {user.first_name}
                  </TableCell>
                  <TableCell>{user.last_name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell align="right">
                    <IconButton>
                      <EditIcon />
                    </IconButton>
                  </TableCell>
                  <TableCell align="right">
                    <IconButton
                      onClick={() =>
                        removeUser({
                          variables: { _id: user._id },
                          refetchQueries: [{ query: USERS_QUERY }]
                        })
                      }
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              )
            )}
          </TableBody>
        </Table>
      </Paper>
    </div>
  );
};
