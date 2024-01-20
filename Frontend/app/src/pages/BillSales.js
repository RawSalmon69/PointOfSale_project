import { useEffect, useState } from "react";
import Modal from "../components/Modal";
import Template from "../components/Template";
import Swal from "sweetalert2";
import config from "../config";
import axios from "axios";
import * as dayjs from 'dayjs';

function BillSales() {
    const [billSales, setBillSales] = useState([]);
    const [selectedBill, setSelectedBill] = useState([]);

    useEffect(() => {
        fetchData();
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

    return (
        <>
            <Template>
                <div className="card">
                    <div className="card-header">
                        <div className="card-title h5">
                            Total Bill Sales
                        </div>
                    </div>
                    <div className="card-body">
                        <table className="table table-bordered table-sm">
                            <thead>
                                <tr>
                                    <th className="text-center" width="120px">-----</th>
                                    <th width="100px">Bill ID</th>
                                    <th>Sale Time</th>
                                </tr>
                            </thead>
                            <tbody>
                                {billSales.length > 0 ? billSales.map(item =>
                                    <tr>
                                        <td className="text-center">
                                            <button 
                                            onClick={e => setSelectedBill(item)} 
                                            data-toggle="modal" data-target="#modalBillSaleDetail" 
                                            className="btn btn-outline-primary btn-sm">
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
                    </div>
                </div>
            </Template>

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
    )
}
export default BillSales;