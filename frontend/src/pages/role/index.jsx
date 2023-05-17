import { Card, Table, Button, Modal, message } from "antd";
import { useEffect, useRef, useState } from "react";
import { PAGE_SIZE } from "../../utils/constants";
import { reqRoles, reqAddRole, reqUpdateRole } from "../../api";
import AddForm from "./add-form";
import AuthForm from "./auth-form";
import memoryUtils from '../../utils/memoryUtils';
import storageUtils from '../../utils/storageUtils';
import formateDate from "../../utils/dateUtils";
import { useNavigate } from "react-router-dom";

const columns = [
    {
        title: 'role name',
        dataIndex: 'name'
    },
    {
        title: 'create time',
        dataIndex: 'create_time',
        render: formateDate
    },
    {
        title: 'authorize time',
        dataIndex: 'auth_time',
        render: formateDate,
    },
    {
        title: 'authorizer',
        dataIndex: 'auth_name'
    },
]

function Role() {
    const navigate = useNavigate();
    const authRef = useRef();
    const [messageAPI, contextHolder] = message.useMessage();
    const [state, setState] = useState({
        roles: [], // all roles list
        role: {},  // selected role
        isShowAdd: false,
        isShowAuth: false,
    });
    const [form, setForm] = useState(null);

    const onRow = (role) => {
        return {
            onClick: event => {
                setState({...state, role});
            },
        };
    }

    const title = (
        <span>
            <Button 
                type="primary" 
                style={{marginRight: '10px'}} 
                onClick={() => setState({...state, isShowAdd: true})}
            >
                Add Role
            </Button>
            <Button 
                type="primary"
                disabled={!state.role._id}
                onClick={() => setState({...state, isShowAuth: true})}
            >
                Set Authority
                </Button>
        </span>
    )

    const getRoles = async () => {
        const result = (await reqRoles()).data;
        if (result.status === 0) {
            const roles = result.data;
            setState({...state, roles})
        }
    }

    const addRole = () => {
        form.validateFields().then(async (values) => {
            const { roleName } = values;
            const result = (await reqAddRole(roleName)).data;
            if (result.status === 0) {
                messageAPI.success('Add Role Successfully');                
                setState({
                    ...state,
                    roles: [...state.roles, result.data],
                    role: {},
                    isShowAdd: false,
                })
                form.resetFields();
            } else {
                messageAPI.success('Add Role Failed');
            }
        }).catch((errorInfo) => {
            ;
        })   
    }

    const updateRole = async () => {
        const menus = authRef.current.getMenus();
        const newRole = {
            ...state.role,
            menus: menus,
            auth_name: memoryUtils.user.username,
        };
        const result = (await reqUpdateRole(newRole)).data;
        if (result.status === 0) {
            if (newRole._id === memoryUtils.user.role_id) {
                messageAPI.success('Current Role is update. Please login again.');
                memoryUtils.user = [];
                storageUtils.removeUser();
                navigate('/login', {replace: true});
            } else {
                messageAPI.success('Update Successfully');
                setState({
                    ...state, 
                    roles: state.roles.map((r) => {
                        if (r._id === result.data._id) {
                            return result.data;
                        } else {
                            return r;
                        }
                    }),
                    role: result.data,
                    isShowAuth: false
                });
            }

        } else {
            messageAPI.success('Update Failed');
        }
    }

    useEffect(() => {
        getRoles();
    }, [])
    

    return (
        <Card title={title}>
            <Table
                dataSource={state.roles} 
                columns={columns} 
                bordered
                rowKey='_id'
                pagination={{defaultPageSize: PAGE_SIZE}}
                rowSelection={{
                    type: 'radio', 
                    selectedRowKeys:[state.role._id], 
                    onChange: (e, role) => {setState({...state, role: role[0]})},
                }}
                onRow={onRow}
            />
            <Modal
                title="Add Role"
                open={state.isShowAdd}
                onOk={addRole}
                onCancel={() => setState({...state, isShowAdd: false})}
            >
                <AddForm setForm={(form) => {setForm(form)}}/>
            </Modal>
            <Modal
                title="Set Authority"
                open={state.isShowAuth}
                onOk={updateRole}
                onCancel={() => setState({...state, isShowAuth: false})}
                destroyOnClose
            >
                <AuthForm role={state.role} ref={authRef}/>
            </Modal>
            { contextHolder }
        </Card>
    )
}

export default Role;