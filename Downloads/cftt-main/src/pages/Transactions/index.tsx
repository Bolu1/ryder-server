import PageTitle from 'components/PageTitle';
import React, {useReducer, useEffect} from 'react';
import { Link } from 'react-router-dom';
import Pagination from 'utilComponents/TablePagination';
// Old MUI
import DateFnsUtils from '@date-io/date-fns';
import { DatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
// Old MUI //
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import arrowLeftIcon from 'assets/images/arrow-left.png';
import arrowRightIcon from 'assets/images/arrow-right.png';
import donationsIcon from 'assets/images/donations.png';
import titheIcon from 'assets/images/people.png';
import salesIcon from 'assets/images/shopping-bag.png';
import Badges from 'utilComponents/Badges';
import { useQuery } from '@apollo/client';
import AlertComponent from 'components/AlertComponent';
import { GET_ALL_TRANSACTIONS } from 'GraphQl/Queries';
import { capiitalizeFirstLetter, changeOptionsToBool, extractErrorMessage, processAlertError } from 'utils';
import TotalRevenue from 'pages/Home/Charts/TotalRevenue';
import { Button, createTheme } from '@mui/material';
import { purple } from '@mui/material/colors';
import { Filter } from 'tabler-icons-react';
import moment from 'moment';

const selectOptions = {
    paymentType: ['tithe', 'offering', 'donation', 'welfare' ],
    paymentMethod: ['truelayer', 'paystack', 'stripe', 'applePay'],
    status: ['failed', 'successful'],
};
const theme = createTheme({
    palette: {
      primary: purple,
    },
});
let now = new Date();
now.setDate(now.getDate() - 7);
const Transactions = ():JSX.Element => {
    const initialState = {
        listView: true,
        pagination:{
            rowsPerPage: 100,
            page:0,
            totalRecords: 10,
        },
        alertMessage:{},
        dataArr:[],
        activeReportComponent: 0,
        openChart: false,
        searchData:{
            startDdate: now,
            endDate: new Date(),
            status: '',
            paymentMethod: '',
            paymentType: '',
        },
        isLoading: true,
        
    };
   

    const [state, setState] = useReducer((state:any, newState: any) => ({ ...state, ...newState }), initialState);
    const {listView, page, rowsPerPage, activeReportComponent, pagination, openChart, alertMessage, dataArr, searchData, isLoading} = state;

    const { fetchMore } = useQuery(GET_ALL_TRANSACTIONS, {
        variables: {
          page: 1,
          limit: 100,
          status:  searchData?.status,
          paymentMethod: searchData?.paymentMethod,
          paymentType: searchData?.paymentType,
          startDdate: searchData?.startDdate,
          endDate: searchData?.endDate
        },
    });
    const openCharts = () => {
        setState({
                ...state,
              openChart: !openChart,
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

    const handleChangePage = (event: React.MouseEvent<HTMLButtonElement, MouseEvent> | null, newPage: number): void => {
        const newPagination = {
            ...pagination,
            page: newPage,
        };
        setState({
            page: newPage,
        });
        fetchData(newPagination);
        
    };
  
    const handleChangeRowsPerPage = (event: any): void => {
        const newPagination = {
            ...pagination,
            rowsPerPage: event?.target?.value,
        };
        
        setState({
            rowsPerPage: event?.target?.value,
        });
        fetchData(newPagination);
        
    };

    const fetchData =  async (paginationArgs = pagination) => {
        setState({
            isLoading:true,
        });
        const apiData : any = 
        await fetchMore({
                    variables:{
                        page: paginationArgs?.page + 1,
                        limit: paginationArgs?.rowsPerPage,
                        status:  searchData?.status,
                        paymentMethod: searchData?.paymentMethod,
                        paymentType: searchData?.paymentType,
                        startDdate: searchData?.startDdate,
                        endDate: searchData?.endDate
                    }
                });
         if(apiData.data){
            console.log(apiData.data.getAllTransactions.docs);
            setState({
                dataArr: apiData?.data?.getAllTransactions?.docs,
                isLoading: false,
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

    const handleDateChange = (e:Date) => {
        setState({
            searchData: {
                ...searchData,
                startDdate: e
            },
        });
    };
    const handleEndDateChange = (e:Date) => {
        setState({
            searchData: {
                ...searchData,
                endDate: e
            },
        });
    };
    const handleFilterChange = (e:any) => {
        const {name, value} = e.target;
        setState({
            searchData: {
                ...searchData,
                [name]: value
            },
        });
    };

    const changeStatus = (e:any) => {
        const option = changeOptionsToBool(e?.target?.value);
        setState({
            status: option,
        });
        fetchData();
    };

    useEffect(() => {
        fetchData();
        
        // Cleanup method
        return () => {
            setState({
                ...initialState,
            });
        };
    }, [page, rowsPerPage]);


    const reportCardsAndComponents = () => {
        return [
            {
                name: 'Donations',
                amount: '£1585.00',
                icon: donationsIcon,
            },
            {
                name: 'Tithe',
                amount: '£1585.00',
                icon: titheIcon,
            },
            {
                name: 'Sales',
                amount: '£1585.00',
                icon: salesIcon,
            },
        ]
    };

    const transactionTable = ():JSX.Element => {
        return (
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell className="table-th">Transaction ID</TableCell>
                  <TableCell align="left" className="table-th">Type</TableCell>
                  <TableCell align="left" className="table-th">Method</TableCell>
                  <TableCell align="left" className="table-th">Date</TableCell>
                  <TableCell align="left" className="table-th">Status</TableCell>
                  <TableCell align="left" className="table-th">Amount</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
      
                {dataArr.map((row:any) => (
                  <TableRow
                  //   key={row.name}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {row.transactionId}
                    </TableCell>
                    <TableCell align="left">{capiitalizeFirstLetter(row.paymentType)}</TableCell>
                    <TableCell align="left">{capiitalizeFirstLetter(row.paymentPlatform)}</TableCell>
                    <TableCell align="left">{moment(row.transactionDate).format('MMMM Do YYYY, h:mm:ss a')}</TableCell>
                    <TableCell align="left">
                        {row.status === "Successful"? (
                            <Badges
                                text="Successful"
                                type="success"
                            />
                        ):(
                            <Badges
                              text="Failed"
                              type="error"
                          />
                        )}
                          
                      </TableCell>
                    <TableCell align="left">{row.currency} {row.amount}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        );
      }

    const dashBoardCards = reportCardsAndComponents();
   
    return(
        <>
        <div className="row justify-content-between align-items-end">
        <div className="col-md-6">
            <PageTitle text='Latest Transactions' />
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
        <div className="">
            <div className='row justify-content-between align-items-center'>
                <div className='col-md-2'>
                    <div className='label-container my-2'>
                        <label>Payment type </label>
                    </div>
                    <div className=''>
                        <TextField
                            id="standard-select-currency"
                            select
                            variant='outlined'
                            size='small'
                            className='w-100'
                            name="paymentType"
                            onChange={handleFilterChange}
                        >
                            <MenuItem key="type" value=''>--Select--</MenuItem>
                            {selectOptions?.paymentType.map((option) => (
                                <MenuItem key={option} value={option}>
                                {capiitalizeFirstLetter(option)}
                                </MenuItem>
                            ))}
                        </TextField>
                    </div>
                </div>
                <div className='col-md-2'>
                <div className='label-container my-2'>
                        <label>Payment method </label>
                    </div>
                    <div className=''>
                        <TextField
                            id="standard-select-currency"
                            select
                            variant='outlined'
                            size='small'
                            className='w-100'
                            name="paymentMethod"
                            onChange={handleFilterChange}
                        >
                            <MenuItem key="method" value=''>--Select--</MenuItem>
                            {selectOptions?.paymentMethod.map((option) => (
                                <MenuItem key={option} value={option}>
                                {capiitalizeFirstLetter(option)}
                                </MenuItem>
                            ))}
                        </TextField>
                    </div>
                </div>
                <div className='col-md-2'>
                    <div className='label-container my-2'>
                        <label>Status </label>
                    </div>
                    <div className=''>
                        <TextField
                        id="standard-select-currency"
                        select
                        variant='outlined'
                        size='small'
                        className='w-100'
                        name="status"
                        onChange={handleFilterChange}
                        >
                        <MenuItem key="stat" value=''>--Select--</MenuItem>
                        {selectOptions?.status.map((option) => (
                            <MenuItem key={option} value={option}>
                            {capiitalizeFirstLetter(option)}
                            </MenuItem>
                        ))}
                        </TextField>
                    </div>
                </div>
                
                <div className='col-md-2'>
                    <div className='label-container my-2'>
                        <label>Start Date </label>
                    </div>
                    <div className=''>
                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <DatePicker
                            variant="inline"
                            inputVariant="outlined"
                            value={searchData?.startDdate}
                            // @ts-ignore
                            onChange={handleDateChange}
                            size='small'
                            format="MM/dd/yyyy"
                            autoOk
                        />
                        </MuiPickersUtilsProvider>
                    </div>
                </div>
                <div className='col-md-2'>
                    <div className='label-container my-2'>
                        <label>End Date </label>
                    </div>
                    <div className=''>
                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <DatePicker
                            variant="inline"
                            inputVariant="outlined"
                            value={searchData?.endDate}
                            // @ts-ignore
                            onChange={handleEndDateChange}
                            size='small'
                            format="MM/dd/yyyy"
                            autoOk
                        />
                        </MuiPickersUtilsProvider>
                    </div>
                </div>
                <div className='col-md-2'>
                    <br />
                    <button className='mt-2 p-2 px-3 filter-btn' onClick={()=> fetchData()}>
                        {!isLoading? (
                            <>
                                <Filter size={15} strokeWidth={2} color={'white'} />  Filter
                            </>
                        ):(
                            <>...Loading</>
                        )}
                        
                    </button>
                </div>
            </div>
            <div className="d-flex justify-content-between py-3 ">
                <div className={`${openChart? 'col-md-7': 'col-md-11'} openchart bg-white d-flex justify-content-between px-0 `}>
                    <div className="py-3 px-2 w-96">
                        {transactionTable()}
                        {dataArr.length !== 0 && (
                            <>
                                <div>
                                    <Pagination
                                        count={pagination?.totalRecords}
                                        page={pagination?.page}
                                        rowsPerPage={pagination?.rowsPerPage}
                                        onPageChange={handleChangePage}
                                        handleChangeRowsPerPage={handleChangeRowsPerPage}
                                    />
                                </div>
                            </>
                        )}
                    </div>
                    <div className=" table-toggle  px-2 d-flex align-items-center pointer w-4" onClick={()=> openCharts()}>
                        <img src={`${openChart? arrowRightIcon : arrowLeftIcon}`} className={`flip`}/>
                    </div>

                </div>
                
            </div>
        </div>
        
        </>
    )

};
export default Transactions;