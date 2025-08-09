import { RootState } from '../store';
import { UserInterface } from '@/shared/interfaces/user.interface';

const selectUser = (state: RootState): UserInterface | null => state.auth.user;
const selectLoadingStatus = (state: RootState): 'loading' | 'loaded' | 'idle' =>
  state.auth.loadingStatus;

const authSelector = {
  selectUser,
  selectLoadingStatus,
};
export default authSelector;
