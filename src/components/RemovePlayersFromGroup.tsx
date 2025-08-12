import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Swal from "sweetalert2";

import * as bootstrap from "bootstrap";

import http from "../services/http.services";
import { RemoveIcon } from "../shared/icons";

export function RemovePlayerFromGroup(props: any) {
  const [selectedPlayers, setSelectedPlayers] = useState([]);
  const [players, setPlayers] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();  
  const removeAdmin = (userId :any) => {
    //e.preventDefault();
    console.log(selectedPlayers);
    const user_group = {
      "group_id" : location.state.group_id,
      "user_id" : userId
    }
    http.post('api_remove_group_player.php',user_group)
    .then((response)=>{
      if(response.data.status === 'STATUS OK'){
        console.log('Admin removed from group');
        Swal.fire({
          title: 'Success',
          text: 'Admin removed from group',
          icon: 'success',
        }).then((result) => {
          if (result.isConfirmed) {
            //window.location.reload();
            get_admin_list();
          }
        });          
      }
      else{
        console.log('Error');
        Swal.fire({
          title: 'Error',
          text: response.data.status,
          icon: 'error',
        });
      }
      console.log(response);
    })
    .catch((error) => {
      console.error('Error:', error);
    })
  }
  const get_admin_list = () => {
    http.post('api_get_group_users.php',{group_id : location.state.group_id})
    .then((response) => {      
      setPlayers(response.data)      
    })
    .catch((error) => {
      console.error('Error:', error);
    })
  }
 
  useEffect(() => {
    get_admin_list();
  }, []);


  useEffect(() => {
    const createShootoutModal = new bootstrap.Modal(
      document.getElementById("removePlayerModal") as HTMLElement
    )

    createShootoutModal.show();

    const modalElement = document.getElementById("removePlayerModal") as HTMLElement;
    const handleModalClose = () => {
      createShootoutModal.hide();
      //props.history.push('/ap/club-league/clubs');
      window.location.reload();
    }

    modalElement.addEventListener('hidden.bs.modal', handleModalClose);

    return () => {
      modalElement.removeEventListener('hidden.bs.modal', handleModalClose);
    }
  });

  return (
    <div
      className="modal fade"
      id="removePlayerModal"
      tabIndex={-1}
      aria-labelledby="removePlayerModalLabel"
      aria-hidden="true"
      data-bs-backdrop="static"
      data-bs-keyboard="false"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h1 className="modal-title fs-5" id="removePlayerModalLabel">
              Remove Players(s) from Group
            </h1>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body">
              <div style={{maxHeight : "280px", overflow:"auto"}}>
                <table className='table table-bordered'>
                  <thead className='table-ace'>
                    <tr>
                        <th>Players Name</th>                     
                        <th>Remove</th>
                    </tr>
                  </thead>
                  <tbody>
                    {players.map((player: any, index :number) => (
                      <tr key={player.user_id}>                        
                        <td>{player.user_name}</td>
                        <td className="text-center">
                            <button className="btn btn-sm btn-danger" onClick={()=>removeAdmin(player.user_id)}>
                                <RemoveIcon />
                            </button>
                        </td>
                      </tr>
                    ))}
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
          </div>
        </div>
      </div>
    </div>
  );
}