import React from "react";

interface ParentProps {
  data: "";
}
const Child: React.FC<ParentProps> = ({ data }) => {
  const [childCount, setChildCount] = React.useState<number>(0);

  console.log("Child Component Rendered : ", data);
  return (
    <div>
      <div>This is Child Component</div>
      <div className="">
        This count is handled by Parent : <span className="">{data}</span>{" "}
      </div>
      <button
        className="bg-green-400 shadow-2xs border py-1 px-2 rounded-sm"
        onClick={() => setChildCount((prev) => prev + 1)}
      >
        Increase Parent Count
      </button>
    </div>
  );
};

export default Child;
