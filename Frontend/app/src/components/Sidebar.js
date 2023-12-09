import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import axios from 'axios';
import config from '../config';
import { Link } from 'react-router-dom';

function Sidebar() {
    const [memberName, setMemberName] = useState();
    const [packageName, setPackageName] = useState();
    useEffect(() => {
        fetchData();
    })

    const fetchData = async () => {
        try {
            axios.get(config.api_path +'/member/info', config.headers()).then(res=>{
                if(res.data.message==='success'){
                    setMemberName(res.data.result.name);
                    setPackageName(res.data.result.package.name);
                }
            }).catch(err=>{
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
            <aside class="main-sidebar sidebar-dark-primary elevation-4">
                <a href="http://localhost:3001/" class="brand-link">
                    <img src="dist/img/AdminLTELogo.png" alt="AdminLTE Logo" class="brand-image img-circle elevation-3" style={{ opacity: .8 }} />
                    <span class="brand-text font-weight-light">RawS: POS on Cloud</span>
                </a>

                <div class="sidebar">
                    <div class="user-panel mt-3 pb-3 mb-3 d-flex">
                        <div class="image mt-2">
                            <img src="dist/img/user2-160x160.jpg" class="img-circle elevation-2" alt="User Image" />
                        </div>
                        <div class="info text-white">
                            <a>
                                <h6 className='text-bold'>{memberName}</h6>
                                <div>Package: {packageName}</div>
                                </a>
                        </div>
                    </div>

                    <nav class="mt-2">
                        <ul class="nav nav-pills nav-sidebar flex-column" data-widget="treeview" role="menu" data-accordion="false">
                            <li class="nav-item">
                                <a href="pages/widgets.html" class="nav-link">
                                    <i class="nav-icon fas fa-th"></i>
                                    <p>
                                        Dashboard
                                    </p>
                                </a>
                            </li>
                            <li class="nav-item">
                                <Link to="/product" class="nav-link">
                                    <i class="nav-icon fas fa-box"></i>
                                    <p>
                                        Products
                                    </p>
                                </Link>
                            </li>
                        </ul>
                    </nav>
                </div>
            </aside>
        </>
    )
}

export default Sidebar;