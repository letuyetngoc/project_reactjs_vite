import { Modal, Button, Form, Input, Select, message } from 'antd';
import { ACCESS_TOKEN, BACKEND_URL } from '../../utils/constant';

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
  user: IUser
}

export default function UpdateUserModal(props: IUpdateUserModalProps) {
  const { isModalOpen, setIsModalOpen, user } = props

  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleSubmit = async (values: any) => {
    fetch(`${BACKEND_URL}/api/v1/users`,
      {
        method: 'PATCH',
        headers: {
          "Content-Type": "application/json",
          'Authorization': 'Bearer ' + ACCESS_TOKEN,
        },
        body: JSON.stringify(values)
      })
      .then(res => res.json())
      .then((data:IBackendRes<any>) => {
        if(data.statusCode === 200){
          message.info('Update user success!')
          handleCancel()
        }
      });
  }

  return (
    <>
      <Modal title="Update user" open={isModalOpen} onOk={handleOk} onCancel={handleCancel} footer={[]}>
        <Form {...formItemLayout} variant="filled" style={{ maxWidth: 600 }} onFinish={handleSubmit}>
          <Form.Item
            label="id"
            name="_id"
            initialValue={user?._id}
          >
            <Input disabled />
          </Form.Item>

          <Form.Item
            label="name"
            name="name"
            rules={[{ required: true, message: 'Please input!' }]}
            initialValue={user?.name}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="email"
            name="email"
            rules={[{ required: true, message: 'Please input!' }]}
            initialValue={user?.email}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="age"
            name="age"
            rules={[{ required: true, message: 'Please input!' }]}
            initialValue={user?.age}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="gender"
            name="gender"
            rules={[{ required: true, message: 'Please input!' }]}
            initialValue={user?.gender}
          >
            <Select
              options={[{ value: 'MALE', label: 'MALE' }, { value: 'FEMALE', label: 'FEMALE' }]}
            />
          </Form.Item>

          <Form.Item
            label="address"
            name="address"
            rules={[{ required: true, message: 'Please input!' }]}
            initialValue={user?.address}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="role"
            name="role"
            rules={[{ required: true, message: 'Please input!' }]}
            initialValue={user?.role}
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
