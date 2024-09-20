import MainLayout from "@/layout/mainLayout";
import { getMusicById } from "@/store/music/action";
import { useAppDispatch, useAppSelector } from "@/store/redux-Hooks";
import { Row, Col, Typography, Divider } from "antd";
import React, { useEffect } from "react";
import { useParams } from "react-router-dom";

const { Title, Text } = Typography;

const SongDetail: React.FC = () => {
  const dispatch = useAppDispatch();
  const { artistId, songId } = useParams();
  
  const { songDetail, songDetailLoading } = useAppSelector(
    (state) => state.song
  );

  useEffect(() => {
    if (songId && artistId) {
      dispatch(getMusicById(`/artists/${artistId}/songs/${songId}`));
    }
  }, [songId, artistId]);

  return (
    <MainLayout>
      <div className="flex items-center justify-center pl-3">
        <div className="w-full max-w-2xl bg-white">
          <Title level={3} className="text-left mb-6 text-blue-700">
            Song Details
          </Title>
          <Divider style={{ borderColor: '#dbeafe' }} />

          <Row gutter={24} className="mb-6">
            <Col span={12}>
              <Text strong className="text-blue-600">Title:</Text>
              <p className="text-gray-900">{songDetail?.title || 'N/A'}</p>
            </Col>
            <Col span={12}>
              <Text strong className="text-blue-600">Artist ID:</Text>
              <p className="text-gray-900">{songDetail?.artist_id || 'N/A'}</p>
            </Col>
          </Row>

          <Row gutter={24} className="mb-6">
            <Col span={12}>
              <Text strong className="text-blue-600">Album Name:</Text>
              <p className="text-gray-900">{songDetail?.album_name || 'N/A'}</p>
            </Col>
            <Col span={12}>
              <Text strong className="text-blue-600">Genre:</Text>
              <p className="text-gray-900">{songDetail?.genre || 'N/A'}</p>
            </Col>
          </Row>

          <Divider style={{ borderColor: '#dbeafe' }} />

          <div className="text-left mt-6">
            <Title level={4} className="text-blue-700">Additional Information</Title>
            <p className="text-gray-800">
              <Text strong className="text-blue-600">Created At:</Text>{' '}
              {songDetail?.created_at ? new Date(songDetail.created_at).toLocaleDateString() : 'N/A'}
            </p>
            <p className="text-gray-800">
              <Text strong className="text-blue-600">Updated At:</Text>{' '}
              {songDetail?.updated_at ? new Date(songDetail.updated_at).toLocaleDateString() : 'N/A'}
            </p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default SongDetail;
