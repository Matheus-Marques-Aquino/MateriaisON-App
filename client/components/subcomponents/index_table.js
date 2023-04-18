import React, { Component } from 'react';
import history from './widgets/history';


class IndexTable extends Component{

    goToVendor(page_id){        
        let link = "/fornecedor/"+page_id;
        history.push(link);
    }
    
    render(){        
        return(
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(86px, 86px))',
                gridGap: '18px',
                justifyContent: 'center'
            }}>{
                this.props.featured.map((vendor, index)=>{
                    let key = "Featured_"+index;
                    let image = ''
                    if (!vendor.img_url){ return; }else{ image = 'url('+vendor.img_url+')'; }
                    return( <div style={{height:'86px', width:'86px', backgroundImage: image, backgroundSize:'contain', backgroundRepeat:'no-repeat', backgroundPosition: 'center', backgroundColor:'white', borderRadius:'5px'}} onClick={()=>{this.goToVendor(vendor.id)}} key={key}></div> );
                })
            }</div>
        )
    }
}
export default IndexTable;