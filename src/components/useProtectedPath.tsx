import { useStore } from "react-stores";
import { store } from "./store";
import { useRouteMatch } from "react-router";

const PROTECTED_PATHS = ["/userlist", "/addblogpost", "/article"];

export const useProtectedPath = () => {
  const { authorized, token, userId } = useStore(store);
  const match = useRouteMatch();
  const protectedPath =
    PROTECTED_PATHS.indexOf((match && match.path) || "") >= 0;
  const accessGrant =
    !protectedPath ||
    (protectedPath && authorized) ||
    (protectedPath && token) ||
    (protectedPath && userId);

  return accessGrant;
};
