import * as Yup from 'yup';
export const courtValidationSchema = Yup.object().shape({
    court_name: Yup.string()
        .required('Court name is required')
        .max(150, 'Court name must be less than 150 characters'),
    court_description: Yup.string()
        .required('Description is required'),
    court_email: Yup.string()
        .email('Invalid email format')
        .required('Email is required'),
    court_phone: Yup.string()
        .matches(/^[0-9\-\+]{10,}$/, 'Invalid phone number')
        .required('Phone number is required'),
    court_website: Yup.string()
        .url('Invalid URL format'),
    court_indoor_count: Yup.number()
        .min(0, 'Cannot be negative')
        .required('Number of indoor courts is required'),
    court_outdoor_count: Yup.number()
        .min(0, 'Cannot be negative')
        .required('Number of outdoor courts is required'),
    line1: Yup.string()
        .required('Address line 1 is required'),
    city: Yup.string()
        .required('City is required'),
    state: Yup.string()
        .required('State is required'),
    zipCode: Yup.string()
        .required('ZIP code is required')
        .matches(/^[0-9]{5}(-[0-9]{4})?$/, 'Invalid ZIP code format'),
});



export interface CourtData {
    court_name: string;
    court_description: string;
    court_address: string;
    court_map_latitude: string;
    court_map_longitude: string;
    court_email: string;
    court_phone: string;
    court_website: string;
    court_indoor_count: string;
    court_outdoor_count: string;
    court_surface_ids: number[];
    court_aminity_ids: number[];
    court_net_details: string;
    court_note: string;
    court_access: string;
    court_fees: string;
    court_reservations: number;
    court_avail_ids: TimeSlot[];  // Update this type
    additional_description: string;
    lines: string;
    booking_system: string;
    nets_count: number;
}
export interface TimeSlot {
    day: number;
    startTime: string;
    endTime: string;
}


export interface Surface {
    id: number;
    surface: string;
}

export interface Amenity {
    id: number;
    aminity: string;
}

export interface Address {
    line1: string;  // Door/Flat
    line2: string;  // Street
    city: string;
    state: string;
    zipCode: string;
}

export interface DayAvailability {
    name: string;
    day: number;
    isChecked: boolean;
    startTime: string;
    endTime: string;
}

export const initialValues = {
    court_name: '',
    court_description: '',
    line1: '',
    line2: '',
    city: '',
    state: '',
    zipCode: '',
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
    lines: ''
  };