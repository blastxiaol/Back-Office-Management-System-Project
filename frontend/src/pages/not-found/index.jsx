import {Button, Row, Col} from 'antd'
import { useNavigate } from 'react-router-dom'
import './not-found.css'

function NotFound() {
    const navigate = useNavigate()

    const goHome = () => {
        navigate('/home', {replace: true});
    }

    return (
        <Row className='not-found'>
            <Col span={12} className='left'></Col>
            <Col span={12} className='right'>
                <h1>404</h1>
                <h2>Sorry. The page is not existed.</h2>
                <Button type='primary' onClick={goHome}>
                    Return to Home.
                </Button>
            </Col>
        </Row>
    )
}

export default NotFound;