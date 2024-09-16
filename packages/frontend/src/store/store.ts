import { configureStore } from "@reduxjs/toolkit";
import userSlice from './user/slices'
import artistSlice from './artist/slices'


export const store = configureStore({
  reducer: {
   user: userSlice,
   artist: artistSlice
  },
});


export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;