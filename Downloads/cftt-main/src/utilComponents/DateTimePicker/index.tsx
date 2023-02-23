import React from 'react';
import DateTimePicker from 'react-datetime-picker';
import { noOp } from 'utils';

import 'react-datetime-picker/dist/DateTimePicker.css';
import 'react-calendar/dist/Calendar.css';
import 'react-clock/dist/Clock.css';


const CustomDateTimePicker = ( props: any) => {
   const { value , className = '', onChange = noOp, showError, errorMessage, ...rest } = props;
  
    const newValue :any = value? new Date(value): null;
    return (
        <>
            <DateTimePicker
                className={`custom_date_picker ${className}`}
                // format="dd-MM-y"
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

export default CustomDateTimePicker;
