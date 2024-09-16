import GeneralForm from "@/components/Form";
import MainLayout from "@/layout/mainLayout";
import axiosInstance from "@/shared/axiosInstance";
import { useAppDispatch, useAppSelector } from "@/store/redux-Hooks";
import { getAllUser, getUserById } from "@/store/user/actions";
import { FieldConfig } from "@/types/formTypes";
import moment from "moment";
import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

const UpdateUser: React.FC = () => {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const { userDetail, userDetailLoading } = useAppSelector(
    (state) => state.user
  );
  const formattedUserDetail = {
    ...userDetail,
    dob: userDetail?.dob ? moment(userDetail.dob).format("YYYY-MM-DD") : undefined,
  };
  const navigate = useNavigate();

  const updateUserFields: FieldConfig<{
    first_name: string;
    last_name: string;
    username: string;
    email: string;
    password: string;
    mobile_number?: string;
    dob?: string;
    gender?: string;
    address?: string;
    role: string;
  }>[] = [
    {
      name: "first_name",
      label: "First Name",
      type: "text",
      rules: [
        { required: true, message: "First name is required" },
        {
          pattern: /^[A-Za-z]+$/,
          message: "First name should contain only alphabetic characters",
        },
      ],
      colSpan: 12,
    },
    {
      name: "last_name",
      label: "Last Name",
      type: "text",
      rules: [
        { required: true, message: "Last name is required" },
        {
          pattern: /^[A-Za-z]+$/,
          message: "Last name should contain only alphabetic characters",
        },
      ],
      colSpan: 12,
    },
    {
      name: "username",
      label: "Username",
      type: "text",
      rules: [
        { required: true, message: "Username is required" },
        { min: 3, message: "Username must be at least 3 characters long" },
      ],
      colSpan: 12,
    },
    {
      name: "email",
      label: "Email",
      type: "email",
      rules: [
        { required: true, message: "Email is required" },
        { type: "email", message: "Please enter a valid email" },
      ],
      colSpan: 12,
    },
    
    {
      name: "mobile_number",
      label: "Mobile Number",
      type: "text",
      rules: [
        {
          pattern: /^[9][0-9]{9}$/,
          message:
            "Phone number must be a valid 10-digit Nepali number starting with 9",
        },
        { required: false },
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
      name: "role",
      label: "Role",
      type: "select",
      options: [
        { value: "super_admin", label: "Super Admin" },
        { value: "artist_manager", label: "Artist Manager" },
        { value: "artist", label: "Artist" },
      ],
      rules: [{ required: true, message: "Role is required" }],
      colSpan: 12,
    },
    {
      name: "address",
      label: "Address",
      type: "text",
      colSpan: 12,
    },
    {
      name: "dob",
      label: "Date of Birth",
      type: "date",
      rules: [
        { type: "date", message: "Date of birth must be a valid date" },
        { required: false },
      ],
      colSpan: 12,
    },
  ];

  const handleUpdateUser = async (values: {
    first_name: string;
    last_name: string;
    username: string;
    email: string;
    password: string;
    mobile_number?: string;
    dob?: string;
    gender?: string;
    address?: string;
    role: string;
  }) => {
    const formattedValues = {
      ...values,
      dob: values.dob ? moment(values.dob).format("YYYY-MM-DD") : undefined,
    };
    const response = await axiosInstance.put(`/user/${id}`, formattedValues);
    if (response?.status === 200) {
      dispatch(getAllUser("/users"));
      navigate("/");
      return response;
    }
  };

  useEffect(() => {
    if (id) {
      dispatch(getUserById(`/user/${id}`));
    }
  }, [id]);
  return (
    <MainLayout>
      {!userDetailLoading && userDetail && (
        <>
          <GeneralForm
            fields={updateUserFields}
            formTitle="Update User"
            onSubmit={handleUpdateUser}
            textRight={true}
            submitButtonText="Update"
            layout="vertical"
            initialValues={formattedUserDetail}
          />
        </>
      )}
    </MainLayout>
  );
};

export default UpdateUser;
