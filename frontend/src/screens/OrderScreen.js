import { useEffect, useState } from 'react';
import axios from 'axios';
import { Row, Col, ListGroup, Image, Card } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { PayPalButton } from 'react-paypal-button-v2';
import moment from 'moment';

import Loader from '../components/Loader';
import { getOrderDetails, payOrder, resetOrderPay } from '../actions/orderActions';
import { emptyCartItems } from '../actions/cartActions';
import Message from '../components/Message';

const OrderScreen = ({ match }) => {
    const orderId = match.params.id;

    const [sdkReady, setSdkReady] = useState(false);

    const dispatch = useDispatch();
    const { order, loading, error } = useSelector(state => state.orderDetails);
    const { loading: loadingPay, success: successPay } = useSelector(state => state.orderPay);

    useEffect(() => {
        const addPayPalScript = async () => {
            const { data: clientId } = await axios.get('/api/config/paypal');
            const script = document.createElement('script');
            script.type = 'text/javascript';
            script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}`;
            script.async = true;
            script.onload = () => {
                setSdkReady(true);
            };
            document.body.appendChild(script);
        };    

        if(!order || order._id !== orderId || successPay) {
            dispatch(resetOrderPay());
            dispatch(getOrderDetails(orderId));
        }

        if (order && !order.isPaid) {
            if(!window.paypal) {
                addPayPalScript();
            } else {
                setSdkReady(true);
            }
        }
    }, [dispatch, order, orderId, successPay]);

    const successPaymentHandler = paymentResult => {
        dispatch(payOrder(orderId, paymentResult));
        dispatch(emptyCartItems());
    }

    return (
        loading 
            ? <Loader /> 
            : error 
            ? <Message variant="danger">{error}</Message>
            : <>
                <Row>
                    <Col md={8}>
                        <ListGroup variant="flush">
                            <ListGroup.Item>
                                <h2>Shipping</h2>
                                <strong>Name: </strong> {order.user.name} <br />
                                <strong>Email: </strong><a href={`mailto:${order.user.email}`}>{order.user.email}</a>
                                <p>
                                    <strong>Address: </strong>
                                    {order.shippingAddress.address}, {' '}
                                    {order.shippingAddress.city}{' '}
                                    {order.shippingAddress.postalCode}, {' '}
                                    {order.shippingAddress.country}
                                </p>
                                {order.isDelivered 
                                    ? <Message variant="success">Delivered on {moment(order.deliveredAt).format('LLLL')}</Message>
                                    : <Message variant="warning">Not Delivered</Message>
                                }
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <h2>Payment Method</h2>
                                <p>
                                    <strong>Method: </strong>
                                    {order.paymentMethod}
                                </p>
                                {order.isPaid 
                                    ? <Message variant="success">Paid on {moment(order.paidAt).format('LLLL')}</Message>
                                    : <Message variant="warning">Not Paid</Message>
                                }
                            </ListGroup.Item>

                            <ListGroup.Item>
                                <h2>Order Items</h2>
                                {order.orderItems.length === 0 
                                    ? <Message>Your Cart is Empty!</Message>
                                    : (
                                        <ListGroup variant="flush">
                                            {order.orderItems.map((item, index) => (
                                                <ListGroup.Item key={index}>
                                                    <Row>
                                                        <Col md={1}>
                                                            <Image src={item.image} alt={item.name} fluid rounded />
                                                        </Col>
                                                        <Col>
                                                            <Link to={`/product/${item.product}`}>
                                                                {item.name}
                                                            </Link>
                                                        </Col>
                                                        <Col md={4}>
                                                            {item.qty} X ${item.price} = ${item.qty * item.price}
                                                        </Col>
                                                    </Row>
                                                </ListGroup.Item>
                                            ))}
                                        </ListGroup>
                                )}
                            </ListGroup.Item>
                        </ListGroup>
                    </Col>
                    <Col md={4}>
                        <Card>
                            <ListGroup variant="flush">
                                <ListGroup.Item>
                                    <h2>Order Summary</h2>
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <Row>
                                        <Col>Items</Col>
                                        <Col>${order.itemsPrice}</Col>
                                    </Row>
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <Row>
                                        <Col>Shipping</Col>
                                        <Col>${order.shippingPrice}</Col>
                                    </Row>
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <Row>
                                        <Col>Tax</Col>
                                        <Col>${order.taxPrice}</Col>
                                    </Row>
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <Row>
                                        <Col>Total</Col>
                                        <Col>${order.totalPrice}</Col>
                                    </Row>
                                </ListGroup.Item>
                                {!order.isPaid && (
                                    <ListGroup.Item>
                                        {loadingPay && <Loader />}
                                        {!sdkReady ? <Loader /> : (
                                            <PayPalButton 
                                                amount={order.totalPrice}  
                                                onSuccess={successPaymentHandler}
                                            />
                                        )}
                                    </ListGroup.Item>
                                )}
                            </ListGroup>
                        </Card>
                    </Col>
                </Row>
            </>
    )
}

export default OrderScreen;