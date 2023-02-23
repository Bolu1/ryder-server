import React, { useState } from 'react';
import Modal from 'utilComponents/Modal';
import {Animated} from "react-animated-css";
import { Refresh, Trash } from 'tabler-icons-react';
import { useMutation } from '@apollo/client';
import { extractErrorMessage, processAlertError, processAlertSuccess } from 'utils';
import AlertComponent from 'components/AlertComponent';
interface propInterface {
    
    refresh: () => any;
    addAlert:(msg:any)=> any;
    mutation: any,
    handleModalToggle: () => any;
    showModal:  boolean,
    errorMessage?: string,
    parameterKey:any,
    recordId: number,
}
const DeleteModal = (props: propInterface) => {
    const {showModal, handleModalToggle, parameterKey, mutation, recordId, refresh} = props;
    const [deleteRecord, { data, loading, error }] = useMutation(mutation);
    // State
    const [alertMessage, setAlertMessage]:any = useState({}); 
    const [isLoading, setIsLoading] = useState(false);

    const handleDeleteAction = async() => {

        try {
            await deleteRecord({variables:{[parameterKey]: recordId}});
            refresh();
            props.addAlert(processAlertSuccess('Record deleted successfully'));
            handleModalToggle();
        } catch (error) {
            const errorMsg = extractErrorMessage(error);
            setAlertMessage(processAlertError(errorMsg));
            setIsLoading(false);
        }
    };
    return(
        <>
             <Modal
                title="Delete record"
                show={showModal} 
                toggle={handleModalToggle}
            >
            <>
                {alertMessage?.text && (
                        <div className='col-md-12 d-flex justify-content-end my-2'>
                        <AlertComponent
                            text={alertMessage.text}
                            type={alertMessage.type}
                            onClose={()=>{setAlertMessage({})}}
                        />
                    </div>
                )}
                <div className="text-center">
                    <Animated animationIn="fadeIn" animationOut="zoomOutDown" animationInDuration={2000} animationOutDuration={1400} isVisible={true}>
                        <div>
                            <Trash
                                size={70}
                                strokeWidth={3}
                                color={'#bc1d2c'}
                            />
                        </div>
                    </Animated>
                    <h4 className="my-3">Are you sure you want to delete this entry?</h4>
                    <hr/>
                    <button 
                        type="button" 
                        className="btn w-100" 
                        style={{'background': '#0654DF', 'color': 'white'}}
                        disabled={isLoading}
                        onClick={()=> handleDeleteAction()}
                    >
                       {isLoading? 'Please wait ...': 'Delete'}
                    </button>
                </div>
            </>
        </Modal>
        </>
    )
};
export default DeleteModal;