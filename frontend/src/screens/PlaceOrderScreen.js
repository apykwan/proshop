import {useEffect } from 'react';
import { Button, Row, Col, ListGroup, Image, Card } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import CheckoutSteps from '../components/CheckoutSteps';
import { createOrder } from '../actions/orderActions';
import Message from '../components/Message';
import { priceComa } from '../utils/helper';

const PlaceOrderScreen = ({ location, history }) => {
    const dispatch = useDispatch();
    let { 
        cartItems, 
        shippingAddress, 
        paymentMethod,
        itemsPrice,
        shippingPrice,
        taxPrice,
        totalPrice 
    } = useSelector(state => state.cart);

    // Calculate Prices
    const addDecimals = num => {
        return (Math.round(num * 100) / 100).toFixed(2)
    };

    itemsPrice = addDecimals(cartItems.reduce((acc, item) => acc + item.price * item.qty, 0));
    shippingPrice = addDecimals(itemsPrice > 29.99 ? 0 : 29.99);
    taxPrice = addDecimals(Number((0.15 * itemsPrice).toFixed(2)));
    totalPrice = (Number(itemsPrice) + Number(shippingPrice) + Number(taxPrice)).toFixed(2);

    const { order, success, error } = useSelector(state => state.orderCreate);

    useEffect(() => {
        if (success) {
            history.push(`/order/${order._id}`);
        }
    }, [history, success, order]);
    
    const placeOrderHandler = e => {
        e.preventDefault();

        dispatch(createOrder({
            orderItems: cartItems,
            shippingAddress,
            paymentMethod,
            itemsPrice,
            taxPrice,
            totalPrice
        }));
    }
    return (
        <div>
            <CheckoutSteps step1 step2 step3 step4 location={location} />
            <Row>
                <Col md={8}>
                    <ListGroup variant="flush">
                        <ListGroup.Item>
                            <h2>Shipping</h2>
                            <p>
                                <strong>Address: </strong>
                                {shippingAddress.address}, {' '}
                                {shippingAddress.city}{' '}
                                {shippingAddress.postalCode}, {' '}
                                {shippingAddress.country}
                            </p>
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <h2>Payment Method</h2>
                            <strong>Method: </strong>
                            {paymentMethod}
                        </ListGroup.Item>

                        <ListGroup.Item>
                            <h2>Order Items</h2>
                            {cartItems.length === 0 
                                ? <Message>Your Cart is Empty!</Message>
                                : (
                                    <ListGroup variant="flush">
                                        {cartItems.map((item, index) => (
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
                                                        {item.qty} X ${item.price} = ${priceComa(item.qty * item.price)}
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
                                    <Col>${priceComa(itemsPrice)}</Col>
                                </Row>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Row>
                                    <Col>Shipping</Col>
                                    <Col>${shippingPrice}</Col>
                                </Row>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Row>
                                    <Col>Tax</Col>
                                    <Col>${priceComa(taxPrice)}</Col>
                                </Row>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Row>
                                    <Col>Total</Col>
                                    <Col>${priceComa(totalPrice)}</Col>
                                </Row>
                            </ListGroup.Item>
                            {error && <ListGroup.Item>
                                <Message variant="danger">{error}</Message>
                            </ListGroup.Item>}
                            <ListGroup.Item>
                                <Button 
                                    type="button" 
                                    className="btn-block" 
                                    disabled={cartItems === 0}
                                    onClick={placeOrderHandler}
                                >
                                    Place PlaceOrderScreen
                                </Button>
                            </ListGroup.Item>
                        </ListGroup>
                    </Card>
                </Col>
            </Row>
        </div>
    )
}

export default PlaceOrderScreen;