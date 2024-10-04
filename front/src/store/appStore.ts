import {writable, get} from 'svelte/store'
export class AppStore {
  page = "";
  footer = false;
  cardIndex = 0;
  tabIdx = 0;
}
export const app = writable<AppStore>(new AppStore());
