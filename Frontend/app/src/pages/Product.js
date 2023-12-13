import Template from "../components/Template";
import Swal from "sweetalert2";
import config from "../config";
import axios from "axios";
import { useState, useEffect } from "react";
import Modal from "../components/Modal";

function Product() {
    const [product, setProduct] = useState({});
    const [products, setProducts] = useState([]);
    const [productImage, setProductImage] = useState({});
    const [productImages, setProductImages] = useState([]);

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
    const handleChangeFile = (files) => {
        setProductImage(files[0]);
    }
    const handleUpload = () => {
        Swal.fire({
            title: 'Upload Image',
            text: 'Are you sure?',
            icon: 'question',
            showCancelButton: true,
            showConfirmButton: true,
        }).then(async res => {
            if (res.isConfirmed) {
                try {
                    const _config = {
                        headers: {
                            'Authorization': 'Bearer ' + localStorage.getItem(config.token_name),
                            'Content-Type': 'multipart/form-data',
                        }
                    }
                    const formData = new FormData();
                    formData.append('productImage', productImage);
                    formData.append('productImageName', productImage.name);
                    formData.append('productId', product.id);

                    await axios.post(config.api_path + '/productImage/insert', formData, _config).then(res => {
                        if (res.data.message === 'success') {
                            Swal.fire({
                                title: 'Image Uploaded',
                                text: 'Image uploaded successfully',
                                icon: 'success',
                                timer: 2000
                            })

                            fetchDataProductImage({ id: product.id });

                            // const btns = document.getElementsByClassName('btnClose');
                            // for (let i = 0; i < btns.length; i++) btns[i].click();
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
    const fetchDataProductImage = async (item) => {
        try {
            await axios.get(config.api_path + '/productImage/list/' + item.id, config.headers()).then(res => {
                if (res.data.message === 'success') {
                    setProductImages(res.data.results)
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
    const handleChooseProduct = (item) => {
        setProduct(item);
        fetchDataProductImage(item);
    }
    const handleChooseMainImage = (item) => {
        Swal.fire({
            title: 'Set Main Image',
            text: 'Are you sure?',
            icon: 'question',
            showCancelButton: true,
            showConfirmButton: true,
        }).then(async res => {
            if (res.isConfirmed) {
                try {
                    const url = config.api_path + '/productImage/chooseMainImage/' + item.id + '/' + item.productId;
                    await axios.get(url, config.headers()).then(res => {
                        if (res.data.message === 'success') {
                            fetchDataProductImage({
                                id: item.productId
                            });

                            Swal.fire({
                                title: 'Main Image Chosen',
                                text: 'Main image chosen successfully',
                                icon: 'success',
                                timer: 2000
                            })
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
    const handleDeleteProductImage = (item) => {
        Swal.fire({
            title: 'Delete Product Image',
            text: 'Are you sure?',
            icon: 'question',
            showCancelButton: true,
            showConfirmButton: true,
        }).then(async res => {
            if (res.isConfirmed) {
                try {
                    await axios.delete(config.api_path + '/productImage/delete/' + item.id, config.headers()).then(res => {
                        if (res.data.message === 'success') {

                            fetchDataProductImage({ id: item.productId });

                            Swal.fire({
                                title: 'Image Deleted',
                                text: 'Image deleted successfully',
                                icon: 'success',
                                timer: 2000
                            })
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
                        <div className="card-title">Products</div>
                    </div>
                    <div className="card-body">
                        <button onClick={clearForm} data-toggle='modal' data-target='#modalProduct' className="btn btn-primary">
                            <i className="fa fa-plus mr-2"></i>Add Product
                        </button>
                        <table className="mt-3 table table-bordered table-striped">
                            <thead>
                                <tr>
                                    <th>Barcode</th>
                                    <th>Product name</th>
                                    <th>Base Cost</th>
                                    <th>Sale Price</th>
                                    <th>Details</th>
                                    <th width='170px'></th>
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

                                            <button onClick={e => handleChooseProduct(item)} data-toggle='modal' data-target='#modalProductImage' className="btn btn-primary mr-2">
                                                <i className="fa fa-image"></i>
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

            <Modal id='modalProductImage' title='Product Image' modalSize='modal-lg'>
                <div className="row">
                    <div className="col-4">
                        <div>Barcode</div>
                        <input value={product.barcode} disabled className="form-control"></input>
                    </div>
                    <div className="col-8">
                        <div>Product Name</div>
                        <input value={product.name} disabled className="form-control"></input>
                    </div>
                    <div className="col-12 mt-2">
                        <div>Details</div>
                        <input value={product.details} disabled className="form-control"></input>
                    </div>

                    <div className="col-12 mt-2">
                        <div>Choose Product Image</div>
                        <input onChange={e => handleChangeFile(e.target.files)} type='file' name='imageName' className="form-control"></input>
                    </div>
                    {/* { productImage.name != undefined ? 
                    <div className="mt-1">File: {productImage.name}</div> 
                    : '' } */}

                    <div className="mt-3">
                        {productImage.name !== undefined ?
                            <button onClick={handleUpload} className="btn btn-primary">
                                <i className="fa fa-upload mr-2"></i>
                                Upload and Save
                            </button>
                            : ''}
                    </div>

                    <hr className="divider mt-2"></hr>
                    <div className="h5">Product Images</div>
                    <div className="row mt-2">
                        {productImages.length > 0 ? productImages.map(item =>
                            <div className="col-3" key={item.id}>
                                <div className="card">
                                    <img className="card-img-top" src={config.api_path + '/uploads/' + item.imageName} width='100%' alt='' />
                                    <div className="card-body text-center">
                                        {item.isMain ?
                                            <button className="btn btn-info mr-2">
                                                <i className="fa fa-check mr-2"></i>
                                                Main
                                            </button>
                                            :
                                            <button onClick={e => handleChooseMainImage(item)} className="btn btn-outline-secondary mr-2">image</button>
                                        }
                                        <button onClick={e => handleDeleteProductImage(item)} className="btn btn-danger">
                                            <i className="fa fa-times"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : ''}
                    </div>
                </div>
            </Modal>
        </>
    )
}
export default Product;