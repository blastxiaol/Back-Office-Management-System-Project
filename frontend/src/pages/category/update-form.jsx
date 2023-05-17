import { Form, Input } from "antd"

export default function UpdateForm(props) {
    const setForm = props.setForm;
    const [form] = Form.useForm();
    
    const x = () => {
      setForm(form);
    }

    form.setFieldsValue({'categoryName': props.categoryName});
    
    return (
        <Form form={form} onChange={x}>
            <Form.Item 
              name='categoryName'
              rules={[{required: true, message: 'Must enter category name!'}]}
              >
                <Input 
                  placeholder="Please enter category name"
                ></Input>
            </Form.Item>
        </Form>
    )
}