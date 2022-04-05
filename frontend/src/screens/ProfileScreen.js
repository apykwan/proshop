import {useState, useEffect, useMemo } from 'react';
import { Form, Table, Button, Row, Col } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { useDispatch, useSelector } from 'react-redux';

import Message from '../components/Message';
import Loader from '../components/Loader';
import { getUserDetails, updateUserProfile, resetUserProfile, clearError } from '../actions/userActions';
import { listMyOrders } from '../actions/orderActions';

const ProfileScreen = ({ history }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');

    const dispatch = useDispatch();

    const { error, loading, user } = useSelector(state => state.userDetails);
    const { userInfo } = useSelector(state => state.userLogin);
    const { success } = useSelector(state => state.userUpdateProfile);
    const { loading: loadingOrders, error: errorOrders, orders} = useSelector(state => state.orderListMy);

    useEffect(() => {
        if (!userInfo) {
            history.push('/login');
        } else {
            if (!user ||!user.name || success) {
                dispatch(resetUserProfile());
                dispatch(getUserDetails('profile'));
                dispatch(listMyOrders());
            } else {
                setName(user.name);
                setEmail(user.email);
            }
        }
    }, [history, userInfo, user, dispatch, success]);

    useEffect(() => {
        setTimeout(() => {
            setMessage('');
            dispatch(clearError());
        }, 3000);

        return () => {
            clearTimeout();
        }
        
    }, [name, email, password, confirmPassword, dispatch]);

    const submitHandler = e => {
        e.preventDefault();
        if (password !== confirmPassword) {
            return setMessage('Password do not match!!!');
        } else {
            dispatch(updateUserProfile({
                id: user._id,
                name,
                email, 
                password
            }));
        }
    };

    const profileTable = useMemo(() => {
        return (
            orders?.map(order => (
                <tr key={order._id}>
                    <td>{order._id}</td>
                    <td>{order.createdAt.substring(0, 10)}</td>
                    <td>$ {order.totalPrice}</td>
                    <td>{order.isPaid 
                            ? order.paidAt.substring(0, 10) 
                            : (
                                <i className="fas fa-times text-danger"></i>
                            )}
                    </td>
                    <td>{order.isDelivered 
                            ? order.deliveredAt.substring(0, 10) 
                            : (
                                <i className="fas fa-times text-danger"></i>
                            )}
                    </td>
                    <td>
                        <LinkContainer to={`/order/${order._id}`}>
                            <Button className="btn-sm" variant="light">
                                Details
                            </Button>
                        </LinkContainer>
                    </td>
                </tr>
            ))
        )
    }, [orders]);

    return (
        <Row>
            <Col md={3}>
                <h2>User Profile</h2>
                {message && <Message variant="danger">{message}</Message>}
                {error && <Message variant="danger">{error}</Message>}
                {success && <Message variant="success">Updated Successfully</Message>}
                {loading && <Loader />}
                <Form onSubmit={submitHandler}>
                    <Form.Group controlId="name" className="mb-3">
                        <Form.Label>Your Name</Form.Label>
                        <Form.Control 
                            type="text" 
                            placeholder="Enter Your Name"
                            value={name}
                            onChange={e => setName(e.target.value)}
                        >
                        </Form.Control>
                    </Form.Group>

                    <Form.Group controlId="email" className="mb-3">
                        <Form.Label>Email Address</Form.Label>
                        <Form.Control 
                            type="email" 
                            placeholder="Enter Email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                        >
                        </Form.Control>
                    </Form.Group>
                    
                    <Form.Group controlId="password" className="mb-3">
                        <Form.Label>Password</Form.Label>
                        <Form.Control 
                            type="password" 
                            placeholder="Enter Password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                        >
                        </Form.Control>
                    </Form.Group>

                    <Form.Group controlId="confirmPassword" className="mb-3">
                        <Form.Label>Confirm Password</Form.Label>
                        <Form.Control 
                            type="password" 
                            placeholder="Confirm Password"
                            value={confirmPassword}
                            onChange={e => setConfirmPassword(e.target.value)}
                        >
                        </Form.Control>
                    </Form.Group>

                    <Button 
                        type="submit" 
                        variant="primary"
                    >
                        Update
                    </Button>
                </Form>
            </Col>
            <Col md={9}>
                <h2>My Orders</h2>
                {loadingOrders 
                    ? <Loader /> 
                    : errorOrders 
                    ? <Message variant="danger">{errorOrders}</Message> 
                    : (
                        <Table striped border hover responsive className="table-sm">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>DATE</th>
                                    <th>TOTAL</th>
                                    <th>PAID</th>
                                    <th>DELIVERED</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {profileTable}
                            </tbody>
                        </Table>
                    )}
            </Col>
        </Row>
    )
}

export default ProfileScreen;