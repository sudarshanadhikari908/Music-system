import React, { useEffect, useState } from "react";
import { Table, Button, Pagination, Select } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { PaginationType } from "@/types/paginationType";
import RoleCheck from "@/hoc/RoleCheck";

interface CustomTableProps {
  data: any[];
  columns: any[];
  onEdit: (record: any) => void;
  onDelete: (record: any) => void;
  loading: boolean;
  pageChange: ({ currentPage, pageSize }: PaginationType) => void;
  total: number;
  onRowClick: (record: any) => void;
  additionalAction?: (record: any) => React.ReactNode
}

const { Option } = Select;

const CustomTable: React.FC<CustomTableProps> = ({
  data,
  columns,
  onEdit,
  onDelete,
  loading,
  pageChange,
  onRowClick,
  total,
  additionalAction
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (value: number) => {
    setCurrentPage(1);
    setPageSize(value);
  };

  const handleRowClick = (record: any) => {
    onRowClick(record?.id);
  };

  const actionColumn = {
    title: "Actions",
    key: "actions",
    render: (text: any, record: any) => (
      <>
        {/* <RoleCheck> */}
          <Button
            icon={<EditOutlined />}
            onClick={(e) => {
              e.stopPropagation();
              onEdit(record);
            }}
            className="mr-2"
          />
        {/* </RoleCheck> */}
        {/* <RoleCheck> */}
          <Button
            icon={<DeleteOutlined />}
            onClick={(e) => {
              e.stopPropagation();
              onDelete(record);
            }}
            danger
            className="mr-2"
          />
        {/* </RoleCheck> */}
        {additionalAction && additionalAction(record)}
      </>
    ),
  };

  useEffect(() => {
    pageChange({ pageSize, currentPage });
  }, [pageSize, currentPage]);

  return (
    <div>
      <Table
        columns={[...columns, actionColumn]}
        dataSource={data}
        pagination={false}
        rowKey={(record) => record.id}
        onRow={(record) => ({
          onClick: () => handleRowClick(record),
          className: "cursor-pointer hover:bg-gray-100",
        })}
        loading={loading}
      />

      <div className="flex justify-between items-center mt-4">
        <Select
          value={pageSize}
          onChange={handlePageSizeChange}
          className="w-20"
        >
          <Option value={5}>5</Option>
          <Option value={10}>10</Option>
          <Option value={20}>20</Option>
          <Option value={50}>50</Option>
        </Select>

        <Pagination
          current={currentPage}
          pageSize={pageSize}
          onChange={handlePageChange}
          total={total}
          showSizeChanger={false}
        />
      </div>
    </div>
  );
};

export default CustomTable;
