import { PlusOutlined } from '@ant-design/icons';
import { message, Modal, Upload } from 'antd';
import { useEffect } from 'react';
import { useState, forwardRef, useImperativeHandle } from 'react';
import { reqDeleteImg } from '../../api';
import { BASE_IMG_URL } from '../../utils/constants';

const getBase64 = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });
}
  
function PicturesWall(props, ref) {
    const [messageApi, contextHolder] = message.useMessage();
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [previewTitle, setPreviewTitle] = useState('');
    const [fileList, setFileList] = useState([]);
    const imgs = props.imgs;

    const handleCancel = () => setPreviewOpen(false);

    const handlePreview = async (file) => {
        if (!file.url && !file.preview) {
        file.preview = await getBase64(file.originFileObj);
        }
        setPreviewImage(file.url || file.preview);
        setPreviewOpen(true);
        setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
    };

    const handleChange = async ({ file: newFile, fileList: newFileList }) => {
        if (newFile.status === 'done') {
            const result = newFile.response;
            if (result.status === 0) {
                messageApi.success('Successfull Upload');
                const { name, url } = result.data;
                newFile.name = name;
                newFile.url = url;
            } else {
                messageApi.error('Failed Upload');
            } 
        } else if (newFile.status === 'removed') {
            const result = (await reqDeleteImg(newFile.name)).data;
            if (result.status === 0) {
                messageApi.success('Successful Delete');
            } else {
                messageApi.error('Failed Delete');
            }
        }
        setFileList(newFileList);
    };

    const getImgs = () => {
        // Get an array including all uploaded images' name
        return fileList.map(file => file.name);
    }

    useImperativeHandle(ref, () => ({
        getImgs: getImgs,
    }))
    
    useEffect(() => {
        if (imgs && imgs.length > 0) {
            const initFileList = imgs.map((img, index) => ({
                uid: -index,
                name: img,
                status: 'done',
                url: BASE_IMG_URL + img,
            }))
            setFileList(initFileList);
        }
    }, [])

    const uploadButton = (
        <div>
            <PlusOutlined />
            <div
                style={{
                marginTop: 8,
                }}
            >
                Upload
            </div>
        </div>
    );

    ref.getImgs = getImgs;

    return (
        <div ref={ref}>
            <Upload
                action="/manage/img/upload"
                listType="picture-card"
                fileList={fileList}
                onPreview={handlePreview}
                onChange={handleChange}
                accept="image/*"
                name="image"
            >
                {fileList.length >= 8 ? null : uploadButton}
            </Upload>
            <Modal open={previewOpen} title={previewTitle} footer={null} onCancel={handleCancel}>
                <img
                alt="example"
                style={{
                    width: '100%',
                }}
                src={previewImage}
                />
            </Modal>
            { contextHolder }
        </div>
    );
};

export default forwardRef(PicturesWall);