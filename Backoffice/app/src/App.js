function App() {
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
              <input className="form-control" />
            </div>

            <div className="mt-3">
              <label>Password</label>
              <input type="password" className="form-control" />
            </div>

            <div className="mt-3">
              <button className="btn btn-primary mb-3" >
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
