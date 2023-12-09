import Template from "../components/Template";
import Swal from "sweetalert2";
import config from "../config";
import axios from "axios";
import { useState, useEffect } from "react";
import Modal from "../components/Modal";

function Product() {
    const [product, setProduct] = useState({});
    const [products, setProducts] = useState([]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            await axios.get(config.api_path + '/product/list', config.headers()).then(res => {
                if (res.data.message === 'success') {
                    setProducts(res.data.results);
                }
            })
        } catch (e) {
            Swal.fire({
                title: 'error',
                text: e.message,
                icon: 'error'
            })
        }
    }

    const clearForm = () => {
        setProduct({
            barcode: '',
            name: '',
            cost: '',
            price: '',
            details: ''
        });
    }

    const handleClose = () => {
        const btns = document.getElementsByClassName('btnClose');
        for (let i = 0; i < btns.length; i++) {
            btns[i].click();
        }
    }

    const handleSave = async (e) => {
        e.preventDefault();
        try {

            let url = '/product/insert';
            if (product.id !== undefined) {
                url = '/product/update';
            }

            await axios.post(config.api_path + url, product, config.headers()).then(res => {
                if (res.data.message === 'success') {
                    Swal.fire({
                        title: 'Product Saved',
                        text: 'Product details saved successfully',
                        icon: 'success',
                        timer: 2000
                    })
                    fetchData();
                    handleClose();

                }
            })
        } catch (e) {
            Swal.fire({
                title: 'error',
                text: e.message,
                icon: 'error',
            })
        }
    }
    const handleDelete = (item) => {
        Swal.fire({
            title: 'Delete Product',
            text: 'Are you sure?',
            icon: 'question',
            showCancelButton: true,
            showConfirmButton: true
        }).then(async res => {
            if (res.isConfirmed) {
                try {
                    await axios.delete(config.api_path + '/product/delete/' + item.id, config.headers()).then(res => {
                        if (res.data.message === 'success') {
                            Swal.fire({
                                title: 'Product Deleted',
                                text: 'Product deleted successfully',
                                icon: 'success',
                                timer: 2000
                            })
                            fetchData();
                        }
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
                        <div className="card-title">Products</div>
                    </div>
                    <div className="card-body">
                        <button onClick={clearForm} data-toggle='modal' data-target='#modalProduct' className="btn btn-primary">
                            <i className="fa fa-plus mr-2"></i>Add Product
                        </button>
                        <table className="mt-3 table table-bordered">
                            <thead>
                                <tr>
                                    <th>Barcode</th>
                                    <th>Product name</th>
                                    <th>Base Cost</th>
                                    <th>Sale Price</th>
                                    <th>Details</th>
                                    <th width='150px'></th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.length > 0 ? products.map(item =>
                                    <tr>
                                        <td>{item.barcode}</td>
                                        <td>{item.name}</td>
                                        <td className="text-right">{parseInt(item.cost).toLocaleString('th-TH')}</td>
                                        <td className="text-right">{parseInt(item.price).toLocaleString('th-TH')}</td>
                                        <td>{item.details}</td>
                                        <td className="text-center">
                                            <button onClick={e => setProduct(item)} data-toggle='modal' data-target='#modalProduct' className="btn btn-info mr-2">
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

            <Modal id='modalProduct' title='Product' modalSize='modal-lg'>
                <form onSubmit={handleSave}>
                    <div className="row">
                        <div className="mt-3 col-3">
                            <label>Barcode</label>
                            <input value={product.barcode} onChange={e => setProduct({ ...product, barcode: e.target.value })} className="form-control" />
                        </div>

                        <div className="mt-3 col-9">
                            <label>Product Name</label>
                            <input value={product.name} onChange={e => setProduct({ ...product, name: e.target.value })} className="form-control" />
                        </div>

                        <div className="mt-3 col-3">
                            <label>Sale Price</label>
                            <input value={product.price} onChange={e => setProduct({ ...product, price: e.target.value })} className="form-control" />
                        </div>

                        <div className="mt-3 col-3">
                            <label>Base Cost</label>
                            <input value={product.cost} onChange={e => setProduct({ ...product, cost: e.target.value })} className="form-control" />
                        </div>

                        <div className="mt-3 col-6">
                            <label>Details</label>
                            <input value={product.details} onChange={e => setProduct({ ...product, details: e.target.value })} className="form-control" />
                        </div>
                        <div className="mt-3">
                            <button onClick={handleSave} className="btn btn-primary">
                                <i className="fa fa-save mr-2"></i>Save
                            </button>
                        </div>
                    </div>
                </form>
            </Modal>
        </>
    )
}
export default Product;