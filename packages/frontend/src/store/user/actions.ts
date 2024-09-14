import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { UserProfile } from '@/types/userTypes';
import axiosInstance from '@/shared/axiosInstance';

interface ErrorResponse {
  message?: string;
}

export const getProfile = createAsyncThunk<UserProfile, string, { rejectValue: ErrorResponse }>(
  'user/getProfile',
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
