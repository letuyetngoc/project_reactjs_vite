import { Modal, Button, Form, Input, Select, message } from 'antd';
import { ACCESS_TOKEN, BACKEND_URL } from '../../utils/constant';
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';

const formItemLayout = {
    labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
    },
    wrapperCol: {
        xs: { span: 24 },
        sm: { span: 14 },
    },
};

interface IUpdateUserModalProps {
    isModalOpen: boolean;
    setIsModalOpen: (val: boolean) => void,
}

export default function CreateUserModal(props: IUpdateUserModalProps) {
    const { isModalOpen, setIsModalOpen } = props
    const [form] = Form.useForm();


    const handleOk = () => {
        setIsModalOpen(false);
    };
    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const handleSubmit = (values: any) => {
        fetch(`${BACKEND_URL}/api/v1/users`,
            {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': 'Bearer ' + ACCESS_TOKEN,
                },
                body: JSON.stringify(values)
            })
            .then(res => res.json())
            .then((data: IBackendRes<any>) => {
                if (data.statusCode === 201) {
                    message.info('Create user success!')
                    form.resetFields()
                    handleCancel()
                } else {
                    message.error(Array.isArray(data.message) ? data.message.map(el => <p>{el}</p>) : data.message)
                }
            });
    }
    return (
        <>
            <Modal title="Create user" open={isModalOpen} onOk={handleOk} onCancel={handleCancel} footer={[]}>
                <Form {...formItemLayout} form={form} variant="filled" style={{ maxWidth: 600 }} initialValues={{}} onFinish={handleSubmit}>

                    <Form.Item
                        label="name"
                        name="name"
                        rules={[{ required: true, message: 'Please input!' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="email"
                        name="email"
                        rules={[{ required: true, message: 'Please input!' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="password"
                        name="password"
                        rules={[{ required: true, message: 'Please input!' }]}
                    >
                        <Input.Password
                            iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                        />
                    </Form.Item>

                    <Form.Item
                        label="age"
                        name="age"
                        rules={[{ required: true, message: 'Please input!' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="gender"
                        name="gender"
                        rules={[{ required: true, message: 'Please input!' }]}
                    >
                        <Select
                            options={[{ value: 'MALE', label: 'MALE' }, { value: 'FEMALE', label: 'FEMALE' }]}
                        />
                    </Form.Item>

                    <Form.Item
                        label="address"
                        name="address"
                        rules={[{ required: true, message: 'Please input!' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="role"
                        name="role"
                        rules={[{ required: true, message: 'Please input!' }]}
                    >
                        <Select
                            options={[{ value: 'USER', label: 'USER' }, { value: 'ADMIN', label: 'ADMIN' }]}
                        />
                    </Form.Item>

                    <Form.Item wrapperCol={{ offset: 6, span: 16 }}>
                        <Button type="primary" htmlType="submit">
                            Submit
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
}
