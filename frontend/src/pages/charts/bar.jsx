import {Card, Button} from 'antd';
import ReactEcharts from 'echarts-for-react';
import { useState } from 'react';

const defaultSales = [5, 20, 36, 10, 10, 20];
const defaultInventory = [15, 30, 46, 20, 20, 40];

function Bar() {
    const [state, setState] = useState({
        sales: defaultSales,
        inventory: defaultInventory,
    })

    const getOption = () => {
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
                    type: 'bar', 
                    data: sales,
                }, 
                {
                    name: 'Inventory', 
                    type: 'bar', 
                    data: inventory,
                }
            ] 
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
                <Button type='primary' onClick={update}>Update</Button> 
            </Card>
            <Card title='Bar 1'>
                <ReactEcharts option={getOption()} style={{height: 300}}/>
            </Card> 
        </div>
    )
}

export default Bar;