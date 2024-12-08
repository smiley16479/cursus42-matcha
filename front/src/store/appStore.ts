import {writable, get} from 'svelte/store'
export class AppStore {
  page = "";
  footer = false;
  cardIndex = 0;
  offset = 0;
  tabIdx = 0;
  loadingSpinner = false;
  profilConsult = false;
}
export const app = writable<AppStore>(new AppStore());
