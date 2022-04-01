import {useState, useEffect} from 'react';
import { Link } from 'react-router-dom';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';

import Loader from '../components/Loader';
import Message from '../components/Message';
import FormContainer from '../components/FormContainer';
import { register, clearError } from '../actions/userActions';

const RegisterScreen = ({ location, history }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');

    const dispatch = useDispatch();

    const { error, userInfo, loading } = useSelector(state => state.userRegister);

    const redirect = location.search ? location.search.split('=')[1] : "/";

    useEffect(() => {
        if (userInfo) {
            history.push(redirect);
        }
    }, [history, userInfo, redirect]);

    useEffect(() => {
        setTimeout(() => {
            setMessage('');
            dispatch(clearError());
        }, 1500);

        return () => {
            clearTimeout();
        }
        
    }, [name, email, password, confirmPassword, dispatch]);

    const submitHandler = e => {
        e.preventDefault();
        if (password !== confirmPassword) {
            return setMessage('Password do not match!!!');
        }

        dispatch(register(name, email, password));
    };

    return (
        <FormContainer>
            <h1>Sign Up</h1>
            {message && <Message variant="danger">{message}</Message>}
            {error && <Message variant="danger">{error}</Message>}
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
                    Register
                </Button>
            </Form>

            <Row className="py-3">
                <Col>
                    Have an account? {' '} 
                    <Link to={redirect ? `/login?redirect=${redirect}` : '/login'}>
                        Log In
                    </Link>
                </Col>
            </Row>
        </FormContainer>
    )
}

export default RegisterScreen;