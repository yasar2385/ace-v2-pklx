import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Form, Row, Col, Button, Modal } from 'react-bootstrap';
import Swal from 'sweetalert2';
import http from '../services/http.services';
import { FaEye, FaEyeSlash } from 'react-icons/fa'; // For eye icons (optional)


interface FormData {
  user_email: string;
  user_phone: string;
  user_fname: string;
  user_lname: string;
  user_password: string;
  user_confirm_password: string;
  terms_accepted: boolean;
  user_dominant_hand: string;
  user_gender: string;
  user_nickname: string;
  user_dob: string;
}

const UserRegistration = () => {
  const navigate = useNavigate();
  const [validated, setValidated] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    user_email: '',
    user_phone: '',
    user_fname: '',
    user_lname: '',
    user_password: '',
    user_confirm_password: '',
    terms_accepted: false,
    user_dominant_hand: '-1',
    user_gender: 'm',
    user_nickname: '',
    user_dob: ""
  });

  const [errors, setErrors] = useState({
    user_email: '',
    user_phone: '',
    user_fname: '',
    user_lname: '',
    user_password: '',
    user_confirm_password: '',
    user_nickname: '',
    user_dob: ""
  });

  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const validateField = (name: string, value: string): string => {
    switch (name) {
      case 'user_email':
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? '' : 'Invalid email address';
      case 'user_phone':
        return /^[0-9]\d{9}$/.test(value) ? '' : 'Phone number must be exactly 10 digits';
      case 'user_fname':
      case 'user_lname':
        return /^[a-zA-Z]+$/.test(value) && value.length >= 2
          ? ''
          : `${name === 'user_fname' ? 'First' : 'Last'} name must be at least 2 characters and contain only letters`;
      case 'user_password':
        return value.length >= 8 ? '' : 'Password must be at least 8 characters';
      case 'user_confirm_password':
        return value === formData.user_password ? '' : 'Passwords must match';
      default:
        return '';
    }
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    const fieldValue = type === 'checkbox' ? checked : value;

    setFormData(prev => ({ ...prev, [name]: fieldValue }));

    if (type !== 'checkbox') {
      setErrors(prev => ({ ...prev, [name]: validateField(name, value) }));
    }
  };
  const validateForm = (): boolean => {
    let isValid = true;
    const newErrors = { ...errors };

    Object.keys(formData).forEach((key) => {
      if (key in errors) {
        const error = validateField(key, formData[key as keyof FormData].toString());
        newErrors[key as keyof typeof errors] = error;
        if (error) isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setValidated(true);

    if (!validateForm() || !termsAccepted) {
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await http.post('api_user_signin.php', {
        ...formData,
        terms_accepted: termsAccepted
      });

      if (response.data.status === 'STATUS OK') {
        Swal.fire({
          title: 'Registered Successfully',
          text: 'Please login to continue',
          icon: 'success',
          confirmButtonText: 'Ok'
        }).then((result) => {
          if (result.isConfirmed) {
            navigate('/login');
          }
        });
      } else {
        Swal.fire({
          title: 'Error',
          text: response.data.status,
          icon: 'error',
          confirmButtonText: 'Ok'
        });
      }
    } catch (error) {
      console.error('Registration error:', error);
      Swal.fire({
        title: 'Error',
        text: 'An error occurred during registration',
        icon: 'error',
        confirmButtonText: 'Ok'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTermsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { checked } = e.target;
    setTermsAccepted(checked);
    setFormData(prev => ({ ...prev, terms_accepted: checked }));
  };

  const handleTermsClick = () => setShowTermsModal(true);

  const handleTermsModalResponse = (accepted: boolean) => {
    setShowTermsModal(false);
    setTermsAccepted(accepted);
    setFormData(prev => ({ ...prev, terms_accepted: accepted }));
  };

  useEffect(() => {
    if (localStorage.getItem('isLoggedIn')) {
      navigate('/ap/club-league/clubs');
    }
    document.title = 'Register | ACEPickl';
    document.body.classList.add('loginLayout');
    return () => {
      document.body.classList.remove('loginLayout');
    };
  }, [navigate]);


  return (
    <>
      <main className="form-signin w-100 m-auto bg-white rounded-4 position-relative p-4">
        <Link
          className="btn-close"
          to="/"
          style={{
            width: '32px',
            height: '32px',
            textAlign: 'center',
            position: 'absolute',
            right: '10px',
            top: '10px',
            padding: '3px'
          }}
        />

        <Form noValidate validated={validated} onSubmit={handleSubmit}>
          <div className="text-center mb-4">
            {/* <img className="mb-3" src="./Logo-Green-Trans.png" alt="Ace Pickl Logo" width={100} /> */}
            <h1 className="h4 fw-bold">Welcome to ACE PICKL</h1>
          </div>

          <Row className="g-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label>First Name</Form.Label>
                <Form.Control
                  required
                  type="text"
                  name="user_fname"
                  value={formData.user_fname}
                  onChange={handleChange}
                  isInvalid={!!errors.user_fname}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.user_fname || 'First name is required'}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group>
                <Form.Label>Last Name</Form.Label>
                <Form.Control
                  required
                  type="text"
                  name="user_lname"
                  value={formData.user_lname}
                  onChange={handleChange}
                  isInvalid={!!errors.user_lname}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.user_lname || 'Last name is required'}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={6} className='d-none'>
              <Form.Group>
                <Form.Label>Nick Name</Form.Label>
                <Form.Control
                  type="text"
                  name="user_nickname"
                  value={formData.user_nickname}
                  onChange={handleChange}
                  isInvalid={!!errors.user_nickname}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.user_nickname || 'Nick name is required'}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={6} className='d-none'>
              <Form.Group>
                <Form.Label>Date of Birth</Form.Label>
                <Form.Control
                  type="date"
                  name="user_dob"
                  value={formData.user_dob}
                  onChange={handleChange}
                  isInvalid={!!errors.user_dob}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.user_dob || 'date of birth is required'}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>

            <Col xs={12}>
              <Form.Group>
                <Form.Label>Email</Form.Label>
                <Form.Control
                  required
                  type="email"
                  name="user_email"
                  value={formData.user_email}
                  onChange={handleChange}
                  isInvalid={!!errors.user_email}
                  autoComplete="off"
                />
                <Form.Control.Feedback type="invalid">
                  {errors.user_email || 'Email is required'}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>

            <Col xs={12}>
              <Form.Group>
                <Form.Label>Phone</Form.Label>
                <Form.Control
                  required
                  type="tel"
                  name="user_phone"
                  value={formData.user_phone}
                  onChange={handleChange}
                  isInvalid={!!errors.user_phone}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.user_phone || 'Phone number is required'}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group>
                <Form.Label>Password</Form.Label>
                <Form.Control
                  required
                  type="password"
                  name="user_password"
                  value={formData.user_password}
                  onChange={handleChange}
                  isInvalid={!!errors.user_password}
                  autoComplete="off"
                />
                <Form.Control.Feedback type="invalid">
                  {errors.user_password || 'Password is required'}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group>
                <Form.Label>Confirm Password</Form.Label>
                <div className="position-relative">
                  <Form.Control
                    required
                    type={showPassword ? 'text' : 'password'}
                    name="user_confirm_password"
                    value={formData.user_confirm_password}
                    onChange={handleChange}
                    isInvalid={!!errors.user_confirm_password}
                    autoComplete="off"
                    style={{ backgroundImage: "none" }}
                  />
                  <span
                    className="position-absolute end-0 top-50 translate-middle-y me-2"
                    style={{ cursor: 'pointer' }}
                    onClick={togglePasswordVisibility}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </span>
                </div>
                <Form.Control.Feedback type="invalid">
                  {errors.user_confirm_password || 'Please confirm your password'}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>

            <Col xs={12}>
              <Form.Group>
                <Form.Check
                  required
                  name="terms_accepted"
                  label={
                    <>
                      I agree to the{' '}
                      <Button
                        variant="link"
                        onClick={handleTermsClick}
                        style={{ padding: 0, textDecoration: 'underline' }}
                      >
                        Terms and Conditions
                      </Button>
                    </>
                  }
                  checked={termsAccepted}
                  onChange={handleTermsChange}
                  isInvalid={!termsAccepted && validated}
                  feedback="You must accept the terms and conditions"
                  feedbackType="invalid"
                />
              </Form.Group>
            </Col>

            <Col xs={12}>
              <Button
                type="submit"
                variant="success"
                className="w-100"
                disabled={isSubmitting || !termsAccepted}
              >
                {isSubmitting ? 'Registering...' : 'Register'}
              </Button>
            </Col>
          </Row>
        </Form>
      </main>

      <Modal show={showTermsModal} onHide={() => handleTermsModalResponse(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Terms and Conditions</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Here are the terms and conditions...</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => handleTermsModalResponse(false)}>
            Decline
          </Button>
          <Button variant="success" onClick={() => handleTermsModalResponse(true)}>
            Accept
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default UserRegistration;