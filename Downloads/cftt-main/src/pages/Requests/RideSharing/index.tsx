import React, {useReducer, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AlertComponent from 'components/AlertComponent';
import Pagination from 'utilComponents/TablePagination';
import { ApiRequestClient } from 'apiClient';
import { apiRoutes } from 'constants/index';
import Filter from 'components/Filter';
import InfoDivHeader from 'utilComponents/InfoDivHeader';
import MakeSelection from 'utilComponents/MakeSelectionIcon';
import { formatInitialDateValue } from 'utils';
import Badges from 'utilComponents/Badges';
import { Download, FileInvoice } from 'tabler-icons-react';
import CreateButton from 'utilComponents/CreateButton';

const RideSharing = ():JSX.Element => {
    const initialState = {
        listView: true,
        rowsPerPage:5,
        page:0,
        alertMessage:{},
        data:[],
        activeDataObj:{},
        showEditModal: false,
    };
    
    const [state, setState] = useReducer((state:any, newState: any) => ({ ...state, ...newState }), initialState);
    const {listView, page, activeDataObj, alertMessage, data, showEditModal} = state;

    const changeListView = () => {
        setState({
            listView: !listView,
        });
    };

    const handleChangePage = (event: React.MouseEvent<HTMLButtonElement, MouseEvent> | null, newPage: number): void => {
      
      };
    
    const handleChangeRowsPerPage = (event: React.SyntheticEvent): void => {
        
    };
    const handleAlertClose = () => {
        setState({
            alertMessage:{},
        });
    };

    const addAlert = (alertObj:{text: string, type: string}) => {
        setState({
            alertMessage: alertObj,
        });
    };

    const fetchData = async () => {
        setState({
            isLoading: true,
        });

        try {
            const response = await ApiRequestClient.get(apiRoutes.GET_ALL_GROUPS);
    
            setState({
                data: response?.data?.data,
                isLoading: false,
            });
        } catch (error) {
            setState({
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

    const toggleEditModal = () => {
        setState({
            showEditModal: !showEditModal,
        });
    };


    return(
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
        <div className="bg-white">
        <div className="row ">
            <div className="col-md-4 list-column border-right pr-0">
                <div className="p-3 my-2">
                    <Filter
                        text="Show"
                    />
                    
                </div>
                {data.map((datum:any,_i:number) =>{
                    return(
                        <>
                            <div 
                                className={`
                                    d-flex pointer justify-content-between 
                                    align-items-start px-3 py-2 border-top border-bottom 
                                    ${activeDataObj?._id === datum?._id? 'active-list':''}`
                                }
                                onClick={()=> setState({...state, activeDataObj: datum})}
                            >
                
                                <div className="user-account pb-2 d-flex align-items-center pr-3">
                                 
                                    <div className="user-name px-2">
                                        <h6 className="m-0 name">Jessica Styles</h6>
                                        <span className="small email">
                                            Lorem ipsum dolor sit amet, consectetur adipiscing elit...
                                            
                                            
                                        </span>
                                    </div>
                                </div>
                                <div className="justify-content-end py-0 my-0 pt-1 ">
                                    <div>
                                        <Badges
                                            text="Pending"
                                            type="pending"
                                        />
                                    </div>
                                    
                                </div>
                                
                            </div>
                        </>
                    )
                })}
                
                <div>
                <Pagination
                    count={data.length?? 0}
                    page={0}
                    rowsPerPage={10}
                    onPageChange={handleChangePage}
                    handleChangeRowsPerPage={handleChangeRowsPerPage}
                />
                </div>

            </div>
            <div className="col-md-8 pl-0 my-2 py-2">
                {activeDataObj?._id? (
                    <>
                    <div className="d-flex justify-content-between align-items-center border-bottom w-100">
                        <div className=" py-3 px-3">
                        <div className="user-account pb-1 d-flex align-items-end">
                            
                            <div className="user-name px-2">
                                <div className="d-flex">
                                <h6 className="m-0 name">Jessica Styles&nbsp;&nbsp;
                                    
                                </h6>
                                <Badges
                                    text="Pending"
                                    type="pending"
                                />
                                </div>
                                 <div className="small email pt-3">
                                     {formatInitialDateValue(activeDataObj?.createdAt)}&nbsp;&nbsp;
                                     <span className="text-primary pointer">View profile</span>
                                </div>
                            </div>
                           
                        </div>
                        </div>
                        
                </div>
                <div className="pt-2 pb-4 px-3 mt-2">
                    <div className="record-info-header">
                        CONTACT DETAILS 
                    </div>
                    <div className="my-3">
                        <InfoDivHeader
                            label="PHONE NUMBER"
                            text="09067980987"
                        />
                    </div>
                    <div className="my-3">
                        <InfoDivHeader
                            label="ADDRESS"
                            text="32a Charlseton Close, off Priya Road"
                        />
                    </div>
                    <div className="record-info-header">
                        CAR DETAILS 
                    </div>
                    <div className="my-3">
                        <InfoDivHeader
                            label="CAR MODEL"
                            text="Lexus ES"
                        />
                    </div>
                    <div className="my-3">
                        <InfoDivHeader
                            label="NUMBER OF SEATS"
                            text="4"
                        />
                    </div>
                    
                    <div className="my-4 d-flex">
                            <div className="attachment-div p-2 pointer">
                                <div className="d-flex justify-content-between align-items-center">
                                    <div className="">
                                        <FileInvoice
                                            size={25}
                                            strokeWidth={2}
                                            color={'#dadada'}
                                        />
                                        <span className="font-weight-bold small name px-3">
                                            Selfportrait.png
                                        </span>
                                    </div>
                                    <div className="">
                                        <Download
                                            size={25}
                                            strokeWidth={2}
                                            color={'#dadada'}
                                        />
                                    </div>
                                </div>
                                
                            </div>
                            <div className="mx-4" />

                            <div className="attachment-div p-2 pointer">
                                <div className="d-flex justify-content-between align-items-center">
                                    <div className="">
                                        <FileInvoice
                                            size={25}
                                            strokeWidth={2}
                                            color={'#dadada'}
                                        />
                                        <span className="font-weight-bold small name px-3">
                                            license.pdf
                                        </span>
                                    </div>
                                    <div className="">
                                        <Download
                                            size={25}
                                            strokeWidth={2}
                                            color={'#dadada'}
                                        />
                                    </div>
                                </div>
                                
                            </div>
                    </div>

                    <div className="my-2 d-flex justify-content-end ">
                        <CreateButton
                            text={'APPROVE'}
                            
                            actionEvent={()=>{console.log('me')}}

                        />
                    </div>
                    
                </div>
                    </>
                ):(
                    <div className="mt-5 mb-3">
                        <MakeSelection />
                    </div>
                )}
                
            </div>
        </div>
        </div>
    
       
        </>
    )

};
export default RideSharing;