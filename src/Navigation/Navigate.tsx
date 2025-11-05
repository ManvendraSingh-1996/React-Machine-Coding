import { BrowserRouter, Route, Routes } from "react-router-dom";
import App from "../App";
const Navigate = () => {
  return (
    <div>
      {" "}
      <>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<App />} />
          </Routes>
        </BrowserRouter>
      </>
    </div>
  );
};

export default Navigate;
