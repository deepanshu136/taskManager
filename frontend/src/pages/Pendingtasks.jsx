import React from "react";
import Cards from "../components/Home/Cards";

const Pendingtasks = () => {
  return (
    <div>
      {/* Change home={false} to pass boolean, not string */}
      <Cards home={false} />
    </div>
  );
};

export default Pendingtasks;
