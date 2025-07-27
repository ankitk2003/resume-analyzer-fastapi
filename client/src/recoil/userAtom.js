import { atom } from 'recoil';

export const loadingState = atom({
  key: 'loadingState',  
  default: false,       // default is not loading
});
