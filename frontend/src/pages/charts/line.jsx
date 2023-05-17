import {Card, Button} from 'antd';
import ReactEcharts from 'echarts-for-react';
import { useState } from 'react';

const defaultSales = [5, 20, 36, 10, 10, 20];
const defaultInventory = [15, 30, 46, 20, 20, 40];

function Line() {
    const [state, setState] = useState({
        sales: defaultSales,
        inventory: defaultInventory,
    })

    const getOption1 = () => {
        const {sales, inventory} = state;
        return {
            title: { 
                text: 'ECharts Sample' 
            },
            tooltip: {},
            legend: { 
                data: ['Sales', 'Inventory'] 
            },
            xAxis: {
                data: ["T-shirt","Cardigan","Chiffon shirt","Trousers","High heels","Socks"]
            },
            yAxis: {},
            series: [
                {
                    name: 'Sales', 
                    type: 'line', 
                    data: sales,
                }, 
                {
                    name: 'Inventory', 
                    type: 'line', 
                    data: inventory,
                }
            ] 
        };
    }

    const getOption2 = () => {
        return {
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
            },
            yAxis: {
                type: 'value'
            },
            series: [{
                data: [820, 932, 901, 934, 1290, 1330, 1320], 
                type: 'line',
                areaStyle: {}
            }]
        };
    }

    const update = () => {
        const sales = state.sales.map(sale => sale + 1);
        const inventory = state.inventory.map(inventory => inventory -1);
        setState({
            ...state,
            sales: sales,
            inventory: inventory,
        }) 
    }

    return (
        <div>
            <Card>
                <Button type='primary' onClick={update}> Update </Button> 
            </Card>
            <Card title='Line 1'>
                <ReactEcharts option={getOption1()} style={{height: 300}}/>
            </Card>
            <Card title='Line 2'>
                <ReactEcharts option={getOption2()} style={{height: 300}}/>
            </Card> 
        </div>
    )
}

export default Line;