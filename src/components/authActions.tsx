import { store } from "./store";

export function login() {
  store.setState({
    authorized: true,
    email: "sanel@sanel.com",
    password: "sanel"
  });
}

export function logout() {
  store.setState({
    authorized: false,
    email: "",
    password: ""
  });
}
