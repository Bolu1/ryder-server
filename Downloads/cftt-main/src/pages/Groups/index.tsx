import PageTitle from 'components/PageTitle';

import React, {useReducer, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AlertComponent from 'components/AlertComponent';
import TableListView from 'utilComponents/TableListView';
import Pagination from 'utilComponents/TablePagination';
import Filter from 'components/Filter';
import branchIcon from 'assets/images/branch.png';
import CreateGroup from './CreateGroup';
import MakeSelection from 'utilComponents/MakeSelectionIcon';
import EditGroup from './EditGroup';
import CircularLoader from 'utilComponents/Loader';
import Badges from 'utilComponents/Badges';
import { useQuery } from '@apollo/client';
import { GET_ALL_GROUPS } from 'GraphQl/Queries';
import { extractErrorMessage, formatDate2, formatInitialDateValue, processAlertError } from 'utils';
import ViewGroup from './ViewGroup';


const Groups = ():JSX.Element => {
    const initialState = {
        listView: true,
        rowsPerPage:10,
        page:0,
        alertMessage:{},
        dataArr:[],
        activeDataObj:{},
        showEditModal: false,
        isLoading: true,
    };
    
    const [state, setState] = useReducer((state:any, newState: any) => ({ ...state, ...newState }), initialState);
    const {listView, page, isLoading, activeDataObj, alertMessage, showEditModal, dataArr, rowsPerPage} = state;
    const { data, loading, error } = useQuery(GET_ALL_GROUPS);
    const changeListView = () => {
        setState({
            listView: !listView,
        });
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


    useEffect(() => {
        if(data){
            setState({
                dataArr: data?.getAllGroups,
                activeDataObj: data?.getAllGroups? data?.getAllGroups[0] : {},
            });
           
        };
        if(!loading){
            setState({
                isLoading: false,
            });
        };

        if(error){
            
            setState({
                alertMessage :processAlertError(extractErrorMessage(error)),
            })
        }
        
        // Cleanup method
        return () => {
            setState({
                ...initialState,
            });
        };
    }, [data ]);

    const toggleEditModal = ():void => {
        setState({
            showEditModal: !showEditModal,
        });
    };

    const addData = (newData: any):void => {
        const newArr = [...dataArr];
        newArr.push(newData);
        setState({
            dataArr: [...newArr],
        });
    };
    const handleChangePage = (event: React.MouseEvent<HTMLButtonElement, MouseEvent> | null, newPage: number): void => {
        
        setState({
            page: newPage,
        });
        
    };
  
    const handleChangeRowsPerPage = (event: any): void => {

        const splicedIndex = page * rowsPerPage;
        let spilceStop = rowsPerPage+ splicedIndex;
        
        if(spilceStop >= dataArr.length){
            return;
        }
        setState({
            rowsPerPage: event?.target?.value,
        });
      
    };

    const paginatedData = (dataArr:any) => {
        const splicedIndex = page * rowsPerPage;
        let spilceStop = rowsPerPage+ splicedIndex;
        const newArr = dataArr.slice(splicedIndex, spilceStop);
        
        return newArr;

    };
    const paginateData = paginatedData(dataArr);
    return(
        <>
        <div className="row justify-content-between align-items-end">
        <div className="col-md-6">
            <PageTitle text='Groups' />
        </div>
        <div className="col-md-6 d-flex justify-content-end">
            <TableListView
                isActive={listView}
                actionEvent={changeListView}
            />
        </div>
        </div>
        {alertMessage?.text && (
            <>
                <AlertComponent
                    text={alertMessage.text}
                    type={alertMessage.type}
                    onClose={handleAlertClose}
                />
            </>
        )}
        {isLoading? (
            <>
                <CircularLoader/>
            </>
        ):(
            <>
        
        <div className="bg-white">
        <div className="row ">
            <div className="col-md-4 list-column border-right pr-0">
                <div className="p-3">
                    <Filter
                        text="Show"
                    />
                    
                </div>
                <div className='overflow-y-auto'>
                    {paginateData?.map((datum:any,_i:number) =>{
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
                                        <div className="avatar">
                                            
                                            <img src={branchIcon} />
                                        </div>
                                        <div className="user-name px-2">
                                            <h6 className="m-0 name">{datum?.name}</h6>
                                            <span className="small email">{formatDate2 (new Date(datum?.createdAt))}</span>
                                        </div>
                                    </div>
                                    <div className="justify-content-end py-0 my-0 pt-1 ">
                                        <Badges
                                            type="success"
                                            text="Active"
                                        />
                                        
                                    </div>
                                    
                                </div>
                            </>
                        )
                    })}
                </div>
                
                <div>
                    <Pagination
                        count={dataArr.length?? 0}
                        page={page}
                        rowsPerPage={rowsPerPage}
                        onPageChange={handleChangePage}
                        handleChangeRowsPerPage={handleChangeRowsPerPage}
                    />
                </div>

            </div>
            <div className="col-md-8 pl-0">
                {activeDataObj?._id? (
                    <>
                        <ViewGroup
                            group={activeDataObj}
                        />
                    </>
                ):(
                    <div className="mt-5 mb-3">
                        <MakeSelection />
                    </div>
                )}
                
            </div>
        </div>
        </div>
        
            
        <div>
           
            <CreateGroup
                addAlert={addAlert}
                refresh={addData}
            />
            {activeDataObj?._id && (
                <EditGroup
                    group={activeDataObj}
                    addAlert={addAlert}
                    show={showEditModal}
                    toggleModal={toggleEditModal}
                />
            )}
                
        </div>
           </>
           )}
        </>

    )

};
export default Groups;