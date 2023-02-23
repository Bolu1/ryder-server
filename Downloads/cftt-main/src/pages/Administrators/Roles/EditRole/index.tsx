import React, { useEffect, useReducer } from 'react';
import AlertComponent from 'components/AlertComponent';
import { validateData } from 'helpers';
import CreateButton from 'utilComponents/CreateButton';
import FormGroupInput from 'utilComponents/FormGroupInput';
import PageTitle from 'components/PageTitle';
import CloseButton from 'components/CloseButton';
import { GET_ALL_PERMISSIONS, GET_SINGLE_ROLE } from 'GraphQl/Queries';
import { useMutation, useQuery } from '@apollo/client';
import { capiitalizeFirstLetter, extractErrorMessage, isObjectEmpty, processAlertError, processAlertSuccess } from 'utils';
import { Checkbox, FormControlLabel } from '@mui/material';
import CircularLoader, { DivLoader } from 'utilComponents/Loader';
import { EDIT_ROLE } from 'GraphQl/Mutations';

const EditRole = (props:any) => {
    const initialState = {
        formData: {
            name: '',
        },
        selectedpermissions: [],
        allroleIds:[],
        groupedPermissions:[],
        roleSet:[],
        errors:{},
        isLoading: true,
        alertMessage:{},
        showModal: false,
        checkall: false,

    };
    const [state, setState] = useReducer((state:any, newState: any) => ({ ...state, ...newState }), initialState);
    let {
        formData, 
        isLoading, 
        alertMessage, 
        errors, 
        showModal, 
        roleOptions,
        allroleIds,
        groupedPermissions,
        roleSet,
        selectedpermissions,
        checkall
    } = state;
    const { fetchMore } = useQuery(GET_ALL_PERMISSIONS, {}); 
    const getRole = useQuery(GET_SINGLE_ROLE, {
        variables:{id: props?.roleId}
    }); 
    const [updateRole, loadingParams] = useMutation(EDIT_ROLE); 
    const handleChange = (e: React.ChangeEvent<HTMLInputElement> ) :void  => {
        const {name, value} = e.target;
        setState({
            formData:{
                ...formData,
                [name]: value,
            },
            errors:{
                ...state.errors,
                [name]: '',
            }
        });
    };

    const  handlePreviousRoleData = (roleData:any)=> {
        const {data, error} = roleData;
        if(data){
            const {getRole} = data;
            const permissionIdArray = [];
            for (let index = 0; index < getRole.permissions.length; index++) {
                const element = getRole.permissions[index];
                permissionIdArray.push(element.id);
            };
            setState({
                formData: {
                    name: getRole?.name,
                },
                selectedpermissions: permissionIdArray,
            });
            return permissionIdArray;
        }
        if(error){
            setState({
                alertMessage :processAlertError(extractErrorMessage(error)),
                isLoading: false,
            });
        }
    };
    const markRoleSet = (rolesArr:any, permissions:any) => {
        
        for (let index = 0; index < rolesArr.length; index++) {
            let check = true;
            const element = rolesArr[index];
            for (let j = 0; j < element.ids.length; j++) {
                const el = element.ids[j];
                if(!permissions.includes(el)){
                    check = false;
                }
            };
            element.checked = check;
        }
        return rolesArr;

    }


    const fetchData = async() => {
        try {
            const apiResponse = await Promise.all([
                fetchMore({variables: {}}),
                getRole?.fetchMore({variables: {
                    id: props?.roleId,
                }})
            ])
            const response = apiResponse[0];
            const  getSelectedPermissions = handlePreviousRoleData(apiResponse[1]);
            const {data, error} = response;
            if(data){
                const arr = [];
                for (let index = 0; index < data?.getPermissions.length; index++) {
                    const element = data?.getPermissions[index];
                    // element.module_name = element.module.name;
                    arr.push(element.id);
                }

               const groupByModule = groupPermissions('moduleName');
               const groupedPermissions = groupByModule(data?.getPermissions);
              
               const rolesArr = [];
                const keys = Object.keys(groupedPermissions);
                for (let index = 0; index < keys.length; index++) {
                    const element = keys[index];
                    const permission = groupedPermissions[element];
                    const ids = [];
                    for (let j = 0; j < permission.length; j++) {
                        const el = permission[j];
                        ids.push(el.id);
                    }
                    rolesArr.push({
                        name: element,
                        checked: false,
                        ids: ids,
                    });
                }
                const markedRoleSet =  markRoleSet(rolesArr, getSelectedPermissions);
             
                setState({
                    allroleIds: arr,
                    groupedPermissions: groupedPermissions,
                    roleSet: markedRoleSet,
                    isLoading:false,
                })
               
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
    const handlePermissionSelection = (id:any) => {
        const newArrary = [...selectedpermissions];
        if(newArrary.includes(id)){
            const index = newArrary.indexOf(id);
            newArrary.splice(index,1);
        }else{
            newArrary.push(id);
        }
        setState({
            selectedpermissions: newArrary,
        });

    }

    const handleRoleSetSelection = (key:any) => {
        
        selectedpermissions = [...selectedpermissions];
        const roleGroup = roleSet[key];
        if(roleGroup.checked){
            for (let index = 0; index < roleGroup.ids.length; index++) {
                const element = roleGroup.ids[index];
                if(selectedpermissions.includes(element)){
                    const indexOfElement = selectedpermissions.indexOf(element);
                    selectedpermissions.splice(indexOfElement, 1);
                }
                checkall = false;   
            }
        }else{
            for (let index = 0; index < selectedpermissions.length; index++) {
                const element = selectedpermissions[index];
                if(roleGroup.ids.includes(element)){
                    selectedpermissions.splice(index,1);
                }
            }
            selectedpermissions = [...selectedpermissions, ...roleGroup.ids];
        }
        roleGroup.checked = !roleGroup.checked;
        let allChecked = true;
        for (let index = 0; index < roleSet.length; index++) {
            const element = roleSet[index];
            if(!element.checked){
                allChecked = false;  
            }
            
        }

        if(allChecked){
            checkall = true;
        }

        setState({
            selectedpermissions: selectedpermissions,
            roleSet: roleSet,
            checkall: checkall,
        });
    }


    /**
    * React checkIsInArray method
    * @returns {string} check or '' is returned
    * @param {string} id - id of the permission.
    */
    const checkIsInArray = (id:number) => {
        const check = selectedpermissions.includes(id) ? 'checked' : '';
        return check;
    }

    const checkRoleset = (key:any) => {
     
        const check = roleSet[key].checked ? 'checked' : '';
        return check;
    }


    const renderPermissions = () => {
    
        const options = Object.keys(groupedPermissions).map(function(list,key) {
            
            return (
                <div 
                    className={`col-md-12   mx-2  my-2 bg-white py-2 px-4`}
                    key={key}
                >
                    <p className="mb-0  w-100 d-flex justify-content-between ">
                        <label 
                            className='mr-3 font-weight-bold pointer' 
                            htmlFor={`list-${list}`}
                        >{capiitalizeFirstLetter(list)}
                        </label>
                        <Checkbox  
                            // @ts-ignore
                            checked={checkRoleset(key)}
                            className="pointer"
                            id={`list-${list}`}
                            onChange={() => handleRoleSetSelection(key)} 
                           
                        />
                        
                    </p>
                    <div className="row ">
                        {groupedPermissions[list].map((item:any, index:any)=>{
                           
                            return(
                                <div 
                                    className="col-md-4 py-2  px-0" 
                                    key={index}
                                >
                                    <FormControlLabel
                                        control={
                                        <Checkbox  
                                            // @ts-ignore
                                            checked={checkIsInArray(item.id)}
                                            onChange={() => handlePermissionSelection(item.id)} 
                                            name={item.id} 
                                        />
                                        }
                                        label={capiitalizeFirstLetter(item.description)}

                                    />
                                    
                                </div>
                            );
                        })}
                    </div>
                </div>
            );
        });
        return <>{options}</>;
    }

    // Submission /validation

    const validateFormData = async () => {
       
    
        const rules = {
            name: 'required|string',
        };
        const messages = {
            'name.required': 'Enter Role Name',
        };
        const validate = await validateData(formData, rules, messages);
        if(isObjectEmpty(validate)) {
            return true;
        } else {
            setState({
                errors: validate
            });
            return false;
        }
    }

    const submit = async (e : React.SyntheticEvent<Element, Event>) => {
        e.preventDefault();
        setState({
            isLoading: true,
        })
        try {
            const validate = await validateFormData();
            if(validate){
                const payload = {
                    ...formData,
                    permissions:  selectedpermissions,
                    id: props?.roleId,
                };
                await updateRole({variables: payload})
               
               // refreshForm();
                props.addAlert(processAlertSuccess('Role updated successfully'));
                props.close(true);
             
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
                        <PageTitle text='Edit Role' />
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
                            <FormGroupInput
                                placeholder="Role name"
                                value={formData?.name}
                                onChange={handleChange}
                                name="name"
                                showError={errors.name}
                                errorMessage={errors.name}
                            />
                        </div>

                        <div className="row ">
                            <div className='col-md-12 px-0'>
                            {renderPermissions()}
                            </div>
                            <div className="col-md-12 mt-3 mb-3 d-flex justify-content-end">
                                <CreateButton
                                    text={'Edit role'}
                                    actionEvent={(e)=>{submit(e)}}
                                    disabled={isLoading}
                                    loading={isLoading}
                                    float
                                />
                            </div>
                        </div>

                    </>
                )}

            </div>
        </>
    )
};
export default EditRole;