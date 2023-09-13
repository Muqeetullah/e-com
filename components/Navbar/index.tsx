import React from "react";
import NavUI from "./navbar";

const Navbar = () => {
  return (
    <div>
      <NavUI cartItemsCount={2} />
    </div>
  );
};

export default Navbar;
