import React from "react";
import PrivateRoute from "~root/src/features/routes/PrivateRoute";
import Home from "./home";

const Index = () => {
  return <Home />;
};

export default PrivateRoute(Index);
