import {useState, useEffect} from 'react';
import { Link } from 'react-router-dom';
import { Form, Button, Row, Col, Image } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';

import Loader from '../components/Loader';
import Message from '../components/Message';
import FormContainer from '../components/FormContainer';
import { listProductDetails, updateProduct, resetProduct } from '../actions/productActions';

const ProductEditScreen = ({ match, history }) => {
    const productId = match.params.id;
    const { error, product, loading } = useSelector(state => state.productDetails);
    const { loading: loadingUpdate, error: errorUpdate, success: successUpdate } = useSelector(state => state.productUpdate);

    const [name, setName] = useState('');
    const [price, setPrice] = useState(0);
    const [image, setImage] = useState('');
    const [brand, setBrand] = useState('');
    const [category, setCategory] = useState('');
    const [countInStock, setCountInStock] = useState(0);
    const [description, setDescription] = useState('');
    const [previewImage, setPreviewImage] = useState(image);

    const dispatch = useDispatch();

    useEffect(() => {
        if (successUpdate) {
            dispatch(resetProduct);
            return history.push('/admin/productlist');
        }

        if (!product.name || product._id !== productId) return dispatch(listProductDetails(productId));
           
        setName(product.name);
        setPrice(product.price);
        setImage(product.image);
        setBrand(product.brand);
        setCategory(product.category);
        setCountInStock(product.countInStock);
        setDescription(product.description);
    }, [product, productId, dispatch, successUpdate, history]);

    const submitHandler = e => {
        e.preventDefault();

        let productData = new FormData();
        productData.append('name', name);
        productData.append('price', price);
        image && productData.append('image', image);
        productData.append('brand', brand);
        productData.append('category', category);
        productData.append('description', description);
        productData.append('countInStock', countInStock);

        dispatch(updateProduct(productId, productData));
    };

    return (
        <div>
            <Link 
                to="/admin/productList" 
                className="btn btn-light my-3"
            >
                Go Back
            </Link>
            <h1>Edit Product</h1>
            {loadingUpdate && <Loader />}
            {errorUpdate && <Message variant="danger">{errorUpdate}</Message>}
            {loading 
                ? <Loader />
                : error
                ?  <Message variant="danger">{error}</Message>
                : (<FormContainer>
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

                            <Form.Group controlId="price" className="mb-3">
                                <Form.Label>Price</Form.Label>
                                <Form.Control 
                                    type="number" 
                                    placeholder="Enter Price"
                                    value={price}
                                    onChange={e => setPrice(e.target.value)}
                                >
                                </Form.Control>
                            </Form.Group>
                            
                            <Form.Group controlId="price" className="mb-3">
                                <Form.Label>Image</Form.Label>
                                <Row>
                                    <Col sm={12} md={5}>
                                        <Image 
                                            src={previewImage ? previewImage : image} 
                                            alt={name} 
                                            fluid 
                                            rounded 
                                        />
                                    </Col>
                                    <Col sm={12} md={7}>
                                        <Form.Control 
                                            type="file"
                                            accept="image/*"
                                            placeholder="Upload an Image"
                                            onChange={e => {
                                                setPreviewImage(URL.createObjectURL(e.target.files[0]));
                                                setImage(e.target.files[0]);
                                            }}
                                        >
                                        </Form.Control>
                                    </Col>
                                </Row>
                                
                            </Form.Group>

                            <Form.Group controlId="brand" className="mb-3">
                                <Form.Label>Brand</Form.Label>
                                <Form.Control 
                                    type="text" 
                                    placeholder="Enter Brand"
                                    value={brand}
                                    onChange={e => setBrand(e.target.value)}
                                >
                                </Form.Control>
                            </Form.Group>

                            <Form.Group controlId="category" className="mb-3">
                                <Form.Label>Category</Form.Label>
                                <Form.Control 
                                    type="text" 
                                    placeholder="Enter Category"
                                    value={category}
                                    onChange={e => setCategory(e.target.value)}
                                >
                                </Form.Control>
                            </Form.Group>

                            <Form.Group controlId="countInStock" className="mb-3">
                                <Form.Label>Count in Stock</Form.Label>
                                <Form.Control 
                                    type="number" 
                                    placeholder="Available Stock"
                                    value={countInStock}
                                    onChange={e => setCountInStock(e.target.value)}
                                >
                                </Form.Control>
                            </Form.Group>

                            <Form.Group controlId="description" className="mb-3">
                                <Form.Label>Description</Form.Label>
                                <Form.Control 
                                    type="text" 
                                    placeholder="Enter Category"
                                    value={description}
                                    onChange={e => setDescription(e.target.value)}
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
                    </FormContainer>
            )}
        </div>
    )
}

export default ProductEditScreen;