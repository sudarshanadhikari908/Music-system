import { useNavigate } from "react-router-dom";
import { Button } from "antd";
import GeneralForm from "@/components/Form";
import { FieldConfig } from "@/types/formTypes";
import AuthLayout from "@/layout/authLayout";
import axiosInstance from "@/shared/axiosInstance";
import { useAppDispatch } from "@/store/redux-Hooks";
import { getProfile } from "@/store/user/actions";

const LoginForm = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const loginFields: FieldConfig<{ email: string; password: string }>[] = [
    {
      name: "email",
      label: "Email",
      type: "email",
      rules: [
        { required: true, message: "Please enter your email" },
        { type: "email", message: "Please enter a valid email" },
      ],
    },
    {
      name: "password",
      label: "Password",
      type: "password",
      rules: [{ required: true, message: "Please enter your password" }],
    },
  ];
  const handleLogin = async (values: { email: string; password: string }) => {
    const response = await axiosInstance.post("/auth/login", {
      email: values.email,
      password: values.password,
    });
    if (response.status === 204) {
      localStorage.setItem('isLoggedIn', 'true')
      dispatch(getProfile("/profile"));
      navigate("/");
      return response;
    }
  };

  return (
    <AuthLayout width={"sm"}>
      <GeneralForm
        fields={loginFields}
        formTitle="Login"
        onSubmit={handleLogin}
        submitButtonText="Login"
        layout="vertical"
      />
      <div className="text-center mt-4">
        <p className="text-gray-600">Don’t have an account?</p>
        <Button
          type="link"
          onClick={() => navigate("/auth/register")}
          style={{ padding: 0, fontSize: "16px" }}
        >
          Register
        </Button>
      </div>
    </AuthLayout>
  );
};

export default LoginForm;
