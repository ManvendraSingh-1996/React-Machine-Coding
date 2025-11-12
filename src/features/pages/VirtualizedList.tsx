import React, { useState } from "react";

const VirtualizedList: React.FC = () => {
  const height = 400;
  const itemHeight = 35;
  const LIST = Array.from({ length: 20 }, (_, index) => index + 1);
  const [indices, setIndices] = useState([0, Math.floor(height / itemHeight)]);
  const virtualList = LIST.slice(indices[0], indices[1] + 1);
  //   console.log("visibleList : ", virtualList);
  const handleScroll = (e: { target: { scrollTop: any } }) => {
    const { scrollTop } = e.target;
    const startIndex = Math.floor(scrollTop / itemHeight);
    const lastIndex = startIndex + Math.floor(height / itemHeight);
    // console.log(scrollTop);
    setIndices([startIndex, lastIndex]);
  };

  return (
    <div className="">
      <div
        className=" w-1/3 border shadow-2xs m-1 bg-amber-100 relative overflow-auto"
        style={{ height: height }}
        onScroll={handleScroll}
      >
        <ul
          className=" w-full absolute overflow-auto "
          style={{ height: itemHeight * LIST.length }}
        >
          {LIST &&
            virtualList.map((item, index) => (
              <li
                className="h-[35px] w-full py-2 border "
                key={index}
                style={{
                  position: "absolute",
                  top: (indices[0] + index) * itemHeight,
                }}
              >
                Item {" " + item}
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
};

export default VirtualizedList;
