import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Card,
  FloatingLabel,
  ButtonGroup,
  ToggleButton,
  Alert,
  Spinner, CloseButton
} from 'react-bootstrap';
import { MapPin, Plus, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import Swal from 'sweetalert2';
import http from '../../../../services/http.services';

interface CreateGroupFormProps {
  type: 'Edit' | 'Create';
}

interface Location {
  latitude: number;
  longitude: number;
}

interface CourtLocation {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
}
// Define the type for a perk
interface Perk {
  key: string;
  value: string;
}
interface MembershipType {
  type: string;
  fee: number;
  period: 'monthly' | 'annually' | 'one-time';
  perks: string[];
}

interface FormData {
  group_name: string;
  group_description: string;
  group_allowpublic: number;
  group_court_id: number;
  group_access_name: string;
  group_access_visibility: number;
  group_access_skill_level: number;
  group_access_rating: number;
  group_access_invite_others: number;
  group_access_message_all: number;
  group_access_playing_hours: string;
  group_access_member_count: string;
  group_access_show_admin: number;

  address_line_01: string;
  address_line_02: string;
  address_line_03: string;
  address_line_city: string;
  address_line_region: string;
  address_line_zipcode: string;
  address_line_country: string;
  location: Location;
  // members_file?: File | null;


  primary_name: string
  primary_email: string,
  primary_phone: string,
  secondary_name: string,
  secondary_email: string,
  secondary_phone: string,

  mem_type: number,
  mem_cat: number,
  mem_fee: number,
  mem_fee_amount: number,
  mem_perks: { [key: string]: string };
  mem_rules: string,
  mem_privacy: number,

  payment_details: string,

  facebook_page: string,
  instagram_page: string,
  twitter_page: string,
  other_social_media: string,
  group_access_website: string,
  group_access_phone: string,
  group_access_email: string
}

interface Court {
  court_id: number;
  court_name: string;
}

interface ValidationErrors {
  [key: string]: string;
}

export const CreateGroupForm: React.FC<CreateGroupFormProps> = ({ type }) => {

  const initialFormData: FormData = {

    group_name: "",
    group_description: "",
    group_allowpublic: 0,
    group_court_id: -1,
    group_access_name: "",
    group_access_visibility: 0,
    group_access_skill_level: 0,
    group_access_rating: 0,
    group_access_invite_others: 0,
    group_access_message_all: 0,
    group_access_playing_hours: "",
    group_access_member_count: "",
    group_access_show_admin: 0,
    group_access_website: "",
    group_access_phone: "",
    group_access_email: "",

    address_line_01: "",
    address_line_02: "",
    address_line_03: "",
    address_line_city: "",
    address_line_region: "",
    address_line_zipcode: "",
    address_line_country: "",
    location: { latitude: 0, longitude: 0 },

    primary_name: "",
    primary_email: "",
    primary_phone: "",
    secondary_name: "",
    secondary_email: "",
    secondary_phone: "",

    mem_type: 0,
    mem_cat: 0,
    mem_fee: 0,
    mem_fee_amount: 0,
    mem_perks: {},
    mem_rules: "",
    mem_privacy: 0,
    payment_details: "",

    facebook_page: "",
    twitter_page: "",
    instagram_page: "",
    other_social_media: ""
  };

  const [formData, setFormData] = useState<FormData>(initialFormData);
  const navigate = useNavigate();
  const location = useLocation();
  const [courtLocations, setCourtLocations] = useState<CourtLocation[]>([]);
  const [collapsedSections, setCollapsedSections] = useState({
    basic: false,
    location: false,
    setting: false,
    contact: false,
    access: false,
    courts: false,
    membership: false
  });

  const [countryLists, setCountryLists] = useState<Record<string, string>>({});
  const [courtLists, setCourtLists] = useState<Court[]>([]);
  const [validated, setValidated] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const [isGettingLocation, setIsGettingLocation] = useState(false);

  const skillLevels = [
    { name: 'All', value: '0' },
    { name: 'Beginner', value: '1' },
    { name: 'Intermediate', value: '2' },
    { name: 'Advanced', value: '3' }
  ];

  const visibilityOptions = [
    { name: 'Private', value: '0' },
    { name: 'Public', value: '1' }
  ];

  const peaks: Perk[] = [
    { key: '0', value: 'Court Access' },
    { key: '1', value: 'Coaching' },
    { key: '2', value: 'Tournaments' },
    { key: '3', value: 'Equipment Rental' },
  ];



  const handleCheckboxChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    key: string
  ) => {
    const isChecked = e.target.checked;
    const perkValue = peaks.find((p) => p.key === key)?.value;

    setFormData((prevData) => {
      const updatedPerks = { ...prevData.mem_perks };
      if (isChecked && perkValue) {
        updatedPerks[key] = perkValue; // Add the selected perk
      } else {
        delete updatedPerks[key]; // Remove the deselected perk
      }
      return { ...prevData, mem_perks: updatedPerks };
    });
  };
  const handleCategoryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { id } = event.target;
    const categoryValue = parseInt(id.split('-')[1], 10);
    setFormData((prev) => ({
      ...prev,
      mem_cat: categoryValue,
    }));
  };
  const handleFeeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = event.target;
    setFormData((prev) => ({
      ...prev,
      mem_fee: parseInt(value, 10),
    }));
  };

  const handleMembershipTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { id } = event.target;
    setFormData((prev) => ({
      ...prev,
      membershipType: id === 'free' ? 0 : 1,
    }));
  };
  const toggleCollapse = (section: keyof typeof collapsedSections) => {
    setCollapsedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };
  const addCourtLocation = () => {
    setCourtLocations([...courtLocations, {
      id: Date.now().toString(),
      name: '',
      latitude: 0,
      longitude: 0
    }]);
  };

  const removeCourtLocation = (id: string) => {
    setCourtLocations(courtLocations.filter(court => court.id !== id));
  };

  const handleGetLocation = (id: string) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCourtLocations(courts => courts.map(court =>
            court.id === id ? {
              ...court,
              latitude: position.coords.latitude,
              longitude: position.coords.longitude
            } : court
          ));
        },
        (error) => {
          console.error('Location error:', error);
        }
      );
    }
  };

  const getLocation = () => {
    setIsGettingLocation(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData(prev => ({
            ...prev,
            location: {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude
            }
          }));
          setIsGettingLocation(false);
        },
        (error) => {
          setIsGettingLocation(false);
          Swal.fire({
            title: 'Location Error',
            text: 'Unable to get your location. Please ensure location access is enabled.',
            icon: 'error',
            confirmButtonText: 'Ok',
          });
        }
      );
    }
  };

  const validateForm = (): boolean => {
    const errors: ValidationErrors = {};

    if (!formData.group_name.trim()) {
      errors.group_name = 'Club name is required';
    }

    if (!formData.group_description.trim()) {
      errors.group_description = 'Description is required';
    }

    if (formData.group_court_id === -1) {
      errors.group_court_id = 'Please select a court';
    }

    if (!formData.address_line_01.trim()) {
      errors.address_line_01 = 'Address is required';
    }

    if (!formData.address_line_city.trim()) {
      errors.address_line_city = 'City is required';
    }

    if (!formData.address_line_region.trim()) {
      errors.address_line_region = 'State is required';
    }

    if (!formData.address_line_zipcode.trim()) {
      errors.address_line_zipcode = 'ZIP code is required';
    }

    if (formData.address_line_country === "-1") {
      errors.address_line_country = 'Please select a address_line_country';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setIsLoading(true);
    setError(null);


    try {
      const formDataToSend = new FormData();

      // Append all form data
      Object.entries(formData).forEach(([key, value]) => {
        if (key === 'location') {
          formDataToSend.append('latitude', value.latitude.toString());
          formDataToSend.append('longitude', value.longitude.toString());
        } else if (key === 'members_file' && value) {
          // formDataToSend.append('members_file', value);
        } else if (/_court_id|_access_visibility|_access_skill_level|_access_rating|_access_message_all|_access_show_admin|mem_fee_amount/gi.test(key)) {
          formDataToSend.append(key, value.toString());
        } else if (key === 'mem_perks' && typeof value === 'object' && value !== null) {
          Object.entries(value).forEach(([perkKey, perkValue]) => {
            formDataToSend.append(`mem_perks[${perkKey}]`, perkValue as string);
          });
          // console.log(JSON.stringify(value))
          // formDataToSend.append(key, JSON.stringify(value));
        } else {
          if (value != null && value != undefined) {
            formDataToSend.append(key, value.toString());
          }
        }
      });


      if (type === "Edit") {
        // formDataToSend.append('group_id', location.address_line_region?.group_id);
      }

      const endpoint = type === "Edit" ? "/api_edit_group.php" : "/api_create_group.php";
      const response = await http.post(endpoint, formDataToSend);

      if (response.data.status === "STATUS OK" || response.data.status !== "ERROR") {
        await Swal.fire({
          title: `Club ${type === "Edit" ? "updated" : "created"} successfully`,
          icon: "success",
          confirmButtonText: "Ok",
        });
        navigate('/ap/club-league/clubs');
      } else {
        setError(response.data.description || 'An error occurred while saving the club');
      }
    } catch (error) {
      setError('An unexpected error occurred. Please try again.');
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [countriesResponse, courtsResponse] = await Promise.all([
          http.get("/api_get_countries.php"),
          http.get("/api_select_all_courts.php")
        ]);

        setCountryLists(countriesResponse.data);
        setCourtLists(courtsResponse.data);

        /*
        if (type === "Edit" && location.address_line_region?.group_id) {
          const groupResponse = await http.post("/api_get_group.php", {
            group_id: location.address_line_region.group_id
          });
          setFormData(prev => ({
            ...prev,
            ...groupResponse.data
          }));
        }
        */

      } catch (error) {
        setError('Failed to load necessary data. Please refresh the page.');
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
    // [type, location.address_line_region?.group_id]
  }, [type]);  
  

  if (isLoading && Object.keys(countryLists).length === 0) {

    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }
  const renderCardHeader = (title: string, section: keyof typeof collapsedSections, extraContent?: React.ReactNode) => (
    <Card.Header
      className="d-flex justify-content-between align-items-center"
      style={{ cursor: 'pointer' }}
      onClick={() => toggleCollapse(section)}
    >
      {/* <Card.Title>{title}</Card.Title> */}
      {title}
      <div className="d-flex align-items-center">
        {extraContent}
        {collapsedSections[section] ? <ChevronDown size={20} /> : <ChevronUp size={20} />}
      </div>
    </Card.Header>
  );
  return (
    <Container className="py-4">
      <Card>
        <Card.Header>
          <Card.Title as="h4" className="mb-0">
            {type === "Edit" ? "Edit Club" : "Create Club"}
          </Card.Title>
        </Card.Header>
        <Card.Body>
          {error && (
            <Alert variant="danger" dismissible onClose={() => setError(null)}>
              {error}
            </Alert>
          )}

          <Form noValidate validated={validated} onSubmit={handleSubmit}>
            <Row>
              {/* Basic Information */}
              <Col md={6}>
                <Card className="mb-3">
                  {renderCardHeader('Basic Information', 'basic')}
                  <Card.Body className={collapsedSections.basic ? 'd-none' : ''}>
                    <FloatingLabel label="Club Name" className="mb-3">
                      <Form.Control
                        type="text"
                        placeholder="Enter club name"
                        value={formData.group_name}
                        onChange={e => setFormData(prev => ({
                          ...prev,
                          group_name: e.target.value
                        }))}
                        isInvalid={!!validationErrors.group_name}
                      />
                      <Form.Control.Feedback type="invalid">
                        {validationErrors.group_name}
                      </Form.Control.Feedback>
                    </FloatingLabel>

                    <FloatingLabel label="Description" className="mb-3">
                      <Form.Control
                        as="textarea"
                        placeholder="Enter description"
                        style={{ height: '100px' }}
                        value={formData.group_description}
                        onChange={e => setFormData(prev => ({
                          ...prev,
                          group_description: e.target.value
                        }))}
                        isInvalid={!!validationErrors.group_description}
                      />
                      <Form.Control.Feedback type="invalid">
                        {validationErrors.group_description}
                      </Form.Control.Feedback>
                    </FloatingLabel>

                    <Form.Group className="mb-3">
                      <Form.Label>Playing Hours</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="e.g., Mon-Fri 9am-5pm"
                        value={formData.group_access_playing_hours}
                        onChange={e => setFormData(prev => ({
                          ...prev,
                          group_access_playing_hours: e.target.value
                        }))}
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Member Count</Form.Label>
                      <Form.Control
                        type="number"
                        placeholder="Number of members"
                        value={formData.group_access_member_count}
                        onChange={e => setFormData(prev => ({
                          ...prev,
                          group_access_member_count: e.target.value
                        }))}
                      />
                    </Form.Group>
                  </Card.Body>
                </Card>

                <Card className="mb-3">
                  {renderCardHeader('Court Information', 'courts')}
                  <Card.Body className={collapsedSections.courts ? 'd-none' : ''}>
                    <Form.Group className="mb-3">
                      <Form.Label>Select Court</Form.Label>
                      <Form.Select
                        value={formData.group_court_id}
                        onChange={e => setFormData(prev => ({
                          ...prev,
                          group_court_id: Number(e.target.value)
                        }))}
                        isInvalid={!!validationErrors.group_court_id}
                      >

                        <option value={-1}>Choose...</option>
                        {
                          courtLists.map((court) => (
                            <option key={court.court_id} value={court.court_id}>{court.court_name}</option>
                          ))
                        }

                      </Form.Select>
                      <Form.Control.Feedback type="invalid">
                        {validationErrors.group_court_id}
                      </Form.Control.Feedback>
                      <Form.Text>
                        Don't see your court? <Link to="/ap/club-league/courts">Add court</Link>
                      </Form.Text>
                    </Form.Group>
                  </Card.Body>
                </Card>
              </Col>

              {/* Location and Settings */}
              <Col md={6}>
                <Card className="mb-2">
                  {renderCardHeader('Location Information', 'location')}
                  <Card.Body className={collapsedSections.location ? 'd-none' : ''}>
                    <Row>
                      <Col md={12}>
                        <FloatingLabel label="Address Line 1" className="mb-3">
                          <Form.Control
                            type="text"
                            placeholder="Enter address"
                            value={formData.address_line_01}
                            onChange={e => setFormData(prev => ({
                              ...prev,
                              address_line_01: e.target.value
                            }))}
                            isInvalid={!!validationErrors.address_line_01}
                          />
                          <Form.Control.Feedback type="invalid">
                            {validationErrors.address_line_01}
                          </Form.Control.Feedback>
                        </FloatingLabel>
                      </Col>
                      <Col md={12}>
                        <FloatingLabel label="Address Line 2" className="mb-3">
                          <Form.Control
                            type="text"
                            placeholder="Enter address"
                            value={formData.address_line_02}
                            onChange={e => setFormData(prev => ({
                              ...prev,
                              address_line_02: e.target.value
                            }))}
                          />
                        </FloatingLabel>
                      </Col>
                    </Row>
                    <Row>
                      <Col md={6}>
                        <FloatingLabel label="City" className="mb-3">
                          <Form.Control
                            type="text"
                            placeholder="Enter address_line_city"
                            value={formData.address_line_city}
                            onChange={e => setFormData(prev => ({
                              ...prev,
                              address_line_city: e.target.value
                            }))}
                            required
                          />
                        </FloatingLabel>
                      </Col>
                      <Col md={6}>
                        <FloatingLabel label="State/Province" className="mb-3">
                          <Form.Control
                            type="text"
                            placeholder="Enter address_line_region"
                            value={formData.address_line_region}
                            onChange={e => setFormData(prev => ({
                              ...prev,
                              address_line_region: e.target.value
                            }))}
                            required
                          />
                        </FloatingLabel>
                      </Col>

                      <Col md={6}>
                        <FloatingLabel label="ZIP/Postal Code" className="mb-3">
                          <Form.Control
                            type="text"
                            placeholder="Enter ZIP code"
                            value={formData.address_line_zipcode}
                            onChange={e => setFormData(prev => ({
                              ...prev,
                              address_line_zipcode: e.target.value
                            }))}
                            required
                          />
                        </FloatingLabel>
                      </Col>

                      <Col md={6}>
                        <FloatingLabel label="Country" className="mb-3">
                          <Form.Select
                            value={formData.address_line_country}
                            onChange={e => setFormData(prev => ({
                              ...prev,
                              address_line_country: e.target.value
                            }))}
                            required
                          >
                            <option value="-1">Select Country</option>
                            {Object.entries(countryLists).map(([id, name]) => (
                              <option key={id} value={id}>{name}</option>
                            ))}
                          </Form.Select>
                        </FloatingLabel>
                      </Col>

                      <Col md={12}>
                        <Form.Group className="mb-3">
                          <Form.Label>Location</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="Click to get location"
                            value={formData.location.latitude
                              ? `${formData.location.latitude}, ${formData.location.longitude}`
                              : ''
                            }
                            onClick={getLocation}
                            readOnly
                          />
                          <Form.Text>Click to get your current location</Form.Text>
                        </Form.Group>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
              </Col>
            </Row>

            {/* Access Settings Section */}
            <Card className="mb-3">
              {renderCardHeader('Access Settings Section', 'access')}
              <Card.Body className={collapsedSections.access ? 'd-none' : ''}>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Skill Level</Form.Label>
                      <div>
                        {['All', 'Beginner', 'Intermediate', 'Advanced'].map((level, index) => (
                          <Button
                            key={level}
                            variant={formData.group_access_skill_level === index ? 'dark' : 'outline-dark'}
                            onClick={() => setFormData(prev => ({
                              ...prev,
                              group_access_skill_level: index
                            }))}
                            className="me-2"
                          >
                            {level}
                          </Button>
                        ))}
                      </div>
                    </Form.Group>
                    <hr />
                    <Form.Group>
                      <Form.Check
                        type="switch"
                        id="invite-others-switch"
                        label="Allow players to invite others"
                        checked={formData.group_access_invite_others === 1}
                        onChange={e => setFormData(prev => ({
                          ...prev,
                          group_access_invite_others: e.target.checked ? 1 : 0
                        }))}
                      />
                    </Form.Group>
                    <Form.Group>
                      <Form.Check
                        type="switch"
                        id="message-all-switch"
                        label="Allow players to message the entire groups"
                        checked={formData.group_access_message_all === 1}
                        onChange={e => setFormData(prev => ({
                          ...prev,
                          group_access_message_all: e.target.checked ? 1 : 0
                        }))}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6} className="mb-3">
                    <Form.Group className="mb-3">
                      <Form.Label>Visibility</Form.Label>
                      <div>
                        {['Private', 'Public'].map((label, index) => (
                          <Button
                            key={label}
                            variant={formData.group_access_visibility === index ? 'primary' : 'outline-primary'}
                            onClick={() => setFormData(prev => ({
                              ...prev,
                              group_access_visibility: index
                            }))}
                            className="me-2"
                          >
                            {label}
                          </Button>
                        ))}
                      </div>
                    </Form.Group>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
            {/* Contact Information */}
            <Card className="mb-4">
              {renderCardHeader('Contact Information', 'contact')}
              <Card.Body className={collapsedSections.contact ? 'd-none' : ''}>
                <Row>
                  <Col md={6}>
                    <h6>Primary Contact</h6>
                    <FloatingLabel label="Name" className="mb-3">
                      <Form.Control type="text"
                        value={formData.primary_name}
                        required
                        onChange={e => setFormData(prev => ({
                          ...prev,
                          primary_name: e.target.value
                        }))}
                      />
                    </FloatingLabel>
                    <FloatingLabel label="Email" className="mb-3">
                      <Form.Control type="email"
                        value={formData.primary_email}
                        onChange={e => setFormData(prev => ({
                          ...prev,
                          primary_email: e.target.value
                        }))}
                        required
                      />
                    </FloatingLabel>
                    <FloatingLabel label="Phone Number" className="mb-3">
                      <Form.Control type="tel"
                        value={formData.primary_phone}
                        onChange={e => setFormData(prev => ({
                          ...prev,
                          primary_phone: e.target.value
                        }))}
                        required
                      />
                    </FloatingLabel>
                  </Col>
                  <Col md={6}>
                    <h6>Secondary Contact (Optional)</h6>
                    <FloatingLabel label="Name" className="mb-3">
                      <Form.Control type="text"
                        value={formData.secondary_name}
                        onChange={e => setFormData(prev => ({
                          ...prev,
                          secondary_name: e.target.value
                        }))}
                      />
                    </FloatingLabel>
                    <FloatingLabel label="Email" className="mb-3">
                      <Form.Control type="email"
                        value={formData.secondary_email}
                        onChange={e => setFormData(prev => ({
                          ...prev,
                          secondary_email: e.target.value
                        }))}
                      />
                    </FloatingLabel>
                    <FloatingLabel label="Phone Number" className="mb-3">
                      <Form.Control type="tel"
                        value={formData.secondary_phone}
                        onChange={e => setFormData(prev => ({
                          ...prev,
                          secondary_phone: e.target.value
                        }))}
                      />
                    </FloatingLabel>
                  </Col>
                </Row>
                <Row>
                  <Col md={12}>
                    <h6>Online Presence</h6>
                    <FloatingLabel label="Club Website" className="mb-3">
                      <Form.Control type="url" placeholder="https://"
                        value={formData.group_access_website}
                        onChange={e => setFormData(prev => ({
                          ...prev,
                          group_access_website: e.target.value
                        }))}
                      />
                    </FloatingLabel>
                  </Col>
                  <Col md={6}>
                    <FloatingLabel label="Facebook" className="mb-3">
                      <Form.Control type="url" value={formData.facebook_page}
                        onChange={e => setFormData(prev => ({
                          ...prev,
                          facebook_page: e.target.value
                        }))} />
                    </FloatingLabel>
                  </Col>
                  <Col md={6}>
                    <FloatingLabel label="Instagram" className="mb-3">
                      <Form.Control type="url" value={formData.instagram_page}
                        onChange={e => setFormData(prev => ({
                          ...prev,
                          instagram_page: e.target.value
                        }))} />
                    </FloatingLabel>
                  </Col>
                  <Col md={6}>
                    <FloatingLabel label="Twitter" className="mb-3">
                      <Form.Control type="url" value={formData.twitter_page}
                        onChange={e => setFormData(prev => ({
                          ...prev,
                          twitter_page: e.target.value
                        }))} />
                    </FloatingLabel>
                  </Col>
                  <Col md={6}>
                    <FloatingLabel label="Other Social Link" className="mb-3">
                      <Form.Control type="url" value={formData.other_social_media}
                        onChange={e => setFormData(prev => ({
                          ...prev,
                          other_social_media: e.target.value
                        }))} />
                    </FloatingLabel>
                  </Col>
                </Row>
              </Card.Body>
            </Card>

            {/* Court Locations */}
            {/* <Card className="mb-4">
              <Card.Header className="d-flex justify-content-between align-items-center">
                Court Locations
                <Button variant="outline-primary" onClick={addCourtLocation}>
                  <Plus className="me-2" size={16} />
                  Add Court
                </Button>
              </Card.Header>
              <Card.Body>
                {courtLocations.map(court => (
                  <Row key={court.id} className="mb-3">
                    <Col md={4}>
                      <FloatingLabel label="Court Name">
                        <Form.Control
                          type="text"
                          value={court.name}
                          onChange={(e) => {
                            setCourtLocations(courts => courts.map(c =>
                              c.id === court.id ? { ...c, name: e.target.value } : c
                            ));
                          }}
                        />
                      </FloatingLabel>
                    </Col>
                    <Col md={6}>
                      <Form.Control
                        type="text"
                        value={court.latitude ? `${court.latitude}, ${court.longitude}` : ''}
                        placeholder="Click to get location"
                        onClick={() => handleGetLocation(court.id)}
                        readOnly
                      />
                    </Col>
                    <Col md={2} className="d-flex align-items-center">
                      <Button
                        variant="outline-danger"
                        onClick={() => removeCourtLocation(court.id)}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </Col>
                  </Row>
                ))}
              </Card.Body>
            </Card> */}

            {/* Membership Details */}
            <Card className="mb-4">
              {renderCardHeader('Membership Details', 'membership')}
              <Card.Body className={collapsedSections.membership ? 'd-none' : ''}>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Choose Your Plan</Form.Label>
                      <div>
                        <Form.Check
                          type="radio"
                          label="Free"
                          name="mem_type"
                          id="free"
                          inline
                          checked={formData.mem_type === 0}
                          onChange={handleMembershipTypeChange}
                        />
                        <Form.Check
                          type="radio"
                          label="Paid"
                          name="mem_type"
                          id="paid"
                          inline
                          checked={formData.mem_type === 1}
                          onChange={handleMembershipTypeChange}
                        />
                      </div>
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Select Your Category</Form.Label>
                      <div>
                        {['Individual', 'Family', 'Youth', 'Senior'].map((category, index) => (
                          <Form.Check
                            key={category}
                            type="radio"
                            label={category}
                            id={`category-${index}`}
                            inline
                            checked={formData.mem_cat === index}
                            onChange={handleCategoryChange}
                          />
                        ))}
                      </div>
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <Form.Label>Amount</Form.Label>
                    <Form.Control
                      placeholder="Enter amount"
                      aria-label="Membership fee amount"
                      type="number"
                      min="100" step="10"
                      value={formData.mem_fee_amount}
                      onChange={e => setFormData(prev => ({
                        ...prev,
                        mem_fee_amount: Number(e.target.value)
                      }))}
                    />
                  </Col>
                  <Col md={6}>
                    <Form.Label>Subscription Details</Form.Label>
                    <Form.Select
                      className="mb-3"
                      value={formData.mem_fee}
                      onChange={handleFeeChange}
                    >
                      <option value={0}>Select Fee Period</option>
                      <option value={1}>Monthly</option>
                      <option value={2}>Annually</option>
                      <option value={3}>One-time</option>
                    </Form.Select>
                  </Col>
                </Row>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Member Perks</Form.Label>
                      <div>
                        {peaks.map((perk) => (
                          <Form.Check
                            key={perk.key}
                            type="checkbox"
                            label={perk.value}
                            id={`perk-${perk.value.toLowerCase().replace(' ', '-')}`}
                            onChange={(e) => handleCheckboxChange(e, perk.key)}
                          />
                        ))}
                      </div>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Payment Information</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={3}
                        placeholder="Enter payment methods and instructions"
                        value={formData.payment_details}
                        onChange={e => setFormData(prev => ({
                          ...prev,
                          payment_details: e.target.value
                        }))}
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Form.Group className="mb-3">
                  <Form.Label>Terms & Conditions</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={4}
                    placeholder="Enter club policies and code of conduct"
                    value={formData.mem_rules}
                    onChange={e => setFormData(prev => ({
                      ...prev,
                      mem_rules: e.target.value
                    }))}
                  />
                </Form.Group>


              </Card.Body>
            </Card>
            <div className="d-flex justify-content-end gap-2">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Spinner size="sm" className="me-2" />
                    Saving...
                  </>
                ) : (
                  `${type === "Edit" ? 'Update' : 'Create'} Club`
                )}
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default CreateGroupForm;