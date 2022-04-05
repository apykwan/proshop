import { useEffect, useMemo } from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import { Table, Button, Row, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';

import Loader from '../components/Loader';
import Message from '../components/Message';
import { 
    listProducts, 
    deleteProduct,
    createProduct,
    resetProduct
} from '../actions/productActions';
import { priceComa } from '../utils/helper';

const ProductListScreen = ({ history, match }) => {
    const dispatch = useDispatch();

    const { loading, error, products } = useSelector(state => state.productList);
    const { userInfo } = useSelector(state => state.userLogin);
    const {
        success: successDelete, 
        loading: loadingDelete, 
        error: errorDelete
    } = useSelector(state => state.productDelete);
    const { 
        success: successCreate, 
        product: createdProduct, 
        error: errorCreate,
        loading: loadingCreate
    } = useSelector(state => state.productCreate);

    useEffect(() => {
        dispatch(resetProduct());

        if (!userInfo.isAdmin) return history.push('/login');
        if (successCreate) return history.push(`/admin/product/${createdProduct._id}/edit`);

        dispatch(listProducts());
    }, [userInfo, dispatch, history, successCreate, createdProduct, successDelete]);

    const createProductHandler = () => {
        // using dummy data
        dispatch(createProduct());
    };

    const productTable = useMemo(() => (
        products?.map(product => (
                <tr key={product._id}>
                    <td>{product._id}</td>
                    <td>{product.name}</td>
                    <td>${priceComa(product.price)}</td>
                    <td>{product.category}</td>
                    <td>{product.brand}</td>
                    <td>
                        <LinkContainer to={`/admin/product/${product._id}/edit`}>
                            <Button variant="light" className="btn-sm">
                                <i className="fas fa-edit"></i>
                            </Button>
                        </LinkContainer>
                        <Button 
                            variant="danger" 
                            className="btn-sm mx-3" 
                            onClick={() => {
                                if (window.confirm('Are your sure?')) {
                                    dispatch(deleteProduct(product._id));
                                }
                            }}
                        >
                            <i className="fas fa-trash"></i>
                        </Button>
                    </td>
                </tr>
        ))
    ), [products, dispatch]);

    return (
        <div>
            <Row className="align-items-center">
                <Col>
                    <h1>Products</h1>
                </Col>
                <Col className="text-right">
                    <Button 
                        className="my-3" 
                        onClick={createProductHandler}
                    >
                        <i className="fas fa-plus"></i> Create Product
                    </Button>
                </Col>
            </Row>
            {loadingDelete && <Loader />}
            {errorDelete && <Message variant="danger">{errorDelete}</Message>}
            {loadingCreate && <Loader />}
            {errorCreate && <Message variant="danger">{errorCreate}</Message>}
            {loading 
                ? <Loader /> 
                : error 
                ? <Message variant="danger">{error}</Message>
                : (
                    <Table striped bordered hover responsive className="table-sm">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>NAME</th>
                                <th>PRICE</th>
                                <th>CATEGORY</th>
                                <th>BRAND</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {productTable}
                        </tbody>
                    </Table>
                )}
        </div>
    )
}

export default ProductListScreen;