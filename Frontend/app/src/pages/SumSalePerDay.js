import { useEffect, useState } from "react";
import Modal from "../components/Modal";
import Template from "../components/Template";
import Swal from "sweetalert2";
import config from "../config";
import axios from "axios";
import * as dayjs from 'dayjs';

function SumSalePerDay() {
    const [billSales, setBillSales] = useState([]);
    const [currentBillSale, setCurrentBillSale] = useState({});
    const [billSaleDetails, setBillSaleDetails] = useState([]);
    const [currentYear, setCurrentYear] = useState(() => {
        let myDate = new Date();
        return myDate.getFullYear();
    });
    const [currentMonth, setCurrentMonth] = useState(() => {
        let myDate = new Date();
        return myDate.getMonth() + 1;
    });
    const [arrYear, setArrYear] = useState(() => {
        let arr = [];
        let myDate = new Date();
        let currentYear = myDate.getFullYear();
        let beforeYear = currentYear - 4;

        for (let i = beforeYear; i <= currentYear; i++) {
            arr.push(i);
        }

        return arr;
    });
    const [arrMonth, setArrMonth] = useState(() => {
        let arr = [
            { value: 1, label: 'January' },
            { value: 2, label: 'Febuary' },
            { value: 3, label: 'March' },
            { value: 4, label: 'April' },
            { value: 5, label: 'May' },
            { value: 6, label: 'June' },
            { value: 7, label: 'July' },
            { value: 8, label: 'August' },
            { value: 9, label: 'September' },
            { value: 10, label: 'October' },
            { value: 11, label: 'November' },
            { value: 12, label: 'December' },
        ];

        return arr;
    });
    useEffect(() => {
        fetchData();
        handleShowReport();
    }, []);

    const fetchData = async () => {
        try {
            await axios.get(config.api_path + '/billSale/list', config.headers()).then(res => {
                if (res.data.message === 'success') {
                    setBillSales(res.data.results);
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
    const handleShowReport = async () => {
        try {
            const url = config.api_path + '/billSale/listByYearAndMonth/' + currentYear + '/' + currentMonth
            await axios.get(url, config.headers()).then(res => {
                if (res.data.message === 'success') {
                    setBillSales(res.data.results);
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
            <Template>
                <div className="card">
                    <div className="card-header">
                        <div className="card-title h5">
                            Daily Sales Report
                        </div>
                    </div>
                    <div className="card-body">
                        <div className="row">
                            <div className="col-3">
                                <div className="input-group">
                                    <div className="input-group-text">Year</div>
                                    <select onChange={e => setCurrentYear(e.target.value)} value={currentYear} className="form-select">
                                        {arrYear.map(item =>
                                            <option value={item}>
                                                {item}
                                            </option>
                                        )}
                                    </select>
                                </div>
                            </div>
                            <div className="col-3">
                                <div className="input-group">
                                    <div className="input-group-text">Month</div>
                                    <select onChange={e => setCurrentMonth(e.target.value)} value={currentMonth} className="form-select">
                                        {arrMonth.map(item =>
                                            <option value={item.value}>
                                                {item.label}
                                            </option>
                                        )}
                                    </select>
                                </div>
                            </div>
                            {/* <div className="col-3">
                                <div className="input-group">
                                    <div className="input-group-text">Date</div>
                                    <select className="form-select">

                                    </select>
                                </div>
                            </div> */}
                            <div className="col-3">
                                <button onClick={handleShowReport} className="btn btn-primary">
                                    <i className="fa fa-search mr-2"></i>
                                    Search
                                </button>
                            </div>
                        </div>

                        <table className="table table-bordered table-sm mt-3">
                            <thead>
                                <tr>
                                    <th className="text-center" width="120px">-----</th>
                                    <th width="100px" className="text-end">Date</th>
                                    <th className="text-end">Total Sold</th>
                                </tr>
                            </thead>
                            <tbody>
                            { billSales!= null ? billSales.map(item =>
                                <tr>
                                    <td className="text-center">
                                        <button
                                        data-toggle="modal"
                                        data-target="#modalBillSale"
                                        onClick={e => {setCurrentBillSale(item.results)}} 
                                        className="btn btn-outline-dark btn-sm">
                                            {/* <i className="fa fa-eye me-2"></i> */}
                                            View
                                        </button>
                                    </td>
                                    <td className="text-end">{item.day}</td>
                                    <td className="text-end">{parseInt(item.sum).toLocaleString('th-TH')}</td>

                                </tr>
                            ) : ''}
                            </tbody>
                        </table>
                    </div>
                </div>
            </Template>

            <Modal id="modalBillSale" title="Bill Details">
                <table className="table table-bordered">
                    <thead>
                        <tr>
                            <th className="text-center" width="120px">-----</th>
                            <th>Bill ID</th>
                            <th className="text-end">Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentBillSale.length > 0 ? currentBillSale.map(item =>
                            <tr>
                                <td className="text-center">
                                        <button
                                        data-toggle="modal"
                                        data-target="#modalBillSaleDetail" 
                                        onClick={e => setBillSaleDetails(item.billSaleDetails)}
                                        className="btn btn-outline-primary">
                                            <i className="fa fa-eye me-2"></i>
                                            View
                                        </button>
                                </td>
                                <td className="text-end">{item.id}</td>
                                <td className="text-end">{dayjs(item.updatedAt).format('DD/MM/YYYY - HH:mm:ss')}</td>
                            </tr>
                        ) : ''}
                    </tbody>
                </table>
            </Modal>

            <Modal id="modalBillSaleDetail" title="Bill Details" modalSize="modal-lg">
            <table className="table table-bordered">
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
                    {billSaleDetails.length > 0 ? billSaleDetails.map(item =>
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
    )
}
export default SumSalePerDay;