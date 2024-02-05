import { useEffect, useState } from 'react';
import { Space, Table, Typography } from 'antd';
import type { GetProp, TableProps } from 'antd';
import { ACCESS_TOKEN, BACKEND_URL, PAGE_SIZE } from '../../utils/constant';
import UpdateUserModal from './updateUser.modal';

const { Title } = Typography;

type ColumnsType<T> = TableProps<T>['columns'];
type TablePaginationConfig = Exclude<GetProp<TableProps, 'pagination'>, boolean>;

interface TableParams {
  pagination?: TablePaginationConfig;
  sortField?: string;
  sortOrder?: string;
  filters?: Parameters<GetProp<TableProps, 'onChange'>>[1];
}



const getRandomuserParams = (params: TableParams) => ({
  results: params.pagination?.pageSize,
  page: params.pagination?.current,
  ...params,
});

const UserTable = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [users, setUsers] = useState<IUser[]>();
  const [user, setUser] = useState<IUser>();
  const [loading, setLoading] = useState(false);
  const [tableParams, setTableParams] = useState<TableParams>({
    pagination: {
      current: 1,
      pageSize: 5,
    },
  });

  useEffect(() => {
    (function () {
      setLoading(true);
      const current = getRandomuserParams(tableParams).page
      fetch(`${BACKEND_URL}/api/v1/users?current=${current}&pageSize=${PAGE_SIZE}`,
        {
          method: 'GET',
          headers: {
            "Content-Type": "application/json",
            'Authorization': 'Bearer ' + ACCESS_TOKEN,
          },
        })
        .then(res => res.json())
        .then((data: IBackendRes<IUserPaginate<IUser>>) => {
          setUsers(data.data?.result);
          setLoading(false);
          setTableParams({
            ...tableParams,
            pagination: {
              current: current,
              pageSize: PAGE_SIZE,
              total: data.data?.meta.total,
            },
          });
        });
    })()
  }, [JSON.stringify(tableParams)]);

  const handleTableChange: TableProps['onChange'] = (pagination, filters, sorter) => {
    setTableParams({
      pagination,
      filters,
      ...sorter,
    });

    // `dataSource` is useless since `pageSize` changed
    if (pagination.pageSize !== tableParams.pagination?.pageSize) {
      setUsers([]);
    }
  };

  const columns: ColumnsType<IUser> = [
    {
      title: 'Email',
      dataIndex: 'email',
    },
    {
      title: 'Name',
      dataIndex: 'name',
      sorter: true,
      width: '20%',
    },
    {
      title: 'Role',
      dataIndex: 'role',
    },
    {
      title: 'Actions',
      dataIndex: 'actions',
      render: (value, user) => {
        return (
          <a onClick={() => {
            setUser(user)
            setIsModalOpen(true)
          }}
          >
            Edit
          </a>)
      },
      onCellClick: (record, e) => {
        console.log('record', record)
        console.log('e', e)
      }
    },
  ];

  return (
    <div style={{ width: '80%', textAlign: 'center', margin: '0 auto' }}>
      <Typography>
        <Title level={2}>Table users</Title>
      </Typography>
      <Table
        columns={columns}
        rowKey={(record) => record._id}
        dataSource={users}
        pagination={tableParams.pagination}
        loading={loading}
        onChange={handleTableChange}
      />
      <UpdateUserModal user={user!} isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
    </div>
  );
};

export default UserTable;