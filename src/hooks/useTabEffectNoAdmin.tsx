import { useEffect, useContext } from "react";
import { useLocation } from "react-router-dom";
import { TabContext } from "../App";

export const useTabEffectNoAdmin = () => {
  const { tabIndex, setTabIndex } = useContext(TabContext);
  const location = useLocation();
  const ALL_ROUTES = [
    "/",
    "/addblogpost",
    "/article",
    "/bloglist",
    "/userlist",
  ];

  useEffect(() => {
    const pathIndex = ALL_ROUTES.findIndex((val) => {
      return val === location.pathname;
    });

    if (pathIndex === 3) {
      setTabIndex(2);
      return;
    }

    if (pathIndex >= 0) {
      setTabIndex(pathIndex);
    }
  }, [location, ALL_ROUTES, setTabIndex]);

  return tabIndex;
};
