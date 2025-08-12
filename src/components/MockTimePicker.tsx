import React, { useState } from "react";
// import TimePicker from "analogue-time-picker"; // Uncomment if library is verified

const MockTimePicker: React.FC<{ time: string; onChange: (time: string) => void }> = ({ time, onChange }) => {
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange(e.target.value);
    };

    return (
        <input
            type="time"
            value={time}
            onChange={handleInputChange}
            style={{ padding: "10px", fontSize: "16px", border: "1px solid #ccc", borderRadius: "4px" }}
        />
    );
};

const App: React.FC = () => {
    const [time, setTime] = useState("12:00");

    return (
        <div>
            <h1>Time Picker Example</h1>
            <MockTimePicker time={time} onChange={setTime} />
            <p>Selected Time: {time}</p>
        </div>
    );
};

export default App;
