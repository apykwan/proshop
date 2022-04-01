import { Nav } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

const CheckoutSteps = ({ step1, step2, step3, step4, location }) => {
    const path = location.pathname.split('/')[1];

    return (
        <Nav className="justify-content-center mb-4">
            <Nav.Item>
                {step1 ? (
                    <LinkContainer to="/login">
                        <Nav.Link>Sign In</Nav.Link>
                    </LinkContainer>
                ) : (
                    <Nav.Link disabled>
                        Sign In
                    </Nav.Link>
                )}
            </Nav.Item>

            <Nav.Item>
                {step2 ? (
                    <LinkContainer 
                        to="/shipping"
                        className={path === "shipping" ? "checkoutSteps" : ""}
                    >
                        <Nav.Link>Shipping</Nav.Link>
                    </LinkContainer>
                ) : (
                    <Nav.Link disabled>
                        Shipping
                    </Nav.Link>
                )}
            </Nav.Item>
            <Nav.Item>
                {step3 ? (
                    <LinkContainer 
                        to="/payment"
                        className={path === "payment" ? "checkoutSteps" : ""}
                    >
                        <Nav.Link>Payment</Nav.Link>
                    </LinkContainer>
                ) : (
                    <Nav.Link disabled>
                        Payment
                    </Nav.Link>
                )}
            </Nav.Item>
            <Nav.Item>
                {step4 ? (
                    <LinkContainer 
                        to="/placeorder"
                        className={path === "placeorder" ? "checkoutSteps" : ""}
                    >
                        <Nav.Link>Place Order</Nav.Link>
                    </LinkContainer>
                ) : (
                    <Nav.Link disabled>
                        Place Order
                    </Nav.Link>
                )}
            </Nav.Item>
        </Nav>
    )
}

export default CheckoutSteps;