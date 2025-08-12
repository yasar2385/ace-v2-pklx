import { Password } from 'primereact/password';
import { FloatLabel } from 'primereact/floatlabel'
import { useEffect, useState } from 'react';
import {
  Link,
  useNavigate,
} from 'react-router-dom';
import Swal from 'sweetalert2';
import http from '../services/http.services';

export function ForgotPassword() {

  const [resetPwd, setResetPwd] = useState({
    user_email: '',
    user_otp: '',
    user_password: '',
    user_new_password: '',
  });

  const navigate = useNavigate();
  const [checkEmail, setCheckEmail] = useState(false);
  const [stepOne, setStepOne] = useState(false);

  const resetPassword = (e: any) => {
    e.preventDefault();

    if (e.nativeEvent.submitter.name === 'sendOtp') {
      // setResetPwd({
      //   ...resetPwd,
      //   user_email : userRequest.user_authparameter
      // })
      setStepOne(true);
    } else {

      http.post('api_check_otp.php',
        {
          user_email: resetPwd.user_email,
          user_otp: resetPwd.user_otp,
          new_password: resetPwd.user_password
        }
      )
        .then((response) => {
          console.log(response);
          if (response.data.status === 'STATUS OK') {
            Swal.fire({
              text: 'Password reset successfully',
              icon: 'success',
              confirmButtonText: 'Ok',
            }).then((result) => {
              if (result.isConfirmed) {
                navigate('/login');
              }
            });
          } else {
            Swal.fire({
              text: response.data,
              icon: 'error',
              confirmButtonText: 'Ok',
            });
          }
        })
    };
  }
  useEffect(() => {
    if (localStorage.getItem('isLoggedIn')) {
      navigate('/ap/club-league/clubs');
    }
    document.title = 'Login | PKLX';
    document.getElementsByTagName('body')[0].classList.add('loginLayout');

    return () => {
      document.getElementsByTagName('body')[0].classList.remove('loginLayout');
    };
  });
  return (

    <main className="form-signin w-100 m-auto bg-white rounded-4 position-relative">
      <Link
        className="btn-close"
        to={'/login'}
        style={{
          width: '32px',
          height: '32px',
          textAlign: 'center',
          position: 'absolute',
          right: '10px',
          top: '10px',
          padding: '3px',
        }}
      ></Link>

      {/* {stepOne && ( */}
      <form onSubmit={(e) => resetPassword(e)}>
        <img
          className="mb-4"
          src="./Logo-Green-Trans.png"
          alt="Ace Pickl Logo"
          width={180}
        />
        <h1 className="h3 mb-3 fw-bold">Welcome to ACE PICKL</h1>
        <div className="form-floating mb-3">
          <input
            type="email"
            className="form-control"
            id="floatingInput"
            placeholder="name@example.com/000000000"
            value={resetPwd.user_email}
            onChange={(e) =>
              setResetPwd({
                ...resetPwd,
                user_email: e.target.value,
              })
            }
            readOnly={stepOne}
            onBlur={(e) =>
              setCheckEmail(e.target.value.length === 0 ? true : false)
            }
          />
          <label htmlFor="floatingInput">Email address/Phone number</label>
          {resetPwd.user_email.length === 0 && checkEmail && (
            <div className="text-danger">
              Please enter a valid email address or phone number.
            </div>
          )}
        </div>
        {stepOne && (
          <>
            <div className="form-floating mb-4">
              <input
                type="text"
                className="form-control"
                id="floatingOTP"
                placeholder="OTP"
                autoComplete="current-name"
                value={resetPwd.user_otp}
                maxLength={6}
                onChange={(e) =>
                  setResetPwd({
                    ...resetPwd,
                    user_otp: e.target.value,
                  })
                }
              />
              <label htmlFor="floatingOTP">OTP</label>
            </div>
            <div className="mb-4">
              <FloatLabel>
                <Password
                  promptLabel="Please enter a password"
                  weakLabel="Weak"
                  mediumLabel="Medium"
                  strongLabel="Strong"
                  inputId="floatingPassword"
                  inputClassName='form-control form-control-lg p-3'
                  feedback={true}
                  toggleMask={true}
                  value={resetPwd.user_password}
                  onChange={(e: any) =>
                    setResetPwd({
                      ...resetPwd,
                      user_password: e.target.value,
                    })
                  }

                />
                <label htmlFor="floatingPassword">Password</label>
              </FloatLabel>
              {/* <label htmlFor="floatingPassword">New Password</label> */}
              {resetPwd.user_password.length > 0 &&
                resetPwd.user_password.length < 6 && (
                  <div className="text-danger">
                    Please enter a valid password.
                  </div>
                )}
            </div>
            <div className="mb-4">
              <FloatLabel>
                <Password
                  promptLabel="Please enter a password"
                  weakLabel="Weak"
                  mediumLabel="Medium"
                  strongLabel="Strong"
                  inputId="floatingConfirmPassword"
                  inputClassName='form-control form-control-lg p-3'
                  feedback={true}
                  toggleMask={true}
                  value={resetPwd.user_new_password}
                  onChange={(e) =>
                    setResetPwd({
                      ...resetPwd,
                      user_new_password: e.target.value,
                    })
                  }

                />
                <label htmlFor="floatingConfirmPassword">
                  Confirm Password
                </label>
              </FloatLabel>
              {resetPwd.user_new_password.length > 0 &&
                resetPwd.user_new_password.length < 6 && (
                  <div className="text-danger">
                    Please enter a valid password.
                  </div>
                )}
            </div>
          </>
        )}
        <div className="d-grid gap-2">
          {stepOne ? (
            <button
              name="resetPassword"
              type="submit"
              className={"btn btn-success"}
            >
              Reset Password
            </button>
          ) : (
            <button
              name="sendOtp"
              type="submit"
              className={"btn btn-success" + (resetPwd.user_email.length === 0 ? ' disabled' : '')}
            >
              Send OTP
            </button>
          )}
        </div>
      </form>
      {/* //)} */}
    </main>

  );
}