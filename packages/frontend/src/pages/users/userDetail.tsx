import MainLayout from "@/layout/mainLayout";
import { useAppDispatch, useAppSelector } from "@/store/redux-Hooks";
import { getUserById } from "@/store/user/actions";
import { Row, Col, Avatar, Typography, Divider } from "antd";
import React, { useEffect } from "react";
import { useParams } from "react-router-dom";

const { Title, Text } = Typography;

const UserDetail: React.FC = () => {
  const dispatch = useAppDispatch();
  const { id } = useParams();
  const { userDetail } = useAppSelector((state) => state.user);

  useEffect(() => {
    if (id) {
      dispatch(getUserById(`/user/${id}`));
    }
  }, [id, dispatch]);

  return (
    <MainLayout>
      <div className="flex items-center justify-center pl-3">
        <div className="w-full max-w-2xl bg-white ">
          <div className="flex justify-start mb-8">
            <Avatar
              size={120}
              src={`https://joeschmoe.io/api/v1/${userDetail?.username}`}
              className="border-4 border-blue-500"
            />
          </div>
          <Title level={3} className="text-left mb-6 text-blue-700">
            User Details
          </Title>
          <Divider style={{ borderColor: '#dbeafe' }} />
          <Row gutter={24} className="mb-6">
            <Col span={12}>
              <Text strong className="text-blue-600">First Name:</Text>
              <p className="text-gray-900">{userDetail?.first_name || 'N/A'}</p>
            </Col>
            <Col span={12}>
              <Text strong className="text-blue-600">Last Name:</Text>
              <p className="text-gray-900">{userDetail?.last_name || 'N/A'}</p>
            </Col>
          </Row>
          <Row gutter={24} className="mb-6">
            <Col span={12}>
              <Text strong className="text-blue-600">Username:</Text>
              <p className="text-gray-900">{userDetail?.username || 'N/A'}</p>
            </Col>
            <Col span={12}>
              <Text strong className="text-blue-600">Email:</Text>
              <p className="text-gray-900">{userDetail?.email || 'N/A'}</p>
            </Col>
          </Row>
          <Row gutter={24} className="mb-6">
            <Col span={12}>
              <Text strong className="text-blue-600">Role:</Text>
              <p className="text-gray-900">{userDetail?.role || 'N/A'}</p>
            </Col>
            <Col span={12}>
              <Text strong className="text-blue-600">Mobile Number:</Text>
              <p className="text-gray-900">{userDetail?.mobile_number || 'N/A'}</p>
            </Col>
          </Row>
          <Row gutter={24} className="mb-6">
            <Col span={12}>
              <Text strong className="text-blue-600">Date of Birth:</Text>
              <p className="text-gray-900">
                {userDetail?.dob ? new Date(userDetail.dob).toLocaleDateString() : 'N/A'}
              </p>
            </Col>
            <Col span={12}>
              <Text strong className="text-blue-600">Gender:</Text>
              <p className="text-gray-900">
                {userDetail?.gender === 'F' ? 'Female' : 'Male' || 'N/A'}
              </p>
            </Col>
          </Row>
          <Row gutter={24} className="mb-6">
            <Col span={24}>
              <Text strong className="text-blue-600">Address:</Text>
              <p className="text-gray-900">{userDetail?.address || 'N/A'}</p>
            </Col>
          </Row>
          <Divider style={{ borderColor: '#dbeafe' }} />
          <div className="text-left mt-6">
            <Title level={4} className="text-blue-700">Contact Information</Title>
            <p className="text-gray-800 mb-2">Feel free to reach out via email or phone.</p>
            <p className="text-gray-800">
              <Text strong className="text-blue-600">Email:</Text> {userDetail?.email || 'N/A'}
            </p>
            <p className="text-gray-800">
              <Text strong className="text-blue-600">Phone:</Text> {userDetail?.mobile_number || 'N/A'}
            </p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default UserDetail;
