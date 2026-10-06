import { useState, useEffect } from "react";

function Child(props: any) {
  console.log("props", props);
  return (
    <div>
      <div className="">This is Child Component</div>
      <div>
        This count is handled in Parent Component :{" "}
        <span className="">{props?.data[0]}</span>
      </div>
      <button
        className="bg-blue-400 shadow-2xs border py-1 px-2 rounded-sm"
        onClick={() => props?.data[1]()}
      >
        Increase Parent Count
      </button>

      {/* <Child data={[parentCount, handleChildCount]} /> */}
    </div>
  );
}

export default Child;
