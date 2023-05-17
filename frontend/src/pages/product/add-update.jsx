/*
Add and Update components of Product
*/
import { 
    Card, 
    Form, 
    Input,
    Cascader,
    Button,
    message
} from "antd";
import LinkButton from "../../components/link-button";
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useNavigate, useLocation } from "react-router-dom";
import React, { useState } from "react";
import { useEffect, useRef } from "react";
import { reqAddOrUpdateProduct, reqCategorys } from "../../api";
import PicturesWall from "./pictures-wall"
import RichTextEditor from "./rich-text-editor";

const { TextArea } = Input;
const { Item } = Form;


function ProductAddUpdate() {
    const [messageApi, contextHolder] = message.useMessage();
    const pwRef = useRef();
    const rteRef = useRef();
    const navigate = useNavigate();
    const [options, setOptions] = useState([]);
    const categoryIds = [];
    
    const location = useLocation().state;
    const product = location ? location.products : {};
    const isUpdate = !!location;

    const title = (
        <div>
            <LinkButton>
                <ArrowLeftOutlined 
                    style={{marginRight:15, fontSize:18}}
                    onClick={() => {navigate("../")}}
                />
            </LinkButton>
            <span> {isUpdate ? 'Update' : 'Add'} Product </span>
        </div>
    )

    const formItemLayout = {
        labelCol: {
          span: 2,
        },
        wrapperCol: {
          span: 8,
        },
    };

    const initOptions = async (category) => {
        const opts = category.map((c) => ({
            value: c._id,
            label: c.name,
            isLeaf: false,
        }));

        const {pCategoryId, categoryId} = product;
        if (isUpdate && pCategoryId !== '0') {
            const subCategorys = await getCategory(pCategoryId);
            const childOptions = subCategorys.map((c) => ({
                value: c._id,
                label: c.name,
                isLeaf: true,
            }))

            const targetOption = opts.find((option) => {
                return (option.value === pCategoryId)
            });
            targetOption.children = childOptions;
        }
        setOptions(opts);
    }

    const getCategory = async (parentId) => {
        const result = (await reqCategorys(parentId)).data;
        // debugger;
        if (result.status === 0) {
            const category = result.data;
            if (parentId === '0') {
                initOptions(category);
            } else {
                return category;
            }
        }
    }

    const validatorPrice = (rule, value, callback) => {
        if (value * 1 > 0) {
            return callback(); //pass
        } else {
            return callback('Price should be greater than 0!');
        }
    }

    const onFinish = async (values) => {
        const { name, desc, price, category } = values;
        let pCategoryId, categoryId;
        if (category.length === 1) {
            pCategoryId = '0';
            categoryId = category[0];
        } else {
            pCategoryId = category[0];
            categoryId = category[1];
        }
        const imgs = pwRef.current.getImgs();
        const detail = rteRef.current.getDetail();
        const upload_product = {
            name, 
            desc, 
            price,
            imgs,
            detail,
            pCategoryId,
            categoryId,
        }
        if (isUpdate) {
            upload_product._id = product._id
        }
        const result = (await reqAddOrUpdateProduct(upload_product)).data;
        if (result.status === 0) {
            messageApi.success(`Successful ${isUpdate?'update':'add new'} product`);
            navigate('../');
        } else {
            messageApi.error(`Failed ${isUpdate?'update':'add new'} product`);
        }

    }

    const loadData = async (selectedOptions) => {
        const targetOption = selectedOptions[selectedOptions.length - 1];
        targetOption.loading = true;    
        const subCategory = await getCategory(targetOption.value);
        if (subCategory && subCategory.length > 0) {
            const childOptions = subCategory.map(c => ({
                value: c._id,
                label: c.name,
                isLeaf: true,
            }))
            targetOption.children = childOptions;
        } else {
            targetOption.isLeaf = true;
        }
        targetOption.loading = false;
        setOptions([...options]);
    };

    useEffect(() => {
        getCategory('0');
        if (isUpdate && categoryIds.length <= 0) {
            const {pCategoryId, categoryId} = product;
            if (pCategoryId === '0') {
                categoryIds.push(categoryId);
            } else {
                categoryIds.push(pCategoryId);
                categoryIds.push(categoryId);
            }
        }
    }, [])

    return (
        <>
        <Card title={title}>
            <Form {...formItemLayout} onFinish={onFinish}>
                <Item  
                    label='name' 
                    name="name"
                    rules={[
                        {
                            required: true,
                            message: 'Please input product name!',
                        }
                    ]}
                    initialValue={product.name}
                    >
                    <Input placeholder="Please product name." />
                </Item>
                <Item 
                    label='description'
                    name='desc'
                    rules={[
                        {
                            required: true,
                            message: 'Please input product description!',
                        }
                    ]}
                    initialValue={product.desc}
                    >
                    <TextArea placeholder="Please input product description." autoSize={{minRows: 2, maxRows: 6}}/>
                </Item>
                <Item 
                    label='price'
                    name='price'
                    rules={[
                        {
                            required: true,
                            message: 'Please input right product price!',
                        },
                        {validator: validatorPrice}
                    ]}
                    initialValue={product.price}
                    >
                    <Input placeholder="Please input product price." type="number" addonBefore="$"/>
                </Item>
                <Item 
                    label='category'
                    name='category' 
                    rules={[
                        {
                            required: true,
                            message: 'Please choose a category!',
                        }
                    ]}
                    initialValue={categoryIds}
                    >
                    <Cascader 
                        options={options} 
                        loadData={loadData}
                    />
                </Item>
                <Item label='pictures' name='imgs'>
                    <PicturesWall ref={pwRef} imgs={product.imgs}/>
                </Item>
                <Item label='detail' name='detail' labelCol={{span: 2}} wrapperCol={{span: 20}}>
                    <RichTextEditor ref={rteRef} detail={product.detail}/>
                </Item>
                <Item>
                    <Button type="primary" htmlType="submit">Submit</Button>
                </Item>
            </Form>
        </Card>
        {contextHolder}
        </>
    )
}

export default ProductAddUpdate;