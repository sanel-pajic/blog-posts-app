import React, { useState } from "react";
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
import { Typography, TextField } from "@material-ui/core";
import { useProtectedPath } from "../components/useProtectedPath";
import { Redirect } from "react-router";
import { USERS_QUERY } from "../queries/queries";
import { REMOVE_USER_MUTATION, UPDATE_USER } from "../queries/mutations";
import CheckIcon from "@material-ui/icons/Check";

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
  const [editingID, setEditingID] = useState<null | string>(null);
  const [editedFirstName, setEditedFirstName] = useState("");
  const [editedLastName, setEditedLastName] = useState("");
  const [editedEmail, setEditedEmail] = useState("");
  const { data, loading } = useQuery(USERS_QUERY, {
    fetchPolicy: "cache-and-network"
  });
  const accessGrant = useProtectedPath();

  const [removeUser, { error }] = useMutation(REMOVE_USER_MUTATION);

  const [editUser, { error: errorEditUser }] = useMutation(UPDATE_USER, {
    update: (cache, { data }) => {
      const previousData: any = cache.readQuery({
        query: USERS_QUERY
      });

      console.log(
        "DATA QUERY REMOVE COMMENT LIKE",
        data,
        "PREVIOUS QUERY REMOVE COMMENT LIKE",
        previousData
      );
    }
  });

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

  if (errorEditUser) {
    console.log("error", errorEditUser);
  }

  // console.log("ACCESS GRANT USER LIST", accessGrant);

  const handleEditingFirstNameChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { value } = e.target;
    setEditedFirstName(value);
  };

  const handleEditingLastNameChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { value } = e.target;
    setEditedLastName(value);
  };

  const handleEditingEmailChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { value } = e.target;
    setEditedEmail(value);
  };

  const inputProps = {
    step: 300
  };

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
                  {editingID !== user._id ? (
                    <TableCell component="th" scope="row">
                      {user.first_name}
                    </TableCell>
                  ) : (
                    <TableCell component="th" scope="row">
                      <TextField
                        variant="outlined"
                        fullWidth
                        inputProps={inputProps}
                        value={editedFirstName}
                        onChange={handleEditingFirstNameChange}
                      />
                    </TableCell>
                  )}
                  {editingID !== user._id ? (
                    <TableCell>{user.last_name}</TableCell>
                  ) : (
                    <TableCell component="th" scope="row">
                      <TextField
                        variant="outlined"
                        fullWidth
                        inputProps={inputProps}
                        value={editedLastName}
                        onChange={handleEditingLastNameChange}
                      />
                    </TableCell>
                  )}
                  {editingID !== user._id ? (
                    <TableCell>{user.email}</TableCell>
                  ) : (
                    <TableCell component="th" scope="row">
                      <TextField
                        variant="outlined"
                        fullWidth
                        inputProps={inputProps}
                        value={editedEmail}
                        onChange={handleEditingEmailChange}
                      />
                    </TableCell>
                  )}

                  <TableCell align="right">
                    <IconButton>
                      {editingID === user._id ? (
                        <CheckIcon
                          onClick={() => {
                            editUser({
                              variables: {
                                data: {
                                  _id: user._id,
                                  first_name: editedFirstName,
                                  last_name: editedLastName,
                                  email: editedEmail
                                }
                              }
                            }).catch(error => console.log("error", error));
                            setEditingID(null);
                          }}
                        />
                      ) : (
                        <EditIcon
                          onClick={() => {
                            setEditingID(user._id);
                            setEditedFirstName(user.first_name);
                            setEditedLastName(user.last_name);
                            setEditedEmail(user.email);
                          }}
                        />
                      )}
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
