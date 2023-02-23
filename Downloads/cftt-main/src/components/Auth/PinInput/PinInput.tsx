import React, {useReducer} from 'react';
import './pinInput.scss';
interface propInterface {
    name: string,
    actionEvent: (e: React.SyntheticEvent & { target: HTMLInputElement}) => any;
    value?: string| number;
}
const PinInput = (props: propInterface): JSX.Element => {
    const{name, actionEvent, ...rest} = props;
    return(
        <>
            <div className="w-100 pin-input-wrapper">
                <input
                  name={name}
                  onChange={actionEvent}
                  className="pin-input text-center"
                  maxLength={1}
                  {...rest}
                />
            </div>
        </>
    )
};

export default PinInput;