import React, { Component } from 'react';
import { createContainer } from 'react-meteor-data';
import history from './subcomponents/widgets/history';
import Categories from './subcomponents/categories';
import BottomMenu from './subcomponents/bottom_menu';
import BackButton from './subcomponents/back_button';
import { Vendors } from '../../imports/collections/vendors';
import { Products } from '../../imports/collections/products';
import DistanceHelper from './subcomponents/widgets/distance_helper';
import Waiting from './subcomponents/widgets/waiting';
import VendorHeader from './subcomponents/vendor_header';
import { distanceTo } from './subcomponents/widgets/distance_to';

class VendorPage extends Component{
    constructor(props){
        super(props)
        this.starte = false;
        this.load = 0;
        this.state = {
            vendor: undefined,
            products: [],
            distance: 0,
            loading: true
        }
    }
    componentDidMount(){
        let page_id = history.location.pathname.split('/');
        let pack = {};
        page_id = page_id[page_id.length - 1];        
        if (!page_id){ history.goBack(); return; }
        console.log(page_id);        
        Meteor.subscribe('Single_Vendor', page_id, ()=>{            
            let vendor = Vendors.findOne({'_id': page_id});
            if (!vendor){ history.goBack('/'); return; }
            if (!vendor.display_name){ history.goBack('/'); return; }            
            if (!vendor.banner_url.includes('http')){ vendor.banner_url = ''; }
            if (!vendor.img_url.includes('http')){ history.goBack('/'); return; }
            if (!vendor.terms){ vendor.terms = {}; }
            if (!vendor.terms.delivery){ vendor.terms.delivery = [false, false, false, false, false]; }            
            if (vendor.hidden == true){ history.goBack(); return; }
            pack.vendor = vendor;  
            if (Meteor.userId()){
                Meteor.subscribe('Profile', ()=>{
                    let user = Meteor.users.findOne({'_id': Meteor.userId()});
                    pack.user = user;
                    this.subscribe(pack);   
                    return;                 
                });
            }else{ this.subscribe(pack); return; }
        });
    }
    subscribe(pack){
        let user = pack.user;
        let vendor = pack.vendor;
        let skip = 0;  
        let index = 0;
        if (!user){ skip = 1; }
        if (!user.profile){ user.profile = {}; skip = 2; }
        this.profile = user.profile;
        if (!this.profile.mainAddress){ index = 0; }else{ index = this.profile.mainAddress; }
        if (!this.profile.address){ this.profile.address = []; skip = 3; }
        if (!this.profile.address.length > 0){ this.profile.address[0] = {}}
        if (!this.profile.address[index].coords){ this.profile.address[index].coords = {}; skip = 4; }
        var coords = this.profile.address[index].coords.selected;
        console.log(coords)
        if (!coords){ coords = this.profile.address[index].coords.address; }
        if (!coords){ skip = 5; }
        if (skip > 0){
            if (skip == 1 || skip == 2){ Meteor.logout(); history.push('/entrar'); return; }       
            history.push('/destinatarios'); return;
        };        
        if (!vendor.address){ vendor.address = {}; }
        if (!vendor.address.coords){ vendor.address.coords = {}; }
        if (!vendor.address.coords.address){ vendor.address.coords.address = {lat: 0, lng: 0}; }
        if (!vendor.address.coords.selected){ vendor.address.coords.selected = {lat: 0, lng: 0}; }
        let _coords = vendor.address.coords.address;
        if (!_coords.lat || !_coords.lng){ _coords = vendor.address.coords.selected; }
        if (!_coords.lat || !_coords.lng){ history.push('/destinatarios'); return; }
        vendor.distance = distanceTo([coords, _coords]); 
        Meteor.call('vendors.popularity', vendor._id);
        Meteor.subscribe('Vendor_Products', vendor._id, ()=>{
            let products = Products.find({'vendor_id': vendor._id}).fetch();
            if (!products){ products = []; }
            this.setState({vendor: vendor, products: products, loading: false});
        });       
    }
    render(){     
        if (this.state.loading){
            return(
            <div className='mainContainer'>
                <BackButton/>
                <div><Waiting open={this.state.loading} size='60px'/></div>
            </div>);
        }
        let vendor = this.state.vendor;
        let products = this.state.products;
        return(
            <div className='mainContainer'>
                <BackButton title={vendor.display_name}/>             
                <VendorHeader vendor={vendor}/>
                <div style={{display:'flex', marginTop:'15px', padding:'0 15px'}}>
                    <input style={{width:'100%', height:'30px', marginTop:'10px', margin:'auto 0', paddingLeft:'45px', borderRadius:'5px', border:'1px solid #ff7000', backgroundImage: 'url(/imgs/search.jpg)', backgroundRepeat:'no-repeat', backgroundPosition:'2px 0px', backgroundSize:'contain', fontSize:'15px'}} type='text' placeholder='O que você esta procurando?' onClick={()=>{history.push('/fornecedor/buscar/'+vendor.id)}}/>
                </div>
                <Categories products={products} page={{page:'vendors', name:vendor.display_name, color:(vendor.color) ? vendor.color : '#FF7000'}}/>   
                <Waiting open={this.state.loading} size='60px'/>             
                <BottomMenu />                 
            </div>    
        );/*          
        if (!this.props.vendorId) { return <div></div>; }

        const vendorId = this.props.vendorId;
        
        if (!this.started){
            this.load = 0;
            this.started = true;
            this.Distance = new DistanceHelper(this);
            Meteor.subscribe('productFields', 'VendorPage', {vendorId: vendorId},  ()=>{
                let products = Products.find({'id_vendor': vendorId}).fetch(); 
                this.load += 1;
                if (this.load == 2){
                    this.setState({ products: products, loading: false }); 
                }else{
                    this.setState({ products: products });   
                }
            });            
            Meteor.subscribe('vendorFields', 'VendorPage', vendorId, ()=>{
                let vendor = Vendors.findOne({'id': vendorId});                  
                if (this.state.vendor == undefined){ 
                    let distance = this.Distance.distanceBetweenMe(vendor.address.coords.selected);
                    this.load += 1;
                    if (!vendor.terms){
                        vendor.terms = {};
                    }
                    if (!vendor.terms.delivery){
                        vendor.terms.delivery = [true, false, false, false, false];
                    }
                    if (this.load == 2){
                        this.setState({ vendor: vendor, loading: false }); 
                    }else{
                        this.setState({ vendor: vendor }); 
                    }                    
                } 
            });
        }        
        if (this.state.loading) {
            return(
                <div className='mainContainer'>
                    <BackButton/>
                    <Waiting open={this.state.loading} size='60px'/>             
                    <BottomMenu />                 
                </div>
            )
        }
        var vendor = this.state.vendor;        
        var products = this.state.products;        
        var color = '#ff7000'
        if (vendor.color){ color = vendor.color; }
        return(
            <div className='mainContainer'>
                <BackButton title={vendor.display_name}/>             
                <VendorHeader vendor={vendor} distance={this.state.distance}/>
                <div style={{display:'flex', marginTop:'15px', padding:'0 15px'}}>
                    <input style={{width:'100%', height:'30px', marginTop:'10px', margin:'auto 0', paddingLeft:'45px', borderRadius:'5px', border:'1px solid #ff7000', backgroundImage: 'url(/imgs/search.jpg)', backgroundRepeat:'no-repeat', backgroundPosition:'2px 0px', backgroundSize:'contain', fontSize:'15px'}} type='text' placeholder='O que você esta procurando?' onClick={()=>{history.push('/fornecedor/buscar/'+vendor.id)}}/>
                </div>
                <Categories products={products} page={{page:'vendors', name:vendor.display_name, color:color}}/>   
                <Waiting open={this.state.loading} size='60px'/>             
                <BottomMenu />                 
            </div>    
        )*/
    }

}
export default VendorPage;