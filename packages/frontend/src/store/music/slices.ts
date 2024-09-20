import { Song, SongTable } from "@/types/musicTypes";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getAllMusic, getMusicById } from "./action";

interface MusicState {
  songs: SongTable | null;
  songsLoading: boolean;
  songsError: string | null;
  songDetail: Song | null;
  songDetailLoading: boolean;
  songDetailError: string | null;
}

const initialState : MusicState = {
    songs: null,
    songsLoading: false,
    songsError: null,
    songDetail: null,
    songDetailLoading: false,
    songDetailError: null
}

const songSlice = createSlice({
    name: 'music',
    initialState,
    reducers: {
        clearArtist: (state)=>{
            state.songs = null;
            state.songDetail =  null;
        }
    },
    extraReducers: (builder)=>{
        builder
        .addCase(getAllMusic.pending, (state) => {
          state.songsLoading = true;
          state.songsError = null;
        })
        .addCase(getAllMusic.fulfilled, (state, action: PayloadAction<SongTable>) => {
          state.songsLoading = false;
          state.songs = action.payload;
        })
        .addCase(getAllMusic.rejected, (state, action) => {
          state.songsLoading = false;
          state.songsError = action.payload?.message || 'Failed to fetch profile';
        })
        builder
        .addCase(getMusicById.pending, (state) => {
          state.songDetailLoading = true;
          state.songDetailError = null;
        })
        .addCase(getMusicById.fulfilled, (state, action: PayloadAction<Song>) => {
          state.songDetailLoading = false;
          state.songDetail = action.payload;
        })
        .addCase(getMusicById.rejected, (state, action) => {
          state.songDetailLoading = false;
          state.songDetailError = action.payload?.message || 'Failed to fetch profile';
        })
    }
})

export default songSlice.reducer;