import MainLayout from "@/layout/mainLayout";
import { useAppDispatch, useAppSelector } from "@/store/redux-Hooks";
import { getArtistById } from "@/store/artist/action";
import { Row, Col, Avatar, Typography, Divider } from "antd";
import React, { useEffect } from "react";
import { useParams } from "react-router-dom";

const { Title, Text } = Typography;

const ArtistDetail: React.FC = () => {
  const dispatch = useAppDispatch();
  const { id } = useParams();
  const { artistDetail } = useAppSelector((state) => state.artist);

  useEffect(() => {
    if (id) {
      dispatch(getArtistById(`/artist/${id}`));
    }
  }, [id, dispatch]);

  return (
    <MainLayout>
      <div className="flex items-center justify-center pl-3">
        <div className="w-full max-w-2xl bg-white">
          <div className="flex justify-start mb-8">
            <Avatar
              size={120}
              src={``}
              className="border-4 border-blue-500"
            />
          </div>
          <Title level={3} className="text-left mb-6 text-blue-700">
            Artist Details
          </Title>
          <Divider style={{ borderColor: '#dbeafe' }} />
          <Row gutter={24} className="mb-6">
            <Col span={12}>
              <Text strong className="text-blue-600">Name:</Text>
              <p className="text-gray-900">{artistDetail?.name || 'N/A'}</p>
            </Col>
            <Col span={12}>
              <Text strong className="text-blue-600">Date of Birth:</Text>
              <p className="text-gray-900">
                {artistDetail?.dob ? new Date(artistDetail.dob).toLocaleDateString() : 'N/A'}
              </p>
            </Col>
          </Row>
          <Row gutter={24} className="mb-6">
            <Col span={12}>
              <Text strong className="text-blue-600">Gender:</Text>
              <p className="text-gray-900">
                {artistDetail?.gender === 'F' ? 'Female' : 'Male' || 'N/A'}
              </p>
            </Col>
            <Col span={12}>
              <Text strong className="text-blue-600">No. of Albums Released:</Text>
              <p className="text-gray-900">{artistDetail?.no_of_albums_released || 'N/A'}</p>
            </Col>
          </Row>
          <Row gutter={24} className="mb-6">
            <Col span={12}>
              <Text strong className="text-blue-600">First Release Year:</Text>
              <p className="text-gray-900">{artistDetail?.first_release_year || 'N/A'}</p>
            </Col>
            <Col span={12}>
              <Text strong className="text-blue-600">Biography:</Text>
              <p className="text-gray-900">{artistDetail?.bio || 'N/A'}</p>
            </Col>
          </Row>
          <Divider style={{ borderColor: '#dbeafe' }} />
          <div className="text-left mt-6">
            <Title level={4} className="text-blue-700">Additional Information</Title>
            <p className="text-gray-800">
              <Text strong className="text-blue-600">Created At:</Text> {artistDetail?.created_at ? new Date(artistDetail.created_at).toLocaleDateString() : 'N/A'}
            </p>
            <p className="text-gray-800">
              <Text strong className="text-blue-600">Updated At:</Text> {artistDetail?.updated_at ? new Date(artistDetail.updated_at).toLocaleDateString() : 'N/A'}
            </p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default ArtistDetail;
