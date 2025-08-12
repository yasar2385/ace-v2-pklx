import { useEffect } from "react";

export const PlayerSummary = (props : any) => {
  const {accept, reject, cancelled, notRespond, total} = props._data;

  useEffect(() => {
    console.log('Player Summary', props);
  },[])
  return (
    <div
      className="modal fade"
      id="playerSummaryModal"
      data-bs-backdrop="static"
      data-bs-keyboard="false"
      tabIndex={-1}
      aria-labelledby="playerSummaryModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h1 className="modal-title fs-5" id="playerSummaryModalLabel">
              Player's Summary
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
                    <th>Status</th>
                    <th>Count</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Accepted</td>
                    <td>{accept}</td>
                  </tr>
                  <tr>
                    <td>Rejected</td>
                    <td>{reject}</td>
                  </tr>
                  <tr>
                    <td>Not Responded</td>
                    <td>{notRespond}</td>
                  </tr>
                  <tr>
                    <td>Cancelled</td>
                    <td>{cancelled}</td>
                  </tr>
                  <tr className="table-secondary fw-bold">
                    <td>Total</td>
                    <td>{total}</td>
                  </tr>
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
