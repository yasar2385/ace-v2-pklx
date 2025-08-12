import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import http from "../../services/http.services";

import * as bootstrap from "bootstrap";
import { Calendar } from "primereact/calendar";

export const CreateShootout = (props: any) => {
    const location = useLocation();

    const [request, setRequest] = useState({
        schedule_id: props.scheduleId,
        start_time: new Date(),
        end_time: new Date(),
        court_id: ''
    })
    const [courts, setCourts] = useState([]);

    useEffect(() => {
      getCourts();
      getGroupById(props.group_id);
      console.log('CreateShootout', props);
      // const createShootoutModal = new bootstrap.Modal(
      //   document.getElementById("createShootoutModal") as HTMLElement
      // )

      // createShootoutModal.show();

      // const modalElement = document.getElementById("createShootoutModal") as HTMLElement;
      // const handleModalClose = () => {
      //   createShootoutModal.hide();
      //   //props.history.push('/schedules');        
      // }

      // modalElement.addEventListener('hidden.bs.modal', handleModalClose);

      // return () => {
      //   modalElement.removeEventListener('hidden.bs.modal', handleModalClose);
      // }

      const modalElement = document.getElementById("createShootoutModal");

      if (!modalElement) {
        console.error("Modal element not found!");
        return;
      }
  
      // Initialize the modal instance
      let createShootoutModal = bootstrap.Modal.getInstance(modalElement);
      if (!createShootoutModal) {
        createShootoutModal = new bootstrap.Modal(modalElement);
      }
  
      // Show the modal
      createShootoutModal.show();
  
      // Event listener for modal close
      const handleModalClose = () => {
        console.log("Modal closed!");
        createShootoutModal.hide();
        // Example: Add navigation or other logic here
        // props.history.push('/schedules');
      };
  
      modalElement.addEventListener("hidden.bs.modal", handleModalClose);
  
      // Cleanup
      return () => {
        modalElement.removeEventListener("hidden.bs.modal", handleModalClose);
        createShootoutModal.hide(); // Ensure the modal is hidden
        document.querySelectorAll(".modal-backdrop").forEach((backdrop) => {
          backdrop.remove(); // Remove all lingering backdrops
        });
        document.body.classList.remove("modal-open"); // Remove Bootstrap body classes
        document.body.style.paddingRight = ""; // Reset body styles
      };

    },[props]);

    const getCourts = () => {
        http.get('api_select_all_courts.php')
        .then((response: any) => {
            setCourts(response.data);
        }).catch((error) => {
            console.error(error);
        })
    }


    const getGroupById = (id: any) => {
      http.post('api_get_group.php', {
        "group_id": id
      })
      .then((response: any) => {
        console.log(response);
        setRequest({
          ...request,
          court_id: response.data.group_court_id
        })
      }).catch((error) => {
        console.error(error);
      })
    }

    const createShootout = (e: any) => {
        e.preventDefault();
        
        http.post('api_create_shoot_out.php', request)
        .then((response: any) => {
            if(response.data.status === 'STATUS OK'){
                Swal.fire({
                    icon: 'success',
                    text: 'Shootout created successfully',
                    showConfirmButton: true,
                }).then((result) => {
                    if(result.isConfirmed){
                        window.location.reload();
                    }
                })
            }else{
                Swal.fire({
                    icon: 'error',
                    title: 'ERROR',
                    text: response.data.description
                })
            }
        }).catch((error) => {
            console.error(error);
        })
    }

  return (
    <div
      className="modal fade"
      id="createShootoutModal"
      data-bs-backdrop="static"
      data-bs-keyboard="false"
      tabIndex={-1}
      aria-labelledby="createShootoutModalLabel"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h1 className="modal-title fs-5" id="createShootoutModalLabel">
              Create Shootout
            </h1>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <form action="" onSubmit={(e)=>createShootout(e)}>
            <div className="modal-body">
              <div className="mb-3 d-none">
                <label htmlFor="shootoutDate" className="form-label">
                  Shootout Date
                </label>
                <input
                  type="datetime-local"
                  className="form-control"
                  id="shootoutName"
                  placeholder="Enter Shootout Date"
                />
              </div>
              <div className="mb-3">
                <label htmlFor="shootoutStartTime" className="form-label">
                  Start Time
                </label>
                <br/>
                <Calendar 
                  value={request.start_time} 
                  onChange={(e) => setRequest({...request, start_time: e.value ? new Date(e.value) : new Date()})}
                  appendTo={'self'}
                  showTime hourFormat="24"
                  inputClassName="form-control"
                />
                {/* <input
                  type="datetime-local"
                  className="form-control"
                  id="shootoutStartTime"
                  placeholder="Enter Start Time"
                  value={request.start_time}
                  onChange={(e) => setRequest({...request, start_time: e.target.value})}

                /> */}
              </div>
              <div className="mb-3">
                <label htmlFor="shootoutEndTime" className="form-label">
                  End Time
                </label>
                <br/>
                <Calendar 
                  value={request.end_time} 
                  onChange={(e) => setRequest({...request, end_time: e.value ? new Date(e.value) : new Date()})}
                  appendTo={'self'}
                  showTime hourFormat="24"
                  inputClassName="form-control"
                />
                {/* <input
                  type="datetime-local"
                  className="form-control"
                  id="shootoutEndTime"
                  placeholder="Enter End Time"
                  value={request.end_time}
                  onChange={(e) => setRequest({...request, end_time: e.target.value})}
                /> */}
              </div>
              <div className="mb-3">
                <label htmlFor="selectCourt" className="form-label">Select Court</label>
                <select className="form-select" id="selectCourt" 
                  value={request.court_id}
                  onChange={(e) => setRequest({...request, court_id: e.target.value})}
                >
                  <option value="">Select Court</option>
                  {
                      courts.map((court: any, index : number) => {
                          return <option key={court.court_id} value={court.court_id}>{court.court_name}</option>
                      })
                  }
                 </select> 
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
              <button type="submit" className="btn btn-success">
                Create Shootout
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
