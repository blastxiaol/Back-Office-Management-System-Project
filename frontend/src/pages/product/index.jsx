
import { Routes, Route, Navigate } from 'react-router-dom';
import ProductHome from './home';
import ProductAddUpdate from './add-update';
import ProductDetail from './detail';
import './index.css';

function Product() {
    return (
        <div>
            <Routes>
                <Route path='' element={<ProductHome />}></Route>
                <Route path='addupdate' element={<ProductAddUpdate />}></Route>
                <Route path='detail' element={<ProductDetail />}></Route>
                <Route path='*' element={<Navigate to='' replace/>} />
            </Routes>
        </div>
    )
}

export default Product;