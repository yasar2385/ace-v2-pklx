import { useSelector } from "react-redux";
import { API_BASE_URL } from "../../config";

export function ViewGroup() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const groupDetails = useSelector((state: any) => state.groupDetails);
  console.log(groupDetails);
  return (
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
              Group - {groupDetails?.group_name}
            </h1>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body">
            <div className="card mb-3">
              <img
                src={API_BASE_URL + "/" + groupDetails?.group_photo_id}
                className="card-img-top"
                alt="..."
                height={360}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.onerror = null;
                  target.src =
                    'https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png';
                }}
              />
              <div className="card-body">
                <h5 className="card-title">{groupDetails?.group_name}</h5>
                <p className="card-text">{groupDetails?.group_description}</p>
                {/* <p className="card-text"><small className="text-body-secondary">Last updated 3 mins ago</small></p> */}
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
  )
}