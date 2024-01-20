import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import axios from 'axios';
import config from '../config';
import { Link } from 'react-router-dom';
import Modal from './Modal';

function Sidebar() {
    const [memberName, setMemberName] = useState();
    const [packageName, setPackageName] = useState();
    const [packages, setPackages] = useState([]);
    const [totalBill, setTotalBill] = useState(0);
    const [billAmount, setBillAmount] = useState(0);
    const [banks, setBanks] = useState([]);
    const [choosePackage, setChoosePackage] = useState({});

    useEffect(() => {
        fetchData();
        fetchDataTotalBill();
    })

    const fetchData = async () => {
        try {
            axios.get(config.api_path + '/member/info', config.headers()).then(res => {
                if (res.data.message === 'success') {
                    setMemberName(res.data.result.name);
                    setPackageName(res.data.result.package.name);
                    setBillAmount(res.data.result.package.bill_amount);
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

    const fetchDataTotalBill = async () => {
        try {
            await axios.get(config.api_path + '/packages/countBill', config.headers()).then(res => {
                if (res.data.totalBill != undefined) {
                    setTotalBill(res.data.totalBill);
                }
            }).catch(err => {
                throw err.response.data;
            })
        } catch (e) {
            Swal.fire({
                title: "error",
                message: e.message,
                icon: 'error'
            })
        }
    }

    const fetchPackages = async () => {
        try {
            await axios.get(config.api_path + '/packages/list').then(res => {
                if (res.data.results.length > 0) {
                    setPackages(res.data.results)
                }
            }).catch(err => {
                throw err.response.data;
            })
        } catch (e) {
            Swal.fire({
                title: "error",
                message: e.message,
                icon: 'error'
            })
        }
    }

    const fetchDataBank = async () => {
        try {
            await axios.get(config.api_path + '/bank/list').then(res => {
                if (res.data.results.length > 0) {
                    setBanks(res.data.results)
                }
            }).catch(err => {
                throw err.response.data;
            })
        } catch (e) {
            Swal.fire({
                title: "error",
                message: e.message,
                icon: 'error'
            })
        }
    }

    const renderButton = (item) => {
        if (packageName === item.name) {
            return <button
                data-toggle="modal" data-target="#modalRegister"
                className="btn btn-success disabled">
                <i className='fa fa-check mr-2'></i>
                Subscibed</button>;
        } else {
            return <button
                data-toggle="modal" data-target="#modalBank"
                onClick={e => handleChoosePackage(item)}
                className="btn btn-primary">Subscibe</button>;
        }
    }

    const handleChoosePackage = (item) => {
        setChoosePackage(item);
        if (banks.length == 0) fetchDataBank();
    }

    const handleChangePackage = () => {
        //เพิ่ม Check ว่ามี package change กำลังรอคอนเฟิร์มอยู่ไหม กันสแปม DB
        Swal.fire({
            title: 'Confirm Package Change',
            text: 'Are you sure?',
            icon: 'warning',
            showCancelButton: true,
            showConfirmButton: true
        }).then(async res => {
            if (res.isConfirmed) {
                try {
                    await axios.get(config.api_path + '/packages/changePackage/' + choosePackage.id, config.headers()).then(res => {
                        if (res.data.message === 'success') {
                            Swal.fire({
                                title: "Request Sent",
                                message: "Package change request sent",
                                icon: 'success',
                                timer: 2000
                            })
                        }
                        const btns = document.getElementsByClassName('btnClose');
                        for(let i=0; i< btns.length; i++) btns[i].click();
                    }).catch(err => {
                        throw err.response.data;
                    })
                } catch (e) {
                    Swal.fire({
                        title: "error",
                        message: e.message,
                        icon: 'error'
                    })
                }
            }
        })
    }

    return (
        <>
            <aside className="main-sidebar sidebar-dark-primary elevation-2">
                <a href="http://localhost:3001/" className="brand-link">
                    <img src="dist/img/bdragon.png" alt="AdminLTE Logo" className="brand-image img-circle elevation-3" style={{ opacity: .8 }} />
                    <span className="brand-text font-weight-light">RawS: POS on Cloud</span>
                </a>

                <div className="sidebar">
                    <div className='container'>
                        <div className="user-panel mt-3 pb-3 mb-3 row">
                            {/* <div className="image mt-2">
                                <img src="dist/img/bdragon.png" className="img-circle elevation-2" alt="User Image" />
                            </div> */}
                            <div className="info text-white col-8">
                                <a>
                                    <h6 className='text-bold'>{memberName}</h6>
                                    <div>Package: {packageName}
                                    </div>
                                </a>
                            </div>
                            <div className='info col-4'>
                                <button
                                    data-toggle="modal" data-target="#modalPackage"
                                    onClick={fetchPackages}
                                    className="btn btn-dark mt-2 ml-2">
                                    <i className='fa fa-arrow-up'></i>
                                </button>
                            </div>
                            <div className='info col-12'>
                                <div className='text-white ml-2 '>
                                    {totalBill.toLocaleString('th-TH')} / {billAmount.toLocaleString('th-TH')}
                                    <span className='text-warning fw-bold ml-1'> Bills</span>
                                </div>
                            </div>
                            <div className='col-12'>
                                <div
                                    className="progress mt-2" role="progressbar"
                                    style={{ height: "6px" }} aria-label="Example Animated striped"
                                    aria-valuenow={totalBill * 100 / billAmount} aria-valuemin="0" aria-valuemax="100"
                                >
                                    <div className="progress-bar bg-success" style={{ width: (totalBill * 100 / billAmount) + '%' }}></div>
                                </div>
                            </div>
                        </div>

                    </div>



                    <nav className="mt-2">
                        <ul className="nav nav-pills nav-sidebar flex-column" data-widget="treeview" role="menu" data-accordion="false">

                            <li className="nav-item">
                                <a href="pages/widgets.html" className="nav-link">
                                    <i className="nav-icon fas fa-server"></i>
                                    <p>
                                        Dashboard
                                    </p>
                                </a>
                            </li>

                            <li className="nav-item">
                                <Link to="/sale" className="nav-link">
                                    <i className="nav-icon fas fa-dollar-sign"></i>
                                    <p>
                                        Sale
                                    </p>
                                </Link>
                            </li>

                            <li className="nav-item">
                                <Link to="/sumSalePerDay" className="nav-link">
                                    <i className="nav-icon fas fa-file-alt"></i>
                                    <p>
                                        Daily Sales Report
                                    </p>
                                </Link>
                            </li>

                            <li className="nav-item">
                                <Link to="/billSales" className="nav-link">
                                    <i className="nav-icon fas fa-book"></i>
                                    <p>
                                        Total Sales Report
                                    </p>
                                </Link>
                            </li>

                            <li className="nav-item">
                                <Link to="/product" className="nav-link">
                                    <i className="nav-icon fas fa-box"></i>
                                    <p>
                                        Products
                                    </p>
                                </Link>
                            </li>

                            <li className="nav-item">
                                <Link to="/stock" className="nav-link">
                                    <i className="nav-icon fas fa-cart-plus"></i>
                                    <p>
                                        Product Stock
                                    </p>
                                </Link>
                            </li>

                            <li className="nav-item">
                                <Link to="/reportstock" className="nav-link">
                                    <i className="nav-icon fas fa-tasks"></i>
                                    <p>
                                        Stock Report
                                    </p>
                                </Link>
                            </li>

                            <li className="nav-item">
                                <Link to="/user" className="nav-link">
                                    <i className="nav-icon fas fa-user"></i>
                                    <p>
                                        User
                                    </p>
                                </Link>
                            </li>

                        </ul>
                    </nav>
                </div >
            </aside >

            <Modal id="modalPackage" title="Choose Package" modalSize="modal-lg">
                <div className='row'>
                    {packages.length > 0 ? packages.map(item =>
                        <div className='col-4'>
                            <div className='card'>
                                <div className='card-header h5    text-center text-success'>
                                    {item.name}
                                </div>
                                <div className="h5 text-center mt-3">
                                    {parseInt(item.bill_amount).toLocaleString('th-TH')} Bills
                                </div>
                                <div className="h5 text-secondary text-center">
                                    {parseInt(item.price).toLocaleString('th-TH')}
                                    &nbsp;
                                    {/* ช่องว่าง */}
                                    ฿ / Month
                                </div>
                                <div className="mt-2 text-center pb-3">
                                    {renderButton(item)}
                                </div>
                            </div>
                        </div>
                    ) : ''}
                </div>
            </Modal>

            <Modal id="modalBank" title="Payment Options" modalSize="modal-lg">
                <div className='mb-2'>
                    <strong className='text-primary'>Chosen Package </strong>- <strong className='text-success'>{choosePackage.name}</strong> <br></br>
                    <strong className='text-primary'>Total Due </strong> - <strong className='text-success'>{parseInt(choosePackage.price).toLocaleString('th-TH')}</strong>  ฿
                </div>
                <table className="table table-bordered">
                    <thead>
                        <tr>
                            <th>Bank</th>
                            <th>Account Number</th>
                            <th>Account Name</th>
                        </tr>
                    </thead>
                    <tbody>
                        {banks.length > 0 ? banks.map(item =>
                            <tr>
                                <td>{item.bankType}</td>
                                <td>{item.bankCode}</td>
                                <td>{item.bankName}</td>
                            </tr>
                        ) : ''}
                    </tbody>
                </table>

                <div className='alert alert-warning'>
                    <i className='fa fa-info-circle mr-2 text-blue'></i>
                    After successful transaction - please send your username and attach the payment slip to
                    <br></br><strong>Email :</strong> phanthawasjira@gmail.com</div>
                <div className="text-center">
                    <button
                        onClick={handleChangePackage}
                        className='btn btn-primary'>
                        <i className='fa fa-check mr-2'></i>
                        Confirm Subscription
                    </button>
                </div>
            </Modal>

        </>
    )
}

export default Sidebar;