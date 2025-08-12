import { useState } from 'react';
import Swal from 'sweetalert2';
import * as bootstrap from 'bootstrap';
import http from '../services/http.services';
import { API_BASE_URL } from '../config';

export const UserProfileCanvas = () => {
  const [isEdit, setIsEdit] = useState(false);

  const {
    user_email,
    user_fname,
    user_lname,
    user_phone,
    user_dob,
    user_age,
    user_address,
    user_image,
    user_rating,
    user_country,
  } = JSON.parse(localStorage.getItem('user') || '{}');

  const [userProfile, setUserProfile] = useState({
    user_email: user_email,
    user_fname: user_fname,
    user_lname: user_lname,
    user_mname: 'test',
    user_phone: user_phone,
    user_dob: user_dob,
    user_age: user_age,
    user_address: user_address,
    map_location: '',
    user_map_latitude: '',
    user_map_longitude: '',
    user_rating: user_rating,
    user_country: user_country,

  });
  const showFileUpdload = (args: any) => {
    //setSelectedGroup(args);
    const userPhotoModal = new bootstrap.Modal(
      document.getElementById('profileImageModal') as HTMLElement
    );
    userPhotoModal.show();
  };
  const updateProfile = (event: any) => {
    event.preventDefault();

    http.post('/api_user_update_profile.php', userProfile)
      .then((response) => {
        if (response.data.status !== 'ERROR') {
          Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'Profile updated successfully',
          }).then((result) => {
            if (result.isConfirmed) {
              localStorage.clear();
              window.location.reload();
            }
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: response.data.description,
          });
        }
      })
      .catch((error) => {
        console.error('There was an error!', error);
      });

  };

  const uploadGroupImage = (e: any) => {
    e.preventDefault();
    const profileImage: any = document.getElementById(
      'profileImage'
    ) as HTMLInputElement;
    const formData = new FormData();
    //formData.append('group_id', groupDetails.group_id);
    //formData.append('image_code', '1');
    formData.append('file', profileImage.files[0]);

    http.post(`/api_file_upload.php?image_parameter=${''}&image_code=0`, formData)
      .then((response) => {
        if (response.data.status !== 'ERROR') {
          Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'Group image uploaded successfully',
          }).then((result) => {
            if (result.isConfirmed) {
              window.location.reload();
            }
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: response.data.description,
          });
        }
      })
      .catch((error) => {
        console.error('There was an error!', error);
      });
  };

  return (
    <>
      <div
        className="offcanvas offcanvas-end"
        tabIndex={-1}
        id="userProfileCanvas"
        data-bs-backdrop="static"
        aria-labelledby="userProfileCanvasLabel"
        style={{ width: '520px' }}
      >
        <div className="offcanvas-header">
          <h5 className="offcanvas-title" id="userProfileCanvasLabel">
            User Profile
          </h5>
          <button
            type="button"
            className="btn-close"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
          ></button>
        </div>
        <div className="offcanvas-body">
          <div className="d-flex justify-content-center">
            <div className="profileWrap">
              <img
                src={`${API_BASE_URL}/${user_image}`}
                alt="profile"
                className="rounded-circle border border-2 border-dark"
                width={72}
                height={72}
                onClick={(e) => showFileUpdload(e)}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.onerror = null;
                  target.src = 'user_avatar.png';
                }}
              />
            </div>

          </div>
          <button className='btn btn-sm btn-dark' onClick={() => setIsEdit(true)}>Edit</button>
          <form className="row g-3 mt-3" onSubmit={(e) => updateProfile(e)}>
            <div className="col-md-6">
              <label htmlFor="inputFirstName" className="form-label">
                First Name
              </label>
              <input
                type="text"
                className={`form-control`}
                id="inputFirstName"
                value={userProfile.user_fname ?? ''}
                onChange={(e) =>
                  setUserProfile({ ...userProfile, user_fname: e.target.value })
                }
                disabled={!isEdit}
              />
            </div>
            <div className="col-md-6">
              <label htmlFor="inputLastName" className="form-label">
                Last Name
              </label>
              <input
                type="text"
                disabled={!isEdit}
                className="form-control"
                id="inputLastName"
                value={userProfile.user_lname || ''}
                onChange={(e) =>
                  setUserProfile({ ...userProfile, user_lname: e.target.value })
                }
              />
            </div>
            <div className="col-md-12">
              <label htmlFor="inputMiddleName" className="form-label">
                Nick Name
              </label>
              <input
                type="text"
                disabled={!isEdit}
                className="form-control"
                id="inputMiddleName"
                value={userProfile.user_mname || ''}
                onChange={(e) =>
                  setUserProfile({ ...userProfile, user_mname: e.target.value })
                }
              />
            </div>
            <div className="col-md-12">
              <label htmlFor="inputEmail" className="form-label">
                Email
              </label>
              <input
                type="email"
                disabled={!isEdit}
                className="form-control"
                id="inputEmail"
                value={userProfile.user_email || ''}
                onChange={(e) =>
                  setUserProfile({ ...userProfile, user_email: e.target.value })
                }
              />
            </div>
            <div className="col-md-12">
              <label htmlFor="inputPhone" className="form-label">
                Phone
              </label>
              <input
                type="text"
                disabled={!isEdit}
                className="form-control"
                id="inputPhone"
                value={userProfile.user_phone || ''}
                onChange={(e) =>
                  setUserProfile({ ...userProfile, user_phone: e.target.value })
                }
              />
            </div>

            <div className="col-md-6">
              <label htmlFor="inputRating" className="form-label">
                Player rating
              </label>
              <input
                type="text"
                className="form-control"
                disabled={!isEdit}
                id="inputRating"
                value={userProfile.user_rating}
                onChange={(e) =>
                  setUserProfile({
                    ...userProfile,
                    user_rating: e.target.value,
                  })
                }
              />
            </div>
            <hr />


            <div className="col-md-12">
              <label htmlFor="inputAddressLine1" className="form-label">
                Address Line 1
              </label>
              <input
                type="text"
                className="form-control"
                id="inputAddressLine1"
                value={''}
                disabled={!isEdit}
              />
            </div>
            <div className="col-md-12">
              <label htmlFor="inputAddressLine2" className="form-label">
                Address Line 2
              </label>
              <input
                type="text"
                className="form-control"
                id="inputAddressLine2"
                value={''}
                disabled={!isEdit}
              />
            </div>
            <div className="col-md-6">
              <label htmlFor="inputCity" className="form-label">
                City
              </label>
              <input
                type="text"
                className="form-control"
                id="inputCity"
                value={''}
                disabled={!isEdit}
              />
            </div>
            <div className="col-md-6">
              <label htmlFor="inputState" className="form-label">
                State/Province/Region
              </label>
              <input
                type="text"
                className="form-control"
                id="inputState"
                value={''}
                disabled={!isEdit}
              />
            </div>
            <div className="col-md-6">
              <label htmlFor="inputZip" className="form-label">
                ZIP/Postal Code
              </label>
              <input
                type="text"
                className="form-control"
                id="inputZip"
                value={''}
                disabled={!isEdit}
              />
            </div>
            <div className="col-md-6">
              <label htmlFor="selectCountry" className="form-label">
                Country
              </label>
              <select
                id="selectCountry"
                disabled={!isEdit}
                className="form-select"
                value={userProfile.user_country}
                onChange={(e) =>
                  setUserProfile({
                    ...userProfile,
                    user_country: e.target.value,
                  })
                }
              >
                <option value={''}>Choose...</option>
                <option>United States</option>
              </select>
            </div>
            <hr />
            <div className="col-md-6">
              <label htmlFor="inputDOB" className="form-label">
                Date of Birth
              </label>
              <input
                type="date"
                className="form-control"
                disabled={!isEdit}
                id="inputDOB"
                value={userProfile.user_dob || ''}
                onChange={(e) =>
                  setUserProfile({ ...userProfile, user_dob: e.target.value })
                }
              />
            </div>
            <div className="col-md-6">
              <label htmlFor="inputAge" className="form-label">
                Age<small>(Optional)</small>
              </label>
              <input
                type="number"
                className="form-control"
                id="inputAge"
                disabled={!isEdit}
                value={userProfile.user_age || ''}
                onChange={(e) =>
                  setUserProfile({ ...userProfile, user_age: e.target.value })
                }
              />
            </div>
            <div className="col-md-12">
              <label htmlFor="inputAddress" className="form-label">
                Address
              </label>
              <input
                type="text"
                className="form-control"
                id="inputAddress"
                disabled={!isEdit}
                value={userProfile.user_address || ''}
                onChange={(e) =>
                  setUserProfile({
                    ...userProfile,
                    user_address: e.target.value,
                  })
                }
              />
            </div>
            <div className="col-md-12">
              <label htmlFor="inputLocation" className="form-label">
                Map location
              </label>
              <input
                type="text"
                className="form-control"
                id="inputLocation"
                disabled={!isEdit}
                value={userProfile.map_location}
                onChange={(e) =>
                  setUserProfile({
                    ...userProfile,
                    map_location: e.target.value,
                  })
                }
              />
            </div>

            <div className="col-12 text-center">
              {
                userProfile.user_fname === '' ||
                  userProfile.user_lname === '' ||
                  userProfile.user_email === '' ||
                  userProfile.user_phone === '' ||
                  userProfile.user_dob === '' ||
                  userProfile.user_address === '' ||
                  userProfile.user_rating === '' ? (
                  <button type="submit" className="btn btn-primary disabled">
                    Update profile
                  </button>
                ) : (
                  <button type="submit" className="btn btn-success">
                    Update profile
                  </button>
                )}
            </div>
          </form>
        </div>
      </div>

      <div
        className="modal fade"
        id="profileImageModal"
        tabIndex={-1}
        aria-labelledby="profileImageModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="profileImageModalLabel">
                Modal title
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <form action="" onSubmit={(e) => uploadGroupImage(e)}>
                <div className="mb-3">
                  <label htmlFor="profileImage" className="form-label">
                    Select image
                  </label>
                  <input
                    type="file"
                    className="form-control"
                    id="profileImage"
                  />
                </div>
                <div>
                  <button type="submit" className="btn btn-success">
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
};
