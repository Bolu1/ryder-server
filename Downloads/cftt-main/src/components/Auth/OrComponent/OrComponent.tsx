import React, {useReducer} from 'react';
import './orcomponent.scss';
interface propInterface {
    text?: string,
}
const OrComponent = (props: propInterface): JSX.Element => {
    return(
        <>
            <div className="w-100 or-component">
                <h2>
                    <span>{props.text} </span>
                </h2>
            </div>
        </>
    )
};

export default OrComponent;