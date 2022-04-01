import axios from 'axios';

import { 
    ORDER_CREATE_REQUEST, 
    ORDER_CREATE_SUCCESS, 
    ORDER_CREATE_FAIL,
    ORDER_DETAILS_REQUEST, 
    ORDER_DETAILS_SUCCESS, 
    ORDER_DETAILS_FAIL 
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
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            };

            const { data } = await axios.get(`/api/orders/${id}`, config);
            console.log(data);
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