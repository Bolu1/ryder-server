import React, { useEffect, useReducer } from 'react';
import AlertComponent from 'components/AlertComponent';
import PageTitle from 'components/PageTitle';
import CloseButton from 'components/CloseButton';
import { GET_SINGLE_ROLE } from 'GraphQl/Queries';
import { useQuery } from '@apollo/client';
import { capiitalizeFirstLetter, extractErrorMessage,  processAlertError } from 'utils';
import CircularLoader, { DivLoader } from 'utilComponents/Loader';

const ViewRole = (props:any) => {
    const initialState = {
        formData: {
            name: '',
        },
        
        groupedPermissions:[],
        isLoading: true,
        alertMessage:{},
    };
    const [state, setState] = useReducer((state:any, newState: any) => ({ ...state, ...newState }), initialState);
    let {
        formData, 
        isLoading, 
        alertMessage, 
        groupedPermissions,
    } = state;
    const getRole = useQuery(GET_SINGLE_ROLE, {
        variables:{id: props?.roleId}
    }); 

    const fetchData = async() => {
        try {
            const response = await getRole?.fetchMore({variables: {
                    id: props?.roleId,
                }});
            
            const {data, error} = response;
           
            if(data){
                const groupByModule = groupPermissions('moduleName');
                const groupedPermissions = groupByModule(data?.getRole?.permissions);
                setState({
                    groupedPermissions: groupedPermissions,
                    formData: {
                        name: data?.getRole?.name,
                    },
                    isLoading:false,
                });
            };
            if(error){
                setState({
                    alertMessage :processAlertError(extractErrorMessage(error)),
                    isLoading: false,
                })
            }
        } catch (error) {
            const errMsg = extractErrorMessage(error);
            setState({
                alertMessage :processAlertError(extractErrorMessage(errMsg)),
                isLoading: false,
            })
        }
    };

   const groupPermissions = (key: any) => {
        return function group(array: any) {
            return array.reduce((acc: any, obj: any) => {
                const property = obj[key];
                acc[property] = acc[property] || [];
                acc[property].push(obj);
                return acc;
            }, {});
        };
    }
   
    const renderPermissions = () => {
    
        const options = Object.keys(groupedPermissions).map(function(list,key) {
            
            return (
                <div 
                    className={`col-md-12   mx-2  my-2 bg-white py-2 px-1`}
                    key={key}
                >
                    <p className="mb-0  w-100 d-flex justify-content-between ">
                        <label 
                            className='mr-3 font-weight-bold pointer' 
                            htmlFor={`list-${list}`}
                        >{capiitalizeFirstLetter(list)}
                        </label>
                        
                        
                    </p>
                    <div className="row px-3">
                        {groupedPermissions[list].map((item:any, index:any)=>{
                           
                            return(
                                <div 
                                    className="col-md-4 py-2  px-0" 
                                    key={index}
                                >
                                    <span>
                                        {capiitalizeFirstLetter(item.description)}
                                    </span>
                                    
                                </div>
                            );
                        })}
                    </div>
                </div>
            );
        });
        return <>{options}</>;
    }

    useEffect(() => {
        
        fetchData();
    
        return () => {
            setState({
                ...initialState,
            });
        };
    }, []);
   
    return(
        <>
            <div className="row p-4">
                <div className="row justify-content-between align-items-start py-3">
                    <div className="col-md-6">
                        <PageTitle text='View Role' />
                    </div>
                    <div className="col-md-6 d-flex justify-content-end">
                        <CloseButton 
                            close={props.close}
                        />
                    </div>
                 
                </div>
                {isLoading? (
                    <>
                        <CircularLoader />
                    </>
                ):(
                    <>
                        <div className="col-md-7 mb-3">
                            <p className='mb-1 h6 font-weight-bold'>Role name</p>
                            <span className='small'>{capiitalizeFirstLetter(formData?.name)}</span>
                        </div>

                        <div className="row ">
                            <div className='col-md-12 px-0'>
                            {renderPermissions()}
                            </div>
                            
                        </div>

                    </>
                )}

            </div>
        </>
    )
};
export default ViewRole;