import React, { Contairner, Component} from 'react';
import history from './history';
import DistanceHelper from './distance_helper';

class VendorContainer extends Component{
    constructor(props){
        super(props);
        this.start = false;
        this.state = {
            distance: 0
        }
    }

    goToVendor(page_id){        
        let link = "/fornecedor/"+page_id;
        history.push(link);
    }
    isOpen(open){
        if (open){
            let color = '#ff7000';
            if (this.props.vendor.color){
                color = this.props.vendor.color;
            }
            return(<div style={{width:'20px', height:'20px', margin:'auto', backgroundImage:'url(/imgs/goArrow3.png)', backgroundPosition:'center', backgroundRepeat:'no-repeat', backgroundSize:'contain', backgroundColor:color}}></div>);
        }else{
            return(<div style={{margin:'auto', textAlign:'center', fontSize:'9px', fontWeight:'bold', color:'red'}}>FECHADO</div>);
        }
    }

    render(){
        const vendor = this.props.vendor;
        console.log(vendor)
        const distanceHelper = new DistanceHelper(this);
        var vendorCoords = vendor.address.coords.selected
        if (!this.start) { 
            this.start =true; 
            var distance = distanceHelper.distanceBetweenMe(vendorCoords); 
        }
        var image = ''
        var color = '#ff7000';
        if (vendor.color){
            color = vendor.color;
        }
        if (!vendor){ return( <div></div>); }
        if (!vendor.img_url){ image = ''; }else{ image = 'url('+vendor.img_url+')'; }
        return(
        <div style={{height:'90px', margin:'0 10px', marginBottom:'15px', display:'flex', backgroundColor:'#f1f2f2'}} onClick={()=>{history.push('/fornecedor/'+vendor._id)}}>
            <div style={{width:'6px', height:'100%', backgroundColor:color}}></div>
            <div style={{width:'85px', height:'100%', display:'flex'}}>
                <div style={{width:'65px', height:'65px', margin:'auto', backgroundImage:image, backgroundPosition:'center', backgroundRepeat:'no-repeat', backgroundSize:'contain', backgroundColor:'white', borderRadius:'50%'}}></div>
            </div>
            <div style={{paddingLeft:'5px', display:'flex'}}>
                <div style={{margin:'auto 0'}}>
                    <div style={{minHeight: '20px', fontSize:'14px', fontWeight:'800', color:color}}>{vendor.display_name}</div>
                    <div style={{fontSize:'11px', minHeight:'15px'}}>{vendor.address.cidade} <span style={{display:(Meteor.userId()) ? 'block' : 'none'}}>({vendor.distance.toString().replace('.', ',')} km)</span></div>
                    <div style={{fontSize:'13px', fontSize:'11px', minHeight:'15px'}}>Entrega 24h!</div>
                    <div style={{fontSize:'13px', fontSize:'11px', minHeight:'15px'}}>Correios, Motoboy e Transportadora</div>
                </div>
            </div>
            <div style={{width:'50px', height:'100%', marginLeft:'auto', display:'flex'}}>
                {this.isOpen(vendor.open)}
            </div>
        </div>)
    }
}
export default VendorContainer;