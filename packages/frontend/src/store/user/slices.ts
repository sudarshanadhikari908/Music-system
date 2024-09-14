import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getProfile } from './actions';
import { UserProfile } from '@/types/userTypes';


interface UserState {
  userProfile: UserProfile | null;
  loading: boolean;
  userProfileError: string | null;
}

const initialState: UserState = {
  userProfile: null,
  loading: false,
  userProfileError: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
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
      });
  },
});

export default userSlice.reducer;
