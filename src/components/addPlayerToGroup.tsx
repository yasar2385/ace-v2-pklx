import { MultiSelect, MultiSelectChangeEvent } from 'primereact/multiselect';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import http from '../services/http.services';

interface Player {
  user_fname: string;
  user_email: string;
  user_phone: string;
  user_lname: string;
  user_id: string;
  [key: string]: any;
}

export function AddPlayerToGroup() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [selectedPlayers, setSelectedPlayers] = useState<Player[]>([]);

  const navigate = useNavigate();
  const location = useLocation();
  const [userGroup, setUserGroup] = useState({})

  const addUserToGroup = (e: any) => {
    e.preventDefault();
    console.log(selectedPlayers);
    const user_group = {
      "group_id": location.state.group_id,
      "group_users": { ...selectedPlayers.map((item: any) => item.user_id) }
    }


    http.post('api_add_group_users.php', user_group)
      .then((response) => {
        if (response.data.status === 'STATUS OK') {
          console.log('User added to group');
          Swal.fire({
            title: 'Success',
            text: 'User added to group',
            icon: 'success',
          }).then((result) => {
            if (result.isConfirmed) {
              window.location.reload();
            }
          });
        }
        else {
          console.log('Error');
          Swal.fire({
            title: 'Error',
            text: 'User not logged in',
            icon: 'error',
          });
        }
        console.log(response);
      })
      .catch((error) => {
        console.error('Error:', error);
      })
  }

  const get_user_list = () => {
    http.post('api_select_userlist.php', { selection_code: 0 })
      .then((response) => {
        setPlayers(response.data)
        console.log(response.data);
      })
      .catch((error) => {
        console.error('Error:', error);
      })

  }

  const panelFooterTemplate = () => {
    const length = selectedPlayers ? selectedPlayers.length : 0;

    return (
      <div className="py-2 px-3">
        <b>{length}</b> player{length > 1 ? 's' : ''} selected.
      </div>
    );
  };
  const playerViewTemplate = (option: any) => {
    return (
      <div className="flex align-items-center">
        <h6 className='mb-0'>{option.user_fname} {option.user_lname}</h6>
        <small className='text-secondary'>{option.user_email} | {option.user_phone}</small>
      </div>
    );
  }
  useEffect(() => {
    get_user_list();
  }, []);
  return (
    <div
      className="modal fade"
      id="addPlayerModal"
      tabIndex={-1}
      aria-labelledby="addPlayerLabel"
      aria-hidden="true"
      data-bs-backdrop="static"
      data-bs-keyboard="false"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h1 className="modal-title fs-5" id="addPlayerLabel">
              Add Player To Group
            </h1>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <form onSubmit={(e) => addUserToGroup(e)}>
            <div className="modal-body">
              <div className="mb-3">
                <label htmlFor="playerName" className="form-label">
                  Choose Player(s)
                </label>
                <MultiSelect
                  value={selectedPlayers}
                  onChange={(e: MultiSelectChangeEvent) => setSelectedPlayers(e.value)}
                  options={players || []}
                  optionLabel="user_fname"
                  display="chip"
                  placeholder="Select players"
                  maxSelectedLabels={4}
                  className="w-100"
                  filter
                  filterBy='user_fname,user_email,user_phone,user_lname'
                  itemTemplate={playerViewTemplate}
                  panelFooterTemplate={panelFooterTemplate}
                  filterMatchMode="contains"
                  appendTo="self"
                />
              </div>

              <div style={{ maxHeight: "280px", overflow: "auto" }}>
                <table className='table table-bordered'>
                  <thead className='table-ace'>
                    <tr>
                      <th>Player Name</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedPlayers.map((player: any) => (
                      <tr key={player.id}>
                        <td>{player.user_fname}</td>
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
              <button type="submit" className="btn btn-success">
                Add Player(s)
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
