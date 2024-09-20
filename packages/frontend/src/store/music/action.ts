import axiosInstance from "@/shared/axiosInstance";
import { Song, SongTable } from "@/types/musicTypes";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";


interface ErrorResponse {
    message?: string;
  }

export const getAllMusic = createAsyncThunk<
SongTable,
  string,
  { rejectValue: ErrorResponse }
>("musics/getAllMusic", async (endpoint, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get(endpoint);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return rejectWithValue(error.response.data as ErrorResponse);
    }
    return rejectWithValue({ message: "An unexpected error occurred" });
  }
});


export const getMusicById= createAsyncThunk<Song, string, { rejectValue: ErrorResponse }>(
  'music/getMusicById',
  async (endpoint, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(endpoint);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data as ErrorResponse);
      }
      return rejectWithValue({ message: 'An unexpected error occurred' });
    }
  }
);
