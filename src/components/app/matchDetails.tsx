
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import http from "../../services/http.services";

export const MatchDetails = () => {
  const [matchDetails, setMatchDetails]: any = useState({});
  const [poolData, setPoolData]: any = useState([]);
  const location = useLocation();

  const getMatchDetails = () => {
    http.post('/api_schedule_matches.php', {
      schedule_id: location.state.schedule_id,
      shoot_out_id : location.state.shoot_out_id
    })
    .then((response: any) => {
      const __pool = response.data.pool !== undefined ? [
        ...new Set(response.data.pool.map((item: any, index: number) => item.pool_id)),
      ] : [];
      setPoolData(__pool);
      
      Array.isArray(response.data.pool) &&
      setMatchDetails(response.data);
    })
    .catch((error) => {
      console.error('Error:', error);
    })
  };

  useEffect(() => {
    getMatchDetails();
  }, []);

  return (
    <div
      className="modal fade"
      id="matchDetailsModal"
      data-bs-backdrop="static"
      data-bs-keyboard="false"
      tabIndex={-1}
      aria-labelledby="matchDetailsModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-dialog-centered modal-xl">
        <div className="modal-content">
          <div className="modal-header ">
            <h1 className="modal-title fs-5" id="matchDetailsModalLabel">
              Match Details
            </h1>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body">
            <div className="d-flex justify-content-between text-bg-secondary p-3 rounded-3 mb-2">
              <div>
                <p className="mb-2">
                  Schedule Name : <strong>{matchDetails.schedule_name}</strong>
                </p>
                <p className="mb-2">
                  Group Name : <strong>{matchDetails.group_name}</strong>
                </p>
                <p className="mb-2">
                  Scheduled Date : <strong>{matchDetails.startDate}</strong> to{' '}
                  <strong>{matchDetails.endDate}</strong>
                </p>
              </div>
              <div>Today : {new Date().toLocaleDateString()}</div>
            </div>

            <div style={{ height: '55vh' }}>
              <ul
                className="nav nav-pills mb-0 text-bg-light rounded-3 rounded-bottom-0 p-1"
                id="pills-tab"
                role="tablist"
              >
                {poolData.map((pool: any, index: number) => (
                  <li className="nav-item" role="presentation">
                    <button
                      className={`nav-link ${index === 0 ? 'active' : ''}`}
                      id={'pills-pool-tab-' + index}
                      data-bs-toggle="pill"
                      data-bs-target={'#pills-pool-' + index}
                      type="button"
                      role="tab"
                      aria-controls={'pills-pool-' + index}
                      aria-selected="true"
                    >
                      Pool-{pool}
                    </button>
                  </li>
                ))}
              </ul>
              <div
                className="tab-content rounded-3 rounded-top-0"
                id="pills-tabContent"
              >
                {poolData.map((pool: any, index: number) => (
                  <div
                    className={`tab-pane p-2 fade ${
                      index === 0 ? 'show active' : ''
                    }`}
                    id={'pills-pool-' + index}
                    role="tabpanel"
                    aria-labelledby={'pills-pool-tab-' + index}
                    tabIndex={0}
                  >
                    <div className="container-fluid">
                      <div className="row row-cols-1 row-cols-sm-2 row-cols-md-2 g-3">
                        {matchDetails?.pool.map(
                          (item: any, index: number) =>
                            item.pool_id === pool && (
                              <div className="col">
                                <h6 className="">
                                  Round-{item.match_id + 1}
                                </h6>
                                <div className="d-flex justify-content-between text-bg-light p-3 rounded-3 mb-2">
                                  <div style={{ textTransform: 'capitalize' }}>
                                    <p className="mb-2">{item.team_1[0]}</p>
                                    <p className="mb-2">{item.team_1[1]}</p>
                                  </div>
                                  <div>
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      viewBox="0 0 24 24"
                                      width={64}
                                      height={64}
                                      color={'#2ec4b6'}
                                      fill={'none'}
                                    >
                                      <path
                                        d="M22 6.75003H19.2111C18.61 6.75003 18.3094 6.75003 18.026 6.66421C17.7426 6.5784 17.4925 6.41168 16.9923 6.07823C16.2421 5.57806 15.3862 5.00748 14.961 4.87875C14.5359 4.75003 14.085 4.75003 13.1833 4.75003C11.9571 4.75003 11.1667 4.75003 10.6154 4.97839C10.0641 5.20675 9.63056 5.6403 8.76347 6.50739L8.00039 7.27047C7.80498 7.46588 7.70727 7.56359 7.64695 7.66005C7.42335 8.01764 7.44813 8.47708 7.70889 8.80854C7.77924 8.89796 7.88689 8.98459 8.10218 9.15785C8.89796 9.79827 10.0452 9.73435 10.7658 9.00945L12 7.76789H13L19 13.8036C19.5523 14.3592 19.5523 15.2599 19 15.8155C18.4477 16.3711 17.5523 16.3711 17 15.8155L16.5 15.3125M13.5 12.2947L16.5 15.3125M16.5 15.3125C17.0523 15.8681 17.0523 16.7689 16.5 17.3244C15.9477 17.88 15.0523 17.88 14.5 17.3244L13.5 16.3185M13.5 16.3185C14.0523 16.874 14.0523 17.7748 13.5 18.3304C12.9477 18.8859 12.0523 18.8859 11.5 18.3304L10 16.8214M13.5 16.3185L11.5 14.3185M9.5 16.3185L10 16.8214M10 16.8214C10.5523 17.377 10.5523 18.2778 10 18.8334C9.44772 19.3889 8.55229 19.3889 8 18.8334L5.17637 15.9509C4.59615 15.3586 4.30604 15.0625 3.93435 14.9062C3.56266 14.75 3.14808 14.75 2.31894 14.75H2"
                                        stroke="currentColor"
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                      />
                                      <path
                                        d="M22 14.75H19.5"
                                        stroke="currentColor"
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                      />
                                      <path
                                        d="M8.5 6.75003L2 6.75003"
                                        stroke="currentColor"
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                      />
                                    </svg>
                                  </div>
                                  <div style={{ textTransform: 'capitalize' }}>
                                    <p className="mb-2">{item.team_2[0]}</p>
                                    <p className="mb-2">{item.team_2[1]}</p>
                                  </div>
                                </div>
                              </div>
                            )
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="table-response"></div>
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
