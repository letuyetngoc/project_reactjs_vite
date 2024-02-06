import { useEffect, useState } from 'react';
import { Button, Col, Popconfirm, Row, Table, Typography, message } from 'antd';
import type { GetProp, TableProps } from 'antd';
import { ACCESS_TOKEN, BACKEND_URL, PAGE_SIZE } from '../../utils/constant';

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

const TracksTable = () => {
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

    const handleDeleteUser = async (id: string) => {
        try {
            const res = await fetch(`${BACKEND_URL}/api/v1/tracks/${id}`,
                {
                    method: 'DELETE',
                    headers: {
                        "Content-Type": "application/json",
                        'Authorization': 'Bearer ' + ACCESS_TOKEN,
                    },
                })
            if (res.status === 200) {
                message.info('Delete track success!')
                getTracks()
            }
        } catch (error) {
            message.error('An error occurred, please try again!')
            console.log('err', error)
        }
    }

    const getTracks = () => {
        setLoading(true);
        const current = getRandomuserParams(tableParams).page
        fetch(`${BACKEND_URL}/api/v1/tracks?current=${current}&pageSize=${PAGE_SIZE}`,
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
    }

    useEffect(() => {
        getTracks()
    }, [JSON.stringify(tableParams)]);


    const columns: ColumnsType<ITrack> = [
        {
            title: 'Stt',
            dataIndex: 'stt',
            render: (value, record, index) => index
        },
        {
            title: 'Title',
            dataIndex: 'title',
        },
        {
            title: 'Description',
            dataIndex: 'description',
            width: '20%',
        },
        {
            title: 'Category',
            dataIndex: 'category',
        },
        {
            title: 'Track url',
            dataIndex: 'trackUrl',
        },
        {
            title: 'Uploader',
            dataIndex: 'uploader',
            render: (value, track) => track.uploader.name
        },
        {
            title: 'Actions',
            dataIndex: 'actions',
            render: (value, track) => {
                return (
                    <>
                        <Popconfirm
                            title="Delete the user"
                            description="Are you sure to delete this track?"
                            okText="Yes"
                            cancelText="No"
                            onConfirm={() => {
                                handleDeleteUser(track._id)
                            }}
                        >
                            <Button type="text" danger>Delete</Button>
                        </Popconfirm >
                    </>
                )
            }
        },
    ];

    return (
        <div style={{ width: '80%', textAlign: 'left', margin: '0 auto' }}>
            <Row style={{ marginBottom: '20px' }}>
                <Col span={8}>
                    <Typography>
                        <Title level={2} style={{ margin: 0 }}>Table track</Title>
                    </Typography>
                </Col>
            </Row>
            <Table
                columns={columns}
                rowKey={(record) => record._id}
                dataSource={users}
                pagination={tableParams.pagination}
                loading={loading}
                onChange={handleTableChange}
            />
            {/* <UpdateUserModal user={user!} isModalOpen={isModalOpenUpdate} setIsModalOpen={setIsModalOpenUpdate} />
            <CreateUserModal isModalOpen={isModalOpenCreate} setIsModalOpen={setIsModalOpenCreate} /> */}
        </div>
    );
};

export default TracksTable;