import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getAllUser, getProfile, getUserById } from './actions';
import { UserProfile, UsersTable } from '@/types/userTypes';


interface UserState {
  userProfile: UserProfile | null;
  loading: boolean;
  userProfileError: string | null;
  usersLoading: boolean;
  users: UsersTable| null;
  usersError: string | null;
  userDetail: UserProfile | null;
  userDetailLoading: boolean;
  userDetailError: string | null;

}

const initialState: UserState = {
  userProfile: null,
  loading: false,
  userProfileError: null,
  usersLoading: false,
  users: null,
  usersError: null,
  userDetail: null,
  userDetailLoading: false,
  userDetailError: null
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearUser : (state)=>{
      state.userProfile = null;
      state.users = null;
      state.userDetail = null;

    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getProfile.pending, (state) => {
        state.loading = true;
        state.userProfileError = null;
      })
      .addCase(getProfile.fulfilled, (state, action: PayloadAction<UserProfile>) => {
        state.loading = false;
        state.userProfile = action.payload;
      })
      .addCase(getProfile.rejected, (state, action) => {
        state.loading = false;
        state.userProfileError = action.payload?.message || 'Failed to fetch profile';
      })
      .addCase(getAllUser.pending, (state) => {
        state.usersLoading = true;
        state.usersError = null;
      })
      .addCase(getAllUser.fulfilled, (state, action: PayloadAction<UsersTable>) => {
        state.usersLoading = false;
        state.users = action.payload; 
      })
      .addCase(getAllUser.rejected, (state, action) => {
        state.usersLoading = false;
        state.usersError = action.payload?.message || 'Failed to fetch profile';
      })
      .addCase(getUserById.pending, (state) => {
        state.userDetailLoading = true;
        state.userDetailError = null;
      })
      .addCase(getUserById.fulfilled, (state, action: PayloadAction<UserProfile>) => {
        state.userDetailLoading = false;
        state.userDetail = action.payload; 
      })
      .addCase(getUserById.rejected, (state, action) => {
        state.userDetailLoading = false;
        state.userDetailError = action.payload?.message || 'Failed to fetch profile';
      });
  },
});
export const { clearUser } = userSlice.actions;

export default userSlice.reducer;
