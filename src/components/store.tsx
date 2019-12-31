import { Store } from 'react-stores';

interface IStoreState {
  authorized: boolean;
  email:string;
  password:string
}

export const store = new Store<IStoreState>(
  {
    authorized: false,
    email:"",
    password:""
  },
  {
    persistence: true
  }
);