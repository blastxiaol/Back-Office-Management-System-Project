import { Form, Input } from "antd"
import { useEffect } from "react";


export default function AddForm(props) {

    const setForm = props.setForm;
    const [form] = Form.useForm();

    const formItemLayout = {
        // labelCol: { span: 5},       // width of left label
        wrapperCol: { span: 15 },    // width of right wrapper
    }

    const onChange = () => {
        setForm(form);
    }

    useEffect(() => {
        setForm(form);
    }, [])
    
    return (
        <Form form={form} onChange={onChange} {...formItemLayout}>
            <Form.Item 
                name='roleName' 
                label='role name'
                rules={[{required: true, message: 'Must enter role name!'}]}
                >
                <Input 
                    placeholder="Please enter role name"
                ></Input>
            </Form.Item>
        </Form>
    )
}