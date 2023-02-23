import React, {useReducer} from 'react';
import './formgroupinput.scss';
interface propInterface {
    icon?: any,
    label?:string,
    disabled?: boolean,
    placeholder?: string,
    value?: string | number,
    onChange?: any,
    type?: string,
    name?: string,
    showError?: string | boolean,
    errorMessage?: string,
}
const FormGroupTextarea = (props: propInterface): JSX.Element => {
    const {icon, placeholder, showError, errorMessage, ...rest} = props;
    return(
        <>
            <div className="form-group mb-2">
                {icon && (
                    <img alt="icon" src={icon} />
                )}
                <label>{placeholder}</label>
                <textarea 
                    type="text"
                    className={`form-control ${showError? 'border border-danger text-danger' : ''}`} 
                    placeholder={placeholder}
                    rows={5}
                    {...rest}
                    />
                
            </div>
            {showError && (
                <div className="small w-100 text-left text-danger">
                    {errorMessage}
                </div>
            )}
            
        </>
    )
};

export default FormGroupTextarea;