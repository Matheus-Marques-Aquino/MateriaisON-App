import React, { Component } from 'react';
import { Vendors } from '../../../imports/collections/vendors';
import { Profile } from '../../../imports/collections/profile';
import DistanceHelper from './widgets/distance_helper';
import ResumeContainer from './widgets/resume_container';

class OrdersBox extends Component{
    constructor(props){
        super(props);
        this.Distance = new DistanceHelper(this);
        this.start = false;
        this.vendorArray = [];
        this.orderArray = [];
        this.lastDate = '';
        this.firstMargin = '10px'
        this.state = {
            loaded: false
        };
    }
    render(){                       
        const orderStatus = ['Aguardando pagamento', 'Preparando pedido', 'Pedido em transporte', 'Pedido concluído', 'Pedido cancelado', 'Pagamento recusado']
        this.orderArray = this.props.orders;
        this.firstMargin = '10px'
        if (!this.start){
            this.start = true;            
            Meteor.subscribe('profileFields', 'ProfileCoords', Meteor.userId(), ()=>{
                let profile = Profile.findOne({'_id': Meteor.userId()});
                let coords = profile.profile.address[profile.profile.mainAddress].coords.selected;
                let vendorIds = [];
            
                this.orderArray.map(order=>{
                    if (!vendorIds.includes(order.order.vendorId)){ vendorIds.push(order.order.vendorId); }
                    order.order.status = orderStatus[order.order.status];
                });
                
                Meteor.subscribe('vendorFields', 'OrdersPage', vendorIds, ()=>{
                    let vendors = Vendors.find({}).fetch()
                    let vendorArray = [];
                    vendors.map(vendor=>{
                        if (!vendorArray[vendor]){
                            let image = '';
                            let distance = this.Distance.distanceTo(coords, vendor.address.coords.selected);
                            
                            if (!vendor.img_url){ image = ''; }else{ image = 'url('+vendor.img_url+')';}
                            
                            vendorArray[vendor.id]={
                                name: vendor.display_name,
                                img: image,
                                color: vendor.color,
                                distance: distance,
                                location: vendor.address.cidade
                            }
                        }                
                    });
                    this.vendorArray = vendorArray; 
                    this.setState({loaded: true})                   
                });
            });            
        }        

        if (!this.state.loaded) return(<div></div>)        
        this.orderArray.sort((a,b)=>{
            if (a.order.date < b.order.date){
                return 1;
            }
            if (a.order.date > b.order.date){
                return -1;
            }
            return 0
        })
               
        return(<div>{            
            this.orderArray.map((order, index)=>{                
                var _id = order._id;
                var _order = order.order;
                var productsArray = [];
                _order.products.map(product=>{
                    productsArray.push({
                        name: product.name,
                        quantity: product.quantity,
                        price: product.price
                    });
                });
                _order = {                    
                    _id: _id,
                    id: _order.orderId, 
                    status: _order.status,                   
                    vendorId: _order.vendorId,
                    vendor_name: this.vendorArray[_order.vendorId].name,
                    vendor_img: this.vendorArray[_order.vendorId].img,
                    vendor_color: this.vendorArray[_order.vendorId].color,
                    distance: this.vendorArray[_order.vendorId].distance,
                    location: this.vendorArray[_order.vendorId].location,
                    date: _order.date,
                    products: productsArray,
                    delivery: {name: _order.delivery.name, price: _order.delivery.price},
                    total: _order.price
                }
                if (_order.color == undefined || _order.color == ''){ _order.color = '#ff7000'; }
                let key = 'Order_'+index;
                let showDate = true;
                let formatDate = _order.date.getDate()+'/'+_order.date.getMonth()+'/'+_order.date.getFullYear();
                let statusColor = '#D7B614';
                let _firstMargin = this.firstMargin;

                if (this.lastDate == formatDate){
                    showDate = false;
                    this.lastDate = formatDate;
                }else{
                    this.lastDate = formatDate;
                }  
                if (this.props.page == 0 && _order.status != 'Pedido concluído'){ return(<div key={key}></div>); }
                if (this.props.page == 1 && _order.status == 'Pedido concluído'){ return(<div key={key}></div>); }
                if (_order.status == 'Preparando pedido'){ statusColor = '#1C2F59'; }
                if (_order.status == 'Pedido em transporte'){ statusColor = '#007AF3'; }
                if (_order.status == 'Pedido concluído'){ statusColor = '#3BCD38'; }
                if (_order.status == 'Pedido cancelado' || _order.status == 'Pagamento recusado'){ statusColor = '#B90C10'; }
                this.firstMargin = '25px';
                return(<ResumeContainer type='order' data={_order} showDate={showDate} firstMargin={_firstMargin} key={key} color={statusColor}/>);
            })
        }</div>);
    }
}
export default OrdersBox; 