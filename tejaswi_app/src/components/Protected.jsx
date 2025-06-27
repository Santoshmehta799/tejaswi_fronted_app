/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from "react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

function Protected(props) {
    const { Component } = props;
    const navigate = useNavigate();

    useEffect(() => {
        let token = Cookies.get("access");
        if (!token) {
            navigate("/login");
        }
    }, []);

    return (
        <div>
            <Component />
        </div>
    );
}

export default Protected;