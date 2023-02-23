import moment from 'moment';
import React, {useReducer, useEffect} from 'react'
import { Edit, Trash } from 'tabler-icons-react';
import Badges from 'utilComponents/Badges';
import { extractErrorMessage, processAlertError, processAlertSuccess, truncateMultilineText } from 'utils';
import Pagination from 'utilComponents/TablePagination';
import  { DivLoader } from 'utilComponents/Loader';
import { useMutation, useQuery } from '@apollo/client';
import { GET_ALL_TIME_SLOTS } from 'GraphQl/Queries';
import CreateButton from 'utilComponents/CreateButton';
import AlertComponent from 'components/AlertComponent';
import { connect } from 'react-redux';
import CreateTimeSlot from '../TimeSlots/CreateTimeSlot';
import CloseButton from 'components/CloseButton';
import PageTitle from 'components/PageTitle';
import EditTimeSlot from './EditTimeSlot';
              

const AllTimeSlots =(props: any) => {
    const {user} = props;
    const initialState = {
        listView: true,
        pagination:{
            rowsPerPage: 10,
            page:0,
            totalRecords: 10,
        },
        alertMessage:{},
        dataArr:[],
        activeId: null,
        isLoading:false,
        showAllSermons:true,
        showCreateTimeSlotModal: false,
        showEditTimeSlotModal: false,
        status: 'null',
        showDeleteModal:false,
        search: ''
    };
    const [state, setState] = useReducer((state:any, newState: any) => ({ ...state, ...newState }), initialState);

    const {
        isLoading,
        alertMessage,  
        showDeleteModal, 
        dataArr,
        activeId,
        showAllSermons,
        showCreateTimeSlotModal,
        showEditTimeSlotModal,
        status,
        pagination,
        search
    } = state;
    const { fetchMore } = useQuery(GET_ALL_TIME_SLOTS, {
        variables: {
          adminId: user?.id
        },
    });

    const defaultView = (refresh= null) => {
        setState({
            showCreateTimeSlotModal: false,
            showEditTimeSlotModal: false,
            activeId: null,
        });
        if(refresh){
            fetchData();
        }
    };

    const fetchData =  async (flag= status, paginationArgs = pagination) => {
        setState({
            isLoading:true,
        });
        const searchItem = search?? ' ';
        const apiData : any = 
        await fetchMore({
                    variables:{
                        adminId: user?.id,
                    }
                });
         if(apiData.data){
             console.log(apiData?.data?.getSlots);
            setState({
                dataArr: apiData?.data?.getSlots,
            }); 
        };

        if(!apiData.loading){
            setState({
                isLoading: false,
            });
        };

        if(apiData.error){
            setState({
                alertMessage :processAlertError(extractErrorMessage(apiData?.error)),
                isLoading: false,
            });
        }
    };


    useEffect(() => {
        fetchData();
        // Cleanup method
        return () => {
            setState({
                ...initialState,
            });
        };
    }, []);

    const handleAlertClose = () => {
        setState({
            alertMessage:{},
        });
    };

    const addAlert = (alert:any) => {
        setState({
            alertMessage:alert,
        });
    };

    const toggleCreateTimeSlotModal = (refresh = null) => {
        setState({
            showCreateTimeSlotModal: !showCreateTimeSlotModal,
        });
        if(refresh){
            fetchData();
        }
    };
    const toggleEditTimeSlotModal  = (id = null) => {
        setState({
            showEditTimeSlotModal: !showEditTimeSlotModal,
            activeId : id
        });
    };
    
    return (

        <>
           
            
            <div className="row  py-3 px-4  pt-4 justify-content-between align-items-center"> 
                <div className="col-md-6">
                    <PageTitle text='View Time slots' />
                </div>
                <div className='col-md-5 d-flex justify-content-end mb-3'>
                        
                    <CloseButton 
                        close={props.close}
                    />
                </div>
                {isLoading? (
                    <div className='bg-white'>
                        <DivLoader />
                    </div>
                ) :(
                    <>
                        

                        {alertMessage?.text && (
                                <div className='col-md-12 d-flex justify-content-end my-2'>
                                <AlertComponent
                                    text={alertMessage.text}
                                    type={alertMessage.type}
                                    onClose={handleAlertClose}
                                />
                            </div>
                        )}
                        
                        <table className='table mt-4'>
                            <thead>
                                <tr>
                                    <th>Administrator</th>
                                    <th>Date</th>
                                    <th>Time</th>
                                    <th>Status</th>
                                    <th/>
                                </tr>
                            </thead>
                            <tbody>
                            {dataArr.map((datum: any, _i:number) => {
                                return(
                                    <tr>
                                        <td>{user?.full_name}</td>
                                        <td>{moment(datum?.startDate).format("DD/MM/YYYY")}</td>
                                        <td>{datum?.startTime} - {datum?.endTime}</td>
                                        <td>
                                            {datum?.available?(
                                                <Badges
                                                    text="Available"
                                                    type="success"
                                                />
                                            ):(
                                                <Badges
                                                    text="Not available"
                                                    type="pending"
                                                />
                                            )}
                                        </td>
                                        <td>
                                        {datum?.available &&(
                                            <div className='d-flex gap-3'>
                                                <span className='pointer' onClick={()=>toggleEditTimeSlotModal(datum?._id)}>
                                                    <Edit
                                                        size={28}
                                                        strokeWidth={2}
                                                        color={'black'}
                                                    />
                                                </span>
                                                <span className='pointer'>
                                                    <Trash
                                                        size={28}
                                                        strokeWidth={2}
                                                        color={'black'}
                                                    />
                                                </span>
                                            </div>
                                        )}
                                        </td>
                                    </tr>
                                )
                            })}
                                
                            </tbody>
                        </table>
                    </>
                
                )}
                
            </div>

            <div>
                <CreateButton
                    actionEvent={()=> toggleCreateTimeSlotModal() }
                    text={'Create Time Slot'}
                    float
                />
            </div>

            {showCreateTimeSlotModal && (
                <CreateTimeSlot
                    refresh={defaultView}
                    toggleModal={toggleCreateTimeSlotModal}
                    show={showCreateTimeSlotModal}
                    addAlert={addAlert}
                />
            )}
            {showEditTimeSlotModal && (
                <EditTimeSlot
                    refresh={defaultView}
                    toggleModal={toggleEditTimeSlotModal}
                    show={showEditTimeSlotModal}
                    slotId= {activeId}
                    addAlert={addAlert}
                />
            )}
        
        </>
    )
};
function mapStateToProps(appState:any) {

    return {
       user: appState?.reducer?.userObject,
    };
 }
export default connect(mapStateToProps)(AllTimeSlots);
