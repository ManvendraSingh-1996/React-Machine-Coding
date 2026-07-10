import React, { useState } from "react";
import Child from "./Child";

const Parent: React.FC = () => {
  const [parentCount, setParentCount] = useState<number>(0);
  const [childCount, setChildCount] = React.useState<number>(0);
  const handleChildCount = () => {
    setChildCount((prev) => prev + 1);
  };
  return (
    <div>
      <div className="">This is Parent Component</div>
      <div>
        This count is handled in Child Component : <span className="">{}</span>
      </div>
      <button
        className="bg-blue-400 shadow-2xs border py-1 px-2 rounded-sm"
        onClick={() => setParentCount((prev) => prev + 1)}
      >
        Increase Child Count
      </button>
      <Child data={[parentCount, handleChildCount]} />
    </div>
  );
};

export default Parent;
