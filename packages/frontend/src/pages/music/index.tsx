import CustomTable from "@/components/Table";
import MainLayout from "@/layout/mainLayout";
import axiosInstance from "@/shared/axiosInstance";
import { getAllMusic } from "@/store/music/action";
import { useAppDispatch, useAppSelector } from "@/store/redux-Hooks";
import { Song } from "@/types/musicTypes";
import { PaginationType } from "@/types/paginationType";
import showNotification from "@/utils/notification.util";
import { PlusCircleOutlined } from '@ant-design/icons';

import { Button } from "antd";
import { ColumnsType } from "antd/es/table";
import axios from "axios";
import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

const Musics: React.FC = () => {
  const dispatch = useAppDispatch();
  const { artistId } = useParams();
  const navigate = useNavigate();
  const {songs, songsLoading} = useAppSelector((state)=>state.song)

  const columns: ColumnsType<Song> = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      render: (text: string) => <span>{text || "N/A"}</span>,
    },
    {
      title: "Artist ID",
      dataIndex: "artist_id",
      key: "artist_id",
      render: (text: number) => <span>{text ?? "N/A"}</span>,
    },
    {
      title: "Album Name",
      dataIndex: "album_name",
      key: "album_name",
      render: (text: string) => <span>{text || "N/A"}</span>,
    },
    {
      title: "Genre",
      dataIndex: "genre",
      key: "genre",
      render: (text: string) => <span>{text || "N/A"}</span>,
    },
  ];

  const handleCreate = () => {
    navigate(`/artist/${artistId}/song/create`);
  };

  const handleEdit = (record: Song) => {
    navigate(`/artist/${artistId}/song/update/${record?.id}`);
  };

  const handleDelete = async (record: Song) => {
    try {
      const response = await axiosInstance.delete(`/artists/${artistId}/songs/${record?.id}`);
      if (response?.status === 200) {
        showNotification("success", response?.data?.message);
        dispatch(getAllMusic(`/artists/${artistId}/songs`));
      }
    } catch (e) {
      if (axios.isAxiosError(e)) {
        const errorMessage =
          e.response?.data?.message || "An unexpected error occurred.";
        showNotification("error", errorMessage);
      }
    }
  };

  const onRowClick = (id: number) => {
    navigate(`/artist/${artistId}/song/${id}`);
  };

  const pageChange = ({ pageSize, currentPage }: PaginationType) => {
    dispatch(
      getAllMusic(
        `/artists/${artistId}/songs/?page=${currentPage}&pageSize=${pageSize}`
      )
    );
  };

  useEffect(() => {
    dispatch(getAllMusic(`/artists/${artistId}/songs`));
  }, []);

  return (
    <MainLayout>
      <div className="p-4">
        <h1 className="text-xl mb-4">Songs List</h1>
        <div className="mb-4 flex justify-end">
          <Button type="primary" onClick={handleCreate}>
            <PlusCircleOutlined className="mr-2" />
            Create
          </Button>
        </div>
        <CustomTable
          data={songs?.data || []}
          columns={columns}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onRowClick={onRowClick}
          loading={songsLoading}
          pageChange={pageChange}
          total={songs?.total}
        />
      </div>
    </MainLayout>
  );
};

export default Musics;
