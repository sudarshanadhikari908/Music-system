import GeneralForm from "@/components/Form";
import MainLayout from "@/layout/mainLayout";
import axiosInstance from "@/shared/axiosInstance";
import { getAllMusic, getMusicById } from "@/store/music/action";
import { useAppDispatch, useAppSelector } from "@/store/redux-Hooks";
import { FieldConfig } from "@/types/formTypes";
import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

const UpdateMusic: React.FC = () => {
  const dispatch = useAppDispatch();
  const { artistId, songId } = useParams();
  const navigate = useNavigate();

  const { songDetail, songDetailLoading } = useAppSelector(
    (state) => state.song
  );

  const updateSongFields: FieldConfig<{
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

  const handleUpdateArtist = async (values: {
    title: string;
    album_name?: string;
    genre: string;
  }) => {
   
    const response = await axiosInstance.put(`/artists/${artistId}/songs/${songId}`, values);
    if (response?.status === 200) {
        dispatch(getAllMusic(`/artists/${artistId}/songs`));
        navigate(`/artists/${artistId}/songs`);
        return response;
    }
  };

  useEffect(() => {
    if (songId && artistId) {
      dispatch(getMusicById(`/artists/${artistId}/songs/${songId}`));
    }
  }, [songId, artistId]);
  return (
    <MainLayout>
      {!songDetailLoading && songDetail && (
        <>
          <GeneralForm
            fields={updateSongFields}
            formTitle="Update User"
            onSubmit={handleUpdateArtist}
            textRight={true}
            submitButtonText="Update"
            layout="vertical"
            initialValues={songDetail}
          />
        </>
      )}
    </MainLayout>
  );
};

export default UpdateMusic;
