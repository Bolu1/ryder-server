import React, {useReducer} from 'react';
import Modal from 'utilComponents/Modal';
import { extractErrorMessage, processAlertError, processAlertSuccess, validateImage } from 'utils';
import AlertComponent from 'components/AlertComponent';
import CreateButton from 'utilComponents/CreateButton';
import { UPLOAD_AVATAR } from 'GraphQl/Mutations';
import { useMutation, useQuery } from '@apollo/client';
import DropZone from 'utilComponents/DropZone';
import { useSelector } from 'react-redux';
import { GET_SINGLE_ADMIN } from 'GraphQl/Queries';
import { addUser } from 'store/actionCreators';


const UploadAvatar = (props: any):JSX.Element => {
    const initialState = {
       
        fileError:'',
        isLoading: false,
        alertMessage:{},
        showModal: false,
        file: null,

    };
    const [state, setState] = useReducer((state:any, newState: any) => ({ ...state, ...newState }), initialState);
    const {isLoading, alertMessage, fileError, file} = state;
    const {showModal, toggleModal} = props;

    const [uploadImage, { loading, error }] = useMutation(UPLOAD_AVATAR);
    const reduxState = useSelector( (state:any) => state);
    const{userObject} = reduxState?.reducer;
    const { fetchMore }  = useQuery(GET_SINGLE_ADMIN,{variables:{id: userObject?.id}});

   const updateFile = (file = null) => {
        setState({
            file,
        });
   };

    const validateFormData = () => {
       const validateFile = validateImage(file? file[0]:null);
        if (validateFile) {
            return true;
        } else {
            setState({
                ...state,
                fileError: 'File type not supported',
            });
            return false;
        }


    };

    const submit = async (e : React.SyntheticEvent<Element, Event>) => {
        e.preventDefault();
        setState({
            isLoading: true,
        })
        try {
            const validate = validateFormData();
            if(validate){
                await uploadImage({variables: { file: file[0]}});
                props.addAlert(processAlertSuccess('Image added successfully'));
                fetchData();
                toggleModal();
                // props.reload();
                
            };
            setState({
                isLoading: false,
            }); 
        } catch (error) {
          
            const errorMsg = extractErrorMessage(error);
            setState({
                alertMessage:  processAlertError(errorMsg),
                isLoading: false,
            });
        }
        
    };
    const handleAlertClose = () => {
        setState({
            alertMessage:{},
        });
    };

    const fetchData = async() => {
        try {
             
            const apiData : any = await fetchMore({
                variables: { id: userObject?.id}
            });
            const {data, loading, error} = apiData;
            if(data){
                
                const payload = {
                    ...userObject,
                    avatar: data?.getAdmin?.avatar,
                };
                dispatch(addUser(payload));
                props.reload();
            
            };
            if(!loading){
                setState({
                    isLoading: false,
                });
            };
            if(error){
                setState({
                    alertMessage :processAlertError(extractErrorMessage(error)),
                });
            };
        } catch (error) {
            setState({
                alertMessage :processAlertError(extractErrorMessage(error)),
                isLoading: false,
            });
        }
    };
  
    return(
        <>
        <Modal
            title="Upload avatar"
            show={showModal} 
            toggle={toggleModal}
        >
            <>
                {alertMessage?.text && (
                    <>
                        <AlertComponent
                            text={alertMessage.text}
                            type={alertMessage.type}
                            onClose={handleAlertClose}
                        />
                    </>
                )}

                <div className="row">
                    <div className="col-md-12 mb-3">
                        <DropZone
                             updateFileUrl={updateFile}
                        />
                    </div>
                    {fileError &&(
                        <div className='text-danger'>
                            {fileError}
                        </div>
                    )}
                    
                    
                    <div className="col-md-12 mt-3 mb-3 d-flex justify-content-end">
                    <CreateButton
                        text={'Upload Avatar'}
                        actionEvent={(e)=>{submit(e)}}
                        disabled={isLoading}
                        loading={isLoading}
                    />
                    </div>
                </div>
            </>
        </Modal>
        
        </>
    )

};
export default UploadAvatar;

function dispatch(arg0: any) {
    throw new Error('Function not implemented.');
}
