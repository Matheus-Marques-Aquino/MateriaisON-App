import React, { Component } from 'react';
import FormatNumber from './widgets/format_number';
import Shipping from '../../../imports/collections/cache/shipping';
import { Packing } from './widgets/item_packing';
import history from './widgets/history';
import DistanceHelper from './widgets/distance_helper';

class DeliverySelection extends Component{
    constructor(props) {
        super(props);
        this.start = false;
        this.count = 0;
        this.places = {};
        this.canReload = true;
        this.loading = true
        this.state = {            
            deliverySelection: -1,
            price: [-1, -1, -1, -1, -1],
            delivery: {
                name: '',
                price: 0,
                index: -1,
                box:{
                    w: 0,
                    d: 0,
                    h: 0,
                    wg: 0,
                    error: false
                },
                loaded: false
            },
            canStart: false,
            reload: true,
            loading: true
        };
        this.packData = {
            w: 0,
            h: 0,
            d: 0,
            wg: 0,
            error: false
        }        
    }
    onSelectionChange(index, delivery){
        this.setState({ 
            deliverySelection: index,
            delivery: delivery
        });
        this.props.selection(delivery);
    }
    formatAddress(address){
        let formatedAddress = '';
        if (!address.rua || !address.numero || !address.bairro || !address.cidade || !address.UF){
            return formatedAddress;
        }
        formatedAddress = address.rua + ', ' + address.numero + ' - ' + address.bairro + ', ' + address.cidade + ' - ' + address.UF;

        if (address.cep){
            if (address.cep.length > 8){
                formatedAddress += ', '+ address.cep.replace('-', '');
            }
        }
        formatedAddress += ', Brasil';
        return formatedAddress;
    }
    getPrice(){        
        this.canReload = false        
        this.lastBox = {w: this.packData.w, h: this.packData.h, d: this.packData.d, wg: this.packData.wg};
        Meteor.call('getDelivery', Meteor.userId(), this.places, this.packData, (error, result)=>{
            if (!error){
                this.canReload = true;
                if (!Array.isArray(result)){
                    result = [-1, -1, -1, -1, -1];
                    if (!this.state.loading){
                        this.setState({ loaded: true, price: result, loading:true });}
                    this.getPrice();
                }
                this.setState({ loaded: true, price: result, loading:false });
            }else{
                console.log(error)
                result = [-1, -1, -1, -1, -1];
                if (error.error == 500 ){ 
                    this.setState({ loaded: false, price: result, loading:false })
                    return; 
                }
                if (!this.state.loading){
                    this.setState({ loaded: true, price: result, loading:true })
                }                                
                this.getPrice();
            }
        }); 
    }
    render(){
        const delivery = ['Motoboy:', 'Correios PAC:', 'Correios Sedex:', 'Transportadora:', 'Retirar no local:'];
        var vendor = this.props.vendor;
        var profile = this.props.profile;         
        let packInfo = this.props.packages;
        let packing =  new Packing(packInfo);
        packInfo = packing.result;

        this.packData = {
            w: packInfo.w,
            h: packInfo.h,
            d: packInfo.d,
            wg: packInfo.wg,
            error: packInfo.error
        }
        vendor = {
            vendorId: vendor.id,
            name: vendor.display_name,
            address: vendor.address,
            formatedAddress: this.formatAddress(vendor.address),
            terms: vendor.terms
        };        
        profile.address.address.coords = profile.address.coords;
        profile = {
            name: profile.name,
            address: profile.address.address,
            formatedAddress: this.formatAddress(profile.address.address)
        };      
        this.places = {
            place1: {                
                lat: (vendor.address.coords.selected.lat).toString(),
                lng: (vendor.address.coords.selected.lng).toString(),
                address: {
                    formated: vendor.formatedAddress,
                    complement: (vendor.address.complemento)?vendor.address.complemento:'',
                    phone: (vendor.phone)?vendor.phone:'',
                    cep: vendor.address.cep   
                }                                        
            },
            place2: {   
                name: profile.name,          
                lat: (profile.address.coords.selected.lat).toString(),
                lng: (profile.address.coords.selected.lng).toString(),
                address: {
                    formated: profile.formatedAddress,
                    complement: (profile.address.complemento)?profile.address.complemento:'',
                    phone: (profile.address.celular)?profile.address.celular:'',
                    cep: profile.address.cep
                }   
            },
            vendorId: vendor.vendorId
        }
        this.Distance = new DistanceHelper(this);
        let deliveryDistace = this.Distance.distanceTo(this.places.place1, this.places.place2);
        let _lastBox = {w: this.packData.w, h: this.packData.h, d: this.packData.d, wg: this.packData.wg};
        let _stringLastBox = JSON.stringify(_lastBox)
        let stringLastBox = JSON.stringify(this.lastBox)
        if ((!this.start || _stringLastBox != stringLastBox) && this.canReload){
            this.count += 1;            
            if (this.start){
                setTimeout(()=>{if (!this.state.loading){ history.push('/carrinho') }}, 8000);
                setTimeout(()=>{if (this.state.price[0] == -1 && this.state.price[0] == -1 && 
                    this.state.price[1] == -1 && this.state.price[2] == -1 && 
                    this.state.price[3] == -1 && this.state.price[4] == -1 ){ 
                        history.push('/carrinho'); 
                    }}, 8000);
            } 
            this.start = true;
            this.getPrice();                     
            //this.setState({deliverySelection: -1, loading: true});             
        }                      
        let displayLock = 'none';
        if (this.state.loading){ displayLock = 'block';}
        if (!this.state.loaded){return (<div></div>);}
        if (!vendor.terms){return (<div></div>);}
        if (!vendor.terms.delivery){return (<div></div>);}
        return(
        <div style={{padding:'10px', marginTop:'10px', backgroundColor:'#F7F7F7'}}> 
            <div style={{fontSize:'15px', fontWeight:'bold', color:'#ff7000', display:'flex'}}>
                <div style={{width:'10px', height:'10px', margin:'auto 0', backgroundImage:'url(/imgs/icons/icon-rightArrow.png)', backgroundPosition:'center', backgroundRepeat:'no-repeat', backgroundSize:'contain'}}></div>
                <div style={{marginLeft:'5px'}}>Formas de envio</div>                        
            </div>            
            <div style={{position:'relative'}}>
                <div style={{padding:'5px 10px', paddingBottom:'0px'}}>
                    {vendor.terms.delivery.map((entrega, index)=>{
                        let price = -1;
                        if (index == 0){ price = this.state.price[0]; }
                        if (index == 1){ price = this.state.price[1]; }
                        if (index == 2){ price = this.state.price[2]; }
                        if (index == 3){ price = this.state.price[3]; }
                        if (index == 4){ price = this.state.price[4];}
                        let name = '_'+delivery[index]
                        let display = 'none';
                        let color = '#b3b3b3'
                        let _delivery = {
                            name: delivery[index],
                            price: price,
                            index: index,
                            box: this.packData
                        }
                        if (this.state.deliverySelection == index){
                            display = 'block';
                            color = '#ff7000'
                        }
                        if (entrega && (price >= 0)){
                            let _price = parseFloat(price).toFixed(2).split('.');
                            if (index == 4){
                                return(
                                <div style={{height:'30px', lineHeight:'20px', fontSize:'13px', display:'flex'}} key={name} onClick={()=>{ if (!this.state.loading){this.onSelectionChange(index, _delivery)}}}>
                                    <div style={{width:'10px', height:'10px', margin:'auto 0', border:'2px solid '+color, borderRadius:'50%', display:'flex'}}>
                                        <div style={{width:'6px', height:'6px', margin:'auto', borderRadius:'50%', backgroundColor:'#ff7000', display: display}}></div>
                                    </div>
                                    <span style={{margin:'auto 0', width:'120px', marginLeft:'10px'}}>{delivery[index]}</span>
                                    <span style={{margin:'auto 0'}}> R$ {_price[0]},<span style={{fontSize:'10px', position:'relative', top:'-1px'}}>{_price[1]}</span></span>  
                                    <span style={{margin:'auto', marginRight:'0px', fontSize:'13px'}}>({deliveryDistace} km)</span>                      
                                </div>)                        
                            }else{
                                return(
                                <div style={{height:'30px', lineHeight:'20px', fontSize:'13px', display:'flex'}} key={name} onClick={()=>{ if (!this.state.loading){this.onSelectionChange(index, _delivery)}}}>
                                    <div style={{width:'10px', height:'10px', margin:'auto 0', border:'2px solid '+color, borderRadius:'50%', display:'flex'}}>
                                        <div style={{width:'6px', height:'6px', margin:'auto', borderRadius:'50%', backgroundColor:'#ff7000', display: display}}></div>
                                    </div>
                                    <span style={{margin:'auto 0', width:'120px', marginLeft:'10px'}}>{delivery[index]}</span>
                                    <span style={{margin:'auto 0'}}> R$ {_price[0]},<span style={{fontSize:'10px', position:'relative', top:'-1px'}}>{_price[1]}</span></span>                     
                                </div>)
                            }
                        }                    
                    })
                }
                </div>  
                <div style={{display: displayLock, backgroundColor:'black', opacity:'0.35', height:'100%', top:'0px', width:document.querySelector('.appContainer').clientWidth, position:'absolute', }}></div>      
                <div style={{display: displayLock, position:'absolute', left:'0', right:'0', top:'0', bottom:'0', margin:'auto', width: '35px', height: '35px', border: '8px solid #f3f3f3', borderRadius:'50%', borderTop: '8px solid #ff7000', animation:'spin 2s linear infinite'}}></div>
            </div>        
        </div>);
        
    }
}
export default DeliverySelection;