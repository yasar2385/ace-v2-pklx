
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import http from '../services/http.services';
import { Dropdown } from 'primereact/dropdown';

export const UpdateScore = (props: any) => {
  const location = useLocation();
  const [selectedPlayers, setSelectedPlayers] = useState([]);
  const [selectedPlayer, setSelectedPlayer] = useState('');
  const [players, setPlayers] = useState([]);
  const [updateScore, setUpdateScore] = useState({
    shootout_id : location.state.shoot_out_id,
    round_no : '',
    pool_id : '',
    score : 0,
    user_id : '',  
    playedOn : ''
  });
  const [currentMatch, setCurrentMatch] = useState(0);
  const [scores, setScores] = useState([]);
  const navigate = useNavigate();

  const getCurrentMatch = () => {

    http.post("/api_get_current_match.php", { schedule_id: location.state.schedule_id })
    .then((response: any) => {
      setCurrentMatch(response.data);
      
    }).catch((error) => {
      console.error('Error:', error);
    })
    
  };

  const getPoolId = () => {
    http.post("/api_get_pool_players.php", { shootout_id : location.state.shoot_out_id })
    .then((response: any) => {
      setPlayers(response.data === '' ? [] : response.data);
    }).catch((error) => {
      console.error('Error:', error);
    })
  }

  const getScores = () => {
    http.post("/api_get_updated_scores.php", { shootout_id: location.state.shoot_out_id })
    .then((response: any) => {
      setScores(response.data);
    }).catch((error) => {
      console.error('Error:', error);
    })
  }
  // const handleScoreChange = (index: number, field: any, value: any) => {
  //   // setUpdateScore((prevUpdateScore) => {
  //   //   const updatedScores: any = [...prevUpdateScore.scores];
  //   //   updatedScores[index][field] = value;
  //   //   return {
  //   //     ...prevUpdateScore,
  //   //     scores: updatedScores,
  //   //   };
  //   // });
  // };

  // const addRow = () => {
  //   setUpdateScore({
  //     ...updateScore,
  //     scores: [
  //       ...updateScore.scores,
  //       {
  //         match: 0,
  //         playedOn: '2021-09-01T00:00',
  //         score: 0,
  //       },
  //     ],
  //   });
  // }

  const updatePlayerScore = (e:any) => {
    e.preventDefault();

    http.post("/api_update_score.php", updateScore)
    .then((response)=>{
        if(response.data.status === 'STATUS OK'){
          Swal.fire({
            title: 'Success',
            text: 'Player score updated successfully',
            icon: 'success',
            confirmButtonText: 'OK',
          }).then((result) => {
            if (result.isConfirmed) {
              getScores();
            }
            //window.location.reload();
          });
        }else{
          Swal.fire({
            title: 'Error',
            text: response.data,
            icon: 'error',
            confirmButtonText: 'OK',
          });
        }

    })
    .catch((error) => {
      console.error('Error:', error);
    })

   
  };

  const get_user_list = () => {

    http.post("/api_select_userlist.php", { selection_code: 0 })
    .then((response: any) => {
      //Array.isArray(response.data) ? setPlayers(response.data) : setPlayers([]);
      setPlayers(response.data);
    })
    .catch((error) => {
      console.error('Error:', error);
    })

    
  };

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
        <h6 className="mb-0">
          {option.user_fname} {option.user_lname}
        </h6>
        <small className="text-secondary">
          {option.user_email} | {option.user_phone}
        </small>
      </div>
    );
  };

  useEffect(() => {
    //get_user_list();
    getScores();
    getPoolId();
  }, []);

  return (
    <div
      className="modal fade"
      id="updateScoreModal"
      tabIndex={-1}
      aria-labelledby="updateScoreModalLabel"
      aria-hidden="true"
      data-bs-backdrop="static"
      data-bs-keyboard="false"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h1 className="modal-title fs-5" id="updateScoreModalLabel">
              Update Score
            </h1>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body">
              <div>
                <form onSubmit={(e) => updatePlayerScore(e)}>
                    <div className='mb-3'>
                        <label htmlFor="playerName" className="form-label">
                          Choose Player
                        </label>
                        <Dropdown 
                          value={selectedPlayer} 
                          onChange={(e) => {
                            setSelectedPlayer(e.value); 
                            setUpdateScore({...updateScore, user_id: e.value.user_id, pool_id: e.value.pool_id});
                            console.log(e.value)
                          }} 
                          options={players} 
                          optionLabel="user_name" 
                          placeholder="Choose a Player..." 
                          className="w-100" 
                          appendTo="self"
                          emptyMessage="No Players Found"
                        />
                        <select className='form-select d-none'
                          value={updateScore.user_id}
                          onChange={(e) => setUpdateScore({...updateScore, user_id: e.target.value })}
                        >
                            <option value="">Choose Player...</option>
                          {players.map((player: any, index: number) => (
                            <option key={player.user_id} value={player.user_id}>
                              {player.user_fname} {player.user_name}
                            </option>
                          ))}
                        </select>
                    </div>
                    <div className='mb-3'>
                        <label htmlFor="match" className="form-label">
                          Round
                        </label>
                        <select name="" id="" className='form-select' 
                          value={updateScore.round_no}
                          onChange={(e) => setUpdateScore({...updateScore, round_no: e.target.value})}
                        >
                          <option value="">Choose Round...</option>
                          <option value="1">Round 1</option>
                          <option value="2">Round 2</option>
                          <option value="3">Round 3</option>
                          <option value="4">Round 4</option>
                          <option value="5">Round 5</option>
                        </select>                                              
                    </div>
                    <div className='mb-3'>
                        <label htmlFor="score" className="form-label">
                          Score
                        </label>
                        <input type="number" className='form-control' 
                          value={updateScore.score}
                          onChange={(e) => setUpdateScore({...updateScore, score: Number(e.target.value)})}
                        />
                    </div>

                    <div className='mb-3 text-end'>
                      <button type="submit" className={`btn btn-primary ${updateScore.user_id !== '' ? '' : 'disabled'}`} >
                        Update Score
                      </button>
                    </div>
                </form>
              </div>

              <div style={{maxHeight : "280px", overflow : "auto"}}>
                <table className='table table-bordered'>
                  <thead className='table-ace'>
                    <tr>
                      <th>Player Name</th>
                      <th>Score</th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      scores.map((score: any, index: number) => (
                        <tr key={index}>
                          <td>{score.user_name}</td>
                          <td>{score.score}</td>
                        </tr>
                      ))
                    }
                  </tbody>
                </table>
              </div>
          </div>
          <div className="modal-footer d-none">
            <button
              type="button"
              className="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              Close
            </button>
            <button
              type="button"
              className="btn btn-primary"
            >
              Update score
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
