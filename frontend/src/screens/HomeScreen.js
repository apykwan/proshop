import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Row, Col } from 'react-bootstrap';

import { listProducts } from '../actions/productActions';
import Product from '../components/Product';
import Message from '../components/Message';
import Loader from '../components/Loader';

const HomeScreen = () => {
  const dispatch = useDispatch();
  
  const { products, error, loading } = useSelector(state => state.productList);

  useEffect(() => {
    dispatch(listProducts());
  }, []);

  const productList = useMemo(() => {
      return products.map(product => (
        <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
          <Product product={product} />
        </Col>
      ));
    }, [products]);

  return (
    <>
        <h1>Latest Products</h1>
        {loading 
          ? <Loader />
          : error 
          ? <Message variant="danger">{error}</Message> 
          : (
            <Row>
              {productList}
            </Row>
          )}
    </>
  );
}

export default HomeScreen;