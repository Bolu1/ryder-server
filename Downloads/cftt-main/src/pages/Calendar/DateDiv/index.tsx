import React from 'react';
import dateIcon from 'assets/images/date.svg';
import './datediv.scss';

const DateDiv = (props:any):JSX.Element => {
    const {title, date} = props;
    return(
        <div className='date-div w-100'>
            <div className="title">{title}</div>
            <div className="date-container">
                <div className='date-icon-container'>
                    <img src={dateIcon} alt="Date icon" />
                </div>
                <div>{date}</div>
            </div>
        </div>
    )
};
export default DateDiv;