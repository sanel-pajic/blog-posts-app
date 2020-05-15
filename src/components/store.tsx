import { Store } from "react-stores";

interface IStoreState {
  authorized: boolean;
  token: string;
  userId: string;
  tokenExpiration: number;
}

export const store = new Store<IStoreState>(
  {
    authorized: false,
    token: "",
    userId: "",
    tokenExpiration: 0,
  },
  {
    persistence: true,
    uniqKey: "store-blog-post",
  }
);
