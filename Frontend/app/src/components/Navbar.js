import config from "../config";
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import Modal from "./Modal";
import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from 'react-router-dom';

function Navbar() {
    const [memberName, setMemberName] = useState();
    const [packageName, setPackageName] = useState();

    const navigate = useNavigate();
    const handleSignout = () => {
        Swal.fire({
            title: 'Sign Out',
            text: 'Are you sure?',
            icon: 'question',
            showCancelButton: true,
            showConfirmButton: true
        }).then(res => {
            if (res.isConfirmed) {
                localStorage.removeItem(config.token_name);
                navigate('/login');
                Swal.fire({
                    title: 'Signed Out!',
                    test: 'You have been signed out',
                    icon: 'success',
                    timer: 2000
                })
            }
        })

    }

    const handleEditProfile = async () => {
        try {
            axios.get(config.api_path + '/member/info', config.headers()).then(res => {
                if (res.data.message === 'success') {
                    setMemberName(res.data.result.name);
                }
            }).catch(err => {
                throw err.response.data;
            })
        } catch (e) {
            Swal.fire({
                title: 'error',
                text: e.message,
                icon: 'error'
            })
        }
    }



    return (
        <>
            <nav class="main-header navbar navbar-expand navbar-dark navbar-light">

                <ul class="navbar-nav ml-2">
                    <li class="nav-item">
                        <a class="nav-link" data-widget="pushmenu" href="#" role="button"><i class="fas fa-bars"></i></a>
                    </li>
                    <li class="nav-item d-none d-sm-inline-block">
                        <Link to="/Home" class="nav-link">Home</Link>
                    </li>
                    <li class="nav-item d-none d-sm-inline-block">
                    <Link to="/Home" class="nav-link">Contact</Link>
                    </li>
                </ul>

                <ul class="navbar-nav ml-auto">
                    <li className="nav-item">
                        <button onClick={handleEditProfile} data-toggle='modal' data-target='#modalEditProfile' className="btn btn-info mr-2 text-white">
                            <i className="fa fa-user mr-2"></i>
                            Profile
                        </button>
                        <button onClick={handleSignout} className="btn btn-danger mr-3">
                            <i className="fa fa-times mr-2"></i>
                            Signout
                        </button>
                    </li>
                </ul>
            </nav>
            <Modal id='modalEditProfile' title='Edit Shop Profile'>
                <div>
                    <label>Shop Name</label>
                    <input value={memberName} onChange={e=>setMemberName(e.target.value)}className="form-control"></input>
                </div>
                <div className="mt-3">
                    <button className="btn btn-primary">
                        <i className="fa fa-save mr-2"></i>
                        Save
                    </button>
                </div>
            </Modal>
        </>
    )
}

export default Navbar;