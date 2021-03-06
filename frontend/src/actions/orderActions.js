import axios from 'axios';

import { 
    ORDER_CREATE_REQUEST, 
    ORDER_CREATE_SUCCESS, 
    ORDER_CREATE_FAIL,
    ORDER_DETAILS_REQUEST, 
    ORDER_DETAILS_SUCCESS, 
    ORDER_DETAILS_FAIL,
    ORDER_PAY_REQUEST, 
    ORDER_PAY_SUCCESS, 
    ORDER_PAY_FAIL,
    ORDER_PAY_RESET,
    ORDER_LIST_MY_REQUEST, 
    ORDER_LIST_MY_SUCCESS, 
    ORDER_LIST_MY_FAIL,
    ORDER_LIST_REQUEST, 
    ORDER_LIST_SUCCESS, 
    ORDER_LIST_FAIL,
    ORDER_DELIVER_REQUEST, 
    ORDER_DELIVER_SUCCESS, 
    ORDER_DELIVER_FAIL,
    ORDER_DELIVER_RESET   
} from '../constants/orderConstants';

export const createOrder = order => {
    return async (dispatch, getState) => {
        try {
            dispatch({
                type: ORDER_CREATE_REQUEST,
            });

            const { token } = getState().userLogin.userInfo;
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            };

            const { data } = await axios.post(`/api/orders`, order, config);

            dispatch({
                type: ORDER_CREATE_SUCCESS,
                payload: data
            });
        } catch (error) {
            dispatch({
                type: ORDER_CREATE_FAIL,
                payload: error.response && error.response.data.message 
                    ? error.response.data.message
                    : error.message
            });
        }
    }
};

export const getOrderDetails = id => {
    return async (dispatch, getState) => {
        try {
            dispatch({
                type: ORDER_DETAILS_REQUEST,
            });

            const { token } = getState().userLogin.userInfo;
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            };

            const { data } = await axios.get(`/api/orders/${id}`, config);

            dispatch({
                type: ORDER_DETAILS_SUCCESS,
                payload: data
            });
        } catch (error) {
            dispatch({
                type: ORDER_DETAILS_FAIL,
                payload: error.response && error.response.data.message 
                    ? error.response.data.message
                    : error.message
            });
        }
    }
};

export const payOrder = (orderId, paymentResult) => {
    return async (dispatch, getState) => {
        try {
            dispatch({
                type: ORDER_PAY_REQUEST,
            });

            const { token } = getState().userLogin.userInfo;
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            };

            const { data } = await axios.put(`/api/orders/${orderId}/pay`, paymentResult, config);
 
            dispatch({
                type: ORDER_PAY_SUCCESS,
                payload: data
            });
        } catch (error) {
            dispatch({
                type: ORDER_PAY_FAIL,
                payload: error.response && error.response.data.message 
                    ? error.response.data.message
                    : error.message
            });
        }
    }
};

export const deliverOrder = orderId => {
    return async (dispatch, getState) => {
        try {
            dispatch({
                type: ORDER_DELIVER_REQUEST,
            });

            const { token } = getState().userLogin.userInfo;
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            };

            const { data } = await axios.put(`/api/orders/${orderId}/deliver`, {}, config);
 
            dispatch({
                type: ORDER_DELIVER_SUCCESS,
                payload: data
            });
        } catch (error) {
            dispatch({
                type: ORDER_DELIVER_FAIL,
                payload: error.response && error.response.data.message 
                    ? error.response.data.message
                    : error.message
            });
        }
    }
};

export const listMyOrders = () => {
    return async (dispatch, getState) => {
        try {
            dispatch({
                type: ORDER_LIST_MY_REQUEST,
            });

            const { token } = getState().userLogin.userInfo;
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            };

            const { data } = await axios.get(`/api/orders/myorders`, config);

            dispatch({
                type: ORDER_LIST_MY_SUCCESS,
                payload: data
            });
        } catch (error) {
            dispatch({
                type: ORDER_LIST_MY_FAIL,
                payload: error.response && error.response.data.message 
                    ? error.response.data.message
                    : error.message
            });
        }
    }
};

export const listOrders = () => {
    return async (dispatch, getState) => {
        try {
            dispatch({
                type: ORDER_LIST_REQUEST,
            });

            const { token } = getState().userLogin.userInfo;
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            };

            const { data } = await axios.get(`/api/orders`, config);

            dispatch({
                type: ORDER_LIST_SUCCESS,
                payload: data
            });
        } catch (error) {
            dispatch({
                type: ORDER_LIST_FAIL,
                payload: error.response && error.response.data.message 
                    ? error.response.data.message
                    : error.message
            });
        }
    }
};

export const resetOrder = () => {
    return dispatch => {
        dispatch({ type: ORDER_PAY_RESET });
        dispatch({ type: ORDER_DELIVER_RESET });
    };
};