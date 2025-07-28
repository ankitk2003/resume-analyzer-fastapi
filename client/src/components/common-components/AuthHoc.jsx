import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AuthHoc = (WrappedComponent) => {
  return function WithAuth(props) {
    const navigate = useNavigate();
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/"); 
      } else {
        setIsAuthenticated(true);
      }
    }, [navigate]);

    return isAuthenticated ? <WrappedComponent {...props} /> : null;
  };
};

export default AuthHoc;
