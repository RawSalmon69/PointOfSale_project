import { useEffect, useState } from "react";
import Modal from "../components/Modal";
import Template from "../components/Template";
import Swal from "sweetalert2";
import config from "../config";
import axios from "axios";
import * as dayjs from 'dayjs';

function Sale() {
    const [products, setProducts] = useState([]);
    const [billSale, setBillSale] = useState({});
    const [currentBill, setCurrentBill] = useState({});
    const [totalPrice, setTotalPrice] = useState(0);
    const [item, setItem] = useState({});
    const [inputMoney, setInputMoney] = useState(0);
    const [lastBill, setLastBill] = useState({});
    const [billToday, setBillToday] = useState([]);
    const [selectedBill, setSelectedBill] = useState([]);

    useEffect(() => {
        fetchData();
        openBill();
        fetchBillSaleDetail();
    }, []);

    const openBill = async () => {
        try {
            await axios.get(config.api_path + '/billSale/openBill', config.headers()).then(res => {
                if (res.data.message === 'success') {
                    setBillSale(res.data.result);
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

    const fetchData = async () => {
        try {
            await axios.get(config.api_path + '/product/listForSale', config.headers()).then(res => {
                if (res.data.message === 'success') {
                    setProducts(res.data.results);
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

    const handleSave = async (item) => {
        try {
            await axios.post(config.api_path + '/billSale/sale', item, config.headers()).then(res => {
                if (res.data.message === 'success') {
                    fetchBillSaleDetail();
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

    const fetchBillSaleDetail = async () => {
        try {
            await axios.get(config.api_path + '/billSale/currentBillInfo', config.headers()).then(res => {
                if (res.data.results !== null) {
                    setCurrentBill(res.data.results);
                    SumTotalPrice(res.data.results.billSaleDetails);
                } else {
                    setTotalPrice(0);
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

    const SumTotalPrice = (billSaleDetails) => {
        let sum = 0;
        if (billSaleDetails.length > 0) {
            for (let i = 0; i < billSaleDetails.length; i++) {
                const item = billSaleDetails[i];
                const qty = parseInt(item.qty);
                const price = parseInt(item.price);
                sum += qty * price;
            }

            setTotalPrice(sum);
        }
    }

    const handleDelete = (item) => [
        Swal.fire({
            title: 'Delete Order',
            text: 'Are you sure?',
            icon: 'question',
            showCancelButton: true,
            showConfirmButton: true
        }).then(async res => {
            if (res.isConfirmed) {
                try {
                    await axios.delete(config.api_path + '/billSale/deleteItem/' + item.id, config.headers()).then(res => {
                        if (res.data.message === 'success') {
                            Swal.fire({
                                title: 'Order Deleted',
                                text: 'Order deleted successfully',
                                icon: 'success',
                                timer: 2000
                            })
                            fetchBillSaleDetail();
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
    ]

    const handleUpdateQty = async () => {
        try {
            await axios.post(config.api_path + '/billSale/updateQty', item, config.headers()).then(res => {
                if (res.data.message === 'success') {
                    fetchBillSaleDetail();
                    const btns = document.getElementsByClassName('btnClose');
                    for (let i = 0; i < btns.length; i++) {
                        btns[i].click();
                    }
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

    const handleEndSale = () => {
        Swal.fire({
            title: 'End Sale',
            text: 'Are you sure?',
            icon: 'question',
            showCancelButton: true,
            showConfirmButton: true
        }).then(async res => {
            if (res.isConfirmed) {
                try {
                    await axios.get(config.api_path + '/billSale/endSale', config.headers()).then(res => {
                        if (res.data.message === 'success') {
                            Swal.fire({
                                title: 'Sale Ended',
                                text: 'Sale ended and saved successfully',
                                icon: 'success',
                                timer: 2000
                            });

                            openBill();
                            fetchBillSaleDetail();
                            fetchBillSaleDetail();

                            const btns = document.getElementsByClassName('btnClose');
                            for (let i = 0; i < btns.length; i++) {
                                btns[i].click();
                            }
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

    const handleLastBill = async () => {
        try {
            await axios.get(config.api_path + '/billSale/lastBill', config.headers()).then(res => {
                if (res.data.message === 'success') {
                    setLastBill(res.data.result[0]);
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

    const handleBillToday = async () => {
        try {
            await axios.get(config.api_path + '/billSale/billToday', config.headers()).then(res => {
                if (res.data.message === 'success') {
                    setBillToday(res.data.results);
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

    return <>
        <Template>
            <div className="card">
                <div className="card-header">
                    <div className="card-title h5 float-start">Sale</div>
                    <div className="float-end">
                        <button onClick={handleLastBill} data-toggle="modal" data-target="#modalLastBill" className="btn btn-primary text-white mr-2">
                            <i className="fa fa-file-alt mr-2" />
                            Last Bill
                        </button>
                        <button onClick={handleBillToday} data-toggle="modal" data-target="#modalBillToday" className="btn btn-info text-white mr-2">
                            <i className="fa fa-history mr-2" />
                            History
                        </button>
                        <button onClick={e => setInputMoney(0)} data-toggle="modal" data-target="#modalEndSale" className="btn btn-success mr-2">
                            <i className="fa fa-check mr-2" />
                            End Sale
                        </button>
                    </div>
                    <div className="float none"></div>
                </div>
                <div className="card-body">

                    <div className="row">

                        <div className="col-9">
                            <div className="row mt-2 ml-1">
                                {products.length > 0 ? products.map(item =>
                                    <div className="col-2 gx-2" onClick={e => handleSave(item)}>
                                        <div className="card">
                                            <img className="card-img-top"
                                                src={config.api_path + '/uploads/' + item.ProductImages[0].imageName}
                                                width='100px'
                                                height='200px'
                                                alt={item.name}></img>
                                            <div className="card-body text-center">
                                                <div className="text-primary h6">{item.name}</div>
                                                <div>{parseInt(item.price).toLocaleString('th-TH')} THB</div>
                                            </div>
                                        </div>

                                    </div>) : ''}
                            </div>
                            <table className="table table-bordered mt-3">
                                <thead className="table-dark">
                                    <tr>
                                        <th width="180px">Barcode</th>
                                        <th>Product</th>
                                        <th width="180px">Price</th>
                                        <th width="180px">Amount</th>
                                        <th width="250px">Total</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {currentBill != {} && currentBill.billSaleDetails != undefined ? currentBill.billSaleDetails.map(item =>
                                        <tr>
                                            <td>{item.product.barcode}</td>
                                            <td>{item.product.name}</td>
                                            <td>{parseInt(item.price).toLocaleString('th-TH')}</td>
                                            <td>{item.qty}</td>
                                            <td>{(item.qty * item.price).toLocaleString('th-TH')} THB</td>
                                        </tr>
                                    ) : ''}
                                </tbody>
                            </table>
                        </div>

                        <div className="col-3 mt-2">
                            <div className="">
                                <div className="h2 ps-3 pe-3 border border-dark rounded text-end pt-2 pb-2"
                                    style={{ backgroundColor: "black", color: "lightgreen" }}>
                                    {parseInt(totalPrice).toLocaleString('th-TH')}
                                </div>

                                {currentBill != {} && currentBill.billSaleDetails != undefined ?
                                    currentBill.billSaleDetails.map(item =>
                                        <div className="card">
                                            <div className="card-header">
                                                <div className="text-success">{item.product.name}</div>
                                            </div>
                                            <div className="card-body">
                                                <div>
                                                    <span className="text-success h5 mr-1">{item.qty}</span>
                                                    x
                                                    <span className="ml-1 mr-1">{parseInt(item.price).toLocaleString('th-TH')}</span>
                                                    =
                                                    <span className="ml-1 mr-1">{(item.qty * item.price).toLocaleString('th-TH')} THB</span>
                                                </div>
                                                <div className="text-end">
                                                    <button onClick={e => setItem(item)} data-toggle='modal' data-target="#modalQty" className="btn btn-primary mr-2">
                                                        <i className="fa fa-pencil"></i>
                                                    </button>
                                                    <button onClick={e => handleDelete(item)} className="btn btn-danger">
                                                        <i className="fa fa-times"></i>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ) : ''}
                            </div>

                        </div>
                    </div>



                    {/* <div className="input-group mt-3">
                        <span className="input-group-text">Barcode</span>
                        <input className="form-control"></input>
                        <button className="btn btn-primary">
                            <i className="fa fa-search mr-2"></i>
                            Check
                        </button>
                    </div> */}



                </div>
            </div>
        </Template>

        <Modal id="modalQty" title="Change Amount">
            <div>
                <label>Amount</label>
                <input value={item.qty} className="form-control" onChange={e => setItem({ ...item, qty: e.target.value })}></input>
                <div className="mt-3">
                    <button onClick={handleUpdateQty} className="btn btn-primary">
                        <i className="fa fa-save mr-2"></i>
                        Save
                    </button>
                </div>
            </div>
        </Modal>

        <Modal id="modalEndSale" title="End Sale">
            <div>
                <label>Total Price</label>
            </div>
            <div className="">
                <input value={parseInt(totalPrice).toLocaleString('th-TH')} className="form-control" disabled></input>
            </div>
            <div className="mt-3">
                <label>Amount Received</label>
            </div>
            <div className="">
                <input value={parseInt(inputMoney).toLocaleString('th-TH')} className="form-control" onChange={e => setInputMoney(e.target.value)}></input>
            </div>
            <div className="mt-3">
                <label>Change</label>
            </div>
            <div className="">
                <input value={parseInt(inputMoney - totalPrice).toLocaleString('th-TH')} className="form-control" disabled></input>
            </div>
            <div className="mt-3 text-center">
                <button onClick={e => setInputMoney(totalPrice)} className="btn btn-success mr-2">
                    <i className="fa fa-check mr-2"></i>
                    No Change
                </button>
                <button onClick={handleEndSale} className="btn btn-primary">
                    <i className="fa fa-save mr-2"></i>
                    End Sale
                </button>
            </div>

        </Modal>

        <Modal id="modalLastBill" title="Last Bill" modalSize="modal-lg">
            <table className="table table-bordered ">
                <thead>
                    <tr>
                        <th>Barcode</th>
                        <th>Product</th>
                        <th className="text-end">Amount</th>
                        <th className="text-end">Price</th>
                        <th className="text-end">Total</th>
                    </tr>
                </thead>
                <tbody>
                    {lastBill.billSaleDetails !== undefined ? lastBill.billSaleDetails.map(item =>
                        <tr>
                            <td>{item.product.barcode}</td>
                            <td>{item.product.name}</td>
                            <td className="text-end">{parseInt(item.qty).toLocaleString('th-TH')}</td>
                            <td className="text-end">{parseInt(item.price).toLocaleString('th-TH')}</td>
                            <td className="text-end">{parseInt(item.price * item.qty).toLocaleString('th-TH')}</td>
                        </tr>
                    ) : ''}
                </tbody>
            </table>
        </Modal>

        <Modal id="modalBillToday" title="Today's Bills" modalSize="modal-lg">
            <table className="table table-bordered ">
                <thead>
                    <tr>
                        <th className="text-center" width="120px">-----</th>
                        <th width="100px">Bill ID</th>
                        <th>Sale Time</th>
                    </tr>
                </thead>
                <tbody>
                    {billToday.length > 0 ? billToday.map(item =>
                        <tr>
                            <td className="text-center">
                                <button onClick={e => setSelectedBill(item)} data-toggle="modal" data-target="#modalBillSaleDetail" className="btn btn-primary">
                                    <i className="fa fa-eye mr-2"></i>
                                    View
                                </button>
                            </td>
                            <td>{item.id}</td>
                            <td>{dayjs(item.updatedAt).format('DD/MM/YYYY - HH:mm:ss')}</td>
                        </tr>
                    ) : ''}
                </tbody>
            </table>
        </Modal>

        <Modal id="modalBillSaleDetail" title="Bill Details" modalSize="modal-lg">
            <table className="table table-bordered ">
                <thead>
                    <tr>
                        <th>Barcode</th>
                        <th>Product</th>
                        <th className="text-end">Amount</th>
                        <th className="text-end">Price</th>
                        <th className="text-end">Total</th>
                    </tr>
                </thead>
                <tbody>
                    {selectedBill.billSaleDetails != null ? selectedBill.billSaleDetails.map(item =>
                        <tr>
                            <td>{item.product.barcode}</td>
                            <td>{item.product.name}</td>
                            <td className="text-end">{parseInt(item.qty).toLocaleString('th-TH')}</td>
                            <td className="text-end">{parseInt(item.price).toLocaleString('th-TH')}</td>
                            <td className="text-end">{parseInt(item.price * item.qty).toLocaleString('th-TH')}</td>
                        </tr>
                    ) : ''}
                </tbody>
            </table>
        </Modal>
    </>
}
export default Sale;