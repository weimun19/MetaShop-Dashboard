import React from "react";
import "./TopRankingCard.css";
import { BsFire } from "react-icons/bs";

const TopRankingCard = ({ title, data }) => {
  // assuming the data is sorted properly
  // Get the top 3 cards
  const topThree = data.slice(0, 3);

  return (
    <div className="ranking">
      <h2>
        {title} <BsFire />
      </h2>
      {topThree.map((card, index) => (
        <div className="individualRank" key={index}>
          <h3>{"Top " + card.ranking}</h3>
          <p>{card.item + " (" + card.description + ")"}</p>
          {/* Display other card details as needed */}
        </div>
      ))}
    </div>
  );
};

export default TopRankingCard;
