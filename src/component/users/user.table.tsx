import { useEffect, useState } from 'react';
import { Button, Col, Row, Table, Typography } from 'antd';
import type { GetProp, TableProps } from 'antd';
import { ACCESS_TOKEN, BACKEND_URL, PAGE_SIZE } from '../../utils/constant';
import UpdateUserModal from './update.modal';
import CreateUserModal from './create.modal';

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
  const [isModalOpenUpdate, setIsModalOpenUpdate] = useState<boolean>(false);
  const [isModalOpenCreate, setIsModalOpenCreate] = useState<boolean>(false);
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
            setIsModalOpenUpdate(true)
          }}
          >
            Edit
          </a>)
      }
    },
  ];

  return (
    <div style={{ width: '80%', textAlign: 'center', margin: '0 auto' }}>
      <Row style={{marginBottom:'20px'}}>
        <Col span={8}>
          <Typography>
            <Title level={2} style={{ margin: 0 }}>Table users</Title>
          </Typography>
        </Col>
        <Col span={8} offset={8}><Button type="primary" onClick={()=>setIsModalOpenCreate(true)}>Add new</Button></Col>
      </Row>
      <Table
        columns={columns}
        rowKey={(record) => record._id}
        dataSource={users}
        pagination={tableParams.pagination}
        loading={loading}
        onChange={handleTableChange}
      />
      <UpdateUserModal user={user!} isModalOpen={isModalOpenUpdate} setIsModalOpen={setIsModalOpenUpdate} />
      <CreateUserModal isModalOpen={isModalOpenCreate} setIsModalOpen={setIsModalOpenCreate} />
    </div>
  );
};

export default UserTable;