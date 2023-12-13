import { useEffect, useState } from "react";
import Modal from "../components/Modal";
import Template from "../components/Template";
import Swal from "sweetalert2";
import config from "../config";
import axios from "axios";

function Sale() {
    const [products, setProducts] = useState([]);
    const [billSale, setBillSale] = useState({});

    useEffect(() => {
        fetchData();
        openBill();
    }, []);

    const openBill = async () => {
        try {
            await axios.get(config.api_path + '/billSale/openBill', config.headers()).then(res => {
                if (res.data.message === 'success') {
                    setBillSale(res.data.result);
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

    const fetchData = async () => {
        try {
            await axios.get(config.api_path + '/product/listForSale', config.headers()).then(res => {
                if (res.data.message === 'success') {
                    setProducts(res.data.results);
                }
            }).catch[(err) => {
                throw err.response.data;
            }]
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
            await axios.post(config.api_path + '/billSale/sale', item, config.headers()).then(res =>{
                if(res.data.message === 'success'){
                    fetchDataSale();
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

    const fetchDataSale = async () => {

    }

    return <>
        <Template>
            <div className="card">
                <div className="card-header">
                    <div className="card-title float-start">Sale</div>
                    <div className="float-end">
                        <button className="btn btn-primary text-white mr-2">
                            <i className="fa fa-file-alt mr-2" />
                            Last Bill
                        </button>
                        <button className="btn btn-info text-white mr-2">
                            <i className="fa fa-history mr-2" />
                            History
                        </button>
                        <button className="btn btn-success mr-2">
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
                                                <div>{item.price}</div>
                                            </div>
                                        </div>

                                    </div>) : ''}
                            </div>
                        </div>

                        <div className="col-3 mt-2">
                            <div className="text-end">
                                <div className="h2 ps-3 pe-3 border border-dark rounded"
                                    style={{ backgroundColor: "black", color: "lightgreen" }}>
                                    0.00
                                </div>
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


                    <table className="table table-bordered table-striped mt-3">
                        <thead className="table-dark">
                            <tr>
                                <th>#</th>
                                <th>Barcode</th>
                                <th>Product</th>
                                <th>Price</th>
                                <th>Amount</th>
                                <th width='100px'></th>
                            </tr>
                        </thead>

                        <tbody>

                        </tbody>
                    </table>
                </div>
            </div>
        </Template>
    </>
}
export default Sale;