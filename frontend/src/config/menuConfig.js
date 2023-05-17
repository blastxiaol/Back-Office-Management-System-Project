import {
    UserOutlined,
    ContainerOutlined,
    PieChartOutlined,
    DesktopOutlined,
} from '@ant-design/icons';

function getItem(label, key, icon, children, type, ispublic) {
    return {
        key,
        icon,
        children,
        label,
        type,
        ispublic: ispublic,
    };
}
const menuList = [
    getItem('Home', 'home', <PieChartOutlined />, null, null, 1),
    getItem('Products', '2', <DesktopOutlined />, [
        getItem('Category Management', 'category', <ContainerOutlined />),
        getItem('Product Management', 'product', <ContainerOutlined />),
    ]),
    getItem('User Management', 'user', <UserOutlined />),
    getItem('Role Management', 'role', <ContainerOutlined />),
    getItem('Chart & Table', '5', <ContainerOutlined />, [
        getItem('Bar', 'charts/bar', <ContainerOutlined />),
        getItem('Line', 'charts/line', <ContainerOutlined />),
        getItem('Pie', 'charts/pie', <ContainerOutlined />),
    ]),
];

export default menuList;