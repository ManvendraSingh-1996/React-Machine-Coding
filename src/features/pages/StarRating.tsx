import { StarIcon } from "lucide-react";
import { useState } from "react";

export const StarRating = ({ starCount = 5 }) => {
  const [rating, setRating] = useState<number>();
  const [hoverRating, setHoverRating] = useState<number>();
  //   const Stars = () => (
  //     <span className="star">
  //       <StarIcon />
  //     </span>
  //   );
  console.log(rating);

  return (
    <div>
      <h1 className="">Star Rating</h1>
      <div className="flex p-1 m-1 gap-1">
        {Array.from({ length: starCount }, (_, index) => (
          <span
            className={`p-1 rounded-md cursor-pointer transition-colors  ${
              (rating && index < rating) || (hoverRating && index < hoverRating)
                ? "bg-yellow-400 text-white  hover:bg-yellow-300"
                : "bg-gray-200 "
            }`}
            key={index}
            onClick={() => setRating(index + 1)}
            onMouseEnter={() => setHoverRating(index + 1)}
            onMouseLeave={() => setHoverRating(rating)}
          >
            <StarIcon />
          </span>
        ))}
      </div>
    </div>
  );
};
