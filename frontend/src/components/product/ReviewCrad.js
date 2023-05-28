import { Rating } from "@material-ui/lab";
import React from "react";
// import profilePng from "../../images/Profile.png";

const ReviewCard = ({ review }) => {
  const options = {
    value: review.rating,
    readOnly: true,
    precision: 0.5,
  };

  return (
    <div className="reviewCard">
      <img src="https://m.media-amazon.com/images/W/IMAGERENDERING_521856-T2/images/I/816YxAP-6kL._AC_UL600_FMwebp_QL65_.jpg" alt="User" />
      <p>{review.name}</p>
      <Rating {...options} />
      <span className="reviewCardComment">{review.comment}</span>
    </div>
  );
};

export default ReviewCard;