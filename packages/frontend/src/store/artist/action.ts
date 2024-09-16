import axiosInstance from "@/shared/axiosInstance";
import { Artist, ArtistTable } from "@/types/artistTypes";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

interface ErrorResponse {
  message?: string;
}

export const getAllArtist = createAsyncThunk<
  ArtistTable,
  string,
  { rejectValue: ErrorResponse }
>("artist/getAllArtist", async (endpoint, { rejectWithValue }) => {
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

export const getArtistById= createAsyncThunk<Artist, string, { rejectValue: ErrorResponse }>(
    'artist/getArtistById',
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
