import React, { Component } from 'react';
import { createContainer } from 'react-meteor-data';
import history from './subcomponents/widgets/history';
import BackButton from './subcomponents/back_button';
import BottomMenu from './subcomponents/bottom_menu';
import ReactMeteorData from 'react-meteor-data/lib/ReactMeteorData';
import { Orders } from '../../imports/collections/orders';
import { Vendors } from '../../imports/collections/vendors';
import DetailsOrderBox from './subcomponents/details_order_box';
import MapOrderBox from './subcomponents/map_order_box';
import FormatDate from './subcomponents/widgets/format_date';

class OrderPage extends Component{
    constructor(props){
        super(props)
        this.start = false;
        this.address = '';
        this.state = {
            order: undefined
        };
        
    }
    render(){
        const orderId= this.props.orderId;
        const orderStatus = ['Aguardando pagamento', 'Preparando pedido', 'Pedido em transporte', 'Pedido concluído', 'Pedido cancelado', 'Pagamento recusado']
        var statusColor = '#D7B614';
        var color = '#ff7000'
        var title = 'Pedido #'+orderId;                
        if (!this.start && orderId){                        
            this.start = true;
            Meteor.subscribe('orderFields', 'OrderPage', {user_id: Meteor.userId(), orderId: parseInt(this.props.orderId)},()=>{
                let order = Orders.findOne({'order.orderId': parseInt(this.props.orderId)});
                let vendorId = order.order.vendorId.toString()
                Meteor.subscribe('vendorFields', 'OrderPage', vendorId,()=>{
                    let vendor = Vendors.findOne({'id': vendorId});
                    let image = '';                    
                    if (vendor.img_url && vendor.img_url != ''){ image = 'url('+vendor.img_url+')'; } 
                    if (vendor.color && vendor.color != ''){ color = vendor.color; }                    
                    order.vendor = {
                        id: vendorId,
                        name: vendor.display_name,
                        img: image,
                        address: vendor.address
                    }
                    this.address = order.order.address.address.rua+', '+order.order.address.address.numero;
                    if (order.order.address.address.complemento.length > 0){
                        this.address += ' - '+order.order.address.address.complemento;
                    }                    
                                      
                    this.setState({
                        order: order
                    })
                });
                
            });
        }
        if (!this.state.order){ return(<div></div>); }    
        if (this.state.order.order.status == 1){ statusColor = '#1C2F59'; }
        if (this.state.order.order.status == 2){ statusColor = '#007AF3'; }
        if (this.state.order.order.status == 3){ statusColor = '#3BCD38'; }
        if (this.state.order.order.status > 3){ statusColor = '#B90C10'} 
        return(
        <div className='mainContainer'>
            <BackButton/>
            <div style={{height:'55px', display:'flex', backgroundColor:'#ff7000'}}>
                <div style={{margin:'auto', color:'white', fontSize:'19px', fontWeight:'bold', }}>Pedido #{orderId}</div>    
            </div>
            <div style={{padding:'15px 10px'}}>
                <div style={{height:'90px', displa:'flex', marginBottom:'5px'}}>
                    <div style={{margin:'auto 0', display:'flex'}}>
                        <div style={{height:'90px', width:'85px', display:'flex'}}>
                            <div style={{height:'65px', width:'65px', margin:'auto', backgroundImage: this.state.order.vendor.img, backgroundSize:'contain', backgroundRepeat:'no-repeat', backgroundPosition: 'center', backgroundColor:'white'}}></div>
                        </div>
                        <div style={{height:'min-content', margin:'auto 0', marginLeft:'10px'}}>
                            <div style={{height:'20px', lineHeight:'20px', fontSize:'15px', fontWeight:'bold', color:color}}>{this.state.order.vendor.name}</div>
                            <div style={{height:'20px', lineHeight:'20px', fontSize:'12px', fontWeight:'bold', color:statusColor}}>{orderStatus[this.state.order.order.status]} #{orderId}</div>
                            <div style={{height:'20px', lineHeight:'20px', fontSize:'12px'}}>
                                Pedido realizado dia <FormatDate type='D/M' date={this.state.order.order.date}/> às <FormatDate type='HM' date={this.state.order.order.date}/>
                            </div>
                        </div>
                    </div> 
                </div>
                <MapOrderBox 
                    delivery={this.state.order.order.delivery} 
                    address={this.state.order.order.address} 
                    vendor={this.state.order.vendor} 
                    status={this.state.order.order.status}
                    orderId={orderId}
                />             
                <DetailsOrderBox 
                    products={this.state.order.order.products} 
                    delivery={this.state.order.order.delivery}
                />           
                <div style={{height:'110px', marginTop:'10px', paddingBottom:'10px', backgroundColor:'#F7F7F7', borderRadius:'5px'}}>
                    <div style={{height:'20px', lineHeight:'20px', padding:'5px 10px', fontSize:'15px', fontWeight:'bold', color:'#ff7000', display:'flex'}}>
                        <div style={{width:'10px', height:'10px', margin:'auto 0', backgroundImage:'url(/imgs/icons/icon-rightArrow.png)', backgroundPosition:'center', backgroundRepeat:'no-repeat', backgroundSize:'contain'}}></div>
                        <div style={{marginLeft:'5px'}}>Destinatário:</div>
                    </div>
                    <div style={{height:'80px', lineHeight:'20px', padding:'0 10px', display:'flex'}}>
                        <div style={{width:'30px', height:'30px', margin:'auto 0', backgroundImage:'url(/imgs/icons/icon-point2.png)', backgroundPosition:'center', backgroundRepeat:'no-repeat', backgroundSize:'contain'}}></div>
                        <div style={{margin:'auto 0', marginLeft:'15px'}}>
                            <div style={{height:'20px', fontSize:'13px'}}>{this.state.order.order.address.name}</div>
                            <div style={{height:'20px', fontSize:'13px'}}>{this.state.order.order.address.address.cidade}</div>
                            <div style={{height:'20px', fontSize:'13px'}}>{this.address}</div>
                        </div>
                    </div>
                </div>
            </div>
            <BottomMenu/>
        </div>)
    }
}
export default createContainer(()=>{
    const location = history.location.pathname.split("/");
    const orderId = location[location.length - 1]; 
    return{
        orderId: orderId
    };
}, OrderPage)