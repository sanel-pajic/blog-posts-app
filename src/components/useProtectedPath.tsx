import { useStore } from 'react-stores';
import { store } from './store';
import { useRouteMatch } from 'react-router';

const PROTECTED_PATHS = ['/addblogpost'];

export const useProtectedPath = () => {
  const { authorized } = useStore(store);
  const match = useRouteMatch();
  const protectedPath =
    PROTECTED_PATHS.indexOf((match && match.path) || '') >= 0;
  const accessGrant = !protectedPath || (protectedPath && authorized);

  return accessGrant;
};