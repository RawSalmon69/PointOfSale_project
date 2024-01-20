import { useEffect, useState } from "react";
import Modal from "../components/Modal";
import Template from "../components/Template";
import Swal from "sweetalert2";
import config from "../config";
import axios from "axios";
import * as dayjs from 'dayjs';

function ReportStock(){
    const [stocks, setStocks] = useState([]);
    const [currentStock, setCurrentStock] = useState({});

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            await axios.get(config.api_path + '/stock/report', config.headers()).then(res => {
                if (res.data.message === 'success') {
                    setStocks(res.data.results);
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
                        <div className="card-title h5">Stock Report</div>
                    </div>
                    <div className="card-body">
                        <table className="table table-bordered">
                            <thead>
                                
                                <tr>
                                    <th width="150px">Barcode</th>
                                    <th>Product Name</th>
                                    <th width="120px" className="text-end">Stock In</th>
                                    <th width="120px" className="text-end">Stock Out</th>
                                    <th width="120px" className="text-end">Remaining</th>
                                </tr>    
                                
                            </thead>    
                            <tbody>
                                {stocks.length > 0 ? stocks.map(item =>
                                <tr>
                                    <td>{item.result.barcode}</td>
                                    <td>{item.result.name}</td>
                                    <td className="text-end">
                                    <a 
                                    data-toggle="modal"
                                    data-target="#modalStockIn"
                                    onClick={e => setCurrentStock(item)}
                                    className="btn btn-default text-success">
                                        {parseInt(item.stockIn)}</a>
                                    </td>
                                    <td className="text-end">
                                    <a 
                                    data-toggle="modal"
                                    data-target="#modalStockOut"
                                    onClick={e => setCurrentStock(item)}
                                    className="btn btn-default text-danger">
                                        {parseInt(item.stockOut)}</a>
                                    </td>
                                    <td className="text-end">
                                        {(parseInt(item.stockIn) - parseInt(item.stockOut)).toLocaleString('th-TH')}</td>
                                </tr>
                                ) : ''}
                            </tbody>
                        </table>    
                    </div>
                </div>
            </Template>

            <Modal id='modalStockIn' title='StockIn' modalSize='modal-lg'>
            <table className="table table-bordered">
                <thead>
                    <tr>
                        <th width="100px">Barcode</th>
                        <th>Product</th>
                        <th width="100px" className="text-end">Quantity</th>
                        <th width="180px" className="text-end">Date</th>
                    </tr>
                </thead>
                <tbody>
                        {currentStock.result != undefined ? currentStock.result.billSaleDetails.map(item =>
                            <tr>
                                <td>{item.product.barcode}</td>
                                <td>{item.product.name}</td>
                                <td className="text-end">{item.qty}</td>
                                <td className="text-center">
                                    {dayjs(item.createdAt).format('DD/MM/YYYY - HH:mm:ss')}
                                </td>
                            </tr>
                        ) : ''}
                </tbody>
            </table>
            </Modal>

            <Modal id='modalStockOut' title='StockOut' modalSize='modal-lg'>
            <table className="table table-bordered">
                <thead>
                    <tr>
                        <th>Barcode</th>
                        <th>Product</th>
                        <th className="text-end">Quantity</th>
                        <th className="text-end">Date</th>
                    </tr>
                </thead>
                <tbody>
                        {currentStock.result != undefined ? currentStock.result.billSaleDetails.map(item =>
                            <tr>
                                <td>{item.product.barcode}</td>
                                <td>{item.product.name}</td>
                                <td className="text-end">{item.qty}</td>
                                <td className="text-center">
                                    {dayjs(item.createdAt).format('DD/MM/YYYY HH:mm')}
                                </td>
                            </tr>
                        ) : ''}
                </tbody>
            </table>
            </Modal>
        </>
    )
}

export default ReportStock;