import React, {useReducer} from 'react';
import './authbutton.scss';
interface propsObject {
    text? : string;
    actionEvent: (e: React.SyntheticEvent) => any;
    className?: string;
    disabled?: boolean;
    loading?: boolean;
  }
const AuthButton = (props: propsObject):JSX.Element => {
    const {className, text, actionEvent, disabled, loading} = props;
    return(
        <div className="text-center w-100">   
            <button 
                onClick={actionEvent} 
                disabled={disabled}
                className={`auth-button w-100 border-0 text-white ${className}`}
            >
                {loading? 'Please wait ...': text}
            </button>
        </div>
    );

};
export default AuthButton;