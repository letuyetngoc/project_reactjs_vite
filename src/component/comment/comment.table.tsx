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

const CommentsTable = () => {
    const [comments, setComments] = useState<IComment[]>();
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
            setComments([]);
        }
    };

    const handleDeleteComment = async (id: string) => {
        try {
            const res = await fetch(`${BACKEND_URL}/api/v1/comments/${id}`,
                {
                    method: 'DELETE',
                    headers: {
                        "Content-Type": "application/json",
                        'Authorization': 'Bearer ' + ACCESS_TOKEN,
                    },
                })
            if (res.status === 200) {
                message.info('Delete comment success!')
                getComments()
            }
        } catch (error) {
            message.error('An error occurred, please try again!')
            console.log('err', error)
        }
    }

    const getComments = () => {
        setLoading(true);
        const current = getRandomuserParams(tableParams).page
        fetch(`${BACKEND_URL}/api/v1/comments?current=${current}&pageSize=${PAGE_SIZE}`,
            {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': 'Bearer ' + ACCESS_TOKEN,
                },
            })
            .then(res => res.json())
            .then((data: IBackendRes<IUserPaginate<IComment>>) => {
                setComments(data.data?.result);
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
        getComments()
    }, [JSON.stringify(tableParams)]);


    const columns: ColumnsType<IComment> = [
        {
            title: 'Stt',
            dataIndex: 'stt',
            render: (value, record, index) => index
        },
        {
            title: 'Content',
            dataIndex: 'content',
        },
        {
            title: 'Track',
            dataIndex: 'track',
            width: '20%',
            render: (value, comment, index) => comment.track.title
        },
        {
            title: 'User',
            dataIndex: 'user',
            render: (value, comment, index) => comment.user.name
        },
        {
            title: 'Actions',
            dataIndex: 'actions',
            render: (value, comment) => {
                return (
                    <>
                        <Popconfirm
                            title="Delete the comment"
                            description="Are you sure to delete this comment?"
                            okText="Yes"
                            cancelText="No"
                            onConfirm={() => {
                                handleDeleteComment(comment._id)
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
        <div style={{textAlign: 'left'}}>
            <Row style={{ marginBottom: '20px' }}>
                <Col span={8}>
                    <Typography>
                        <Title level={2} style={{ margin: 0 }}>Table comments</Title>
                    </Typography>
                </Col>
            </Row>
            <Table
                columns={columns}
                rowKey={(record) => record._id}
                dataSource={comments}
                pagination={tableParams.pagination}
                loading={loading}
                onChange={handleTableChange}
            />
        </div>
    );
};

export default CommentsTable;