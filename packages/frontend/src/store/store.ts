import { configureStore } from "@reduxjs/toolkit";
import userSlice from './user/slices'
import artistSlice from './artist/slices'
import songSlice from './music/slices'



export const store = configureStore({
  reducer: {
   user: userSlice,
   artist: artistSlice,
   song: songSlice
  },
});


export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;