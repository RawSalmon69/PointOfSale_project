import { useEffect, useState } from "react";
import axios from 'axios';
import config from '../config';
import Modal from "../components/Modal";
import Swal from 'sweetalert2';
import { useNavigate } from "react-router-dom";

function Package() {
    const [packages, setPackages] = useState([]);
    const [yourPackage, setYourPackage] = useState({});
    const [name, setName] = useState();
    const [pass, setPass] = useState();
    const [phone, setPhone] = useState();

    const navigate = useNavigate();

    useEffect(() => {
        // document.body.style.backgroundColor = "#2c2c2c";
        fetchData();
    }, [])

    const fetchData = async () => {
        try {
            axios.get(config.api_path + '/packages/list').then(res => {
                setPackages(res.data.results);
            }).catch(err => {
                throw err.response.data;
            })
        } catch (e) {
            console.log(e.message);
        }
    }

    const choosePackage = (item) => {
        setYourPackage(item);
    }

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            Swal.fire({
                title: 'Confirm Subscription',
                text: 'Are you sure?',
                icon: 'question',
                showCancelButton: true,
                showConfirmButton: true
            }).then(res => {
                if (res.isConfirmed) {
                    const payload = {
                        packageId: yourPackage.id,
                        name: name,
                        pass: pass,
                        phone: phone
                    }
                    axios.post(config.api_path + '/packages/memberRegister', payload).then(res => {
                        if (res.data.message === 'success') {
                            Swal.fire({
                                title: 'Details sent!',
                                text: 'Subscription confirmed, please wait to be contacted',
                                icon: 'success',
                                timer: 2000
                            })
                            document.getElementById('btnModalClose').click();

                            navigate('/login');
                        }
                    }).catch(err => {
                        throw err.response.data;
                    });
                }
            });
        } catch (e) {
            Swal.fire({
                title: "error",
                message: e.message,
                icon: 'error'
            })
        }
    }

    return (
        <>
            <div className="container mt-3">
                <div className="h2">Raws : Point Of Sale on Cloud
                    <button className="btn btn-warning mt-3 float-right" onClick={e => navigate('/login')}>
                        Sign in 
                        {/* <i className="fa fa-arrow-right" style={{ marginLeft: '10px' }} /> */}
                    </button></div>

                <div className="h5">Monthly Packages Available</div>
                <div className="row">
                    {packages.map(item =>
                        <div className="col-4">
                            <div className="card">
                                <div className="card-body text-center">
                                    <div className="h4 text-success">{item.name}</div>
                                    <div className="h5">
                                        {parseInt(item.bill_amount).toLocaleString('th-TH')}
                                        <br />Bills / Month
                                    </div>
                                    <div className="h5 text-secondary">
                                        {parseInt(item.price).toLocaleString('th-TH')}
                                        &nbsp;
                                        {/* ช่องว่าง */}
                                        ฿
                                    </div>
                                    <div className="mt-3">
                                        <button onClick={e => choosePackage(item)} data-toggle="modal" data-target="#modalRegister" className="btn btn-primary">Subscibe</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
                {/* <div className="text-center">
                    <button className="btn btn-primary mt-3" onClick={e => navigate('/login')}>
                        Login
                    </button>
                </div> */}
            </div>
            <Modal id="modalRegister" title="Subscribe">
                <form onSubmit={handleRegister}>
                    <div>
                        {/* <label>Package</label> */}
                        <div className="alert alert-info text-center">{yourPackage.name} <br></br> Price : {yourPackage.price}    </div>
                    </div>
                    <div className="mt-2">
                        <label>Shop Name</label>
                        <input className="form-control" onChange={e => setName(e.target.value)} />
                    </div>
                    <div className="mt-2">
                        <label>Password</label>
                        <input className="form-control" onChange={e => setPass(e.target.value)} />
                    </div>
                    <div className="mt-2">
                        <label>Telephone number</label>
                        <input className="form-control" onChange={e => setPhone(e.target.value)} />
                    </div>
                    <div>
                        <button className="btn btn-primary mt-2" onClick={handleRegister}>
                            Confirm
                            <i className="fa fa-arrow-right" style={{ marginLeft: '10px' }} />
                        </button>
                    </div>
                </form>
            </Modal>
        </>
    )
}

export default Package;