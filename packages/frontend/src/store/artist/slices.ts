import { Artist, ArtistTable } from "@/types/artistTypes";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getAllArtist, getArtistById } from "./action";

interface ArtistState {
  artists: ArtistTable | null;
  artistsLoading: boolean;
  artistsError: string | null;
  artistDetail: Artist | null;
  artistDetailLoading: boolean;
  artistDetailError: string | null;
}

const initialState: ArtistState = {
  artists: null,
  artistsLoading: false,
  artistsError: null,
  artistDetail: null,
  artistDetailLoading: false,
  artistDetailError: null
};


const artistSlice = createSlice({
    name: 'artist',
    initialState,
    reducers: {
        clearArtist: (state)=>{
            state.artists = null;
            state.artistDetail =  null;
        }
    },
    extraReducers: (builder)=>{
        builder
        .addCase(getAllArtist.pending, (state) => {
          state.artistsLoading = true;
          state.artistsError = null;
        })
        .addCase(getAllArtist.fulfilled, (state, action: PayloadAction<ArtistTable>) => {
          state.artistsLoading = false;
          state.artists = action.payload;
        })
        .addCase(getAllArtist.rejected, (state, action) => {
          state.artistsLoading = false;
          state.artistsError = action.payload?.message || 'Failed to fetch profile';
        })
        builder
        .addCase(getArtistById.pending, (state) => {
          state.artistDetailLoading = true;
          state.artistDetailError = null;
        })
        .addCase(getArtistById.fulfilled, (state, action: PayloadAction<Artist>) => {
          state.artistDetailLoading = false;
          state.artistDetail = action.payload;
        })
        .addCase(getArtistById.rejected, (state, action) => {
          state.artistDetailLoading = false;
          state.artistDetailError = action.payload?.message || 'Failed to fetch profile';
        })
    }
});
export default artistSlice.reducer;
