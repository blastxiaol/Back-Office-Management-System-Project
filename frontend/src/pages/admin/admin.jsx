import { Navigate } from "react-router-dom";
import { Layout } from 'antd';
import { Routes, Route } from 'react-router-dom'

import memoryUtils from "../../utils/memoryUtils";
import LeftNav from "../../components/left-nav";
import Header from "../../components/header";
import Home from "../home";
import Category from "../category"
import Product from "../product"
import Role from "../role"
import User from "../user"
import Bar from "../charts/bar"
import Line from "../charts/line"
import Pie from "../charts/pie"
import NotFound from "../not-found";




const { Footer, Sider, Content } = Layout;

function Admin() {
  const user = memoryUtils.user;
  if (!user || !user._id) {
    return <Navigate to='/login' />;
  }
  
  return (
    <>
    <Layout style={{minHeight: '100%'}}>
      <Sider>
        <LeftNav/>
      </Sider>
      <Layout>
        <Header/>
        <Content style={{margin: 20, backgroundColor: '#fff'}}>
            <Routes>
              <Route path='' element={<Navigate to='home'/>} />
              <Route path='home' element={<Home/>} />
              <Route path='category' element={<Category/>} />
              <Route path='product/*' element={<Product/>} />
              <Route path='role' element={<Role/>} />
              <Route path='user' element={<User/>} />
              <Route path='charts/bar' element={<Bar/>} />
              <Route path='charts/line' element={<Line/>} />
              <Route path='charts/pie' element={<Pie/>} />
              <Route path='*' element={<NotFound />} />
            </Routes>
        </Content>
        <Footer style={{textAlign: 'center', color: 'gray'}}>Copy Right @Zhenxiang Lin</Footer>
      </Layout>
    </Layout>
    </>
  );
}
  
export default Admin;
  