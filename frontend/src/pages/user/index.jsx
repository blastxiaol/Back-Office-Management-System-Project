import {
    Card,
    Button,
    Table,
    Modal,
    message
} from 'antd';
import LinkButton from '../../components/link-button';
import formateDate from '../../utils/dateUtils';
import { useEffect, useState } from 'react';
import { reqDeleteUser, reqUsers, reqAddOrUpdateUser } from '../../api';
import UserForm from './user-form';

function User() {
    const [messageAPI, contextHolder] = message.useMessage();
    const [modal, modalContextHolder] = Modal.useModal();

    const [isShow, setIsShow] = useState(false);
    const [state, setState] = useState({
        users: [], 
        roles: [], 
    });
    const [user, setUser] = useState(null);
    const [roleNames, setRoleNames] = useState({});
    const [form, setForm] = useState(null);

    const initRoleNames = (roles) => {
        setRoleNames(roles.reduce((pre, role) => {
            pre[role._id] = role.name;
            return pre;
        }, {}));
    }

    const getUsers = async () => {
        const result = (await reqUsers()).data;
        if (result.status===0) {
            const {users, roles} = result.data;
            initRoleNames(roles);
            setState({
                ...state,
                users,
                roles
            })
        }
    }

    const showUpdate = (user) => {
        setUser(user);
        setIsShow(true)
    };

    const deleteUser = (user) => {
        modal.confirm({
          title: `Do you want to delete [${user.username}]?`,
          onOk: async () => {
                const result = (await reqDeleteUser(user._id)).data;
                if(result.status === 0) {
                    messageAPI.success('Successful Delete');
                    getUsers();
                }
            }
        })
      }

    const columns = [
        {
          title: 'Username',
          dataIndex: 'username'
        },
        {
          title: 'Email',
          dataIndex: 'email'
        },
  
        {
          title: 'Phone',
          dataIndex: 'phone'
        },
        {
          title: 'Create time',
          dataIndex: 'create_time',
          render: formateDate
        },
        {
          title: 'Role',
          dataIndex: 'role_id',
          render: (role_id) => roleNames[role_id]
        },
        {
          title: 'Operate',
          render: (user) => (
            <span>
              <LinkButton onClick={() => showUpdate(user)}>change</LinkButton>
              <LinkButton onClick={() => deleteUser(user)}>Delete</LinkButton>
            </span>
          )
        },
    ];

    const showAdd = () => {
        setUser(null);
        setIsShow(true);
    }

    const addOrUpdateUser = async () => {
    
        const newUser = form.getFieldsValue(true);
        form.resetFields()
        if (user) {
            newUser._id = user._id
        }
    
        const result = (await reqAddOrUpdateUser(newUser)).data;
        if(result.status===0) {
            messageAPI.success(`${newUser ? 'change' : 'add'} successfully`);
            getUsers();
        }
        setIsShow(false);
    }

    useEffect(() => {
        getUsers();
    }, [])


    const title =(<Button type='primary' onClick={showAdd}>Create User</Button>)

    return (
        <Card title={title}>
            <Table
                bordered
                rowKey='_id'
                dataSource={state.users}
                columns={columns}
                pagination={{defaultPageSize: 2}}
            />
            {isShow && <Modal
                    title={(user && user._id) ? 'change' : 'add'}
                    open={isShow}
                    onOk={addOrUpdateUser}
                    onCancel={() => {
                        // // this.form.resetFields()
                        setIsShow(false);
                    }}
                    >
                <UserForm 
                    setForm={form => setForm(form)}
                    roles={state.roles}
                    user={user || {}}
                    /> 
            </Modal>}
        { contextHolder }
        { modalContextHolder }
        </Card>
    )
}

export default User;