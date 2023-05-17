import { Form, Input, Tree } from "antd";
import menuList from "../../config/menuConfig";
import { useState, forwardRef, useImperativeHandle } from 'react';


function getTreeData(menuList) {
    if (!menuList) {
        return [];
    }
    let treeData = [];
    for (let i = 0; i < menuList.length; ++i) {
        treeData.push({
            title: menuList[i].label,
            key: menuList[i].key,
            children: getTreeData(menuList[i].children)
        });
    }
    return treeData;
}

function AuthForm(props, ref) {
    const role = props.role;
    const treeData = [{
        title: 'Authority',
        key: 'auth',
        children: getTreeData(menuList),
    }];

    const [state, setState] = useState({
        checkedKeys: role.menus,
    })

    const formItemLayout = {
        labelCol: { span: 4},       // width of left label
        wrapperCol: { span: 15 },    // width of right wrapper
    }

    const getMenus = () => {
        return state.checkedKeys;
    }

    const onCheck = (checkedKeys) => {
        setState({...state, checkedKeys: checkedKeys});
    }

    useImperativeHandle(ref, () => ({
        getMenus: getMenus,
    }))

    return (
        <div>
            <Form.Item 
                label='role name'
                {...formItemLayout}
                >
                <Input 
                    value={role.name}
                    disabled 
                />
            </Form.Item>

            <Tree
                checkable
                defaultExpandAll
                treeData={treeData}
                checkedKeys={state.checkedKeys}
                onCheck={onCheck}
                />
        </div>
    )
}

export default forwardRef(AuthForm);