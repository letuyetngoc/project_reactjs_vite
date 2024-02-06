import { Tabs, TabsProps } from "antd";
import { HomeOutlined, UserOutlined, AudioOutlined, CommentOutlined } from '@ant-design/icons';
import UserPage from "../../screen/user.page";
import TracksTable from "../track/track.table";
import CommentsTable from "../comment/comment.table";

export default function Header() {
  const items: TabsProps['items'] = [
    {
      key: '1',
      label: 'Home',
      children: 'Content of Tab Pane 1',
      icon: <HomeOutlined />
    },
    {
      key: '2',
      label: 'Manage Users',
      children: <UserPage />,
      icon: <UserOutlined /> 
    },
    {
      key: '3',
      label: 'Manage Tracks',
      children: <TracksTable/>,
      icon: <AudioOutlined /> 
    },
    {
      key: '4',
      label: 'Manage Comments',
      children: <CommentsTable/>,
      icon: <CommentOutlined />
    },
  ];
  const onChange = (key: string) => {
    console.log(key);
  };
  return (
      <Tabs
        defaultActiveKey="1"
        items={items}
        onChange={onChange}
      />
  )
}
