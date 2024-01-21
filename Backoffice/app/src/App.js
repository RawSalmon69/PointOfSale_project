import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import config from "./config";
import axios from "axios";
import { useNavigate } from 'react-router-dom';

function App() {
  const [usr, setUsr] = useState('');
  const [pwd, setPwd] = useState('');
  const navigate = useNavigate();

  const handleSignIn = async () => {
    try {
      const payload = {
        usr: usr,
        pwd: pwd
      }
      await axios.post(config.api_path + '/admin/signin', payload).then(res => {
          if (res.data.message === 'success') {
            localStorage.setItem(config.token_nameq, res.data.token);
            navigate('/home');
          }
      }).catch(err => {
          throw err.response.data;
      })
  } catch (e) {
      Swal.fire({
          title: "error",
          text: e.message,
          icon: "error"
      })
  }
  }

  return (
    <>
      <div className="container">
        <div className="card mt-5 shadow">
          <h5 className="card-header">
            <div className="card-title mt-1">Login to POS</div>
          </h5>
          <div className="card-body">
            <div>
              <label>Username</label>
              <input onChange={e=> setUsr(e.target.value)} className="form-control" />
            </div>

            <div className="mt-3">
              <label>Password</label>
              <input onChange={e=> setPwd(e.target.value)} type="password" className="form-control" />
            </div>

            <div className="mt-3">
              <button 
              onClick={handleSignIn}
              className="btn btn-primary mb-3" >
                <i className="fa fa-check" style={{ marginRight: '10px' }}></i>
                Sign in</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
