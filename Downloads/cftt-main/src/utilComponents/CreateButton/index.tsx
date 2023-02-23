import React, {useReducer} from 'react';
import './createbutton.scss';

interface propsObject {
    text: string | JSX.Element,
    actionEvent?: (e: React.SyntheticEvent) => any;
    className?: string;
    float?: boolean;
    disabled?: boolean;
    loading?: boolean;
}
const CreateButton = (props: propsObject):JSX.Element => {
    const {text, className, actionEvent, float, disabled, loading} = props;
    return(
        <button
            disabled={disabled}
            className={`${className} pointer ${!float? 'non-float-create-button' : 'create-button'}`}
            onClick={actionEvent}
        >   
            {loading? 'Please wait ...': text}
        </button>
    );

};
export default CreateButton;