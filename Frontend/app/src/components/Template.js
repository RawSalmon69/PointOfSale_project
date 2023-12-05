import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

function Template(){
    return(
        <>
            <div className='wrapper'>
                    <Navbar/>
                    <Sidebar/>
            </div>
        </>
    )
}

export default Template;