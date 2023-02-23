import React from 'react';
import DatePicker from 'react-date-picker';
import { noOp } from 'utils';
import 'react-date-picker/dist/DatePicker.css';

const CustomDatePicker = ( props: any) => {
   const { value , className = '', onChange = noOp, showError, errorMessage, ...rest } = props;
  
    const newValue :any = value? new Date(value): null;
    return (
        <>
            <DatePicker
                className={`custom_date_picker ${className}`}
                format="dd-MM-y"
                onChange={onChange}
                value={newValue}
                {...rest}
            />
            {showError && (
                <div className="small w-100 text-left text-danger">
                    {errorMessage}
                </div>
            )}
        </>
    );
};

export default CustomDatePicker;
