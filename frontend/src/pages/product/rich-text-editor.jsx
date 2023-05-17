import { useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import { EditorState, convertToRaw, ContentState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

function RichTextEditor(props, ref) {
    const [state, setState] = useState({
        editorState: EditorState.createEmpty(),
    })

    const onEditorStateChange = (editorState) => {
        setState({
            editorState,
        });
    };

    const getDetail = () => {
        return draftToHtml(convertToRaw(state.editorState.getCurrentContent()))
    }

    useImperativeHandle(ref, () => ({
        getDetail: getDetail,
    }))

    useEffect(() => {
        const html = props.detail;
        if (html) {
            const contentBlock = htmlToDraft(html);
            const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
            const editorState = EditorState.createWithContent(contentState);
            setState({
                editorState: editorState,
            })
        }
    }, [])

    function uploadImageCallBack(file) {
        return new Promise(
          (resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.open('POST', '/manage/img/upload');
            const data = new FormData();
            data.append('image', file);
            xhr.send(data);
            xhr.addEventListener('load', () => {
              const response = JSON.parse(xhr.responseText);
              const url = response.data.url;
              resolve({data: {link: url}});
            });
            xhr.addEventListener('error', () => {
              const error = JSON.parse(xhr.responseText);
              reject(error);
            });
          }
        );
      }

    return (
        <div>
            <Editor
                editorState={state.editorState}
                wrapperClassName="demo-wrapper"
                editorClassName="demo-editor"
                editorStyle={{border: '1px solid grey', minHeight: 200, paddingLeft: 10}}
                onEditorStateChange={onEditorStateChange}
                toolbar={{image: {uploadCallback: uploadImageCallBack, alt: { present: true, mandatory: true } }}}
            />
        </div>
    );
}

export default forwardRef(RichTextEditor);