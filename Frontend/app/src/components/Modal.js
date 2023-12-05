function Modal(props) {
    return (
        <>
            <div className="modal fade" id={props.id} tabindex="-1"  data-bs-backdrop="static" data-bs-keyboard="false" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="exampleModalLabel">{props.title}</h1>
                            <button id='btnModalClose' type="button" className="btn-close" data-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            {props.children}
                        </div>
                        {/* <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button type="button" className="btn btn-primary">Save changes</button>
                        </div> */}
                    </div>
                </div>
            </div>
        </>
    )
}

export default Modal;