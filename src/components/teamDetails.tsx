import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import http from "../services/http.services";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import Swal from "sweetalert2";

const TeamDetails = () => {
const location = useLocation();  
const [playerLists, setPlayerLists] = useState([]);

const getPlayerLists = ()=>{

  http.post('api_player_lists.php',{
    schedule_id : location.state.schedule_id
  })
  .then((response: any) => {
    setPlayerLists(response.data);
  })
  .catch((error) => {
    console.error('Error:', error);
  })
}

useEffect(() => {
  getPlayerLists();
},[]);
  return (
    <div
      className="modal fade"
      id="teamDetailsModal"
      data-bs-backdrop="static"
      data-bs-keyboard="false"
      tabIndex={-1}
      aria-labelledby="teamDetailsModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-dialog-centered modal-xl">
        <div className="modal-content">
          <div className="modal-header">
            <h1 className="modal-title fs-5" id="teamDetailsModalLabel">
              Player Lists
            </h1>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body">
            <div className="table-response">
                <DataTable value={playerLists} stripedRows showGridlines paginator rows={10} rowsPerPageOptions={[5, 10, 25, 50]}>
                  <Column field="user_name" header="Player Name"></Column>
                  <Column field="user_email" header="Email ID"></Column>
                  <Column field="user_phone" header="Phone Number"></Column>
                  <Column field="user_response" header="Response"></Column>
                  <Column field="user_respond_by" header="Responded By"></Column>
                  <Column field="user_respond_on" header="Responded On"></Column>
                  <Column field="comments" header="Comments"></Column>                  
                </DataTable>    

              <table className="table table-bordered d-none">
                <thead className="table-ace">
                  <tr>
                    <th>Player Name</th>
                    <th>Email ID</th>
                    <th>Phone Number</th>
                    <th>Response</th>
                    <th>Responded By</th>
                    <th>Responded On</th>
                    <th>Comments</th>
                  </tr>
                </thead>
                <tbody>
                  {playerLists.map((player: any, index: number) => {
                    return (
                      <tr key={index}>
                        <td>{player.user_name}</td>
                        <td>{player.user_email}</td>
                        <td>{player.user_phone}</td>
                        <td>{player.user_response}</td>
                        <td>{player.user_respond_by}</td>
                        <td>{player.user_respond_on}</td>
                        <td>{player.comments}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
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
            <button type="button" className="btn btn-primary d-none">
              Understood
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const TeamDetailsV2 = () => {

  const location = useLocation();  
  const [playerLists, setPlayerLists] = useState([]);
  
  const getGroupPlayerLists = ()=>{

    http.post('api_player_lists_new.php',{
      group_id : location.state.group_id
    })
    .then((response: any) => {
      if(Array.isArray(response.data) && response.data.length > 0){
        setPlayerLists(response.data);
      }else{
        Swal.fire({
          title: 'Error!',
          icon: 'error',
          text: response.data
        }).then((result) => {
          if (result.isConfirmed) {
            window.location.reload();
          }
        });
      }
    })
    .catch((error) => {
      console.error('Error:', error);
    })
  }
  
  useEffect(() => {
    getGroupPlayerLists();
  },[]);
  return (
    <div
      className="modal fade"
      id="teamDetailsModalV2"
      data-bs-backdrop="static"
      data-bs-keyboard="false"
      tabIndex={-1}
      aria-labelledby="teamDetailsModalV2Label"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-dialog-centered modal-xl">
        <div className="modal-content">
          <div className="modal-header">
            <h1 className="modal-title fs-5" id="teamDetailsModalV2Label">
              Player Lists
            </h1>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body">
            <div className="table-response">
              <table className="table table-bordered">
                <thead className="table-dark">
                  <tr>
                    <th>Player Name</th>
                    <th>Email ID</th>
                    <th>Phone Number</th>
                    <th>Rank</th>                    
                  </tr>
                </thead>
                <tbody>
                  {playerLists.map((player: any, index: number) => {
                    return (
                      <tr key={index}>
                        <td>{player.user_name}</td>
                        <td>{player.user_email}</td>
                        <td>{player.user_phone}</td>
                        <td>{player.user_rank || 'NA'}</td>                        
                      </tr>
                    );
                  })}
                </tbody>
              </table>
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
            <button type="button" className="btn btn-primary d-none">
              Understood
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export { TeamDetails, TeamDetailsV2 };