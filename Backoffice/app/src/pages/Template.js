import { Link } from "react-router-dom";

function Template(props) {
    return (
        <>
            <div className="row">
                <div className="col-xxl-2 col-xl-3 bg-dark pe-4 pt-4 ps-4 text-light" style={{ height: '100dvh' }}>
                    <div className="h4 text-center mb-3">
                        MENU
                    </div>
                    <div className="d-grid mt-2">
                        <Link to='/' className="btn btn-outline-info">Shops</Link>
                    </div>

                    <div className="d-grid mt-2">
                        <Link to='/' className="btn btn-outline-warning">Upgrade Requests</Link>
                    </div>

                    <div className="d-grid mt-2">
                        <Link to='/' className="btn btn-outline-success">Daily Income</Link>
                    </div>

                    <div className="d-grid mt-2">
                        <Link to='/' className="btn btn-outline-warning">Monthly Income</Link>
                    </div>

                    <div className="d-grid mt-2">
                        <Link to='/' className="btn btn-outline-warning">Yearly Income</Link>
                    </div>
                    <hr className="mt-"></hr>
                    <div className="float-end">
                        <div className=""> xxxx : Admin</div>
                        <div className="mt-2">
                            <button className="btn btn-danger">Sign Out</button>
                        </div>
                    </div>
                </div>
                <div className="col-xxl-10 col-xl-9">
                    {props.children}
                </div>
            </div>
        </>
    )
}

export default Template;