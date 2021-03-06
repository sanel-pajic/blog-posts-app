import React, { useState } from "react";
import { useQuery, useMutation } from "@apollo/react-hooks";
import { CircularLoading } from "./CircularLoading";
import { ErrorLoading } from "./ErrorLoading";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Typography,
  TextField,
  InputLabel,
  MenuItem,
  FormHelperText,
  FormControl,
  Select,
} from "@material-ui/core";

import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import { useProtectedPath } from "../hooks/useProtectedPath";
import { Redirect } from "react-router";
import { USERS_QUERY } from "../graphql-queries-mutations/queries";
import {
  REMOVE_USER_MUTATION,
  UPDATE_USER,
} from "../graphql-queries-mutations/mutations";
import CheckIcon from "@material-ui/icons/Check";
import { green, red } from "@material-ui/core/colors";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: "70%",
      overflowX: "auto",
    },
    table: {
      minWidth: 650,
    },
  })
);

export const UserList: React.FC = () => {
  const classes = useStyles();
  const [editingID, setEditingID] = useState<null | string>(null);
  const [editedFirstName, setEditedFirstName] = useState("");
  const [editedLastName, setEditedLastName] = useState("");
  const [editedEmail, setEditedEmail] = useState("");
  const [isAdmin, setIsAdmin] = React.useState("false");
  const currentUser: string | null = localStorage.getItem("userId");

  const { data, loading } = useQuery(USERS_QUERY, {
    fetchPolicy: "cache-and-network",
  });
  const accessGrant = useProtectedPath();

  const [removeUser, { error }] = useMutation(REMOVE_USER_MUTATION);

  const [editUser, { error: errorEditUser }] = useMutation(UPDATE_USER);

  if (!accessGrant) {
    return <Redirect to="/authorize" />;
  }
  if (loading || !data) {
    return <CircularLoading />;
  }
  if (error) {
    return <ErrorLoading />;
  }

  if (errorEditUser) {
    alert(errorEditUser);
  }

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
    step: 300,
  };

  const handleChangeIsAdmin = (
    event: React.ChangeEvent<{ value: unknown }>
  ) => {
    setIsAdmin(event.target.value as string);
  };

  const isAdminData = data.users.find(
    (user: { _id: string; isAdmin: boolean }) =>
      user._id === currentUser && user.isAdmin === true
  );

  if (isAdminData === undefined) {
    return <Redirect to="/authorize" />;
  }

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        marginTop: "2%",
        marginBottom: "15%",
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
              <TableCell align="center">
                {" "}
                <Typography variant="h5" style={{ color: green[600] }}>
                  Is Admin
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
                isAdmin: boolean;
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

                  {editingID !== user._id ? (
                    <TableCell component="th" scope="row" align="center">
                      {user.isAdmin === true ? (
                        <Typography style={{ color: green[500] }}>
                          YES
                        </Typography>
                      ) : (
                        <Typography style={{ color: red[500] }}>NO</Typography>
                      )}
                    </TableCell>
                  ) : (
                    <TableCell>
                      <FormControl fullWidth>
                        <InputLabel style={{ marginRight: 15 }} id={user._id}>
                          Is Admin
                        </InputLabel>
                        <Select
                          variant="outlined"
                          value={isAdmin}
                          onChange={handleChangeIsAdmin}
                        >
                          <MenuItem value={"true"}>YES</MenuItem>
                          <MenuItem value={"false"}>NO</MenuItem>
                        </Select>
                        <FormHelperText>Choose admin option.</FormHelperText>
                      </FormControl>
                    </TableCell>
                  )}

                  <TableCell align="right">
                    <IconButton>
                      {editingID === user._id ? (
                        <div>
                          <CheckIcon
                            onClick={() => {
                              editUser({
                                variables: {
                                  data: {
                                    _id: user._id,
                                    first_name: editedFirstName,
                                    last_name: editedLastName,
                                    email: editedEmail,
                                    isAdmin: isAdmin === "true" ? true : false,
                                  },
                                },
                              }).catch((error) => {
                                alert(error);
                              });
                              setEditingID(null);
                            }}
                          />
                        </div>
                      ) : (
                        <div>
                          <EditIcon
                            onClick={() => {
                              setEditingID(user._id);
                              setEditedFirstName(user.first_name);
                              setEditedLastName(user.last_name);
                              setEditedEmail(user.email);
                              setIsAdmin(user.isAdmin ? "true" : "false");
                            }}
                          />
                        </div>
                      )}
                    </IconButton>
                  </TableCell>
                  <TableCell align="right">
                    <IconButton
                      onClick={() =>
                        removeUser({
                          variables: { _id: user._id },
                          refetchQueries: [{ query: USERS_QUERY }],
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
