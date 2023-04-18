import React, { Component } from 'react';
import VendorContainer from './widgets/vendor_container';

class VendorBox extends Component{
    go_to_vendor(page_id){
        let link = "/fornecedor/"+page_id;
        <Redirect to={link} />
    }

    render(){
        const vendors = this.props.vendors;  
        console.log(vendors)      
        return(<div>
            {vendors.map((vendor, index)=>{
                let key = 'cVendor_'+index;
                if (!vendor){return(<div></div>);}
                return(<VendorContainer vendor={vendor} key={key}/>)
            })}   
        </div>)
    }
}
export default VendorBox;