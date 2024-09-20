import React from "react";
import { FieldConfig } from "@/types/formTypes";
import MainLayout from "@/layout/mainLayout";
import GeneralForm from "@/components/Form";
import axiosInstance from "@/shared/axiosInstance";
import { useAppDispatch } from "@/store/redux-Hooks";
import { useNavigate, useParams } from "react-router-dom";
import { getAllMusic } from "@/store/music/action";

const CreateMusic: React.FC = () => {
  const dispatch = useAppDispatch();
  const { artistId } = useParams();
  const navigate = useNavigate();

  const createSongFields: FieldConfig<{
    title: string;
    album_name?: string;
    genre: string;
  
  }>[] = [
    {
      name: "title",
      label: "Title",
      type: "text",
      rules: [
        { required: true, message: "Song title is required" },
        {
          max: 100,
          message: "Title should not exceed 100 characters",
        },
      ],
      colSpan: 12,
    },
    {
      name: "album_name",
      label: "Album Name",
      type: "text",
      rules: [
        {
          max: 255,
          message: "Album name should not exceed 255 characters",
        },
      ],
      colSpan: 12,
    },
    {
      name: "genre",
      label: "Genre",
      type: "select",
      options: [
        { value: "rnb", label: "R&B" },
        { value: "country", label: "Country" },
        { value: "classic", label: "Classic" },
        { value: "rock", label: "Rock" },
        { value: "jazz", label: "Jazz" },
      ],
      rules: [{ required: true, message: "Please select a genre" }],
      colSpan: 12,
    },
  ];

  const handleCreateSongs = async (values: {
    title: string;
    album_name?: string;
    genre: string;
  
  }) => {
    const response = await axiosInstance.post(`/artists/${artistId}/songs/create`, values);
    if (response?.status === 201) {
      dispatch(getAllMusic(`/artists/${artistId}/songs`));
      navigate(`/artists/${artistId}/songs`);
      return response;
    }
  };

  return (
    <MainLayout>
      <GeneralForm
        fields={createSongFields}
        formTitle="Create Artist"
        onSubmit={handleCreateSongs}
        textRight={true}
        submitButtonText="Create"
        layout="vertical"
      />
    </MainLayout>
  );
};
export default CreateMusic;
