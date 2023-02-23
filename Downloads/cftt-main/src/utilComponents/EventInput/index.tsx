import React, {useReducer} from 'react';
import './event.scss';
interface propInterface {
    icon?: any,
    label:string,
    disabled?: boolean,
    placeholder?: string,
    value?: string | number,
    onChange?: any,
    type?: string,
    name?: string,
    showError?: string | boolean,
    errorMessage?: string,
}
const EventInput = (props: propInterface): JSX.Element => {
    const { placeholder, showError, errorMessage, label, ...rest} = props;
    return(
        <>
            <div className="form-group mb-2">
                <label className='label'>{label}</label>
                <input 
                    type="text"
                    className={`form-control ${showError? 'border border-danger text-danger' : ''}`} 
                    placeholder={placeholder}
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

export default EventInput;