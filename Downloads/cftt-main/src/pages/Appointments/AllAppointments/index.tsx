import moment from "moment";
import React, { useReducer, useEffect } from "react";
import ActionButton from "utilComponents/ActionButton";
import Badges from "utilComponents/Badges";
import {
  capiitalizeFirstLetter,
  changeOptionsToBool,
  extractErrorMessage,
  processAlertError,
  processAlertSuccess,
  truncateMultilineText,
} from "utils";
import Filter from "components/Filter";
import Pagination from "utilComponents/TablePagination";
import { DivLoader } from "utilComponents/Loader";
import { useMutation, useQuery } from "@apollo/client";
import { GET_ALL_APPOINTMENTS } from "GraphQl/Queries";
import CreateButton from "utilComponents/CreateButton";
import { DELETE_SERMON, UPDATE_APPOINTMENT } from "GraphQl/Mutations";
import { appointmentOptions } from "constants/index";
import AlertComponent from "components/AlertComponent";
import DeleteModal from "utilComponents/DeleteModal";
import SearchInput from "utilComponents/SearchInput";
import {
  CalendarTime,
  Checks,
  Settings,
  FriendsOff,
  CalendarOff,
} from "tabler-icons-react";
import { connect } from "react-redux";
import AllTimeSlots from "../TimeSlots";
import { mockdata } from "../mockdata";
import { Tooltip } from "@mui/material";

const AllAppointments = (props: any) => {
  const { user } = props;
  const initialState = {
    listView: true,
    pagination: {
      rowsPerPage: 10,
      page: 0,
      totalRecords: 10,
    },
    alertMessage: {},
    dataArr: [],
    activeId: null,
    isLoading: false,
    showAllAppointments: true,
    showCreateTimeSlotModal: false,
    showEditTimeSlotModal: false,
    showAllTimeSlots: false,
    status: "null",
    showDeleteModal: false,
    search: "",
  };
  const [state, setState] = useReducer(
    (state: any, newState: any) => ({ ...state, ...newState }),
    initialState
  );

  const {
    isLoading,
    alertMessage,
    showDeleteModal,
    dataArr,
    activeId,
    showAllAppointments,
    showCreateTimeSlotModal,
    showEditTimeSlotModal,
    showAllTimeSlots,
    status,
    pagination,
    search,
  } = state;
  const { fetchMore } = useQuery(GET_ALL_APPOINTMENTS, {
    variables: {
      adminId: user?.id,
      page: 0,
      limit: 10,
      flag: status,
    },
  });

  const [changeAppointmentStatus] = useMutation(UPDATE_APPOINTMENT);

  const defaultView = (refresh = null) => {
    setState({
      showAllAppointments: true,
      showCreateTimeSlotModal: false,
      showEditTimeSlotModal: false,
      showAllTimeSlots: false,
      activeId: null,
    });
    if (refresh) {
      fetchData();
    }
  };

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent> | null,
    newPage: number
  ): void => {
    const newPagination = {
      ...pagination,
      page: newPage,
    };
    setState({
      page: newPage,
    });
    fetchData(status, newPagination);
  };

  const handleChangeRowsPerPage = (event: any): void => {
    const newPagination = {
      ...pagination,
      rowsPerPage: event?.target?.value,
    };

    setState({
      rowsPerPage: event?.target?.value,
    });
    fetchData(status, newPagination);
  };

  const fetchData = async (flag = status, paginationArgs = pagination) => {
    setState({
      isLoading: true,
    });
    const searchItem = search ?? " ";
    // console.log(flag);
    const apiData: any = await fetchMore({
      variables: {
        adminId: user?.id,
        page: paginationArgs?.page + 1,
        limit: paginationArgs?.rowsPerPage,
        flag: flag, // Use the flag parameter to filter by the selected status option
      },
    });
    console.log(apiData);
    if (apiData.data) {
      setState({
        dataArr: apiData?.data?.getAppointments?.docs,
        flag: apiData?.data?.getAppointments?.docs?.filter(
          (x: any) => flag === x.status
        ),
        pagination: {
          rowsPerPage: apiData?.data?.getAppointments?.limit,
          page: apiData?.data?.getAppointments?.page - 1,
          totalRecords: apiData?.data?.getAppointments?.totalDocs,
        },
        isLoading: false,
      });
    }

    if (!apiData.loading) {
      setState({
        isLoading: false,
      });
    }

    if (apiData.error) {
      setState({
        alertMessage: processAlertError(extractErrorMessage(apiData?.error)),
        isLoading: false,
      });
    }
  };

  const changeStatus = (e: any) => {
    const option = e?.target?.value;
    setState({
      status: option, // Set the selected option state
    });
    fetchData(option, pagination);
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
      alertMessage: {},
    });
  };

  const addAlert = (alert: any) => {
    setState({
      alertMessage: alert,
    });
  };

  const toggleDeleteModal = () => {
    setState({
      showDeleteModal: !showDeleteModal,
    });
  };
  const handleSearchData = (searchVal = "") => {
    setState({
      ...state,
      search: searchVal,
    });
  };
  const acceptAppointment = async (id = null) => {
    if (
      // eslint-disable-next-line no-restricted-globals
      confirm(
        "This action will accept the selected appointment, click ok to continue"
      )
    ) {
      await changeAppointmentStatus({
        variables: { id: id, status: "Accepted" },
      });
      setState({
        alertMessage: processAlertSuccess("Appointment accepted"),
        isLoading: false,
      });
      fetchData();
    }
  };
  const declineAppointment = async (id = null) => {
    if (
      // eslint-disable-next-line no-restricted-globals
      confirm(
        "This action will decline the selected appointment, click ok to continue"
      )
    ) {
      await changeAppointmentStatus({
        variables: { id: id, status: "Not accepted" },
      });
      setState({
        alertMessage: processAlertSuccess("Appointment declined"),
        isLoading: false,
      });
      fetchData();
    }
  };

  const cancelAppointment = async (id = null) => {
    if (
      // eslint-disable-next-line no-restricted-globals
      confirm(
        "This action will cancel the selected appointment, click ok to continue"
      )
    ) {
      await changeAppointmentStatus({
        variables: { id: id, status: "Declined" },
      });
      setState({
        alertMessage: processAlertSuccess("Appointment cancelled"),
        isLoading: false,
      });
      fetchData();
    }
  };
  console.log(appointmentOptions);
  return (
    <>
      {showAllAppointments && (
        <>
          <div className="row  py-3 px-4 justify-content-between">
            <div className="col-md-4 mb-4 mt-3">
              <SearchInput
                handleSearchData={handleSearchData}
                fetchData={fetchData}
              />
            </div>
            <div className="col-md-6 d-flex justify-content-end mt-3 mb-4">
              <Filter
                text="Show"
                selectOptions={appointmentOptions}
                changeEvent={changeStatus}
              />
            </div>
            {isLoading ? (
              <div className="bg-white">
                <DivLoader />
              </div>
            ) : (
              <>
                {alertMessage?.text && (
                  <div className="col-md-12 d-flex justify-content-end my-2">
                    <AlertComponent
                      text={alertMessage.text}
                      type={alertMessage.type}
                      onClose={handleAlertClose}
                    />
                  </div>
                )}
                <div className="col-md-12 px-0 d-flex gap-3 justify-content-end">
                  <span
                    className="pointer text-primary small"
                    onClick={() =>
                      setState({
                        showAllAppointments: false,
                        showAllTimeSlots: true,
                      })
                    }
                  >
                    <CalendarTime strokeWidth={1.2} /> Manage time slots
                  </span>
                </div>
                <table className="table mt-4">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      {/* <th>Message</th> */}
                      <th>Date</th>
                      <th>Time</th>
                      <th>Status</th>
                      <th />
                    </tr>
                  </thead>
                  <tbody>
                    {dataArr.map((datum: any, index: number) => {
                      return (
                        <tr>
                          <td>{capiitalizeFirstLetter(datum?.name)}</td>
                          <td>{datum?.email}</td>
                          {/* <td>{datum?.agendaDescription}</td> */}
                          <td>
                            {moment(datum?.slot?.date).format("DD/MM/YYYY")}
                          </td>
                          <td>
                            {datum?.slot?.startTime} - {datum?.slot?.endTime}
                          </td>
                          <td>
                            {datum?.status === "Accepted" && (
                              <Badges text="Accepted" type="success" />
                            )}
                            {datum?.status === "Declined" && (
                              <Badges text="Cancelled" type="error" />
                            )}
                            {datum?.status === "Not accepted" && (
                              <Badges text="Declined" type="grey" />
                            )}
                            {datum?.status === "Pending" && (
                              <Badges text="Pending" type="pending" />
                            )}
                          </td>
                          <td>
                            <div className="d-flex gap-3">
                              {datum?.status === "Pending" && (
                                <Tooltip
                                  title="Approve appointment"
                                  placement="right-start"
                                  arrow
                                  className="mx-1"
                                >
                                  <span
                                    className="pointer"
                                    onClick={() =>
                                      acceptAppointment(datum?._id)
                                    }
                                  >
                                    <Checks
                                      size={28}
                                      strokeWidth={2}
                                      color={"black"}
                                    />
                                  </span>
                                </Tooltip>
                              )}
                              {datum?.status === "Pending" && (
                                <Tooltip
                                  title="Reject appointment"
                                  placement="right-start"
                                  arrow
                                  className="mx-1"
                                >
                                  <span
                                    className="pointer"
                                    onClick={() =>
                                      declineAppointment(datum?._id)
                                    }
                                  >
                                    <FriendsOff
                                      size={28}
                                      strokeWidth={2}
                                      color={"grey"}
                                    />
                                  </span>
                                </Tooltip>
                              )}
                              {datum?.status === "Accepted" && (
                                <Tooltip
                                  title="Cancel appointment"
                                  placement="right-start"
                                  arrow
                                  className="mx-1"
                                >
                                  <span
                                    className="pointer"
                                    onClick={() =>
                                      cancelAppointment(datum?._id)
                                    }
                                  >
                                    <CalendarOff
                                      size={28}
                                      strokeWidth={2}
                                      color={"red"}
                                    />
                                  </span>
                                </Tooltip>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </>
            )}
          </div>

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
        </>
      )}
      {showAllTimeSlots && <AllTimeSlots close={defaultView} />}

      {showDeleteModal && (
        <DeleteModal
          refresh={fetchData}
          mutation={DELETE_SERMON}
          handleModalToggle={toggleDeleteModal}
          showModal={showDeleteModal}
          parameterKey="sermonId"
          recordId={activeId}
          addAlert={addAlert}
        />
      )}
    </>
  );
};
function mapStateToProps(appState: any) {
  return {
    user: appState?.reducer?.userObject,
  };
}
export default connect(mapStateToProps)(AllAppointments);
