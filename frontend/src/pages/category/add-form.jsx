import { Form, Select, Input } from "antd"
import { useEffect } from "react";

// const items = [
//     {
//       value: '0',
//       label: 'Fisrt Level',
//     },
//     {
//       value: '1',
//       label: 'Computer',
//     },
//   ]

function getItems(itemList) {
    let items  = [{
        value: '0',
        label: 'Main Category',
    }];

    for (let i = 0; i < itemList.length; i++) {
        items.push({
            value: itemList[i]._id,
            label: itemList[i].name,
        })
    }
    return items;
}

export default function AddForm(props) {
    const items = getItems(props.itemList);

    const setForm = props.setForm;
    const [form] = Form.useForm();
    form.setFieldsValue({'categoryId': props.parentId});

    const x = () => {
        setForm(form);
    }

    useEffect(() => {
        setForm(form);
    }, [])
    
    return (
        <Form form={form} onChange={x}>
            <Form.Item name='categoryId'>
                <Select options={items} 
                />
            </Form.Item>
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