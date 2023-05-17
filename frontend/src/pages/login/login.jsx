import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom'
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { 
  Button, 
  Form, 
  Input, 
  message
} from 'antd';
import './login.css'
import logo from '../../assets/images/logo.png'
import { reqLogin } from '../../api';
import memoryUtils from '../../utils/memoryUtils';
import storageUtils from '../../utils/storageUtils';

function Login() {
  const navigate = useNavigate()
  const [usr_icon_style, setUsernameIconStyle] = useState({color: 'rgb(0, 0, 0, 0.25)'})
  const [psw_icon_style, setPasswordIconStyle] = useState({color: 'rgb(0, 0, 0, 0.25)'})

  const user = memoryUtils.user;
  if (user && user._id) {
    return <Navigate to='/' />;
  }
  
  const [messageApi, contextHolder] = message.useMessage();
  const onFinish = async (values) => { // use  async function onFinish(value)  is also OK
    // backend connection
    const response = await reqLogin(values.username, values.password);
    const result = response.data;
    if (result.status === 0) {
      messageApi.success('Successful Login');
      const user = result.data;
      memoryUtils.user = user;
      storageUtils.saveUser(user);
      navigate('/', {replace: true});
    } else {
      messageApi.error(result.msg);
    }
  };

  const onChange = (e) => {
    if (e.target.id === 'normal_login_username') {
      if (e.target.value) {
        setUsernameIconStyle({color: 'rgb(0, 0, 0, 1)'});
      } else {
        setUsernameIconStyle({color: 'rgb(0, 0, 0, 0.25)'});
      }
    } else if (e.target.id === 'normal_login_password') {
      if (e.target.value) {
        setPasswordIconStyle({color: 'rgb(0, 0, 0, 1)'});
      } else {
        setPasswordIconStyle({color: 'rgb(0, 0, 0, 0.25)'});
      }
    }
  }

  return (
    <div className='login'>
      <header className='login-header'>
        <img src={logo} alt="logo"/>
        <h1>Back Office Management System (React)</h1>
      </header>
      <section className='login-content'>
        <h2>Login</h2>
        {contextHolder}
        <Form
          name="normal_login"
          className="login-form"
          initialValues={{
            remember: true,
          }}
          onFinish={onFinish}
          onChange={onChange.bind(this)}
        >
          <Form.Item
            name="username"
            rules={[
              {required: true, message: 'Please input your Username!'},
              {min: 4, message: 'Username\'s length must be greater than 3!'},
              {max: 12, message: 'Username\'s length must be no more than than 12!'},
              {pattern: /^[a-zA-Z0-9_]+$/, message: 'Username must consist of english letters, number and underline!'},
            ]}
          >
            <Input 
              prefix={<UserOutlined className="site-form-item-icon" style={usr_icon_style}/>} 
              placeholder="Username" 
            />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[
              {required: true, message: 'Please input your Password!'},
            ]}
          >
            <Input
              prefix={<LockOutlined className="site-form-item-icon" style={psw_icon_style}/>}
              type="password"
              placeholder="Password"
            />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" className="login-form-button">
              Log in
            </Button>
          </Form.Item>
        </Form>
      </section>
    </div>
  );
}
  
export default Login;
  