import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import { CreateShootout } from "../../components/app/createShootout";
import { MatchDetails } from "../../components/app/matchDetails";
import { PlayerSummary } from "../../components/app/playerSummary";
import { ScheduleModal } from "../../components/app/scheduleModal";
import { TeamDetails } from "../../components/app/teamDetails";
import { UpdateScore } from "../../components/app/updateScore";
import {
  EditIcon,
  DeleteIcon,
  ViewIcon,
  UpdateScoreIcon,
  PlayerSummaryIcon,
  PlayersListsIcon,
  MoreIcon,
} from "../../shared/icons";
import http from "../../services/http.services";

import * as bootstrap from "bootstrap";
import { UpdateScheduleModal } from "../../components/app/updateSchedule";
import { Loading } from "../../components/app/loadingComponent";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { FilterMatchMode } from "primereact/api";
import { InputText } from "primereact/inputtext";

export function CL_Schedules() {
  const [groupLists, setGroupLists] = useState([]);
  const [scheduleList, setScheduleList] = useState([]);
  const [shootoutLists, setShootoutLists] = useState([]);
  const [scheduleDetails, setScheduleDetails]: any = useState({});
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedGroup, setSelectedGroup] = useState(0);
  const [selectedSchedule, setSelectedSchedule] = useState(0);
  const [showShootOut, setShowShootOut] = useState(false);
  const [isPlayerSummary, setIsPlayerSummary] = useState(false);
  const [isUpdateScore, setIsUpdateScore] = useState(false);
  const [isMatchDetails, setIsMatchDetails] = useState(false);
  const [isPlayerLists, setIsPlayerLists] = useState(false);
  const [isShootOut, setIsShootOut] = useState(false);
  const [isUpdateSchedule, setIsUpdateSchedule] = useState(false);
  const [playerSummary, setPlayerSummary] = useState({
    accept: 0,
    reject: 0,
    cancelled: 0,
    notRespond: 0,
    total: 0,
  });
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [expandedRows, setExpandedRows] :any = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [expandedData, setExpandedData] : any = useState({});

  const userGroupsByUserId = () => {
    http
      .post("/api_select_user_groups.php", {})
      .then((response: any) => {
        const res_: any =
          response !== undefined
            ? Object.keys(response.data).map((key: any) => response.data[key])
            : [];
        setGroupLists(res_);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };
  const playerSummaryData = (args: any) => {
    setIsPlayerSummary(true);

    http
      .post("/api_player_summary.php", {
        schedule_id: selectedSchedule,
        shoot_out_id: args,
      })
      .then((response: any) => {
        setPlayerSummary(response.data);
        const playerModal = new bootstrap.Modal(
          document.getElementById("playerSummaryModal") as HTMLElement
        );
        playerModal.show();
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const getSchedule = (args: any) => {
    http
      .post("/api_get_schedule.php", {
        schedule_id: args,
      })
      .then((response: any) => {
        console.log(response);
        setScheduleDetails(response.data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };
  const update_schedule = (args: any) => {
    setIsUpdateSchedule(true);
    location.state = { schedule_id: args };
  };

  const updateStatus = (args: any) => {
    http
      .post("/api_update_status.php", {
        schedule_id: args.id,
        accept_status: args.status,
        play_status: 0,
      })
      .then((response: any) => {
        if (response.data.status !== "ERROR") {
          Swal.fire({
            title: "Success",
            text: "User status updated " + response.data.description,
            icon: "success",
          });
        } else {
          Swal.fire({
            title: "Error",
            text: response.data.description,
            icon: "error",
          });
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const changeGroup = (e: any) => {
    setSelectedGroup(Number(e.target.value));
    location.state = { group_id: e.target.value };
  };
  const getScheduleList = () => {
    setIsLoading(true);
    http
      .post("/api_show_schedule_details.php", {
        group_id:
          location.state !== null ? location.state.group_id : selectedGroup,
      })
      .then((response: any) => {
        const res_: any =
          response !== undefined
            ? Object.keys(response.data).map((key: any) => response.data[key])
            : [];
        setScheduleList(response.data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error:", error);
        setIsLoading(false);
      });
  };

  const getScheduleByGroup = (scheduleId: any) => {
    setIsLoading(true);
    http
      .post("/api_show_schedule_details.php", {
        group_id: scheduleId,
      })
      .then((response) => {
        console.log(response.data);
        setScheduleList(response.data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setIsLoading(false);
      });
  };

  const showUpdateScore = (args: any) => {
    setIsUpdateScore(true);
    location.state = {
      shoot_out_id: args !== undefined ? args : null,
      schedule_id: selectedSchedule,
    };
    // const updateScoreModal = new bootstrap.Modal(document.getElementById('updateScoreModal') as HTMLElement);
    // updateScoreModal.show();
  };

  const showMatchDetails = (args: any) => {
    setIsMatchDetails(true);
    location.state = { schedule_id: selectedSchedule, shoot_out_id: args };
    // const matchDetailsModal = new bootstrap.Modal(document.getElementById('matchDetailsModal') as HTMLElement);
    // matchDetailsModal.show();
  };

  const showPlayerLists = (args: any) => {
    setIsPlayerLists(true);
    location.state = {
      schedule_id: args !== undefined ? args : selectedSchedule,
    };
    // const teamDetailsModal = new bootstrap.Modal(document.getElementById('teamDetailsModal') as HTMLElement);
    // teamDetailsModal.show();
  };
  const filterSchedules = (e: any) => {
    console.log(e.target[e.target.selectedIndex].getAttribute("data-item"));
    if (e.target.value === "0") {
      getScheduleList();
    } else {
      //  getScheduleList();
      setScheduleList(
        scheduleList.filter(
          (item: any) =>
            item.schedule_group_name ===
            e.target[e.target.selectedIndex].getAttribute("data-item")
        )
      );
    }
  };

  const showCreateShootout = (args : any) => {
    setIsShootOut(true);
    setSelectedSchedule(args)
  };
  const getShootOutDetails = (args: any) => {
    setIsLoading(true);
    setSelectedSchedule(args);
    location.state = { schedule_id: args };

    http
      .post("/api_get_shoot_outs.php", {
        schedule_id: args,
      })
      .then((response: any) => {
        setShootoutLists(response.data);
        //setShowShootOut(true);
        setExpandedData((prevState:any)=>({
          ...prevState,
          [args]: response.data
        }))
        setTimeout(() => {
          setIsLoading(false);
        }, 1000);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const updateShootoutStatus = (shootout_id: any, status: any) => {
    if (status >= 0) {
      Swal.fire({
        text:
          status === 1
            ? "Are you sure you want to accept this shootout?"
            : "Are you sure you want to cancel this shootout?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#2d6004",
        cancelButtonColor: "#d33",
        confirmButtonText: status === 1 ? "Yes, accept it!" : "Yes, cancel it!",
      }).then((result) => {
        if (result.isConfirmed) {
          http
            .post("/api_update_shootout_status.php", {
              schedule_id: selectedSchedule,
              shoot_out_id: shootout_id,
              accept_status: status,
            })
            .then((response) => {
              console.log(response);
              if (response.data.status === "STATUS OK") {
                Swal.fire({
                  title: "Success",
                  text: "Status updated",
                  icon: "success",
                }).then((result) => {
                  if (result.isConfirmed) {
                    //window.location.reload();
                    getShootOutDetails(selectedSchedule);
                  }
                });
              } else {
                Swal.fire({
                  title: "Error",
                  text: "Error " + response.data,
                  icon: "error",
                });
              }
            })
            .catch((error) => {
              console.log(error);
            });
        }
      });
    }
  };

  useEffect(() => {
    setSelectedGroup(location.state !== null ? location.state.group_id : 0);
    userGroupsByUserId();
  }, []);

  useEffect(() => {
    const modalElement = document.getElementById(
      "updateScoreModal"
    ) as HTMLElement;

    const modalElement_playerLists = document.getElementById(
      "teamDetailsModal"
    ) as HTMLElement;

    const modalElement_playerListsV2 = document.getElementById(
      "teamDetailsModalV2"
    ) as HTMLElement;

    const modalElement_playerSummary = document.getElementById(
      "playerSummaryModal"
    ) as HTMLElement;

    const modalElement_matchDetails = document.getElementById(
      "matchDetailsModal"
    ) as HTMLElement;
    const modalElement_createShootout = document.getElementById(
      "createShootoutModal"
    ) as HTMLElement;
    if (modalElement) {
      const myModalEl = new bootstrap.Modal(modalElement);

      modalElement.addEventListener("hidden.bs.modal", (event) => {
        // Your logic goes here...
        if (isUpdateScore) {
          setIsUpdateScore(false);
        }
      });
    } else if (modalElement_playerLists) {
      const myModalEl = new bootstrap.Modal(modalElement_playerLists);

      modalElement_playerLists.addEventListener("hidden.bs.modal", (event) => {
        // Your logic goes here...
        if (isPlayerLists) {
          setIsPlayerLists(false);
        }
      });
    } else if (modalElement_playerListsV2) {
      const myModalEl = new bootstrap.Modal(modalElement_playerListsV2);

      modalElement_playerListsV2.addEventListener(
        "hidden.bs.modal",
        (event) => {
          // Your logic goes here...
          if (isPlayerLists) {
            setIsPlayerLists(false);
          }
        }
      );
    } else if (modalElement_playerSummary) {
      const myModalEl = new bootstrap.Modal(modalElement_playerSummary);

      modalElement_playerSummary.addEventListener(
        "hidden.bs.modal",
        (event) => {
          // Your logic goes here...
          if (isPlayerSummary) {
            setIsPlayerSummary(false);
          }
        }
      );
    } else if (modalElement_matchDetails) {
      const myModalEl = new bootstrap.Modal(modalElement_matchDetails);

      modalElement_matchDetails.addEventListener("hidden.bs.modal", (event) => {
        // Your logic goes here...
        if (isMatchDetails) {
          setIsMatchDetails(false);
        }
      });
    } else if (modalElement_createShootout) {
      const myModalEl = new bootstrap.Modal(modalElement_createShootout);

      modalElement_createShootout.addEventListener(
        "hidden.bs.modal",
        (event) => {
          // Your logic goes here...
          if (isShootOut) {
            setIsShootOut(false);
          }
        }
      );
    }

    if (isUpdateScore) {
      const updateScoreModal = new bootstrap.Modal(
        document.getElementById("updateScoreModal") as HTMLElement
      );
      updateScoreModal.show();
    }
    if (isUpdateSchedule) {
      const updateScheduleModal = new bootstrap.Modal(
        document.getElementById("updateScheduleModal") as HTMLElement
      );
      updateScheduleModal.show();
    }
    if (isMatchDetails) {
      const matchDetailsModal = new bootstrap.Modal(
        document.getElementById("matchDetailsModal") as HTMLElement
      );
      matchDetailsModal.show();
    }

    if (isPlayerLists) {
      const playerListsModal = new bootstrap.Modal(
        document.getElementById("teamDetailsModal") as HTMLElement
      );
      playerListsModal.show();
    }
    if (isShootOut) {
      // const shootoutModal = new bootstrap.Modal(
      //   document.getElementById("createShootoutModal") as HTMLElement
      // );
      // shootoutModal.show();
    }
  }, [
    isUpdateScore,
    isMatchDetails,
    isPlayerLists,
    isShootOut,
    isUpdateSchedule,
  ]);
  const onGlobalFilterChange = (e:any) => {
    const value = e.target.value;
    const _filters = { ...filters };

    _filters["global"].value = value;

    setFilters(_filters);
    setGlobalFilterValue(value);
  };
  const renderHeader = () => {
    return (
      <div className="flex justify-content-end">
        <InputText
          value={globalFilterValue}
          onChange={onGlobalFilterChange}
          placeholder="Keyword Search"
        />
      </div>
    );
  };

  const statusTemplate = (data:any) => {
    return(
      <>
      {
        Number(data.user_status) === 0 ? 
        <button 
          className="btn btn-success"  
          onClick={() =>
            updateShootoutStatus(data.shoot_out_id, 1)
          }
        >Accept</button> : 
        <button 
          className="btn btn-danger"
          onClick={() =>
            updateShootoutStatus(data.shoot_out_id, 0)
          }  
        >Cancel</button>
      }
      </>
    )
  }

  const rowExpansionTemplate = (data:any) => {
    const shootoutData = expandedData[data.schedule_id] || [];
    return (
      <div className="p-2 bg-light secondary-table">
        <div className="d-flex justify-content-between p-2">
          <h5 className="mb-0">Shootout for <span className="badge bg-dark">{data.schedule_name}</span></h5>
          <button className="btn btn-sm btn-success" onClick={(e) => showCreateShootout(data.schedule_id)}>Create Shootout</button>
        </div>
        
        <DataTable value={shootoutData} tableClassName="table table-bordered" emptyMessage="No shootout found.">
          {/* <Column field="id" header="Id"></Column> */}
          <Column field="start_time" header="Start time"></Column>
          <Column field="end_time" header="End time"></Column>
          <Column field="user_status" header="Status" body={statusTemplate}></Column>
          <Column field="action" header="Action" body={shootoutActionTemplate}></Column>
        </DataTable>
      </div>
    );
  };

  const rowExpansionTemplateV2 = (data:any) => {
    const shootoutData = expandedData[data.schedule_id] || [];
    return (
      <div className="p-3 bg-light">        
        <div className="container-fluid">
          <div className="row">
              {
                shootoutData.map((item: any, index: number) => 
                  (
                    <div className="col-md-3">
                      <div className="card border-0 shadow-sm">
                        <div className="card-header border-0 bg-white d-flex justify-content-end">                          
                          <div className="dropdown">
                            <button className="btn text-muted p-0" type="button" id="orederStatistics" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                              <MoreIcon/>
                            </button>                       
                            <ul className="dropdown-menu dropdown-menu-end shadow-lg border-0" aria-labelledby="orederStatistics">
                              <li>
                                <button className="dropdown-item" type="button">
                                  <ViewIcon />
                                  View
                                </button>
                              </li>
                              <li>
                                <button className="dropdown-item" type="button">
                                  <EditIcon />
                                  Edit
                                </button>
                              </li>
                              <li>
                                <button
                                  className="dropdown-item"
                                  type="button"
                                  onClick={(e) =>
                                    showUpdateScore(data.shoot_out_id)
                                  }
                                >
                                  <UpdateScoreIcon />
                                  Update Score
                                </button>
                              </li>
                              <li>
                                <button
                                  className="dropdown-item"
                                  type="button"
                                  onClick={(e) =>
                                    playerSummaryData(data.shoot_out_id)
                                  }
                                >
                                  <PlayerSummaryIcon />
                                  Player Summary
                                </button>
                              </li>
                              <li>
                                <button
                                  className="dropdown-item"
                                  type="button"
                                  onClick={(e) =>
                                    showPlayerLists(data.schedule_id)
                                  }
                                >
                                  <PlayersListsIcon />
                                  Player Lists
                                </button>
                              </li>
                              <li>
                                <hr className="dropdown-divider" />
                              </li>
                              <li>
                                <button
                                  className="dropdown-item text-danger"
                                  type="button"
                                >
                                  <DeleteIcon />
                                  Delete
                                </button>
                              </li>
                            </ul>
                          </div>
                        </div>
                        <div className="card-body">
                          <p className="card-text">Start Time : {item.start_time}</p>
                          <p className="card-text">End Time : {item.end_time}</p>
                          {
                            Number(item.user_status) === 0 ? 
                            <button 
                              className="btn btn-success"  
                              onClick={() =>
                                updateShootoutStatus(item.shoot_out_id, 1)
                              }
                            >Accept</button> : 
                            <button 
                              className="btn btn-danger"
                              onClick={() =>
                                updateShootoutStatus(item.shoot_out_id, 0)
                              }  
                            >Cancel</button>
                          }
                          
                        </div>
                      </div>
                    </div>
                  )
                )
              }
          </div>
        </div>
      </div>
    );
  }

  const shootoutActionTemplate = (data:any) => {
    return(
      <div className="dropdown">
      <button className="btn text-muted p-0" type="button" id="orederStatistics" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
        <MoreIcon/>
      </button>                       
      <ul className="dropdown-menu dropdown-menu-end shadow-lg border-0" aria-labelledby="orederStatistics">
        <li>
          <button className="dropdown-item" type="button">
            <ViewIcon />
            View
          </button>
        </li>
        <li>
          <button className="dropdown-item" type="button">
            <EditIcon />
            Edit
          </button>
        </li>
        <li>
          <button
            className="dropdown-item"
            type="button"
            onClick={(e:any) =>
              showUpdateScore(data.shoot_out_id)
            }
          >
            <UpdateScoreIcon />
            Update Score
          </button>
        </li>
        <li>
          <button
            className="dropdown-item"
            type="button"
            onClick={(e:any) =>
              playerSummaryData(data.shoot_out_id)
            }
          >
            <PlayerSummaryIcon />
            Player Summary
          </button>
        </li>
        <li>
          <button
            className="dropdown-item"
            type="button"
            onClick={(e:any) =>
              showPlayerLists(data.schedule_id)
            }
          >
            <PlayersListsIcon />
            Player Lists
          </button>
        </li>
        <li>
          <hr className="dropdown-divider" />
        </li>
        <li>
          <button
            className="dropdown-item text-danger"
            type="button"
          >
            <DeleteIcon />
            Delete
          </button>
        </li>
      </ul>
    </div>
    )
  }
  const actionTemplate = (data:any) => {
    return (
      <div className="dropdown text-center">
      <button
        className="btn text-muted"
        type="button"
        data-bs-toggle="dropdown"
        aria-expanded="false"
      >
        <MoreIcon/>
      </button>
      <ul className="dropdown-menu dropdown-menu-end border-0 shadow-lg">
        <li>
          <button
            className="dropdown-item"
            data-bs-toggle="modal"
            data-bs-target="#viewScheduleModal"
            onClick={(e) => getSchedule(data.schedule_id)}
          >
            <ViewIcon />
            View
          </button>
        </li>
        <li>
          <button
            className="dropdown-item"
            type="button"
            onClick={(e) =>
              update_schedule(data.schedule_id)
            }
          >
            <EditIcon />
            Edit
          </button>
        </li>
        <li>
          <hr className="dropdown-divider" />
        </li>
        <li>
          <button
            className="dropdown-item text-danger"
            type="button"
          >
            <DeleteIcon />
            Delete
          </button>
        </li>
      </ul>
    </div>
    )
  }

  const onRowExpand = (event:any) => {
    console.log("Row Expanded", event.data);
    getShootOutDetails(event.data.schedule_id);
  };
  const onRowCollapse = (event:any) => {
    console.log("Row Collapsed", event.data);
  };
  const header = renderHeader();
  useEffect(() => {
    document.title = "Schedules | ACE PICKL";
    getScheduleList();
  }, []);
  return (
    <>
      <div className="container-fluid">
        <div className="row">
          <div className={showShootOut ? "col-6" : "col-12"}>
            <div className="d-flex justify-content-between py-3">
              <h4 className="text-start">Schedule</h4>
              <div
                className="d-flex align-content-center"
                style={{ whiteSpace: "nowrap" }}
              >
                <select
                  className="form-select me-2"
                  value={selectedGroup}
                  onChange={(e) => {
                    changeGroup(e);
                    getScheduleByGroup(e.target.value);
                  }}
                >
                  <option value={0} data-item="0">
                    --Select Group--
                  </option>
                  {groupLists.map((item: any, index: number) => {
                    return (
                      <option
                        key={index}
                        value={item.group_id}
                        data-item={item.group_name}
                      >
                        {item.group_name}
                      </option>
                    );
                  })}
                </select>
                <button
                  className={`btn btn-success ${
                    selectedGroup === 0 ? "disabled" : ""
                  }`}
                  data-bs-toggle="modal"
                  data-bs-target="#scheduleModal"
                >
                  Create Schedule
                </button>
              </div>
            </div>

            <div className="table-responsive">
              <DataTable
                value={scheduleList}
                tableClassName="table table-bordered"
                paginator
                rows={10}
                rowsPerPageOptions={[5, 10, 25, 50]}
                filters={filters}
                globalFilterFields={[
                  "schedule_name",
                  "schedule_group_name",
                  "court_name",
                ]}
                emptyMessage="No schedule found."
                header={header}
                expandedRows={expandedRows}
                onRowToggle={(e) => setExpandedRows(e.data)}
                onRowExpand={onRowExpand}
                onRowCollapse={onRowCollapse}
                rowExpansionTemplate={rowExpansionTemplate}
                dataKey="schedule_id"
                scrollable
                scrollHeight="calc(100vh - 300px)"
                
              >
                <Column expander={true} style={{ width: "5rem" }} />
                <Column field="schedule_name" header="Schedule Name" />
                <Column field="schedule_group_name" header="Group Name" />
                <Column field="court_name" header="Court Name" />
                <Column field="schedule_date" header="Scheduled Date" />
                <Column field="schedule_starttime" header="Start Date Time" />
                <Column field="schedule_endtime" header="End Date Time" />
                <Column field="action" header="Action" body={actionTemplate}/>
              </DataTable>
            </div>

            <table className="table table-bordered d-none">
              <thead className="table-ace">
                <tr>
                  <th>Schedule name</th>
                  <th>Group name</th>
                  <th>Court name</th>
                  <th scope="col">Scheduled Date</th>
                  <th scope="col">Start Date Time</th>
                  <th scope="col">End Date Time</th>
                  {/* <th scope="col">User Status</th>
                  <th scope="col">Match Details</th> */}
                  <th>Shootout</th>
                  <th scope="col">Action</th>
                </tr>
              </thead>
              <tbody>
                {scheduleList.map((data: any, index) => {
                  return (
                    <tr key={index}>
                      <td>{data.schedule_name || "NA"}</td>
                      <td>{data.schedule_group_name || "NA"}</td>
                      <td>{data.court_name}</td>
                      <td className="text-center">{data.schedule_date}</td>
                      <td className="text-center">{data.schedule_starttime}</td>
                      <td className="text-center">{data.schedule_endtime}</td>
                      <td className="text-center">
                        <button
                          className="btn btn-success"
                          onClick={(e) => getShootOutDetails(data.schedule_id)}
                        >
                          Show
                        </button>
                      </td>
                      <td>
                        <div className="d-flex justify-content-center">
                          <div className="dropdown">
                            <button
                              className="btn btn-outline-dark dropdown-toggle"
                              type="button"
                              data-bs-toggle="dropdown"
                              aria-expanded="false"
                            >
                              Action
                            </button>
                            <ul className="dropdown-menu dropdown-menu-end">
                              <li>
                                <button
                                  className="dropdown-item"
                                  data-bs-toggle="modal"
                                  data-bs-target="#viewScheduleModal"
                                  onClick={(e) => getSchedule(data.schedule_id)}
                                >
                                  <ViewIcon />
                                  View
                                </button>
                              </li>
                              <li>
                                <button
                                  className="dropdown-item"
                                  type="button"
                                  onClick={(e) =>
                                    update_schedule(data.schedule_id)
                                  }
                                >
                                  <EditIcon />
                                  Edit
                                </button>
                              </li>
                              <li>
                                <hr className="dropdown-divider" />
                              </li>
                              <li>
                                <button
                                  className="dropdown-item text-danger"
                                  type="button"
                                >
                                  <DeleteIcon />
                                  Delete
                                </button>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </td>
                     
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {showShootOut && (
            <div className="col-6">
              <div className="shootout-pane">
                <div className="d-flex justify-content-end py-3">
                  <button
                    className="btn btn-success me-2"
                    onClick={(e) => showCreateShootout(e)}
                  >
                    Create Shootout
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={(e) => setShowShootOut(false)}
                  >
                    Close
                  </button>
                </div>
                <div className="">
                  {shootoutLists.map((data: any, index: number) => {
                    return (
                      <div className="card mb-2 shadow-sm" key={index}>
                        <div className="card-body p-1">
                          <div className="d-flex justify-content-between border-0 p-2 shadow-none">
                            <div className="w-25">
                              <h6>Date</h6>
                              <p>{data.date || "-"}</p>
                            </div>
                            <div className="w-50">
                              <h6>Start and End Date</h6>
                              <p>
                                {data.start_time} - {data.end_time}
                              </p>
                            </div>
                            <div className="w-25">
                              <h5>Status</h5>
                              {data.user_status === "1" ? (
                                <button
                                  className="btn btn-sm btn-danger"
                                  onClick={() =>
                                    updateShootoutStatus(data.shoot_out_id, 0)
                                  }
                                >
                                  Cancel
                                </button>
                              ) : (
                                <button
                                  className="btn btn-sm btn-success"
                                  onClick={() =>
                                    updateShootoutStatus(data.shoot_out_id, 1)
                                  }
                                >
                                  Accept
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="card-footer d-flex justify-content-between">
                          <button
                            className="btn btn-success"
                            onClick={() => showMatchDetails(data.shoot_out_id)}
                          >
                            Generate Pool
                          </button>
                          <div className="dropdown">
                            <button
                              className="btn btn-outline-dark"
                              type="button"
                              data-bs-toggle="dropdown"
                              aria-expanded="false"
                            >
                              Action
                            </button>
                            <ul className="dropdown-menu dropdown-menu-end">
                              <li>
                                <button className="dropdown-item" type="button">
                                  <ViewIcon />
                                  View
                                </button>
                              </li>
                              <li>
                                <button className="dropdown-item" type="button">
                                  <EditIcon />
                                  Edit
                                </button>
                              </li>
                              <li>
                                <button
                                  className="dropdown-item"
                                  type="button"
                                  onClick={(e) =>
                                    showUpdateScore(data.shoot_out_id)
                                  }
                                >
                                  <UpdateScoreIcon />
                                  Update Score
                                </button>
                              </li>
                              <li>
                                <button
                                  className="dropdown-item"
                                  type="button"
                                  onClick={(e) =>
                                    playerSummaryData(data.shoot_out_id)
                                  }
                                >
                                  <PlayerSummaryIcon />
                                  Player Summary
                                </button>
                              </li>
                              <li>
                                <button
                                  className="dropdown-item"
                                  type="button"
                                  onClick={(e) =>
                                    showPlayerLists(data.schedule_id)
                                  }
                                >
                                  <PlayersListsIcon />
                                  Player Lists
                                </button>
                              </li>
                              <li>
                                <hr className="dropdown-divider" />
                              </li>
                              <li>
                                <button
                                  className="dropdown-item text-danger"
                                  type="button"
                                >
                                  <DeleteIcon />
                                  Delete
                                </button>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  <table className="table table-bordered d-none">
                    <thead className="table-ace">
                      <tr>
                        <th scope="col">Date</th>
                        <th scope="col">From</th>
                        <th scope="col">to</th>
                        <th scope="col">Nomination Before</th>
                        <th scope="col">Nomination Close In</th>
                        <th scope="col">User Status</th>
                        <th scope="col">Match Details</th>
                        <th scope="col">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {shootoutLists.map((data: any, index) => {
                        return (
                          <tr key={index}>
                            <td>{data.date || "-"}</td>
                            <td>{data.start_time}</td>
                            <td>{data.end_time || "-"}</td>
                            <td>{data.schedule_date || "-"}</td>
                            <td>{data.schedule_starttime || "-"}</td>
                            <td>{data.user_status}</td>
                            <td>
                              <button
                                className="btn btn-outline-dark"
                                onClick={() =>
                                  showMatchDetails(data.shoot_out_id)
                                }
                              >
                                Generate Pool
                              </button>
                            </td>
                            <td>
                              <div className="d-flex justify-content-end">
                                <div className="dropdown">
                                  <button
                                    className="btn btn-outline-dark dropdown-toggle"
                                    type="button"
                                    data-bs-toggle="dropdown"
                                    aria-expanded="false"
                                  >
                                    Action
                                  </button>
                                  <ul className="dropdown-menu dropdown-menu-end">
                                    <li>
                                      <button
                                        className="dropdown-item"
                                        type="button"
                                      >
                                        <ViewIcon />
                                        View
                                      </button>
                                    </li>
                                    <li>
                                      <button
                                        className="dropdown-item"
                                        type="button"
                                      >
                                        <EditIcon />
                                        Edit
                                      </button>
                                    </li>
                                    <li>
                                      <button
                                        className="dropdown-item"
                                        type="button"
                                        onClick={(e) =>
                                          showUpdateScore(data.schedule_id)
                                        }
                                      >
                                        <UpdateScoreIcon />
                                        Update Score
                                      </button>
                                    </li>
                                    <li>
                                      <button
                                        className="dropdown-item"
                                        type="button"
                                        onClick={(e) =>
                                          playerSummaryData(data.schedule_id)
                                        }
                                      >
                                        <PlayerSummaryIcon />
                                        Player Summary
                                      </button>
                                    </li>
                                    <li>
                                      <button
                                        className="dropdown-item"
                                        type="button"
                                        onClick={(e) =>
                                          showPlayerLists(data.schedule_id)
                                        }
                                      >
                                        <PlayersListsIcon />
                                        Player Lists
                                      </button>
                                    </li>
                                    <li>
                                      <hr className="dropdown-divider" />
                                    </li>
                                    <li>
                                      <button
                                        className="dropdown-item text-danger"
                                        type="button"
                                      >
                                        <DeleteIcon />
                                        Delete
                                      </button>
                                    </li>
                                  </ul>
                                </div>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      {isLoading && <Loading />}
      <ScheduleModal />
      {isUpdateSchedule && <UpdateScheduleModal />}
      {isUpdateScore && <UpdateScore />}
      {isPlayerSummary && <PlayerSummary _data={playerSummary} />}
      {isPlayerLists && <TeamDetails />}
      {isMatchDetails && <MatchDetails />}
      {isShootOut && <CreateShootout scheduleId={selectedSchedule} group_id={selectedGroup} />}

      <div
        className="modal fade"
        id="viewScheduleModal"
        tabIndex={-1}
        aria-labelledby="viewScheduleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered modal-xl">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="viewScheduleModalLabel">
                View Schedule
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <table className="table table-bordered">
                <tbody>
                  <tr>
                    <td className="text-start fw-bold" scope="col">
                      Name
                    </td>
                    <td className="text-start" colSpan={3}>
                      {scheduleDetails.schedule_name}
                    </td>
                  </tr>
                  <tr>
                    <td className="text-start fw-bold" scope="col">
                      Description
                    </td>
                    <td className="text-start" colSpan={3}>
                      {scheduleDetails.schedule_description}
                    </td>
                  </tr>
                  <tr>
                    <td className="text-start fw-bold" scope="col">
                      Start Date
                    </td>
                    <td className="text-start">
                      {scheduleDetails.schedule_starttime}
                    </td>

                    <td className="text-start fw-bold" scope="col">
                      Start End Date
                    </td>
                    <td className="text-start">
                      {scheduleDetails.schedule_endtime}
                    </td>
                  </tr>
                  <tr>
                    <td className="text-start fw-bold" scope="col">
                      Repeat
                    </td>
                    <td className="text-start">
                      {scheduleDetails.schedule_repeat === "1" ? "Yes" : "No"}
                    </td>

                    <td className="text-start fw-bold" scope="col">
                      Repeat Until
                    </td>
                    <td className="text-start">
                      {scheduleDetails.schedule_repeat_till}
                    </td>
                  </tr>
                  <tr>
                    <td className="text-start fw-bold" scope="col">
                      Skill Level
                    </td>
                    <td className="text-start">
                      {scheduleDetails.schedule_skilllevel}
                    </td>

                    <td className="fw-bold text-start" scope="col">
                      Player Rating
                    </td>
                    <td className="text-start">
                      {scheduleDetails.schedule_rating}
                    </td>
                  </tr>
                  <tr>
                    <td className="fw-bold text-start" scope="col">
                      Visibility
                    </td>
                    <td className="text-start" colSpan={3}>
                      {scheduleDetails.schedule_visibility === "0"
                        ? "Public"
                        : "Private"}
                    </td>
                  </tr>
                  <tr>
                    <td className="text-start fw-bold" scope="col">
                      Valid Hours
                    </td>
                    <td className="text-start" colSpan={3}>
                      {scheduleDetails.schedule_valid_hours}
                    </td>
                  </tr>
                  <tr>
                    <td className="fw-bold text-start" scope="col">
                      Format
                    </td>
                    <td className="text-start">
                      {scheduleDetails.schedule_format}
                    </td>
                    <td className="text-start fw-bold" scope="col">
                      Cost
                    </td>
                    <td className="text-start">
                      {scheduleDetails.schedule_cost}
                    </td>
                  </tr>
                  <tr>
                    <td className="fw-bold text-start" scope="col">
                      Court Allocation
                    </td>
                    <td className="text-start" colSpan={3}>
                      {scheduleDetails.court_name}
                    </td>
                  </tr>
                  <tr>
                    <td className="text-start fw-bold" scope="col">
                      Note to Player
                    </td>
                    <td className="text-start">
                      {scheduleDetails.schedule_note_player}
                    </td>
                    <td className="text-start fw-bold" scope="col">
                      Note to Reviewer
                    </td>
                    <td className="text-start">
                      {scheduleDetails.schedule_note_reviewer}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
