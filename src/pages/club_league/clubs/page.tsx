import { useEffect, useState } from "react";
import http from "../../../services/http.services";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  ImageIcon,
  ChatIconV2,
  MoreIcon,
  ViewIcon,
  EditIcon,
  AddPlayersIcon,
  AdminIcon,
  ScheduleIcon,
  PlayersListsIcon,
  DeleteIcon,
  CourtIcon,
  RemovePlayer,
} from "../../../shared/icons";

import * as bootstrap from "bootstrap";
import Swal from "sweetalert2";

import { AddPlayerToGroup } from "../../../components/app/addPlayerToGroup";
import { AddAdminToGroup } from "../../../components/app/AddAdminToGroup";
import { TeamDetailsV2 } from "../../../components/app/teamDetails";

import { Loading } from "../../../components/app/loadingComponent";
import { RemoveAdminFromGroup } from "../../../components/app/RemoveAdminFromGroup";
import { RemovePlayerFromGroup } from "../../../components/app/RemovePlayersFromGroup";
import { API_BASE_URL } from "../../../config";

export function ClubsPage() {
  const [clubLists, setClubLists] = useState([]);
  const [groupDetails, setClubDetails]: any = useState({});
  const [isPlayerLists, setIsPlayerLists] = useState(false);
  const [isAddClub, setIsAddClub] = useState(false);
  const [fnType, setFnType] = useState("Create");
  const [selectedClub, setSelectedClub] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [isRemoveAdmin, setIsRemoveAdmin] = useState(false);
  const [isRemovePlayer, setIsRemovePlayer] = useState(false);
  //const dispatch = useDispatch();
  //const groupDetails = useSelector((state:any) => state.groupDetails);

  const getClubs = () => {
    setIsLoading(true);
    http
      .get("/api_select_user_groups.php")
      .then((response) => {
        if (response.data.status === "ACCESS TOKEN ERROR") {
          localStorage.clear();
          navigate("/login");
        }
        console.log(response.data);
        setClubLists(response.data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const getClubDetails = (id: any) => {
    http
      .post("/api_select_group_details.php", { group_id: id })
      .then((response) => {
        console.log(response.data);
        setClubDetails(response.data);
        //setViewGroup(true);
        //dispatch(setGroupDetails(response.data));
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const getClubById = (group_id: number) => {
    setIsLoading(true);
    http
      .post("/api_get_group.php", { group_id: group_id })
      .then((response) => {
        console.log(response.data["1"]);
        setClubDetails(response.data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("There was an error!", error);
      });
  };

  const uploadClubImage = () => {
    setIsLoading(true);
    const groupImage: any = document.getElementById(
      "groupImage"
    ) as HTMLInputElement;
    const formData = new FormData();
    //const reader = new FileReader();
    formData.append('file', groupImage.files[0]);


    http
      .post(
        `/api_file_upload.php?image_parameter=${selectedClub}&image_code=1`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      )
      .then((response) => {
        console.log(response.data);
        setIsLoading(false);
        if (response.data.status !== "ERROR") {
          Swal.fire({
            icon: "success",
            title: "Success",
            text: response.data.description,
            confirmButtonColor: "#3085d6",
          }).then((result) => {
            if (result.isConfirmed) {
              window.location.reload();
            }
          });
        } else {
          Swal.fire({
            icon: "error",
            title: "ERROR",
            text: response.data.description,
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const ShowPlayerLists = (args: any) => {
    setIsPlayerLists(true);
    location.state = { group_id: args };
  };
  const showFileUpdload = (args: any) => {
    setSelectedClub(args);
    const groupPhotoModal = new bootstrap.Modal(
      document.getElementById("groupPhotoModal") as HTMLElement
    );
    groupPhotoModal.show();
  };

  useEffect(() => {
    const modalElement_playerListsV2 = document.getElementById(
      "teamDetailsModalV2"
    ) as HTMLElement;
    if (modalElement_playerListsV2) {
      modalElement_playerListsV2.addEventListener(
        "hidden.bs.modal",
        function (event) {
          setIsPlayerLists(false);
        }
      );
    }
    if (isPlayerLists) {
      if (isPlayerLists) {
        const playerListsModal = new bootstrap.Modal(
          document.getElementById("teamDetailsModalV2") as HTMLElement
        );
        playerListsModal.show();
      }
    }
  }, [isPlayerLists]);
  const deleteClub = (id: any) => {
    console.log(id);
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "Deleted!",
          text: "Selected group has been deleted.",
          icon: "success",
        });
      }
    });
  };
  const changeFnType = (type: string, groupId: any) => {
    if (type === "Edit") {
      location.state = { group_id: groupId };
    }
    setFnType(type);
    setIsAddClub(true);
  };

  useEffect(() => {
    getClubs();
    const interval = setInterval(() => {
      const element = document.querySelector('.dashboardLayout') as HTMLElement | null;
      if (element) {
        element.removeAttribute("style");
        clearInterval(interval); // Stop the interval once the class is removed
      }
    }, 100); // Check every 100ms
    return () => clearInterval(interval); // Cleanup on component unmount
  }, []);
  useEffect(() => {
    document.title = "Club | ACE PICKL";

    const modalElement = document.getElementById("CreateClubModal") as HTMLElement;
    if (modalElement) {
      modalElement.addEventListener("hidden.bs.modal", function (event) {
        setIsAddClub(false);
      });
    }

    if (isAddClub) {
      // const CreateClubModal = new bootstrap.Modal(
      //   document.getElementById("CreateClubModal") as HTMLElement
      // );
      // CreateClubModal.show();
    }
  }, [isAddClub]);

  return (
    <>
      <div className="container">
        <div className="row">
          <div className="col-12 mt-3">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5>Club - (Community / Group)</h5>
              <button
                className="btn btn-success ml-auto"
                onClick={() => navigate("register")}
              >
                Create Club
              </button>
            </div>
          </div>
        </div>

        <div className="row row-cols-1 row-cols-sm-2 row-cols-md-4 g-3">
          {clubLists.map((group: any, index: number) => {
            return (
              <div className="col" key={index}>
                <div className="card shadow-sm border-0">
                  <div className="position-relative p-3  bg-light">
                    <img
                      src={`${API_BASE_URL}/${group.group_photo_id}`}
                      alt="top"
                      className="bd-placeholder-img card-img-top"
                      style={{ aspectRatio: "16/9" }}
                      height={195}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.onerror = null;
                        target.src =
                          "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png";
                      }}
                    />
                    <button
                      className="btn btn-sm btn-secondary"
                      style={{
                        position: "absolute",
                        bottom: "5px",
                        right: "5px",
                      }}
                      onClick={() => showFileUpdload(group.group_id)}
                      title="Change Group Image"
                    >
                      <ImageIcon />
                    </button>
                  </div>
                  <div className="card-body position-relative">
                    <div
                      className="d-flex justify-content-end"
                      style={{ position: "relative", top: "0px", right: "0px" }}
                    >
                      <Link
                        className="btn btn-light me-2"
                        title="Chat"
                        to={"/ap/club-league/chat"}
                        state={{
                          groupId: group.group_id,
                          group_name: group.group_name,
                        }}
                      >
                        <ChatIconV2 />
                      </Link>
                      <div className="dropdown">
                        <button
                          className="btn btn-dark"
                          type="button"
                          data-bs-toggle="dropdown"
                          aria-expanded="false"
                        >
                          <MoreIcon />
                        </button>
                        <ul className="dropdown-menu dropdown-menu-end border-0 shadow-lg">
                          <li>
                            <button
                              className="dropdown-item"
                              type="button"
                              title="View Group"
                              data-bs-toggle="modal"
                              data-bs-target="#viewGroupModal"
                              onClick={(e) => getClubById(group.group_id)}
                            >
                              <ViewIcon />
                              View
                            </button>
                          </li>
                          <li>
                            <button
                              title="Edit Group"
                              className="dropdown-item"
                              type="button"
                              onClick={() =>
                                changeFnType("Edit", group.group_id)
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
                            <Link
                              className="dropdown-item"
                              title="Schedule"
                              to={"/ap/club-league/schedule"}
                              state={{
                                group_id: group.group_id,
                                group_name: group.group_name,
                              }}
                            >
                              <ScheduleIcon />
                              Schedule
                            </Link>
                          </li>
                          <li>
                            <Link
                              className="dropdown-item"
                              title="Schedule"
                              to={"/ap/club-league/courts"}
                              state={{
                                group_id: group.group_id,
                                group_name: group.group_name,
                              }}
                            >
                              <CourtIcon />
                              Court
                            </Link>
                          </li>
                          <li>
                            <hr className="dropdown-divider" />
                          </li>
                          <li><h6 className="dropdown-header">Player</h6></li>
                          <li>
                            <button
                              className="dropdown-item"
                              type="button"
                              title="Add Players"
                              data-bs-toggle="modal"
                              data-bs-target="#addPlayerModal"
                              onClick={(e) =>
                                (location.state = { group_id: group.group_id })
                              }
                            >
                              <AddPlayersIcon />
                              Add Players
                            </button>
                          </li>
                          <li>
                            <button
                              title="Player's Lists"
                              className="dropdown-item"
                              onClick={() => ShowPlayerLists(group.group_id)}
                            >
                              <PlayersListsIcon />
                              Player's List
                            </button>
                          </li>
                          <li>
                            <button
                              title="Player's Lists"
                              className="dropdown-item"
                              onClick={() => {
                                location.state = { group_id: group.group_id }
                                setIsRemovePlayer(true)
                              }}
                            >
                              <RemovePlayer />
                              Remove Player
                            </button>
                          </li>
                          <li>
                            <hr className="dropdown-divider" />
                          </li>
                          <li><h6 className="dropdown-header">Admin</h6></li>
                          <li>
                            <button
                              title="View Images"
                              className="dropdown-item"
                              data-bs-toggle="modal"
                              data-bs-target="#addAdminModal"
                              onClick={(e) =>
                                (location.state = { group_id: group.group_id })
                              }
                            >
                              <AdminIcon />
                              Add Admin
                            </button>
                          </li>
                          <li>
                            <button
                              title="Player's Lists"
                              className="dropdown-item"
                            >
                              <PlayersListsIcon />
                              Admin Lists
                            </button>
                          </li>
                          <li>
                            <button
                              title="Player's Lists"
                              className="dropdown-item"
                              onClick={() => {
                                location.state = { group_id: group.group_id }
                                setIsRemoveAdmin(true)
                              }}
                            >
                              <RemovePlayer />
                              Remove Admin
                            </button>
                          </li>

                          <li>
                            <hr className="dropdown-divider" />
                          </li>
                          <li>
                            <button
                              className="dropdown-item text-danger"
                              type="button"
                              title="Delete group"
                              onClick={(e) => deleteClub(group.group_id)}
                            >
                              <DeleteIcon />
                              Delete
                            </button>
                          </li>
                        </ul>
                      </div>
                    </div>

                    <h5 className="card-title" title={group.group_name} style={{ textOverflow: "ellipsis", whiteSpace: "nowrap", overflow: 'hidden' }}>{group.group_name}</h5>
                    <p className="card-text">{group.group_description}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      

      <AddPlayerToGroup />
      <AddAdminToGroup />
      <div
        className="modal fade"
        id="viewGroupModal"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        tabIndex={-1}
        aria-labelledby="viewGroupModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered modal-xl">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="viewGroupModalLabel">
                Community/Group - {groupDetails.group_name}
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <div className="card mb-3 border-0">
                <div className="card-body">
                  <div className="row">
                    <div className="col-6">
                      <table className="table table-bordered">
                        <tbody>
                          <tr>
                            <td className="fw-bold">Name</td>
                            <td>{groupDetails.group_name}</td>
                          </tr>
                          <tr>
                            <td className="fw-bold">Description</td>
                            <td>{groupDetails.group_description}</td>
                          </tr>
                          <tr>
                            <td className="fw-bold">Members Count</td>
                            <td>{groupDetails.access_member_count}</td>
                          </tr>
                          <tr>
                            <td className="fw-bold">Playing hours</td>
                            <td>{groupDetails.access_playing_hours}</td>
                          </tr>
                          <tr>
                            <td className="fw-bold">Admin visible</td>
                            <td>
                              {groupDetails.access_show_admin === "0"
                                ? "NO"
                                : "Yes"}
                            </td>
                          </tr>
                          <tr>
                            <td className="fw-bold">Court</td>
                            <td>{groupDetails.group_court_id}</td>
                          </tr>
                          <tr>
                            <td className="fw-bold">Visibility</td>
                            <td>
                              {groupDetails.access_visibility === "0"
                                ? "Private"
                                : "Public"}
                            </td>
                          </tr>
                          <tr>
                            <td className="fw-bold">Skill level</td>
                            <td>{groupDetails.access_skill_level}</td>
                          </tr>
                          <tr>
                            <td className="fw-bold">Invite others</td>
                            <td>
                              {groupDetails.access_invite_others === "0"
                                ? "No"
                                : "Yes"}
                            </td>
                          </tr>
                          <tr>
                            <td className="fw-bold">Message to All</td>
                            <td>
                              {groupDetails.access_message_all === "0"
                                ? "No"
                                : "Yes"}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <div className="col-6">
                      <img
                        src={`${API_BASE_URL}/${groupDetails.group_photo}`}
                        className="card-img-top"
                        alt="..."
                        height={360}
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.onerror = null;
                          target.src =
                            "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png";
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
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
      {isLoading && <Loading />}
      {isPlayerLists && <TeamDetailsV2 />}

      {
        isRemoveAdmin && <RemoveAdminFromGroup />
      }
      {
        isRemovePlayer && <RemovePlayerFromGroup />
      }

      <div
        className="modal fade"
        id="groupPhotoModal"
        tabIndex={-1}
        aria-labelledby="groupPhotoModalLabel"
        aria-hidden="true"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="groupPhotoModalLabel">
                Community Image Upload
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <form>
                <div className="mb-3">
                  <label htmlFor="groupImage" className="col-form-label">
                    Select Image
                  </label>
                  <input type="file" className="form-control" id="groupImage" />
                </div>
                <div>
                  <button
                    type="button"
                    className="btn btn-success"
                    onClick={uploadClubImage}
                  >
                    Upload
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
