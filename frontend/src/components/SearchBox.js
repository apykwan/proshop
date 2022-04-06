import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Form, FormControl, Button } from 'react-bootstrap';

const SearchBox = () => {
    const [keyword, setKeyword] = useState('');
    const history = useHistory();

    const submitHandler = e => {
        e.preventDefault();
        
        if (!keyword.trim()) return history.push('/');

        history.push(`/search/${keyword}`);
    };

    return (
        <Form onSubmit={submitHandler} className="d-flex">
          <Form.Control
            type='text'
            name='query'
            onChange={(e) => setKeyword(e.target.value)}
            placeholder='Search Products...'
            className='mr-sm-2 ml-sm-5'
          ></Form.Control>
          <Button type='submit' variant='outline-success' className='p-2'>
            Search
          </Button>
        </Form>
    )
}

export default SearchBox;