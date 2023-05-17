import './index.css';
import { reqWeather } from '../../api';
import memoryUtils from '../../utils/memoryUtils'
import storageUtils from '../../utils/storageUtils'
import formateDate from '../../utils/dateUtils';
import { useInterval } from '../../utils/hooks';
import menuList from '../../config/menuConfig';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { message, Modal } from 'antd';
import LinkButton from '../link-button';

function Header () {
    const navigate = useNavigate();
    const [weather, setWeather] = useState({});

    async function getWeather(city) {
        const result = await reqWeather(city);
        const data = result.data.current;
        setWeather({
            city: city,
            dayPictureUrl: data.condition.icon,
            weather: data.condition.text,
        });
    }

    async function getWeatherAndCity() {
        const checkError = (error) => {
            message.error('Get Location Failed');
            getWeather(null);
        }

        const showLocation = async (position) => {
            const {latitude, longitude} = position.coords.latitude;
    
            // const geoApiUrl = `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
            const geoApiUrl = `https://api.bigdatacloud.net/data/reverse-geocode-client?
            latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
            const response = await fetch(geoApiUrl);
            //store response object
            const data = await response.json();
            getWeather(data.city);
        };

        if (navigator.geolocation) {
            // returns position(latitude and longtitude) or error
            navigator.geolocation.getCurrentPosition(showLocation, checkError);
        } else {
            // For old browsers i.e IE
            message.error('Do not support localization.');
            getWeather(null);
        }
    }

    function getTitle() {
        let title = (path.split('/')[0] === 'product') ? path.split('/')[0] : path;
        for(let i = 0; i < menuList.length; ++i) {
            let item = menuList[i];
            if (item.children) {
                let c_item = item.children.find((c_item) => (c_item.key === title));
                if (c_item) {
                    return c_item.label;
                }
            } else if (item.key === title) {
                return item.label;     
            }
        }
    }

    const [modal, contextHolder] = Modal.useModal();
    function logout() {
        modal.confirm({
            content: 'Do you want to logout?',
            okText: 'Yes',
            cancelText: 'No',
            onOk() {
              storageUtils.removeUser();
              memoryUtils.user = {};
              navigate('/login', {replace: true});
            },
          });
    }

    const username = memoryUtils.user.username;

    const [state, setState] = useState({
        currentTime: formateDate(Date.now()),
        dayPictureUrl: '',
        weather: '',
    });

    const location = useLocation();
    const path = location.pathname.slice(1);
    
    
    useInterval(() => {
        setState({
            ...state,
            currentTime: formateDate(Date.now()),
        });
    }, 1000)

    useEffect(() => {
        getWeatherAndCity();
    }, [])

    return (
        <div className="header">
            <div className='header-top'>
                <span>Welcome, {username}</span>
                <LinkButton onClick={logout}>Log out</LinkButton> 
                {contextHolder}
            </div>
            <div className='header-bottom'>
                <div className='header-bottom-left'>{getTitle()}</div>
                <div className='header-bottom-right'>
                    <span>{state.currentTime}</span>
                    <img src={weather.dayPictureUrl} alt='weather'></img>
                    <span>{weather.weather}</span>
                    <span style={{marginLeft: '10px'}}>{weather.city ? weather.city : 'Loading Location'}</span>
                </div>
            </div>
        </div>
    )
}

export default Header;