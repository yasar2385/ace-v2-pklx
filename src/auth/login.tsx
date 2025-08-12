
import React, { useState, useEffect } from 'react';
import { Password } from "primereact/password";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import http from "../services/http.services";


export function Login() {
  const [userRequest, setUserRequest] = useState({
    user_authcode: 1,
    user_authparameter: "",
    user_password: "",
  });

  const [checkEmail, setCheckEmail] = useState(false);
  const [checkPassword, setCheckPassword] = useState(false);

  const navigate = useNavigate();

  const appLogin = () => {
    // setIsSubmitted(true); // Disable autofill checks
    // if (observerRef.current) {
    //   observerRef.current.disconnect();
    // }
    setUserRequest({
      ...userRequest,
      user_authcode: userRequest.user_authparameter.includes("@") ? 1 : 0,
    });

    http
      .post("/api_user_login.php", userRequest)
      .then((response: any) => {
        const { data } = response;
        if (data.status === "STATUS OK") {
          localStorage.setItem("isLoggedIn", "true");
          localStorage.setItem("user", JSON.stringify(data));
          navigate("/ace/landing");
        } else {
          Swal.fire({
            icon: "error",
            title: "ERROR",
            text: data.description,
          });
        }
      })
      .catch((error) => {
        // setIsSubmitted(false); // Re-enable autofill checks if login fails
        console.error("There was an error!", error);
      });
  };

  useEffect(() => {
    if (localStorage.getItem("isLoggedIn")) {
      navigate("/ap/club-league/clubs");
    }

    document.title = "Login | ACE PICKL";
    document.getElementsByTagName("body")[0].classList.add("loginLayout");

    return () => {
      document.getElementsByTagName("body")[0].classList.remove("loginLayout");
    };
  });
  // const observerRef = useRef(null);
  // const [isSubmitted, setIsSubmitted] = useState(false);
  // const timeoutRef = useRef(null);
  // const isAutofillCheckingRef = useRef(false);

  // // Autofill check function
  // const checkAutofill = useCallback(() => {
  //   if (isSubmitted || isAutofillCheckingRef.current) return;

  //   isAutofillCheckingRef.current = true;
  //   const emailInput = document.getElementById('username');
  //   const passwordInput = document.getElementById('floatingPassword');

  //   if (emailInput?.value || passwordInput?.value) {
  //     setUserRequest(prev => ({
  //       user_authparameter: emailInput?.value || prev.user_authparameter,
  //       user_password: passwordInput?.value || prev.user_password
  //     }));
  //   }

  //   // Reset flag after delay
  //   timeoutRef.current = setTimeout(() => {
  //     isAutofillCheckingRef.current = false;
  //   }, 500);
  // }, [isSubmitted]);

  // // Use useLayoutEffect to run once on mount
  // useLayoutEffect(() => {
  //   console.log("useLayoutEffec");
  //   // Initial check
  //   checkAutofill();

  //   // Setup observer only once
  //   observerRef.current = new MutationObserver(() => {
  //     if (timeoutRef.current) {
  //       clearTimeout(timeoutRef.current);
  //     }
  //     timeoutRef.current = setTimeout(checkAutofill, 100);
  //   });

  //   observerRef.current.observe(document.body, {
  //     subtree: true,
  //     attributes: true,
  //     attributeFilter: ['value', 'style'],
  //   });

  //   // Cleanup function
  //   return () => {
  //     observerRef.current?.disconnect();
  //     if (timeoutRef.current) {
  //       clearTimeout(timeoutRef.current);
  //     }
  //   };
  // }, []); // Empty dependency array ensures single run


  return (
    <main className="form-signin w-100 m-auto bg-white rounded-4 position-relative">
      <Link
        className="btn-close"
        to={"/"}
        style={{
          width: "32px",
          height: "32px",
          textAlign: "center",
          position: "absolute",
          right: "10px",
          top: "10px",
          padding: "3px",
        }}
      ></Link>

      <form
        action="#"
        onSubmit={(e) => {
          e.preventDefault();
          appLogin();
        }}
      >
        <img
          className="mb-4"
          src="./Logo-Green-Trans.png"
          alt="Ace Pickl Logo"
          width={180}
        />
        <h1 className="h3 mb-4 fw-bold">Welcome to ACE PICKL</h1>
        <div className="mb-3 d-none">
          <div className="form-check form-check-inline">
            <input
              className="form-check-input"
              type="radio"
              name="userType"
              id="userTYpe2"
              value="admin"
            />
            <label className="form-check-label" htmlFor="userType2">
              Admin
            </label>
          </div>
          <div className="form-check form-check-inline">
            <input
              className="form-check-input"
              type="radio"
              name="userType"
              id="userTYpe1"
              value="player"
            />
            <label className="form-check-label" htmlFor="userType1">
              Player
            </label>
          </div>
        </div>
        {/* <InputText
            id="floatingInput"
            className="form-control form-control-lg rounded-1"
            value={userRequest.user_authparameter}
            onChange={(e) =>
              setUserRequest({
                ...userRequest,
                user_authparameter: e.target.value,
              })
            }
            onBlur={(e) =>
              e.target.value.length === 0
                ? setCheckEmail(true)
                : setCheckEmail(false)
            }
          /> */}
        <div className="mb-3">
          <label htmlFor="floatingInput">Email/Phone number</label>
          <input
            type="text"
            className="form-control rounded-1"
            id="floatingInput"
            placeholder=""
            value={userRequest.user_authparameter}
            onChange={(e) =>
              setUserRequest({
                ...userRequest,
                user_authparameter: e.target.value,
              })
            }
            onBlur={(e) =>
              e.target.value.length === 0
                ? setCheckEmail(true)
                : setCheckEmail(false)
            }
          />

          {userRequest.user_authparameter.length === 0 && checkEmail && (
            <small className="text-danger">
              Please enter a valid email address.
            </small>
          )}
        </div>
        <div className="mb-3">
          <label htmlFor="floatingPassword">Password</label>
          <Password
            promptLabel="Please enter a password"
            weakLabel="Weak"
            mediumLabel="Medium"
            strongLabel="Strong"
            inputId="floatingPassword"
            inputClassName="form-control rounded-1"
            feedback={false}
            toggleMask={true}
            value={userRequest.user_password}
            onChange={(e) =>
              setUserRequest({
                ...userRequest,
                user_password: e.target.value,
              })
            }
            onBlur={(e) =>
              e.target.value.length === 0
                ? setCheckPassword(true)
                : setCheckPassword(false)
            }
          />

          {userRequest.user_password.length > 0 && checkPassword && (
            <div className="text-danger">Please enter a valid password.</div>
          )}
        </div>
        <div className="d-flex justify-content-end">
          <div className="form-check text-start my-3 d-none">
            <input
              className="form-check-input"
              type="checkbox"
              value="remember-me"
              id="flexCheckDefault"
            />
            <label className="form-check-label" htmlFor="flexCheckDefault">
              Remember me
            </label>
          </div>
          <Link
            to={"/forgotPassword"}
            className="mb-3 link-primary text-decoration-none"
          >
            Forgot password?
          </Link>
        </div>
        {userRequest.user_authparameter.length > 0 &&
          userRequest.user_password.length > 0 ? (
          <button className="btn btn-success w-100 py-2 mb-3" type="submit">
            Sign in
          </button>
        ) : (
          <>
            {/* <div className="alert alert-danger" role='alert'>
                Please enter valid email address or phone number and password.
              </div> */}
            <button
              className="btn btn-success w-100 py-2 mb-3 disabled"
              type="submit"
            >
              Sign in
            </button>
          </>
        )}

        {/* <p className="mt-5 mb-3 text-body-secondary">© 2017–2024</p> */}
        <p className="mb-3 text-body-secondary text-center">
          Don't have an account?{" "}
          <Link to={"/register"} className="">
            Register
          </Link>
        </p>
      </form>
    </main>
  );
}
