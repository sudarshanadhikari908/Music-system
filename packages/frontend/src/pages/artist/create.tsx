import GeneralForm from "@/components/Form";
import MainLayout from "@/layout/mainLayout";
import axiosInstance from "@/shared/axiosInstance";
import { getAllArtist } from "@/store/artist/action";
import { useAppDispatch } from "@/store/redux-Hooks";
import { FieldConfig } from "@/types/formTypes";
import moment from "moment";
import React from "react";
import { useNavigate } from "react-router-dom";

const CreateArtist: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const createArtistFields: FieldConfig<{
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

  const handleCreateArtist = async (values: {
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
    const response = await axiosInstance.post("/artist/create", formattedValues);
    if (response?.status === 201) {
      dispatch(getAllArtist("/artists"));
      navigate("/artists");
      return response;
    }
  };
  return (
    <MainLayout>
      <GeneralForm
        fields={createArtistFields}
        formTitle="Create Artist"
        onSubmit={handleCreateArtist}
        textRight={true}
        submitButtonText="Create"
        layout="vertical"
      />
    </MainLayout>
  );
};

export default CreateArtist;
