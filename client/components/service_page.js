import React, { Component } from 'react';
import { createContainer } from 'react-meteor-data';
import history from './subcomponents/widgets/history';
import Categories from './subcomponents/categories';
import BottomMenu from './subcomponents/bottom_menu';
import BackButton from './subcomponents/back_button';
import { Services } from '../../imports/collections/services';
import DistanceHelper from './subcomponents/widgets/distance_helper';
import Waiting from './subcomponents/widgets/waiting';
import VendorHeader from './subcomponents/vendor_header';
import { distanceTo } from './subcomponents/widgets/distance_to';

class ServicePage extends Component{
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
        let pack = {};        
        let page_id = history.location.pathname.split('/');      
        pack.service = {};  
        page_id = page_id[page_id.length - 1];        
        if (!page_id){ history.goBack(); return; }
        console.log(page_id);        
        Meteor.subscribe('Single_Service', page_id, ()=>{            
            let service = Services.findOne({ '_id': page_id });
            if (!service){ history.push('/'); return; }
            if (service.hidden == true){ history.push('/'); return; }
            if (!service.display_name){ history.push('/'); return; }            
            if (!service.description){ history.push('/'); return; }      
            if (service.description.toString().length < 85){ history.push('/'); return; }       
            if (!service.img_url.includes('http')){ history.push('/'); return; }   
            if (!service.services){ history.push('/'); return; }
            if (!Array.isArray(service.services)){ history.push('/'); return; }
            if (!service.services.length > 0){ history.push('/'); return; }
            
            if (!service.banner_url.includes('http')){ pack.service.banner_url = ''; }
            if (!service.phone){ pack.service.phone = ''; }
            if (!service.cellphone){ pack.service.cellphone = ''; }
            if (!service.email){ pack.service.email = ''; }
            if (!service.social){ service.social = {}; }

            pack.service.img_url = service.img_url;
            pack.service.services = [];            
            service.services.map( service => { if (!service.length < 3){ pack.service.services.push(service); }});
            if (!pack.service.services.length > 0){ history.push('/'); return; }
            for( social in service.social ){ pack.service[social] = service.local[social].link; }

            console.log(pack)
            if (Meteor.userId()){
                Meteor.subscribe('Profile', ()=>{
                    let user = Meteor.users.findOne({'_id': Meteor.userId()});
                    pack.service.user = user;
                    this.subscribe(pack);   
                    return;                 
                });
            }else{ this.subscribe(pack); return; }
        });
    }
    subscribe(pack){
        let user = pack.user;
        let service = pack.service;
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
        if (!service.address){ service.address = {}; }        
        if (!service.address.coords){ service.address.coords = {}; }
        if (!service.address.coords.address){ service.address.coords.address = {lat: 0, lng: 0}; }
        if (!service.address.coords.selected){ service.address.coords.selected = {lat: 0, lng: 0}; }
        let _coords = service.address.coords.address;
        if (!_coords.lat || !_coords.lng){ _coords = service.address.coords.selected; }
        if (!_coords.lat || !_coords.lng){ history.push('/destinatarios'); return; }
        service.distance = distanceTo([coords, _coords]); 
        Meteor.call('services.popularity', service._id);
        this.setState({service: service, loading: true});   
    }
    render(){     
        if (this.state.loading){
            return(
            <div className='mainContainer'>
                <BackButton/>
                <div><Waiting open={this.state.loading} size='60px'/></div>
            </div>);
        }
        /*let vendor = this.state.vendor;
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
        );*/
    }

}
export default ServicePage;