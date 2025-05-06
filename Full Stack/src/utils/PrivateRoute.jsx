import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { getUser } from '../redux/Auth/Action';

const PrivateRoute = ({ children }) => {
    const dispatch = useDispatch()
    const { user } = useSelector((state) => state.auth);

    useEffect(() => {
        const token = localStorage.getItem("jwt");
        if (token) {
            dispatch(getUser(token));
        }
    }, [dispatch]);

    return user ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
