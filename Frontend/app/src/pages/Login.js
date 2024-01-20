import axios from "axios";
import { useState } from "react";
import Swal from "sweetalert2";
import config from "../config";
import { useNavigate } from "react-router-dom";

function Login() {
    const [phone,setPhone] = useState();
    const [pass, setPass] = useState();
    
    const navigate = useNavigate();

    const handleSignIn = async() =>{
        try{
            const payload = {
                phone: phone,
                pass: pass
            }
            await axios.post(config.api_path + '/member/signin', payload).then(res =>{
                if(res.data.message === 'success'){
                    Swal.fire({
                        title: 'Signed in!',
                        test:'You have been signed in',
                        icon:'success',
                        timer:2000
                    })
                    localStorage.setItem(config.token_name, res.data.token);

                    navigate('/home');
                }else
                Swal.fire({
                    title: 'Failed to sign in',
                    text:'Phone number or password is incorrect',
                    icon:'error',
                    timer:2000
                })
            }).catch(err =>{
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
            <div className="container">
                <div className="card mt-5">
                    <h5 className="card-header">
                        <div className="card-title mt-1 h5">Login to POS</div>
                    </h5>
                    <div className="card-body">
                        <div>
                            <span>Phone</span>
                            <input onChange={e=>setPhone(e.target.value)}  className="form-control" />
                        </div>

                        <div className="mt-3">
                            <span>Password</span>
                            <input  onChange={e=>setPass(e.target.value)} type="password" className="form-control" />
                        </div>

                        <div className="mt-3">
                            <button className="btn btn-primary mb-3" onClick={handleSignIn}>
                                <i className="fa fa-check" style={{ marginRight: '10px' }}></i>
                                Sign in</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Login;