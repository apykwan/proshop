import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { Pagination } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

const Paginate = ({ keyword = "" }) => {
    const { pages, page } = useSelector(state => state.productList);

    const location = useLocation();
    const path = location.pathname.split('/page/')[0];
    const baseURL = path === '/' ? '' : path;
    return (
        pages > 1 && (
            <Pagination className="mt-4">
                {[...Array(pages).keys()].map(x => (
                    <LinkContainer
                        key={x + 1}
                        to={
                            keyword
                                ? `search/${keyword}/${baseURL}/page/${x + 1}`
                                : `${baseURL}/page/${x + 1}`
                        }
                    >
                        <Pagination.Item active={x + 1 === page} activeLabel={false}>
                            {x + 1}
                        </Pagination.Item>
                    </LinkContainer>
                ))}
            </Pagination>
        )
    )
}

export default Paginate;