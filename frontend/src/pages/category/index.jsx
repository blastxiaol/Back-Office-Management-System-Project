import './index.css'
import {
    Button,
    Card,
    message,
    Table,
    Modal,
} from 'antd'
import {
    PlusOutlined,
    ArrowRightOutlined,
} from '@ant-design/icons';
import LinkButton from '../../components/link-button';
import { useState, useEffect } from 'react';
import { reqCategorys, reqUpdateCategory, reqAddCategory } from '../../api';
import AddForm from './add-form';
import UpdateForm from './update-form';


function Category() {
    const [show_status, setShowStatus] = useState(0); // 0: not visualible 1: add 2: update
    const [current_category, setCurrentCategory] = useState(null);
    const [form, setForm] = useState(null);
    const handleCancel = () => {
        if (form) {
            form.resetFields();
        }
        setShowStatus(0);
    }

    const addCategory = async () => {
        form.validateFields().then(async (values) => {
            setShowStatus(0);
            const categoryId = form.getFieldValue('categoryId');
            const categoryName = form.getFieldValue('categoryName');
            form.resetFields();
            const result = (await reqAddCategory(categoryName, categoryId)).data;
            if (result.status === 0) {
                if (state.parentId === categoryId){
                    getCategory(); // re-show
                } else if (categoryId === '0') {
                    getCategory('0')
                }
            } else {
                messageAPI.error('Fail to add category');
            }
        }).catch((errorInfo) => {
            // console.log('err:', errorInfo)
            ;
        })
    }

    const updateCategory = () => {
        form.validateFields().then(async (values) => {
            setShowStatus(0); // hidden box
        const result = (await reqUpdateCategory({
            categoryId: current_category._id, 
            categoryName: values.categoryName,
        })).data;
        form.resetFields();
        // console.log('result: ', result);
        if (result.status === 0) {
            getCategory(); // re-show
        } else {
            messageAPI.error('Fail to update category');
        }
        }).catch((errorInfo) => {
            // console.log('err:', errorInfo)
            ;
        })
    }   

    const showAdd = (category) => {
        setShowStatus(1);
        setCurrentCategory(category);
    }

    const showUpdate = (category) => {
        setShowStatus(2);
        setCurrentCategory(category);
    }

    const extra = (
        <Button type='primary' onClick={showAdd}>
            <PlusOutlined />
            Add
        </Button>
    )

    const [state, setState] = useState({
        category: [], // First Level Category List
        loading: true,
        parentId: '0',
        subCategory: [],
        parentName: '',
    }); 

    const columns = [
        {
            title: 'Category',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Operation',
            dataIndex: '',
            key: 'x',
            render: (category) => (<span>
                            <LinkButton onClick={() => showUpdate(category)}>update</LinkButton>
                            {state.parentId === '0' ? <LinkButton onClick={() => {showSubCategory(category)}}>view</LinkButton> : null}
                           </span>),
            width: 250,
        },
    ];

    const showSubCategory = (category) => {
        setState({
            category: state.category,
            loading: true,
            parentId: category._id,
            subCategory: state.subCategory,
            parentName: category.name,
        });
    }

    const [messageAPI, contextHolder] = message.useMessage()
    const getCategory = async (parentId) => {
        const parent_id = parentId || state.parentId;
        const result = (await reqCategorys(parent_id)).data;
        if (result.status === 0) { 
            // Successful Get Data
            if (parent_id === '0') {
                // Update First Level Status
                setState({
                    category: result.data, 
                    loading: false,
                    parentId: state.parentId,
                    subCategory: state.subCategory,
                    parentName: state.parentName,
                });
            } else {
                // Update Sub Level Status
                setState({
                    category: state.category, 
                    loading: false,
                    parentId: state.parentId,
                    subCategory: result.data,
                    parentName: state.parentName,
                }); 
            } 
            
        } else {
            messageAPI.error('Fail to get category list.')
        }
    }

    useEffect(() => {
        getCategory();
    }, []);

    useEffect(() => {
        getCategory();
    }, [state.parentId]);

    const showFirst = () => {
        setState({
            category: state.category,
            loading: false,
            parentId: '0',
            subCategory: [],
            parentName: state.parentName,
        })
    }

    const title = state.parentId === '0' ? "Main Category List" : (
        <span>
            <LinkButton onClick={showFirst}>Fisrt Level List</LinkButton>
            <ArrowRightOutlined style={{marginRight: 5}}/>
            <span>{state.parentName}</span>
        </span>
    ) 

    return (
        <div>
            {contextHolder}
            <Card
                title={title}
                extra={extra}
            >
                <Table 
                    dataSource={state.parentId === '0' ? state.category : state.subCategory} 
                    columns={columns} 
                    bordered
                    rowKey='_id'
                    pagination={{defaultPageSize: 5, showQuickJumper: true}}
                    loading={state.loading}
                />
            </Card>
            <Modal 
                title="Add Category" 
                open={show_status === 1} 
                onOk={addCategory} 
                onCancel={handleCancel}
                >
                <AddForm 
                    itemList={state.category}
                    parentId={state.parentId}
                    parentName={state.parentName}
                    setForm={(form) => {setForm(form)}} 
                />
            </Modal>
            <Modal 
                title="Update Category" 
                open={show_status === 2} 
                onOk={updateCategory} 
                onCancel={handleCancel}
                >
                <UpdateForm 
                    categoryName={current_category ? current_category.name : ''}
                    parentId={state.parentId}
                    setForm={(form) => {setForm(form)}} 
                />
            </Modal>
        </div>
    )
}

export default Category;