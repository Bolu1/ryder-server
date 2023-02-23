import React, {useReducer} from 'react';
import './actionbutton.scss';

interface propsObject {
    text: string | JSX.Element,
    actionEvent?: (e: React.SyntheticEvent) => any;
    className?: string;
    disabled?: boolean;
    loading?: boolean;
}
const ActionButton = (props: propsObject):JSX.Element => {
    const {text, className, actionEvent, disabled, loading} = props;
    return(
        <button
            disabled={disabled}
            className={`pointer action-button ${className} `}
            onClick={actionEvent}
        >   
            {loading? 'Please wait ...': text}
        </button>
    );

};
export default ActionButton;