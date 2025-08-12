
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from "react-router-dom";
import { Form, Button, Row, Col, Card, Table, Container, FloatingLabel, Spinner } from 'react-bootstrap';
import Select from 'react-select';
import Swal from 'sweetalert2';
import { Formik, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import http from '../../../../services/http.services';
import { WebsiteSchema } from '../../../../schemas/website';

// Type definitions
interface CourtFormValues {
    court_name: string;
    court_description: string;
    court_address: string;
    line2: string;
    city: string;
    state: string;
    zipCode: string;
    court_map_latitude: string;
    court_map_longitude: string;
    court_email: string;
    court_phone: string;
    court_website: string;
    court_indoor_count: string;
    court_outdoor_count: string;
    court_surface_ids: { id: number }[];
    court_aminity_ids: { id: number }[];
    court_net_details: string;
    court_note: string;
    court_access: string;
    court_fees: string;
    court_reservations: number;
    nets_count: number;
    booking_system: string;
    lines: string;
    additional_description: string;
}

interface Surface {
    id: number;
    surface: string;
}

interface Amenity {
    id: number;
    aminity: string;
}

// Validation Schema
const validationSchema = Yup.object().shape({
    court_name: Yup.string().required('Court name is required').max(150, 'Court name must be less than 150 characters'),
    court_description: Yup.string().required('Description is required').min(10, 'Description must be at least 10 characters').max(500, 'Description must be less than 500 characters'),
    court_address: Yup.string().required('Address line is required').max(100, 'Address must be less than 100 characters'),
    city: Yup.string().required('City is required').max(50, 'City must be less than 50 characters'),
    state: Yup.string().required('State is required').max(50, 'State must be less than 50 characters'),
    zipCode: Yup.string().required('ZIP code is required').matches(/^[0-9]{5}(-[0-9]{4})?$/, 'Invalid ZIP code format'),
    court_email: Yup.string().email('Invalid email format').required('Email is required'),
    court_phone: Yup.string().matches(/^[0-9\-\+]{10,}$/, 'Invalid phone number').required('Phone number is required'),
    court_website: WebsiteSchema,
    court_indoor_count: Yup.number().min(0, 'Cannot be negative').required('Number of indoor courts is required'),
    court_outdoor_count: Yup.number().min(0, 'Cannot be negative').required('Number of outdoor courts is required'),
    court_surface_ids: Yup.array().min(1, 'At least one surface type must be selected').required('Surface type is required'),
    court_fees: Yup.string()/* .required('Fee information is required') */,
    court_access: Yup.string()/* .required('Access information is required') */,
    nets_count: Yup.number().min(1, 'Cannot be negative').required('Number of nets is required'),
});

const CourtRegistrationPage: React.FC = () => {
    const [surfaces, setSurfaces] = useState<Surface[]>([]);
    const [amenities, setAmenities] = useState<Amenity[]>([]);
    const [editMode, setEditMode] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [showTimePicker, setShowTimePicker] = useState(false);
    const [time, setTime] = useState<string>("08:00");
    const [activeTimeField, setActiveTimeField] = useState<{
        dayIndex: number;
        field: "startTime" | "endTime";
    } | null>(null);

    const [availabilityData, setAvailabilityData] = useState([
        { name: 'Sunday', day: 0, isChecked: true, startTime: '08:00', endTime: '18:00' },
        { name: 'Monday', day: 1, isChecked: true, startTime: '08:00', endTime: '18:00' },
        { name: 'Tuesday', day: 2, isChecked: true, startTime: '08:00', endTime: '18:00' },
        { name: 'Wednesday', day: 3, isChecked: true, startTime: '08:00', endTime: '18:00' },
        { name: 'Thursday', day: 4, isChecked: true, startTime: '08:00', endTime: '18:00' },
        { name: 'Friday', day: 5, isChecked: true, startTime: '08:00', endTime: '18:00' },
        { name: 'Saturday', day: 6, isChecked: true, startTime: '08:00', endTime: '18:00' }
    ]);

    const initialValues: CourtFormValues = {
        court_name: '',
        court_description: '',
        court_address: '',
        line2: '',
        city: '',
        state: '',
        zipCode: '',
        court_map_latitude: '',
        court_map_longitude: '',
        court_email: '',
        court_phone: '',
        court_website: '',
        court_indoor_count: '0',
        court_outdoor_count: '0',
        court_surface_ids: [],
        court_aminity_ids: [],
        court_net_details: '',
        court_note: '',
        court_access: '',
        court_fees: '',
        court_reservations: 1,
        nets_count: 0,
        booking_system: '',
        lines: '',
        additional_description: ''
    };
    const navigate = useNavigate();
    const handleTimePickerClose = () => {
        setShowTimePicker(false);
    };
    const handleTimePickerClick = (index: number, field: "startTime" | "endTime") => {
        const selectedDay = availabilityData[index];
        if (selectedDay.startTime === "Closed" && field === "startTime") return;

        setActiveTimeField({ dayIndex: index, field });
        setTime(availabilityData[index][field] || "08:00");
        setShowTimePicker(true);
    };

    const formatTimeForDisplay = (time: string) => {
        if (time === "Closed") return "Closed";
        const [hours, minutes] = time.split(":").map(Number);
        const formattedHours = hours % 12 || 12;
        const period = hours >= 12 ? "PM" : "AM";
        return `${formattedHours}:${minutes.toString().padStart(2, "0")} ${period}`;
    };
    // Update the time change handler
    const handleTimeChange = (newTime: string) => {
        if (activeTimeField) {
            const updatedData = [...availabilityData];
            updatedData[activeTimeField.dayIndex][activeTimeField.field] = newTime;
            setAvailabilityData(updatedData);
        }
        setShowTimePicker(false); // Close the picker
    };

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                setIsLoading(true);
                await Promise.all([fetchSurfaces(), fetchAmenities()]);
            } catch (error) {
                console.error('Error fetching initial data:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Failed to load initial data. Please refresh the page.',
                });
            } finally {
                setIsLoading(false);
            }
        };

        fetchInitialData();
    }, []);

    const fetchSurfaces = async () => {
        const response = await http.post('/api_get_surfaces.php', {});
        setSurfaces(response.data);
    };

    const fetchAmenities = async () => {
        const response = await http.post('/api_get_aminities.php', {});
        setAmenities(response.data);
    };

    const handleSubmit = async (
        values: CourtFormValues,
        { setSubmitting, setErrors }: FormikHelpers<CourtFormValues>
    ) => {
        try {
            // Transform availability data into the format expected by the API
            const transformedAvailability = availabilityData
                .filter(day => day.isChecked)
                .map(day => ({
                    day: day.day,
                    startTime: day.startTime,
                    endTime: day.endTime
                }));

            const formData = {
                ...values,
                court_avail_ids: transformedAvailability
            };

            const endpoint = editMode ? '/api_edit_court.php' : '/api_create_court.php';
            const response = await http.post(endpoint, formData);

            if (response.data.status === 'STATUS OK') {
                Swal.fire({
                    icon: 'success',
                    text: `Court ${editMode ? 'updated' : 'created'} successfully`,
                    showConfirmButton: true,
                }).then((result) => {
                    if (result.isConfirmed) {
                        navigate("/ap/club-league/courts");
                    }
                });
            } else {
                throw new Error(response.data);
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: (error as Error).message  || 'An error occurred while submitting the form',
            });
        } finally {
            setSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <Container className="d-flex justify-content-center align-items-center min-vh-100">
                <Spinner animation="border" variant="primary" />
            </Container>
        );
    }

    return (
        <div className="d-flex flex-column min-vh-100">
            <Container className="py-4 flex-grow-1">
                <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                >
                    {({
                        handleSubmit,
                        handleChange,
                        handleBlur,
                        values,
                        touched,
                        errors,
                        isSubmitting,
                        setFieldValue
                    }) => (
                        <Form noValidate onSubmit={handleSubmit} className="d-flex flex-column h-100">
                            <div className="flex-grow-1">
                                <Row>
                                    {/* Left Column */}
                                    <Col md={6}>
                                        {/* Basic Information Card */}
                                        <Card className="mb-4">
                                            <Card.Header>
                                                <h4 className="mb-0">Basic Information</h4>
                                            </Card.Header>
                                            <Card.Body>
                                                <FloatingLabel
                                                    controlId="court_name"
                                                    label="Court Name *"
                                                    className="mb-3"
                                                >
                                                    <Form.Control
                                                        type="text"
                                                        placeholder="Enter court name"
                                                        name="court_name"
                                                        value={values.court_name}
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        isInvalid={touched.court_name && !!errors.court_name}
                                                    />
                                                    <Form.Control.Feedback type="invalid">
                                                        {errors.court_name}
                                                    </Form.Control.Feedback>
                                                </FloatingLabel>

                                                <FloatingLabel
                                                    controlId="court_description"
                                                    label="Description *"
                                                    className="mb-3"
                                                >
                                                    <Form.Control
                                                        as="textarea"
                                                        placeholder="Enter description"
                                                        style={{ height: '100px' }}
                                                        name="court_description"
                                                        value={values.court_description}
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        isInvalid={touched.court_description && !!errors.court_description}
                                                    />
                                                    <Form.Control.Feedback type="invalid">
                                                        {errors.court_description}
                                                    </Form.Control.Feedback>
                                                </FloatingLabel>
                                            </Card.Body>
                                        </Card>

                                        {/* Left Column - Additional Cards */}
                                        <Card className="mb-4">
                                            <Card.Header>
                                                <h4 className="mb-0">Address Information</h4>
                                            </Card.Header>
                                            <Card.Body>
                                                <Row>
                                                    <Col md={12}>
                                                        <FloatingLabel controlId="court_address" label="Address Line 1 *" className="mb-3">
                                                            <Form.Control
                                                                type="text"
                                                                placeholder="Enter Address Line 1"
                                                                name="court_address"
                                                                value={values.court_address}
                                                                onChange={handleChange}
                                                                onBlur={handleBlur}
                                                                isInvalid={touched.court_address && !!errors.court_address}
                                                            />
                                                            <Form.Control.Feedback type="invalid">{errors.court_address}</Form.Control.Feedback>
                                                        </FloatingLabel></Col>
                                                    <Col md={12}> <FloatingLabel controlId="line2" label="Address Line 2" className="mb-3">
                                                        <Form.Control
                                                            type="text"
                                                            placeholder="Enter Address Line 2"
                                                            name="line2"
                                                            value={values.line2}
                                                            onChange={handleChange}
                                                            onBlur={handleBlur}
                                                        />
                                                    </FloatingLabel></Col>
                                                    <Col md={6}><FloatingLabel controlId="city" label="City *" className="mb-3">
                                                        <Form.Control
                                                            type="text"
                                                            placeholder="Enter City"
                                                            name="city"
                                                            value={values.city}
                                                            onChange={handleChange}
                                                            onBlur={handleBlur}
                                                            isInvalid={touched.city && !!errors.city}
                                                        />
                                                        <Form.Control.Feedback type="invalid">{errors.city}</Form.Control.Feedback>
                                                    </FloatingLabel></Col>
                                                    <Col md={6}> <FloatingLabel controlId="state" label="State *" className="mb-3">
                                                        <Form.Control
                                                            type="text"
                                                            placeholder="Enter State"
                                                            name="state"
                                                            value={values.state}
                                                            onChange={handleChange}
                                                            onBlur={handleBlur}
                                                            isInvalid={touched.state && !!errors.state}
                                                        />
                                                        <Form.Control.Feedback type="invalid">{errors.state}</Form.Control.Feedback>
                                                    </FloatingLabel></Col>

                                                    <Col md={6}><FloatingLabel controlId="zipCode" label="ZIP Code *" className="mb-3">
                                                        <Form.Control
                                                            type="text"
                                                            placeholder="Enter ZIP Code"
                                                            name="zipCode"
                                                            value={values.zipCode}
                                                            onChange={handleChange}
                                                            onBlur={handleBlur}
                                                            isInvalid={touched.zipCode && !!errors.zipCode}
                                                        />
                                                        <Form.Control.Feedback type="invalid">{errors.zipCode}</Form.Control.Feedback>
                                                    </FloatingLabel></Col>
                                                    <Col md={6}>
                                                        <FloatingLabel controlId="court_map_latitude" label="Location (Google Maps Link)" className="mb-3">
                                                            <Form.Control
                                                                type="text"
                                                                placeholder="Enter Google Maps link"
                                                                name="court_map_latitude"
                                                                value={values.court_map_latitude}
                                                                onChange={handleChange}
                                                                onBlur={handleBlur}
                                                                isInvalid={touched.court_map_latitude && !!errors.court_map_latitude}
                                                            />
                                                            <Form.Control.Feedback type="invalid">
                                                                {errors.court_map_latitude}
                                                            </Form.Control.Feedback>
                                                        </FloatingLabel>
                                                    </Col>
                                                </Row>
                                            </Card.Body>
                                        </Card>
                                        {/* Contact Information Card */}
                                        <Card className="mb-4">
                                            <Card.Header>
                                                <h4 className="mb-0">Contact Information</h4>
                                            </Card.Header>
                                            <Card.Body>
                                                <Row>
                                                    <Col md={12}>
                                                        <FloatingLabel controlId="court_email" label="E-mail Address" className="mb-3">
                                                            <Form.Control
                                                                type="email"
                                                                placeholder="Enter E-mail Address"
                                                                name="court_email"
                                                                value={values.court_email}
                                                                onChange={handleChange}
                                                                onBlur={handleBlur}
                                                                isInvalid={touched.court_email && !!errors.court_email}
                                                            />
                                                            <Form.Control.Feedback type="invalid">
                                                                {errors.court_email}
                                                            </Form.Control.Feedback>
                                                        </FloatingLabel>
                                                    </Col>
                                                    <Col md={12}>
                                                        <FloatingLabel controlId="court_phone" label="Phone Number" className="mb-3">
                                                            <Form.Control
                                                                type="tel"
                                                                placeholder="Enter Phone Number"
                                                                name="court_phone"
                                                                value={values.court_phone}
                                                                onChange={handleChange}
                                                                onBlur={handleBlur}
                                                                isInvalid={touched.court_phone && !!errors.court_phone}
                                                            />
                                                            <Form.Control.Feedback type="invalid">
                                                                {errors.court_phone}
                                                            </Form.Control.Feedback>
                                                        </FloatingLabel>
                                                    </Col>
                                                    <Col md={12}>
                                                        <FloatingLabel controlId="court_website" label="Website" className="mb-3">
                                                            <Form.Control
                                                                type="url"
                                                                placeholder="Enter Website URL"
                                                                name="court_website"
                                                                value={values.court_website}
                                                                onChange={handleChange}
                                                                onBlur={handleBlur}
                                                                isInvalid={touched.court_website && !!errors.court_website}
                                                            />
                                                            <Form.Control.Feedback type="invalid">
                                                                {errors.court_website}
                                                            </Form.Control.Feedback>
                                                        </FloatingLabel>
                                                    </Col>
                                                </Row>
                                            </Card.Body>
                                        </Card>


                                    </Col>

                                    {/* Right Column */}
                                    <Col md={6}>
                                        {/* Court Details Card */}
                                        <Card className="mb-4">
                                            <Card.Header>
                                                <h4 className="mb-0">Court Details</h4>
                                            </Card.Header>
                                            <Card.Body>
                                                <Row className="mb-3 d-none">
                                                    <Col md={6}>
                                                        <FloatingLabel controlId="court_indoor_count" label="No. of Indoor Courts" className="mb-3">
                                                            <Form.Control
                                                                type="number"
                                                                placeholder="Enter Indoor Courts"
                                                                name="court_indoor_count"
                                                                value={values.court_indoor_count}
                                                                onChange={handleChange}
                                                                onBlur={handleBlur}
                                                                isInvalid={touched.court_indoor_count && !!errors.court_indoor_count}
                                                            />
                                                            <Form.Control.Feedback type="invalid">
                                                                {errors.court_indoor_count}
                                                            </Form.Control.Feedback>
                                                        </FloatingLabel>
                                                    </Col>
                                                    <Col md={6}>
                                                        <FloatingLabel controlId="court_outdoor_count" label="No. of Outdoor Courts" className="mb-3">
                                                            <Form.Control
                                                                type="number"
                                                                placeholder="Enter Outdoor Courts"
                                                                name="court_outdoor_count"
                                                                value={values.court_outdoor_count}
                                                                onChange={handleChange}
                                                                onBlur={handleBlur}
                                                                isInvalid={touched.court_outdoor_count && !!errors.court_outdoor_count}
                                                            />
                                                            <Form.Control.Feedback type="invalid">
                                                                {errors.court_outdoor_count}
                                                            </Form.Control.Feedback>
                                                        </FloatingLabel>
                                                    </Col>
                                                </Row>

                                                <Row className="">
                                                    <Col md={12}>
                                                        <FloatingLabel controlId="nets_count" label="Nets (Number of Courts)" className="mb-3">
                                                            <Form.Control
                                                                type="number"
                                                                placeholder="Enter Number of Nets"
                                                                name="nets_count"
                                                                value={values.nets_count}
                                                                onChange={handleChange}
                                                                onBlur={handleBlur}
                                                                isInvalid={touched.nets_count && !!errors.nets_count}
                                                            />
                                                            <Form.Control.Feedback type="invalid">
                                                                {errors.nets_count}
                                                            </Form.Control.Feedback>
                                                        </FloatingLabel>
                                                    </Col>
                                                </Row>

                                                <Row className='d-none'>
                                                    <Col md={12}>
                                                        <FloatingLabel controlId="court_net_details" label="Net Details" className="mb-3">
                                                            <Form.Control
                                                                type="text"
                                                                placeholder="Enter Net Details"
                                                                name="court_net_details"
                                                                value={values.court_net_details}
                                                                onChange={handleChange}
                                                                onBlur={handleBlur}
                                                                isInvalid={touched.court_net_details && !!errors.court_net_details}
                                                            />
                                                            <Form.Control.Feedback type="invalid">
                                                                {errors.court_net_details}
                                                            </Form.Control.Feedback>
                                                        </FloatingLabel>
                                                    </Col>
                                                    <Col md={12}>
                                                        <FloatingLabel controlId="lines" label="Lines" className="mb-3">
                                                            <Form.Control
                                                                type="text"
                                                                placeholder="Enter Lines"
                                                                name="lines"
                                                                value={values.lines}
                                                                onChange={handleChange}
                                                                onBlur={handleBlur}
                                                                isInvalid={touched.lines && !!errors.lines}
                                                            />
                                                            <Form.Control.Feedback type="invalid">
                                                                {errors.lines}
                                                            </Form.Control.Feedback>
                                                        </FloatingLabel>
                                                    </Col>
                                                </Row>

                                                <Row className="mb-3">
                                                    <Col md={12}>
                                                        <Form.Group>
                                                            <Form.Label>Surface</Form.Label>
                                                            <div className="floating-select-wrapper">
                                                                <Select
                                                                    isMulti
                                                                    name="court_surface_ids"
                                                                    options={surfaces.map((surface) => ({
                                                                        value: surface.id,
                                                                        label: surface.surface,
                                                                    }))}
                                                                    value={values.court_surface_ids.map((idObj) => ({
                                                                        value: idObj.id,
                                                                        label: surfaces.find((s) => s.id === idObj.id)?.surface || '',
                                                                    }))}
                                                                    onChange={(selectedOptions) => {
                                                                        // Map the selected options to match the expected format [{ id: 1 }, { id: 2 }]
                                                                        const selectedIds = selectedOptions.map((option) => ({ id: option.value }));
                                                                        setFieldValue('court_surface_ids', selectedIds);
                                                                    }}
                                                                    menuPortalTarget={document.body} /* Portal dropdown to the body */
                                                                    styles={{
                                                                        menuPortal: (base) => ({ ...base, zIndex: 1050 }), /* Adjust z-index */
                                                                        control: (base) => ({
                                                                            ...base,
                                                                            minHeight: 'calc(3.5rem + 2px)', /* Match floating label height */
                                                                        }),
                                                                    }}
                                                                />
                                                            </div>
                                                        </Form.Group>
                                                    </Col>
                                                </Row>

                                                <Row className="mb-3">
                                                    <Col md={12}>
                                                        <Form.Group>
                                                            <Form.Label>Amenities</Form.Label>
                                                            <div className="floating-select-wrapper">
                                                                <Select
                                                                    isMulti
                                                                    name="court_aminity_ids"
                                                                    options={amenities.map((amenity) => ({
                                                                        value: amenity.id,
                                                                        label: amenity.aminity,
                                                                    }))}
                                                                    value={values.court_aminity_ids.map((idObj) => ({
                                                                        value: idObj.id,
                                                                        label: amenities.find((a) => a.id === idObj.id)?.aminity || '',
                                                                    }))}
                                                                    onChange={(selectedOptions) => {
                                                                        // Convert selected options into an array of objects with { id: value }
                                                                        const selectedIds = selectedOptions.map((option) => ({ id: option.value }));
                                                                        setFieldValue('court_aminity_ids', selectedIds);
                                                                    }}
                                                                    menuPortalTarget={document.body}
                                                                    styles={{
                                                                        menuPortal: (base) => ({ ...base, zIndex: 1050 }),
                                                                        control: (base) => ({
                                                                            ...base,
                                                                            minHeight: 'calc(3.5rem + 2px)',
                                                                        }),
                                                                    }}
                                                                />
                                                            </div>
                                                        </Form.Group>
                                                    </Col>
                                                </Row>
                                                <Row className="mb-3">
                                                    <Col md={12}>
                                                        <Form.Group>
                                                            <Form.Label>Facility Hours (Hours of Operation)</Form.Label>
                                                            <div className="time-picker-wrapper">
                                                                <Table striped bordered>
                                                                    <thead>
                                                                        <tr>
                                                                            <th>Day</th>
                                                                            <th>Open</th>
                                                                            <th>Close</th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody>
                                                                        {availabilityData.map((day, index) => (
                                                                            <tr key={day.name}>
                                                                                <td>{day.name}</td>
                                                                                <td>
                                                                                    <div
                                                                                        className="time-display"
                                                                                    // onClick={() => handleTimePickerClick(index, "startTime")}
                                                                                    >
                                                                                        {/* formatTimeForDisplay */(day.startTime)}
                                                                                    </div>
                                                                                </td>
                                                                                <td>
                                                                                    <div
                                                                                        className="time-display"
                                                                                    // onClick={() => handleTimePickerClick(index, "endTime")}
                                                                                    >
                                                                                        {/* formatTimeForDisplay */(day.endTime)}
                                                                                    </div>
                                                                                </td>
                                                                            </tr>
                                                                        ))}
                                                                    </tbody>
                                                                </Table>

                                                                {showTimePicker && activeTimeField && (
                                                                    <div
                                                                        className="time-picker-overlay"
                                                                        onClick={handleTimePickerClose}
                                                                        style={{
                                                                            position: "fixed",
                                                                            top: 0,
                                                                            left: 0,
                                                                            width: "100%",
                                                                            height: "100%",
                                                                            backgroundColor: "rgba(0, 0, 0, 0.5)",
                                                                            display: "flex",
                                                                            justifyContent: "center",
                                                                            alignItems: "center",
                                                                        }}
                                                                    >
                                                                        <div
                                                                            className="time-picker-modal"
                                                                            onClick={(e) => e.stopPropagation()}
                                                                            style={{
                                                                                backgroundColor: "#fff",
                                                                                padding: "20px",
                                                                                borderRadius: "8px",
                                                                            }}
                                                                        >
                                                                            {/* <TimePicker
                                                                            time={time}
                                                                            onChange={handleTimeChange}
                                                                            theme={{
                                                                                primaryColor: "#4CAF50",
                                                                                secondaryColor: "#E8F5E9",
                                                                            }}
                                                                            format="24hr"
                                                                        /> */}
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </Form.Group>
                                                    </Col>
                                                </Row>
                                            </Card.Body>
                                        </Card>

                                        {/* Access & Fees Card */}
                                        <Card className="mb-4">
                                            <Card.Header>
                                                <h4 className="mb-0">Access & Fees</h4>
                                            </Card.Header>
                                            <Card.Body>
                                                <Row>
                                                    <Col md={12}>
                                                        <FloatingLabel controlId="court_access" label="Access" className="mb-3">
                                                            <Form.Control
                                                                type="text"
                                                                placeholder="Enter Access Information"
                                                                name="court_access"
                                                                value={values.court_access}
                                                                onChange={handleChange}
                                                                onBlur={handleBlur}
                                                                isInvalid={touched.court_access && !!errors.court_access}
                                                            />
                                                            <Form.Control.Feedback type="invalid">
                                                                {errors.court_access}
                                                            </Form.Control.Feedback>
                                                        </FloatingLabel>
                                                    </Col>
                                                    <Col md={12}>
                                                        <FloatingLabel controlId="court_fees" label="Fee Details" className="mb-3">
                                                            <Form.Control
                                                                type="text"
                                                                placeholder="Enter Fee Details"
                                                                name="court_fees"
                                                                value={values.court_fees}
                                                                onChange={handleChange}
                                                                onBlur={handleBlur}
                                                                isInvalid={touched.court_fees && !!errors.court_fees}
                                                            />
                                                            <Form.Control.Feedback type="invalid">
                                                                {errors.court_fees}
                                                            </Form.Control.Feedback>
                                                        </FloatingLabel>
                                                    </Col>
                                                    <Col md={12}>
                                                        <Form.Group className="mb-3">
                                                            <Form.Check
                                                                type="switch"
                                                                id="court_reservations"
                                                                label="Reservations Allowed"
                                                                name="court_reservations"
                                                                checked={values.court_reservations === 1}
                                                                onChange={(e) =>
                                                                    setFieldValue('court_reservations', e.target.checked ? 1 : 0)
                                                                }
                                                            />
                                                        </Form.Group>
                                                    </Col>
                                                </Row>
                                            </Card.Body>
                                        </Card>
                                        {/* Additional Information Card */}
                                        <Card className="mb-4">
                                            <Card.Header>
                                                <h4 className="mb-0">Additional Information</h4>
                                            </Card.Header>
                                            <Card.Body>
                                                <Row>
                                                    <Col md={12}>
                                                        <FloatingLabel controlId="court_note" label="Private Notes to Reviewers" className="mb-3">
                                                            <Form.Control
                                                                as="textarea"
                                                                placeholder="Enter Private Notes"
                                                                name="court_note"
                                                                value={values.court_note}
                                                                onChange={handleChange}
                                                                onBlur={handleBlur}
                                                                isInvalid={touched.court_note && !!errors.court_note}
                                                            />
                                                            <Form.Control.Feedback type="invalid">
                                                                {errors.court_note}
                                                            </Form.Control.Feedback>
                                                        </FloatingLabel>
                                                    </Col>
                                                </Row>
                                            </Card.Body>
                                        </Card>
                                    </Col>

                                </Row>
                            </div>

                            {/* Fixed Submit Button */}
                            <div
                                className="position-sticky bottom-0 bg-white border-top py-3 mt-4"
                                style={{
                                    boxShadow: '0 -2px 10px rgba(0,0,0,0.1)',
                                    zIndex: 1020
                                }}
                            >
                                <Container>
                                    <div className="d-flex justify-content-between align-items-center">
                                        <span className="text-muted">* Required fields</span>
                                        <div className="d-flex gap-2">
                                            <Button
                                                variant="secondary"
                                                type="button"
                                                onClick={() => window.history.back()}
                                            >
                                                Cancel
                                            </Button>
                                            <Button
                                                variant="primary"
                                                type="submit"
                                                disabled={isSubmitting}
                                            >
                                                {isSubmitting ? (
                                                    <>
                                                        <Spinner
                                                            as="span"
                                                            animation="border"
                                                            size="sm"
                                                            role="status"
                                                            aria-hidden="true"
                                                            className="me-2"
                                                        />
                                                        Submitting...
                                                    </>
                                                ) : (
                                                    editMode ? 'Update Court' : 'Create Court'
                                                )}
                                            </Button>
                                        </div>
                                    </div>
                                </Container>
                            </div>
                        </Form>
                    )}
                </Formik>
            </Container>
        </div>
    );
};

export default CourtRegistrationPage;