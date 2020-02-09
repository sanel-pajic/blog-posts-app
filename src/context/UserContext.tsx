import React, { useContext } from "react";

export const UserContext = React.createContext({ token: null, userId: null });

const value = useContext(UserContext);

console.log(value);
