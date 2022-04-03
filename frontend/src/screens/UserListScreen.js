import { useEffect, useMemo } from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import { Table, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';

import Loader from '../components/Loader';
import Message from '../components/Message';
import { listUsers, deleteUser } from '../actions/userActions';

const UserListScreen = ({ history }) => {
    const dispatch = useDispatch();

    const { loading, error, users } = useSelector(state => state.userList);
    const { userInfo } = useSelector(state => state.userLogin);
    const { success: successDelete } = useSelector(state => state.userDelete);

    useEffect(() => {
        if (userInfo && userInfo.isAdmin) return dispatch(listUsers());
        
        if (!userInfo) return history.push('/login');

        history.push('/');
    }, [userInfo, dispatch, history, successDelete]);

    const userTable = useMemo(() => (
        users?.map(user => (
                <tr key={user._id}>
                    <td>{user._id}</td>
                    <td>{user.name}</td>
                    <td><a href={`mailto:${user.email}`}>{user.email}</a></td>
                    <td>
                        {user.isAdmin 
                            ? (
                                <i className="fas fa-check text-success"></i>
                            ) : (
                                <i className="fas fa-times text-danger"></i>
                            )}
                    </td>
                    <td>
                        <LinkContainer to={`/admin/user/${user._id}/edit`}>
                            <Button variant="light" className="btn-sm">
                                <i className="fas fa-edit"></i>
                            </Button>
                        </LinkContainer>
                        <Button 
                            variant="danger" 
                            className="btn-sm mx-3" 
                            onClick={() => {
                                if (window.confirm('Are your sure?')) {
                                    dispatch(deleteUser(user._id));
                                }
                            }}
                        >
                            <i className="fas fa-trash"></i>
                        </Button>
                    </td>
                </tr>
        ))
    ), [users, dispatch]);

    return (
        <div>
            <h1>Users</h1>
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
                                <th>EMAIL</th>
                                <th>ADMIN</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {userTable}
                        </tbody>
                    </Table>
                )}
        </div>
    )
}

export default UserListScreen;