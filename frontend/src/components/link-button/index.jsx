import './index.css'
import { useState } from 'react';

export default function LinkButton(props) {
    const [active, setActive] = useState(true);

    const onMouseMove = () => {
        setActive(false);
    }

    const onMouseOut = () => {
        setActive(true);
    }

    return (
        <button {...props}
            className={active?'link-button':'link-button-move'}
            onMouseMove={onMouseMove}
            onMouseOut={onMouseOut}
        >
        </button>
    )
}