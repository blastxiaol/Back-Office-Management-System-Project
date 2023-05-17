import {Card} from 'antd'
import ReactEcharts from 'echarts-for-react'

function Pie() {
    const getOption1 = () => {
        return {
            title: {
                text: 'Source of vistors', 
                subtext: 'It is virtual data', 
                x: 'center'
            },
            tooltip : {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)" 
            },
            legend: {
                orient: 'vertical',
                left: 'left',
                data: ['Direct Entry','From mail','Advertisement','Video Advertisement','Search Enginee']
            },
            series : [
                {
                    name: 'Source of vistors',
                    type: 'pie',
                    radius : '55%',
                    center: ['50%', '60%'],
                    data:[
                        {value:335, name:'Direct Entry'}, 
                        {value:310, name:'From mail'}, 
                        {value:234, name:'Advertisement'}, 
                        {value:135, name:'Video Advertisement'}, 
                        {value:1548, name:'Search Enginee'}
                        ],
                    emphasis: {
                        itemStyle: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        } 
                    }
                }
            ]
        };
    }

    const getOption2 = () => {
        return {
            backgroundColor: '#2c343c',
            title: {
                text: 'Customized Pie', left: 'center',
                top: 20,
                textStyle: { color: '#ccc' }
            },
            tooltip : {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            visualMap: { 
                show: false, 
                min: 80, 
                max: 600, 
                inRange: { colorLightness: [0, 1] }
            },
            series : [
                {
                    name:'source of visitors', 
                    type:'pie',
                    radius : '55%',
                    center: ['50%', '50%'],
                    data:[
                        {value:335, name:'Direct Entry'}, 
                        {value:310, name:'From mail'}, 
                        {value:274, name:'Advertisement'}, 
                        {value:235, name:'Video Advertisement'}, 
                        {value:400, name:'Search Enginee'}
                    ].sort(function (a, b) { return a.value - b.value; }),
                    roseType: 'radius',
                    label: {
                        color: 'rgba(255, 255, 255, 0.3)'
                    },
                    labelLine: { 
                        lineStyle: { color: 'rgba(255, 255, 255, 0.3)' },
                        smooth: 0.2, 
                        length: 10, 
                        length2: 20
                    },
                    itemStyle: { 
                        color: '#c23531',
                        shadowBlur: 200,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    },   
                    animationType: 'scale', 
                    animationEasing: 'elasticOut',
                    animationDelay: function (idx) {
                        return Math.random() * 200; 
                    }
                }
            ]
        }
    }

    return (
        <div>
            <Card title='Pie 1'>
                <ReactEcharts option={getOption1()} style={{height: 300}}/> 
            </Card>
            <Card title='Pie 2'>
                <ReactEcharts option={getOption2()} style={{height: 300}}/>
            </Card>
        </div>
    )
}

export default Pie;