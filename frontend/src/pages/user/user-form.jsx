import { Form, Input, Select } from 'antd';
import { useEffect, useState } from 'react';

const Item = Form.Item;
const Option = Select.Option

const formItemLayout = {
    labelCol: { span: 4 },  
    wrapperCol: { span: 15 }, 
}

function UserForm(props) {
    const { user, roles, setForm } = props;
    const [form] = Form.useForm();

    const onChange = () => {
        setForm(form);
    }

    useEffect(() => {
        setForm(form);
    }, []);

    return (
        <Form form={form} onChange={onChange} {...formItemLayout}>
            <Item 
                label='Username' 
                name='username'
                initialValue={user.username}
                >
                <Input 
                    placeholder='Please input username.'
                    />
            </Item>
            {
                user._id ? null : (
                    <Item 
                        label='Password' 
                        name='password'
                        initialValue={user.password}
                        >
                        <Input 
                            type='password'
                            placeholder='Please input passward'
                            />
                    </Item>
                )
            }
            <Item 
                label='Phone' 
                name='phone'
                initialValue={user.phone}
                >
                <Input placeholder='Please input phone number.'/>
            </Item>
            <Item 
                label='Email' 
                name='email'
                initialValue={user.email}
                >
                <Input placeholder='Please input email address.'/>
            </Item>
            <Item 
                label='Role' 
                name='role_id'
                initialValue={user.role_id}
                >
              <Select placeholder='Please choose a role.'>
                {
                    roles.map(role => <Option key={role._id} value={role._id}>{role.name}</Option>)
                }
              </Select>
            </Item>
        </Form>
    )
}

export default UserForm;