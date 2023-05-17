import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu } from 'antd';

import './index.css';
import logo from '../../assets/images/logo.png';
import menuList from '../../config/menuConfig';
import memoryUtils from '../../utils/memoryUtils';



function LeftNav () {
    const navigate = useNavigate();
    let {pathname} = useLocation();
    let defaultOpenKeys = [];
    if (pathname.indexOf('/product') === 0) {
        pathname = '/product';
        defaultOpenKeys = ['2'];
    } else if (pathname.indexOf('/charts') === 0) {
        defaultOpenKeys = ['5'];
    }

    function onClick(e) {
        const key = e.key;
        navigate(key);
    }

    const hasAuth = (item) => {
        const {key, ispublic} = item;
        const menus = memoryUtils.user.role.menus;
        const username = memoryUtils.user.username;
        
        if (username === 'admin' || ispublic || menus.indexOf(key) !== -1) { // admin or item is public
            return true;
        } else if (item.children) {
            return !!item.children.find(child => menus.indexOf(child.key) !== -1);
        }
        return false;
    }

    const getMenuNodes = (menuList) => {
        let returnMenu = [];
        for (let i = 0; i < menuList.length; i++) {
            let menu = {...menuList[i]};
            if (menu.children) {
                menu.children = getMenuNodes(menu.children);
            } 
            if (hasAuth(menu)) {
                returnMenu.push(menu);
            }
        }
        return returnMenu;
    }

    return (
        <div className='left-nav'>
            <Link to='/' className='left-nav-header'>
                <img src={logo} alt='logo' />
                <h1>Back Office</h1>
            </Link>
            {pathname.slice(1) === '' ? null : <Menu
                defaultSelectedKeys={[pathname.slice(1)]}
                defaultOpenKeys={defaultOpenKeys}
                mode="inline"
                theme="dark"
                items={getMenuNodes(menuList)}
                onClick={onClick}
            />}
        </div>
    )
}

export default LeftNav;