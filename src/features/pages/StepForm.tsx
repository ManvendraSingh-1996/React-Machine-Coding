import React, { useContext, useState } from "react";
import { UserContext } from "../../context/UserContext";

const StepForm: React.FC = () => {
  const user = useContext(UserContext);
  const [step, setStep] = useState<number>(1);
  const [formData, setFormData] = useState({
    name: "",
    city: "",
    phoneNum: "",
  });
  const handleChange = (e: { target: { name: string; value: string } }) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const showNext = () => {
    if (step <= 3) {
      setStep((prev) => prev + 1);
    }
  };
  const showPrev = () => {
    if (step > 1) {
      setStep((prev) => prev - 1);
    }
  };
  const totalSteps = 4;
  const progress = (step / totalSteps) * 100;
  return (
    <div className='max-w-md mx-auto p-6 border rounded-lg shadow"'>
      <h1>Step Form for {user}</h1>
      <div className="w-full bg-gray-300 h-2 rounded mb-6">
        <div
          className="bg-blue-500 h-2 rounded transition-all duration-300"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      <div className="">
        {step == 1 && (
          <div className="">
            <h3>Personal Info</h3>
            <input
              className="border p-2 w-full mb-2"
              type="text"
              placeholder="Enter Name"
              value={formData.name}
              onChange={handleChange}
            />
          </div>
        )}
        {step == 2 && (
          <div className="">
            <h3>Contact Info</h3>
            <input
              className="border p-2 w-full mb-2"
              type="text"
              placeholder="Enter Phone Number"
              value={formData.phoneNum}
              onChange={handleChange}
            />
          </div>
        )}
        {step == 3 && (
          <div className="">
            <h3>Address Info</h3>
            <input
              className="border p-2 w-full mb-2"
              type="text"
              placeholder="City Name"
              value={formData.city}
              onChange={handleChange}
            />
          </div>
        )}
        {step == 4 && (
          <div className="">
            <h3>Review</h3>
            {/* <input type="text" value={formData.name} onChange={handleChange} /> */}
          </div>
        )}
        <div className=" flex justify-between items-center ">
          <button
            className="bg-green-400 px-2 py-1 rounded-md"
            onClick={showPrev}
          >
            Back
          </button>
          <button
            className="bg-green-400 px-2 py-1 rounded-md"
            onClick={showNext}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default StepForm;
