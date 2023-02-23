import React from 'react';
import { X } from 'tabler-icons-react';
const CloseButton = (props:any):JSX.Element => {

    return(
        <>
            <button 
                className='close-button py-1 px-2 text-white'
                onClick={()=> props.close()}
            >
                Close&nbsp; 
                <X
                    size={17}
                    strokeWidth={2}
                    color={'white'}
                />
            </button>
        </>
    )
};
export default CloseButton;