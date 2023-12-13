import { useEffect, useState } from "react";
import Modal from "../components/Modal";
import Template from "../components/Template";
import Swal from "sweetalert2";
import config from "../config";
import axios from "axios";

function User() {
    const [user, setUser] = useState({});
    const [users, setUsers] = useState([]);
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            await axios.get(config.api_path + '/user/list', config.headers()).then(res => {
                if (res.data.message === 'success') {
                    setUsers(res.data.results);
                }
            }).catch(err => {
                throw err.response.data;
            })
        } catch (e) {
            Swal.fire({
                title: "error",
                text: e.message,
                icon: "error"
            })
        }
    }

    const handleSave = async () => {
        try {
            let url = config.api_path + '/user/insert';
            if (user.id !== undefined) {
                url = config.api_path + '/user/edit/'
            }
            await axios.post(url, user, config.headers()).then(res => {
                if (res.data.message === 'success') {
                    Swal.fire({
                        title: 'User Saved',
                        text: 'User details saved successfully',
                        icon: 'success',
                        timer: 2000
                    })
                    clearForm();
                    fetchData();
                    handleClose();
                }
            }).catch(err => {
                throw err.response.data;
            })
        } catch (e) {
            Swal.fire({
                title: "error",
                text: e.message,
                icon: "error"
            })
        }
    }

    const handleClose = () => {
        const btns = document.getElementsByClassName('btnClose');
        for (let i = 0; i < btns.length; i++) {
            btns[i].click();
        }
    }

    const clearForm = () => {
        setUser({
            id: undefined,
            name: '',
            usr: '',
            level: "user"
        });
        setPassword('');
        setConfirmPassword('');
    }

    const changePassword = (item) => {
        setPassword(item);
        comparePassword();
    }

    const changeConfirmPassword = (item) => {
        setConfirmPassword(item);
        comparePassword();
    }

    const comparePassword = () => {
        if (password.length > 0 && confirmPassword.length > 0) {
            if (password !== confirmPassword) {
                Swal.fire({
                    title: "Invalid Password",
                    text: "Password does not macth",
                    icon: "error"
                })
            } else {
                setUser({
                    ...user,
                    pwd: password
                })
            }
        }
    }

    const handleDelete = (item) => {
        Swal.fire({
            title: 'Delete User',
            text: 'Are you sure?',
            icon: 'question',
            showCancelButton: true,
            showConfirmButton: true,
        }).then(async res => {
            if (res.isConfirmed) {
                try {
                    await axios.delete(config.api_path + '/user/delete/' + item.id, config.headers()).then(res => {
                        if (res.data.message === 'success') {
                            Swal.fire({
                                title: 'User Deleted',
                                text: 'User deleted successfully',
                                icon: 'success',
                                timer: 2000
                            })

                            fetchData();
                        }
                    }).catch(err => {
                        throw err.response.data;
                    })
                } catch (e) {
                    Swal.fire({
                        title: 'error',
                        text: e.message,
                        icon: 'error',
                    })
                }
            }
        })
    }

    return (
        <>
            <Template>
                <div className="card">
                    <div className="card-header">
                        <div className="card-title">User</div>
                    </div>
                    <div className="card-body">
                        <button onClick={clearForm} className="btn btn-primary" data-toggle="modal" data-target="#modalUser">
                            <i className="fa fa-plus mr-2"></i>
                            Add User
                        </button>
                        <hr className="divider"></hr>
                        <table className="table table-bordered table-striped">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Username</th>
                                    {/* <th>Password</th> */}
                                    <th>Privilege</th>
                                    <th width="150px"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.length > 0 ? users.map(item =>
                                    <tr>
                                        <td>{item.name}</td>
                                        <td>{item.usr}</td>
                                        {/* <td>{item.pwd}</td> */}
                                        <td>{item.level}</td>
                                        <td className="text-center">
                                            <button onClick={e => setUser(item)} data-toggle='modal' data-target='#modalUser' className="btn btn-info mr-2">
                                                <i className="fa fa-pencil"></i>
                                            </button>
                                            <button onClick={e => handleDelete(item)} className="btn btn-danger">
                                                <i className="fa fa-times"></i>
                                            </button>
                                        </td>
                                    </tr>
                                ) : ''}
                            </tbody>
                        </table>
                    </div>
                </div>
            </Template>

            <Modal id="modalUser" title="User" modalSize="modal-lg">
                <div>
                    <label>Name</label>
                    <input value={user.name} onChange={e => setUser({ ...user, name: e.target.value })} className="form-control"></input>
                </div>
                <div className="mt-2">
                    <label>Username</label>
                    <input value={user.usr} onChange={e => setUser({ ...user, usr: e.target.value })} className="form-control"></input>
                </div>
                <div className="mt-2">
                    <label>Password</label>
                    <input value={password} onChange={e => setPassword(e.target.value)} onBlur={e => changePassword(e.target.value)} className="form-control" type="password"></input>
                </div>
                <div className="mt-2">
                    <label>Confirm Password</label>
                    <input value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} onBlur={e => changeConfirmPassword(e.target.value)} className="form-control" type="password"></input>
                </div>
                <div className="mt-2 col-3 " style={{ paddingLeft: 0 }}>
                    <label>Privilege</label>
                    <select onChange={e => setUser({ ...user, level: e.target.value })} className="form-select">
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                    </select>
                </div>
                <div className="mt-3">
                    <button onClick={handleSave} className="btn btn-primary">
                        <i className="fa fa-check mr-2"></i>
                        Save
                    </button>
                </div>
            </Modal>

        </>
    )
}

export default User;