import CustomTable from "@/components/Table";
import RoleCheck from "@/hoc/RoleCheck";
import MainLayout from "@/layout/mainLayout";
import axiosInstance from "@/shared/axiosInstance";
import { getAllArtist } from "@/store/artist/action";
import { useAppDispatch, useAppSelector } from "@/store/redux-Hooks";
import { Artist } from "@/types/artistTypes";
import { PaginationType } from "@/types/paginationType";
import showNotification from "@/utils/notification.util";
import { PlusCircleOutlined, NotificationOutlined } from "@ant-design/icons";
import { Button, Upload } from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Artists: React.FC = () => {
  const dispatch = useAppDispatch();
  const { artists, artistsLoading } = useAppSelector((state) => state.artist);
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text: string, record: Artist) => record.name || "N/A",
    },
    {
      title: "Date of Birth",
      key: "dob",
      render: (text: string, record: Artist) => {
        if (!record.dob) {
          return "N/A";
        }
        const dob = new Date(record.dob);
        return dob.toLocaleDateString();
      },
    },
    {
      title: "Gender",
      key: "gender",
      render: (text: string, record: Artist) => {
        switch (record.gender) {
          case "M":
            return "Male";
          case "F":
            return "Female";
          case "O":
            return "Other";
          default:
            return "N/A";
        }
      },
    },
    {
      title: "Address",
      key: "address",
      render: (text: string, record: Artist) => record.address || "N/A",
    },
    {
      title: "Number of Albums Released",
      dataIndex: "no_of_albums_released",
      key: "no_of_albums_released",
      render: (text: string, record: Artist) =>
        record.no_of_albums_released ?? "N/A",
    },
    {
      title: "Bio",
      dataIndex: "bio",
      key: "bio",
      render: (text: string, record: Artist) => record.bio || "N/A",
    },
    {
      title: "First Release Year",
      dataIndex: "first_release_year",
      key: "first_release_year",
      render: (text: string, record: Artist) =>
        record.first_release_year || "N/A",
    },
  ];

  const handleCreate = () => {
    navigate("/artist/create");
  };

  const handleEdit = (record: Artist) => {
    navigate(`/artist/update/${record?.id}`);
  };

  const exportFile = async () => {
    try {
      const response = await axiosInstance.post(`/artist/export`, {
        responseType: "blob",
      });
      if (response?.status === 200) {
        const blob = new Blob([response.data], { type: "text/csv" });
        const downloadUrl = window.URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = downloadUrl;
        link.download = "artists.csv";

        document.body.appendChild(link);
        link.click();

        showNotification(
          "success",
          response.data?.message || "Operation Successful"
        );
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage =
          error.response?.data?.message || "An unexpected error occurred.";
        showNotification("error", errorMessage);
      }
    }
  };

  const handleFileChange = (info: any) => {
    const file = info.fileList[0]?.originFileObj;
    importFile(file);
  };

  const importFile = async (file: File | null) => {
    if (!file) {
      showNotification("error", "No file selected. Please select a file first");
      return;
    }
    const formData = new FormData();
    formData.append("file", file);
    for (let [key, value] of formData.entries()) {
      console.log(key, value);
    }

    try {
      setLoading(true);
      const response = await axiosInstance.post("/artist/import", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 201) {
        showNotification("success", response?.data?.message);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage =
          error.response?.data?.message || "An unexpected error occurred.";
        showNotification("error", errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (record: Artist) => {
    try {
      const response = await axiosInstance.delete(`/artist/${record?.id}`);
      if (response?.status === 200) {
        showNotification("success", response?.data?.message);
        dispatch(getAllArtist("/artists"));
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
    navigate(`/artist/${id}`);
  };

  const pageChange = ({ pageSize, currentPage }: PaginationType) => {
    dispatch(
      getAllArtist(`/artists/?page=${currentPage}&pageSize=${pageSize}`)
    );
  };

  useEffect(() => {
    dispatch(getAllArtist("/artists"));
  }, []);

  return (
    <MainLayout>
      <div className="p-4">
        <h1 className="text-xl mb-4">Artist List</h1>
        <div className="flex">
          <RoleCheck allowedRoles={["artist_manager"]}>
            <Upload
              beforeUpload={() => false}
              onChange={handleFileChange}
              accept=".csv,.xls,.xlsx"
              showUploadList={false}
            >
              <Button loading={loading}>
                <span>Import</span>
              </Button>
            </Upload>
          </RoleCheck>
          <RoleCheck allowedRoles={["artist_manager"]}>
            <Button onClick={exportFile}>Export</Button>
          </RoleCheck>
        </div>
        <RoleCheck allowedRoles={["artist_manager"]}>
          <div className="flex justify-end mb-4">
            <Button type="primary" onClick={handleCreate}>
              <PlusCircleOutlined className="mr-2" />
              Create
            </Button>
          </div>
        </RoleCheck>
        <CustomTable
          data={artists?.data || []}
          columns={columns}
          onEdit={handleEdit}
          onDelete={handleDelete}
          loading={artistsLoading}
          pageChange={pageChange}
          total={artists?.total}
          allowedRoles={['artist_manager']}
          onRowClick={onRowClick}
          additionalAction={(record: Artist) => (
            <RoleCheck allowedRoles={['super_admin','artist_manager', 'artist']}>
              <Button
                icon={<NotificationOutlined />}
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/artists/${record?.id}/songs`);
                }}
              >
                Songs
              </Button>
            </RoleCheck>
          )}
        />
      </div>
    </MainLayout>
  );
};

export default Artists;
