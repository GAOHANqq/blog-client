import { createStore } from 'vuex';
import app,{IAppStore} from '@/store/modules/app';
import user,{IUserStore} from '@/store/modules/user';

export interface IGlobalState{
  app: IAppStore;
  user: IUserStore;
}
const store = createStore<IGlobalState>({
  actions: {
  },
  modules: {
    app,
    user
  }
});
export default store;