/*
Sub-routes components of Product
*/
import { 
    Card,
    Select,
    Input,
    Button,
    Table,
    message,
 } from "antd";
import { PlusOutlined } from '@ant-design/icons';
import { useState, useEffect } from "react";
import LinkButton from "../../components/link-button";
import { reqProducts, reqSearchProducts, reqUpdateStatus } from '../../api';
import { PAGE_SIZE } from '../../utils/constants'
import { useNavigate } from "react-router-dom";


function ProductHome() {
    const navigate = useNavigate()
    const options = [
        {
            value: 'productName',
            label: 'by name',
        },
        {
            value: 'productDesc',
            lable: 'by description',
        }
    ]

    // const [state, setState] = useState(defaultProducts);
    const [searchState, setSearchState] = useState({
        serachName: '',
        searchType: 'productName',
    })
    const [pageNum, setPageNum] = useState(0);
    const [state, setState] = useState({
        products: [], //products array
        total: 0,
    });
    

    const extra = (
        <Button type='primary' onClick={() => {navigate('addupdate')}}>
            <PlusOutlined />
            Add
        </Button>
    )

    const [loading, setLoading] = useState(false);

    const updateStatus = async (productId, status) => {
        const result = (await reqUpdateStatus(productId, status)).data;
        if (result.status === 0) {
            message.success('Successful Update');
            getProducts(pageNum);
        }
    };

    const columns = [
        {
            width: 260,
            title: 'Name',
            dataIndex: 'name',
        },
        {
            title: 'Description',
            dataIndex: 'desc',
        },
        {
            title: 'Price',
            dataIndex: 'price',
            render: (price) =>  '$' + price,
        },
        {
            width: 100,
            title: 'Status',
            render: (product) => {
                const {status, _id} = product;
                return (
                    <div>
                        <Button 
                            type="primary"
                            onClick={() => updateStatus(_id, status === 1 ? 2: 1)}
                        > 
                            {status === 1 ? 'off shelf': 'on shelf'} 
                        </Button>
                        <span>{status === 1 ? 'for sale': 'removed'}</span>
                    </div>
                )},
        },
        {
            width: 100,
            title: 'Operation',
            render: (products) => {
                return (
                    <div>
                        <LinkButton onClick={() => {
                            navigate('detail', {
                            state: {products}
                        })}}
                        >
                            detail
                        </LinkButton>
                        <LinkButton onClick={() => {
                            navigate('addupdate', {
                            state: {products}
                        })}}
                        >
                            change
                        </LinkButton>
                    </div>
                )
            }
        }
    ];

    const getProducts = async (pageNum) => {
        setLoading(true);
        let result;
        if (searchState.serachName) {
            result = (await reqSearchProducts(pageNum, PAGE_SIZE, searchState.serachName, searchState.searchType)).data; 
        } else {
            result = (await reqProducts(pageNum, PAGE_SIZE)).data; 
        }  
        if (result.status === 0) {
            setPageNum(pageNum);
            const data = result.data;
            setState({
                products: data.list,
                total: data.total,
            });
            setLoading(false);
        } 
    }

    const title = (
        <div>
            <Select 
                defaultValue={searchState.searchType}
                style={{
                    width: 150,
                  }}
                options={options}   
                onChange={(value) => {setSearchState({
                    serachName: searchState.serachName,
                    searchType: value,
                })} }
            />
            <Input 
                placeholder="key words" 
                style={{width: 150, margin: '0 15px'}}
                value={searchState.serachName}
                onChange={(e) => {setSearchState({
                    serachName: e.target.value,
                    searchType: searchState.searchType,
                })}}
                />
            <Button type="primary" onClick={getProducts}>Search</Button>
        </div>
    )

    useEffect(() => {
        getProducts(1);
    }, [])

    return (
        <Card title={title} extra={extra}>
            <Table
                rowKey='_id'
                dataSource={state.products}
                columns={columns} 
                pagination={{
                    defaultPageSize: PAGE_SIZE, 
                    showQuickJumper: true,
                    total: state.total,
                    onChange: (pageNum) => {getProducts(pageNum)}
                }}
                loading={loading}
                />
        </Card>
    )
}

export default ProductHome;