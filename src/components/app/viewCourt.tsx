import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import http from '../../services/http.services';
import { API_BASE_URL } from '../../config';

export const ViewCourt = (props: any) => {
  const location = useLocation();
  const [courtDetails, setCourtDetails] = useState<any>({
    court_photos: [],
  });

  const getCourtById = async (id: number) => {

    http.post("/api_get_court.php", { court_id: id })
      .then((response: any) => {
        setCourtDetails(response.data);
      })
      .catch((error) => {
        console.error('Error:', error);
      })
  };

  useEffect(() => {
    getCourtById(location.state.court_id);
  }, []);

  return (
    <div
      className="modal fade"
      id="courtViewModal"
      tabIndex={-1}
      aria-labelledby="courtViewModalLabel"
      aria-hidden="true"
      data-bs-backdrop="static"
      data-bs-keyboard="false"
    >
      <div className="modal-dialog modal-dialog-centered modal-xl">
        <div className="modal-content">
          <div className="modal-header">
            <h1 className="modal-title fs-5" id="courtViewModalLabel">
              View Court Details
            </h1>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body">
            <div className="container-fluid">
              <div className="row">
                <div className="col">
                  <table className="table table-bordered">
                    <tbody>
                      <tr>
                        <td className='fw-bold'>
                          Court Name
                        </td>
                        <td>
                          {courtDetails.court_name}
                        </td>
                      </tr>
                      <tr>
                        <td className='fw-bold'>
                          Description
                        </td>
                        <td>
                          {courtDetails.court_description}
                        </td>
                      </tr>
                      <tr>
                        <td className='fw-bold'>
                          Indoor Count
                        </td>
                        <td>
                          {courtDetails.court_indoor_count}
                        </td>
                      </tr>
                      <tr>
                        <td className='fw-bold'>
                          Outdoor Count
                        </td>
                        <td>
                          {courtDetails.court_outdoor_count}
                        </td>
                      </tr>
                      <tr>
                        <td className='fw-bold'>
                          Address
                        </td>
                        <td>
                          {courtDetails.court_address}
                        </td>
                      </tr>
                      <tr>
                        <td className='fw-bold'>
                          Court Notes
                        </td>
                        <td>
                          {courtDetails.court_note}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="col">
                  <div className="mb-0">
                    <div id="carouselExample" className="carousel slide">
                      <div className="carousel-inner">
                        {courtDetails.court_photos.map(
                          (photo: any, index: number) => (
                            <div
                              className={`carousel-item ${index === 0 ? 'active' : ''
                                }`}
                              key={index}
                            >
                              <img
                                src={`${API_BASE_URL}${photo}`}
                                className="d-block w-100"
                                alt={`Slide ${index + 1}`}
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.onerror = null;
                                  target.src =
                                    'https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png';
                                }}
                              />
                            </div>
                          )
                        )}
                      </div>
                      <button
                        className="carousel-control-prev"
                        type="button"
                        data-bs-target="#carouselExample"
                        data-bs-slide="prev"
                      >
                        <span
                          className="carousel-control-prev-icon"
                          aria-hidden="true"
                        ></span>
                        <span className="visually-hidden">Previous</span>
                      </button>
                      <button
                        className="carousel-control-next"
                        type="button"
                        data-bs-target="#carouselExample"
                        data-bs-slide="next"
                      >
                        <span
                          className="carousel-control-next-icon"
                          aria-hidden="true"
                        ></span>
                        <span className="visually-hidden">Next</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
