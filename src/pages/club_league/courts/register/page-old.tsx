import React, { useState, useEffect } from 'react';
import { Form, Button, Row, Col, Card, Table, Container } from 'react-bootstrap';
import Select from 'react-select';
import Swal from 'sweetalert2';
import http from '../../../../services/http.services';
// import TimePicker from "analogue-time-picker";
import { Formik } from 'formik';

import { courtValidationSchema, DayAvailability, Address, Amenity, Surface, TimeSlot, CourtData } from '../../../../schemas/validation-Interface';

// import "analogue-time-picker/dist/index.css";

const CourtRegistrationPage = () => {
    const [surfaces, setSurfaces] = useState<Surface[]>([]);
    const [amenities, setAmenities] = useState<Amenity[]>([]);
    const [editMode, setEditMode] = useState(false);

    const [showTimePicker, setShowTimePicker] = useState(false);
    const [activeTimeField, setActiveTimeField] = useState<{
        dayIndex: number;
        field: "startTime" | "endTime";
    } | null>(null);
    const [time, setTime] = useState<string>("08:00");

    const [address, setAddress] = useState<Address>({
        line1: '',
        line2: '',
        city: '',
        state: '',
        zipCode: ''
    });

    const [availabilityData, setAvailabilityData] = useState<DayAvailability[]>([
        { name: 'Sunday', day: 0, isChecked: true, startTime: '08:00', endTime: '18:00' },
        { name: 'Monday', day: 1, isChecked: true, startTime: '08:00', endTime: '18:00' },
        { name: 'Tuesday', day: 2, isChecked: true, startTime: '08:00', endTime: '18:00' },
        { name: 'Wednesday', day: 3, isChecked: true, startTime: '08:00', endTime: '18:00' },
        { name: 'Thursday', day: 4, isChecked: true, startTime: '08:00', endTime: '18:00' },
        { name: 'Friday', day: 5, isChecked: true, startTime: '08:00', endTime: '18:00' },
        { name: 'Saturday', day: 6, isChecked: true, startTime: '08:00', endTime: '18:00' }
    ]);

    const [courtData, setCourtData] = useState<CourtData>({
        court_name: '',
        court_description: '',
        court_address: '',
        court_map_latitude: '',
        court_map_longitude: '',
        court_email: '',
        court_phone: '',
        court_website: '',
        court_indoor_count: '',
        court_outdoor_count: '',
        court_surface_ids: [],
        court_aminity_ids: [],
        court_net_details: '',
        court_note: '',
        court_access: '',
        court_fees: '',
        court_reservations: 1,
        court_avail_ids: [],
        additional_description: '',
        lines: '',
        booking_system: '',
        nets_count: 0
    });

    useEffect(() => {
        fetchSurfaces();
        fetchAmenities();
    }, []);

    useEffect(() => {
        // ? Combine address fields when they change
        const fullAddress = [
            address.line1,
            address.line2,
            address.city,
            address.state,
            address.zipCode
        ].filter(Boolean).join(', ');

        setCourtData(prev => ({
            ...prev,
            court_address: fullAddress
        }));
    }, [address]);

    const fetchSurfaces = async () => {
        try {
            const response = await http.post('/api_get_surfaces.php', {});
            setSurfaces(response.data);
        } catch (error) {
            console.error('Error fetching surfaces:', error);
        }
    };

    const fetchAmenities = async () => {
        try {
            const response = await http.post('/api_get_aminities.php', {});
            setAmenities(response.data);
        } catch (error) {
            console.error('Error fetching amenities:', error);
        }
    };

    const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setAddress(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setCourtData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const endpoint = editMode ? '/api_edit_court.php' : '/api_create_court.php';
            const response = await http.post(endpoint, courtData);

            if (response.data.status !== 'ERROR') {
                Swal.fire({
                    icon: 'success',
                    text: `Court ${editMode ? 'updated' : 'created'} successfully`,
                    showConfirmButton: true,
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
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    };
    useEffect(() => {
        const interval = setInterval(() => {
            const element = document.querySelector('.dashboardLayout') as HTMLElement | null;
            if (element) {
                element.style.height = '100%';
                clearInterval(interval); // Stop the interval once the class is removed
            }
        }, 100); // Check every 100ms

        return () => clearInterval(interval); // Cleanup on component unmount
    }, []);



    const handleTimePickerClick = (index: number, field: "startTime" | "endTime") => {
        const selectedDay = availabilityData[index];
        if (selectedDay.startTime === "Closed" && field === "startTime") return;

        setActiveTimeField({ dayIndex: index, field });
        setTime(availabilityData[index][field] || "08:00");
        setShowTimePicker(true);
    };

    const handleTimePickerClose = () => {
        setShowTimePicker(false);
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

    return (
        <div className="d-flex flex-column">
            <Container className="py-4 flex-grow-1">

                <Form onSubmit={handleSubmit} className="d-flex flex-column h-100">
                    <div className="flex-grow">
                        <Row>
                            {/* Left Column */}
                            <Col md={6}>
                                {/* Basic Information Card */}
                                <Card className="mb-4">
                                    <Card.Header>
                                        <h4 className="mb-0">Basic Information</h4>
                                    </Card.Header>
                                    <Card.Body>
                                        <Row>
                                            <Col md={12}>
                                                <Form.Group className="mb-3">
                                                    <Form.Label>Title</Form.Label>
                                                    <Form.Control
                                                        type="text"
                                                        name="court_name"
                                                        value={courtData.court_name}
                                                        onChange={handleInputChange}
                                                        required
                                                        maxLength={150}
                                                    />
                                                </Form.Group>
                                            </Col>
                                            <Col md={12}>
                                                <Form.Group>
                                                    <Form.Label>Description</Form.Label>
                                                    <Form.Control
                                                        type="text"
                                                        name="court_description"
                                                        value={courtData.court_description}
                                                        onChange={handleInputChange}
                                                    />
                                                </Form.Group>
                                            </Col>
                                        </Row>
                                    </Card.Body>
                                </Card>

                                {/* Address Card */}
                                <Card className="mb-4">
                                    <Card.Header>
                                        <h4 className="mb-0">Address Information</h4>
                                    </Card.Header>
                                    <Card.Body>
                                        <Row>
                                            <Col md={12}>
                                                <Form.Group className="mb-3">
                                                    <Form.Label>Address Line 1 (Door/Flat)</Form.Label>
                                                    <Form.Control
                                                        type="text"
                                                        name="line1"
                                                        value={address.line1}
                                                        onChange={handleAddressChange}
                                                    />
                                                </Form.Group>
                                            </Col>
                                            <Col md={12}>
                                                <Form.Group className="mb-3">
                                                    <Form.Label>Address Line 2 (Street)</Form.Label>
                                                    <Form.Control
                                                        type="text"
                                                        name="line2"
                                                        value={address.line2}
                                                        onChange={handleAddressChange}
                                                    />
                                                </Form.Group>
                                            </Col>
                                            <Col md={4}>
                                                <Form.Group className="mb-3">
                                                    <Form.Label>City</Form.Label>
                                                    <Form.Control
                                                        type="text"
                                                        name="city"
                                                        value={address.city}
                                                        onChange={handleAddressChange}
                                                    />
                                                </Form.Group>
                                            </Col>
                                            <Col md={4}>
                                                <Form.Group className="mb-3">
                                                    <Form.Label>State/Province/Region</Form.Label>
                                                    <Form.Control
                                                        type="text"
                                                        name="state"
                                                        value={address.state}
                                                        onChange={handleAddressChange}
                                                    />
                                                </Form.Group>
                                            </Col>
                                            <Col md={4}>
                                                <Form.Group className="mb-3">
                                                    <Form.Label>ZIP/Postal code</Form.Label>
                                                    <Form.Control
                                                        type="text"
                                                        name="zipCode"
                                                        value={address.zipCode}
                                                        onChange={handleAddressChange}
                                                    />
                                                </Form.Group>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col md={12}>
                                                <Form.Group>
                                                    <Form.Label>Location (Google Maps Link)</Form.Label>
                                                    <Form.Control
                                                        type="text"
                                                        name="court_map_latitude"
                                                        value={courtData.court_map_latitude}
                                                        onChange={handleInputChange}
                                                        placeholder="Enter Google Maps link"
                                                    />
                                                </Form.Group>
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
                                                <Form.Group className="mb-3">
                                                    <Form.Label>E-mail address</Form.Label>
                                                    <Form.Control
                                                        type="email"
                                                        name="court_email"
                                                        value={courtData.court_email}
                                                        onChange={handleInputChange}
                                                    />
                                                </Form.Group>
                                            </Col>
                                            <Col md={12}>
                                                <Form.Group className="mb-3">
                                                    <Form.Label>Phone number</Form.Label>
                                                    <Form.Control
                                                        type="tel"
                                                        name="court_phone"
                                                        value={courtData.court_phone}
                                                        onChange={handleInputChange}
                                                    />
                                                </Form.Group>
                                            </Col>
                                            <Col md={12}>
                                                <Form.Group>
                                                    <Form.Label>Website</Form.Label>
                                                    <Form.Control
                                                        type="url"
                                                        name="court_website"
                                                        value={courtData.court_website}
                                                        onChange={handleInputChange}
                                                    />
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
                                                <Form.Group className="mb-3">
                                                    <Form.Label>Access</Form.Label>
                                                    <Form.Control
                                                        type="text"
                                                        name="court_access"
                                                        value={courtData.court_access}
                                                        onChange={handleInputChange}
                                                    />
                                                </Form.Group>
                                            </Col>
                                            <Col md={12}>
                                                <Form.Group className="mb-3">
                                                    <Form.Label>Fee details</Form.Label>
                                                    <Form.Control
                                                        type="text"
                                                        name="court_fees"
                                                        value={courtData.court_fees}
                                                        onChange={handleInputChange}
                                                    />
                                                </Form.Group>
                                            </Col>
                                            <Col md={12}>
                                                <Form.Group>
                                                    <Form.Check
                                                        type="switch"
                                                        id="court_reservations"
                                                        label="Reservations allowed"
                                                        name="court_reservations"
                                                        checked={courtData.court_reservations === 1}
                                                        onChange={(e) => setCourtData(prev => ({
                                                            ...prev,
                                                            court_reservations: e.target.checked ? 1 : 0
                                                        }))}
                                                    />
                                                </Form.Group>
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
                                        <Row className="mb-3">
                                            <Col md={6}>
                                                <Form.Group>
                                                    <Form.Label>No. of Indoor Courts</Form.Label>
                                                    <Form.Control
                                                        type="number"
                                                        name="court_indoor_count"
                                                        value={courtData.court_indoor_count}
                                                        onChange={handleInputChange}
                                                    />
                                                </Form.Group>
                                            </Col>
                                            <Col md={6}>
                                                <Form.Group>
                                                    <Form.Label>No. of Outdoor Courts</Form.Label>
                                                    <Form.Control
                                                        type="number"
                                                        name="court_outdoor_count"
                                                        value={courtData.court_outdoor_count}
                                                        onChange={handleInputChange}
                                                    />
                                                </Form.Group>
                                            </Col>
                                        </Row>

                                        {/* New Fields */}
                                        <Row className="mb-3">
                                            <Col md={12}>
                                                <Form.Group>
                                                    <Form.Label>Nets (Number of courts)</Form.Label>
                                                    <Form.Control
                                                        type="number"
                                                        name="nets_count"
                                                        value={courtData.nets_count}
                                                        onChange={handleInputChange}
                                                    />
                                                </Form.Group>
                                            </Col>
                                        </Row>

                                        <Row className="mb-3">
                                            <Col md={12}>
                                                <Form.Group>
                                                    <Form.Label>Surface</Form.Label>
                                                    <Select
                                                        isMulti
                                                        name="court_surface_ids"
                                                        options={surfaces.map(surface => ({
                                                            value: surface.id,
                                                            label: surface.surface
                                                        }))}
                                                        value={courtData.court_surface_ids.map(id => ({
                                                            value: id,
                                                            label: surfaces.find(s => s.id === id)?.surface || ''
                                                        }))}
                                                        onChange={(selectedOptions) => {
                                                            const selectedIds = selectedOptions.map(option => option.value);
                                                            setCourtData(prev => ({
                                                                ...prev,
                                                                court_surface_ids: selectedIds
                                                            }));
                                                        }}
                                                    />
                                                </Form.Group>
                                            </Col>
                                        </Row>

                                        <Row className="mb-3">
                                            <Col md={12}>
                                                <Form.Group>
                                                    <Form.Label>Amenities</Form.Label>
                                                    <Select
                                                        isMulti
                                                        name="court_aminity_ids"
                                                        options={amenities.map(amenity => ({
                                                            value: amenity.id,
                                                            label: amenity.aminity
                                                        }))}
                                                        value={courtData.court_aminity_ids.map(id => ({
                                                            value: id,
                                                            label: amenities.find(a => a.id === id)?.aminity || ''
                                                        }))}
                                                        onChange={(selectedOptions) => {
                                                            const selectedIds = selectedOptions.map(option => option.value);
                                                            setCourtData(prev => ({
                                                                ...prev,
                                                                court_aminity_ids: selectedIds
                                                            }));
                                                        }}
                                                    />
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
                                                                                onClick={() => handleTimePickerClick(index, "startTime")}
                                                                            >
                                                                                {formatTimeForDisplay(day.startTime)}
                                                                            </div>
                                                                        </td>
                                                                        <td>
                                                                            <div
                                                                                className="time-display"
                                                                                onClick={() => handleTimePickerClick(index, "endTime")}
                                                                            >
                                                                                {formatTimeForDisplay(day.endTime)}
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

                                        <Row>
                                            <Col md={12}>
                                                <Form.Group className="mb-3">
                                                    <Form.Label>Net Details</Form.Label>
                                                    <Form.Control
                                                        type="text"
                                                        name="court_net_details"
                                                        value={courtData.court_net_details}
                                                        onChange={handleInputChange}
                                                    />
                                                </Form.Group>
                                            </Col>
                                            <Col md={12}>
                                                <Form.Group>
                                                    <Form.Label>Lines</Form.Label>
                                                    <Form.Control
                                                        type="text"
                                                        name="lines"
                                                        value={courtData.lines}
                                                        onChange={handleInputChange}
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
                                                <Form.Group>
                                                    <Form.Label>Private notes to reviewers</Form.Label>
                                                    <Form.Control
                                                        as="textarea"
                                                        rows={3}
                                                        name="court_note"
                                                        value={courtData.court_note}
                                                        onChange={handleInputChange}
                                                        maxLength={150}
                                                    />
                                                </Form.Group>
                                            </Col>
                                        </Row>
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>
                    </div>
                    {/* Form Actions - Full Width */}
                    {/* Fixed bottom action buttons */}
                    <div
                        className="position-sticky bottom-0 bg-white py-3 mt-4"
                        style={{
                            boxShadow: '0 -2px 10px rgba(0,0,0,0.1)',
                            zIndex: 1020
                        }}
                    >
                        <Container>
                            <div className="d-flex justify-content-end">
                                <Button
                                    variant="secondary"
                                    className="me-2"
                                    type="button"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    variant="primary"
                                    type="submit"
                                >
                                    {editMode ? 'Update Court' : 'Create Court'}
                                </Button>
                            </div>
                        </Container>
                    </div>

                </Form>
            </Container>
        </div>
    );
};

export default CourtRegistrationPage;