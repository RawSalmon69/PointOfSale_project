import { useEffect, useState } from "react";
import Modal from "../components/Modal";
import Template from "../components/Template";
import Swal from "sweetalert2";
import config from "../config";
import axios from "axios";
import * as dayjs from 'dayjs';

function Stock(){
    const [products, setProducts] = useState([]);
    const [productName, setProductName] = useState('');
    const [productId, setProductId] = useState(0);
    const [qty, setQty] = useState(0);
    const [stocks, setStocks] = useState([]);

    useEffect(() => {
        fetchData();
        fetchDataStock();
    }, []);

    const fetchData = async() => {
        try{
            await axios.get(config.api_path + '/product/list', config.headers()).then( res => {
                if(res.data.message === 'success'){
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

    const fetchDataStock = async() => {
        try{
            await axios.get(config.api_path + '/stock/list', config.headers()).then( res => {
                if(res.data.message === 'success'){
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

    const handleChooseProduct = (item) => {
        setProductName(item.name);
        setProductId(item.id);

        const btns = document.getElementsByClassName('btnClose');
        for(let i = 0; i < btns.length; i++) btns[i].click();
    }

    const handleSave = async () => {
        try{
            const payload = {
                qty: qty,
                productId: productId
            }
            await axios.post(config.api_path + '/stock/save', payload, config.headers()).then( res => {
                if(res.data.message === 'success'){
                    Swal.fire({
                        title: 'Stock Updated',
                        text: 'Stock updated successfully',
                        icon: 'success',
                        timer: 2000
                    })
                    fetchDataStock();
                    setQty(0);
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

    const handleDelete = (item) => {
        Swal.fire({
            title: 'Delete Stock',
            text: 'Are you sure?',
            icon: 'question',
            showCancelButton: true,
            showConfirmButton: true
        }).then(async res => {
            if (res.isConfirmed) {
                try {
                    await axios.delete(config.api_path + '/stock/delete/' + item.id, config.headers()).then(res => {
                        if (res.data.message === 'success') {
                            Swal.fire({
                                title: 'Stock Deleted',
                                text: 'Stock deleted successfully',
                                icon: 'success',
                                timer: 2000
                            })
                            fetchDataStock();
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

    return(
        <>
            <Template>
                <div className="card">
                    <div className="card-header">
                        <div className="card-title">Product Stock</div>
                    </div>
                    <div className="card-body">
                        <div className="row">
                            <div className="col-8">
                                <div className="input-group">
                                    <span className="input-group-text">Product</span>
                                    <input value={productName} className="form-control" disabled></input>
                                    <button 
                                    onClick={fetchData}
                                    data-toggle="modal"
                                    data-target="#modalProduct"
                                    className="btn btn-primary">
                                        {/* <i className="fa fa-search"></i> */}
                                        Choose Product
                                    </button>
                                </div>
                            </div>
                            <div className="col-2">
                                <div className="input-group">
                                    <span className="input-group-text">Quantity</span>
                                    <input 
                                    type="number" value={qty} 
                                    onChange={e => setQty(e.target.value)}
                                    className="form-control"></input>
                                </div>
                            </div>
                            <div className="col-2">
                                <button 
                                onClick={handleSave}
                                className="btn btn-success">
                                    <i className="fa fa-plus mr-2"></i>
                                    Add
                                </button>
                            </div>
                        </div>

                        <table className="table table-bordered mt-3">
                            <thead>
                                <tr>
                                    <th width="150px">Barcode</th>
                                    <th>Product</th>
                                    <th width="100px">Quantity</th>
                                    <th width="180px">Date</th>
                                    <th width="100px"></th>
                                </tr>
                            </thead>
                            <tbody>
                                { stocks.length > 0 ? stocks.map(item =>
                                <tr>
                                    <td>{item.product.barcode}</td>
                                    <td>{item.product.name}</td>
                                    <td className="text-end">{item.qty}</td>
                                    <td>{dayjs(item.updatedAt).format('DD/MM/YYYY - HH:mm:ss')}</td>
                                    <td className="text-center">
                                        <button 
                                        onClick={e => handleDelete(item)}
                                        className="btn btn-danger">
                                            <i className="fa fa-times ml-1 mr-1"></i>
                                        </button>
                                    </td>
                                </tr>
                                ) : ''}
                            </tbody>
                        </table>
                    </div>
                </div>
            </Template>

            <Modal id="modalProduct" title="Choose Product" modalSize="modal-lg">
                <table className="table table-bordered table-striped">
                    <thead>
                        <tr>
                            <th className="text-center" width="120px">-----</th>
                            <th width="120px">Barcode</th>
                            <th>Product Name</th>
                        </tr>
                    </thead>
                    <tbody>
                        { products.length > 0 ? products.map(item =>
                        <tr>
                            <td className="text-center">
                                <button 
                                onClick={e => handleChooseProduct(item)}
                                className="btn btn-outline-primary">
                                    <i className="fa fa-check me-2"></i>
                                    Select
                                </button>
                            </td>
                            <td className="text-end">{item.barcode}</td>
                            <td>{item.name}</td>
                        </tr>
                        ) : ''}
                    </tbody>
                </table>
            </Modal>
        </>
    )
}

export default Stock;