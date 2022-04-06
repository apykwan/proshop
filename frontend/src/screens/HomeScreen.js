import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Row, Col } from 'react-bootstrap';

import { listProducts } from '../actions/productActions';
import Product from '../components/Product';
import Message from '../components/Message';
import Loader from '../components/Loader';
import Paginate from '../components/Paginate';

const HomeScreen = ({ match }) => {
  const dispatch = useDispatch();
  const keyword = match.params.keyword;
  const pageNumber = match.params.pageNumber;
  
  const { products, error, loading } = useSelector(state => state.productList);

  useEffect(() => {
    dispatch(listProducts(keyword, pageNumber));
  }, [dispatch, keyword, pageNumber]);

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
            <>
              <Row>
                {productList}
              </Row>
              <Paginate keyword={keyword ? keyword : ''} />
            </>
          )}
    </>
  );
}

export default HomeScreen;