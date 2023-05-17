/*
detail components of Product
*/
import { 
    Card,
    List,
} from "antd";
import { ArrowLeftOutlined } from '@ant-design/icons';
import LinkButton from "../../components/link-button";
import { useNavigate, useLocation } from "react-router-dom";
import { BASE_IMG_URL } from "../../utils/constants"; 
import { useState } from "react";
import { reqCategory } from "../../api";
import { useEffect } from "react";

function ProductDetail() {
    const navigate = useNavigate();

    const [state, setState] = useState({
        cName1: '',
        cName2: '',
    })

    const { products } = useLocation().state;
    const { name, desc, price, detail, imgs } = products;

    const title = (
        <div>
            <LinkButton>
                <ArrowLeftOutlined 
                    style={{marginRight:15, fontSize:18}}
                    onClick={() => {navigate("../")}}
                    />
            </LinkButton>
            <span> Product Detail </span>
        </div>);
    
    const getCategory = async () => {
        const { pCategoryId, categoryId } = products;
        if (pCategoryId === '0') {
            const result = (await reqCategory(categoryId)).data;
            setState({
                cName1: result.data.name,
                cName2: state.cName2, 
            })
        } else {
            // const result1 = (await reqCategory(pCategoryId)).data;
            // const result2 = (await reqCategory(categoryId)).data;
            const results = await Promise.all([reqCategory(pCategoryId), await reqCategory(categoryId) ])
            const result1 = results[0].data;
            const result2 = results[1].data;
            setState({
                cName1: result1.data.name,
                cName2: result2.data.name, 
            })
        }
    }
    
    useEffect(() => {
        getCategory();
    }, [])

    return (
        <Card title={title} className="product-detail">
            <List>
                <List.Item className="product-detail-list-item">
                    <span className="product-detail-list-item-name"> Name: </span>
                    <span className="product-detail-list-item-desc"> { name } </span>
                </List.Item>
                <List.Item className="product-detail-list-item">
                    <span className="product-detail-list-item-name"> Description: </span>
                    <span className="product-detail-list-item-desc"> { desc } </span>
                </List.Item>
                <List.Item className="product-detail-list-item">
                    <span className="product-detail-list-item-name"> Price: </span>
                    <span className="product-detail-list-item-desc"> { `$${price}` } </span>
                </List.Item>
                <List.Item className="product-detail-list-item">
                    <span className="product-detail-list-item-name"> Category: </span>
                    <span className="product-detail-list-item-desc"> {state.cName1}{state.cName2 ? ` --> ${state.cName2}`: null} </span>
                </List.Item>
                <List.Item className="product-detail-list-item">
                    <span className="product-detail-list-item-name"> Picture: </span>
                    <span className="product-detail-list-item-desc"> 
                        {
                            imgs.map((img) => {
                                let img_path = BASE_IMG_URL + img;
                                return (
                                    <img 
                                        key={img}
                                        src={img_path}
                                        className="product-detail-list-item-desc-img"
                                        alt="img"
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = require('/Users/apple/Desktop/Application/Management System Project/frontend/src/assets/images/logo.png');
                                        }}  
                                    />
                                )
                            })
                        }
                    </span>
                </List.Item>
                <List.Item className="product-detail-list-item">
                    <span className="product-detail-list-item-name"> Detail: </span>
                    <span dangerouslySetInnerHTML={{__html: detail}}></span>
                </List.Item>
            </List>
        </Card>
    )
}

export default ProductDetail;