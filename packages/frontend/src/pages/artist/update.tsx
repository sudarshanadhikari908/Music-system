import GeneralForm from "@/components/Form";
import MainLayout from "@/layout/mainLayout";
import axiosInstance from "@/shared/axiosInstance";
import { getAllArtist, getArtistById } from "@/store/artist/action";
import { useAppDispatch, useAppSelector } from "@/store/redux-Hooks";
import { FieldConfig } from "@/types/formTypes";
import moment from "moment";
import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

const UpdateArtist: React.FC = () => {
  const dispatch = useAppDispatch();
  const { id } = useParams();
  const navigate = useNavigate();

  const { artistDetail, artistDetailLoading } = useAppSelector(
    (state) => state.artist
  );

  const formattedArtistDetail = {
    ...artistDetail,
    dob: artistDetail?.dob ? moment(artistDetail.dob) : null,
  };

  const updateArtistFields: FieldConfig<{
    name: string;
    dob?: string;
    gender?: string;
    address?: string;
    no_of_albums_released?: number;
    bio?: string;
    first_release_year?: number;
  }>[] = [
    {
      name: "name",
      label: "Name",
      type: "text",
      rules: [
        { required: true, message: "Name is required" },
        {
          pattern: /^[A-Za-z\s]+$/,
          message: "Name should contain only alphabetic characters and spaces",
        },
      ],
      colSpan: 12,
    },

    {
      name: "gender",
      label: "Gender",
      type: "select",
      options: [
        { value: "M", label: "Male" },
        { value: "F", label: "Female" },
        { value: "O", label: "Other" },
      ],
      colSpan: 12,
    },
    {
      name: "address",
      label: "Address",
      type: "text",
      colSpan: 12,
    },
    {
      name: "no_of_albums_released",
      label: "Number of Albums Released",
      type: "number",
      colSpan: 12,
    },
    {
      name: "bio",
      label: "Bio",
      type: "textarea",
      colSpan: 12,
    },
    {
      name: "first_release_year",
      label: "First Release Year",
      type: "number",
      rules: [
        {
          type: "number",
          min: 1900,
          max: new Date().getFullYear(),
          transform: (value: any) => Number(value),
          message: "First release year must be a valid year",
        },
      ],
      colSpan: 12,
    },
    {
      name: "dob",
      label: "Date of Birth",
      type: "date",
      rules: [{ type: "date", message: "Date of birth must be a valid date" }],
      colSpan: 12,
    },
  ];

  const handleUpdateArtist = async (values: {
    name: string;
    dob?: string;
    gender?: string;
    address?: string;
    no_of_albums_released?: number;
    bio?: string;
    first_release_year?: number;
  }) => {
    const formattedValues = {
      ...values,
      dob: values.dob ? moment(values.dob).format("YYYY-MM-DD") : undefined,
    };
    const response = await axiosInstance.put(`/artist/${id}`, formattedValues);
    if (response?.status === 200) {
      dispatch(getAllArtist("/artists"));
      navigate("/artists");
      return response;
    }
  };

  useEffect(() => {
    if (id) {
      dispatch(getArtistById(`/artist/${id}`));
    }
  }, [id]);
  return (
    <MainLayout>
      {!artistDetailLoading && artistDetail && (
        <>
          <GeneralForm
            fields={updateArtistFields}
            formTitle="Update User"
            onSubmit={handleUpdateArtist}
            textRight={true}
            submitButtonText="Update"
            layout="vertical"
            initialValues={formattedArtistDetail}
          />
        </>
      )}
    </MainLayout>
  );
};

export default UpdateArtist;
