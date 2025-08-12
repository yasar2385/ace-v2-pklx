import * as Yup from 'yup';
declare module "analogue-time-picker" {
    interface TimePickerProps {
        time: string;
        onChange: (time: string) => void;
        theme?: {
            primaryColor?: string;
            secondaryColor?: string;
        };
        disabled?: boolean;
        format?: "24hr" | "12hr";
    }

    interface Theme {
        primaryColor?: string;
        secondaryColor?: string;
    }

    interface AnalogueTimePickerProps {
        time: string;
        onChange: (time: string) => void;
        theme?: Theme;
        disabled?: boolean;
        format?: "24hr" | "12hr";
    }

    const AnalogueTimePicker: React.FC<AnalogueTimePickerProps>;
    
    
    export default AnalogueTimePicker;
    export const TimePicker: React.FC<TimePickerProps>;
}


