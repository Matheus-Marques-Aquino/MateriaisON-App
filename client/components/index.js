import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'react-meteor-data';
import Banner from './subcomponents/banner';
import Slider from './subcomponents/slider';
import IndexTable from './subcomponents/index_table';
import VendorBox from './subcomponents/vendor_box'
import Filters from './subcomponents/filters'
import BottomMenu from './subcomponents/bottom_menu';
import { Vendors } from '../../imports/collections/vendors';
import { Profile } from '../../imports/collections/profile'
import { VendorCache } from '../../imports/collections/cache/vendor_cache';
import { Cache } from './subcomponents/widgets/cache';
import history from './subcomponents/widgets/history';
import AddressDisplay from './subcomponents/address_display';
import { HTTP } from 'meteor/http';
import DistanceHelper from './subcomponents/widgets/distance_helper';
import GeoNamesHelper from './subcomponents/widgets/geonames_helper';
import Waiting from './subcomponents/widgets/waiting';
import { distanceTo } from './subcomponents/widgets/distance_to';

class Index extends Component{
    constructor(props){
        super(props)
        this.profile = {};
        this.vendors = [];
        this.state={
            vendors: [],
            vendorList: [],
            filter: ['shipping', 'open', 'distance'],
            filters:{
                distance: true,
                distanceMax: 25,
                price: false,
                priceMax: 0,
                priceMin: 0,
                shipping: false
            },
            vendorOrder: '_distance',
            order: ['popularity', 'distance'],
            loading: true
        }
    }
    componentDidMount(){
        Meteor.subscribe('Vendors', ()=>{
            let vendors = Vendors.find({}).fetch();
            if (!vendors){ vendors = []; }
            this.vendors = vendors;
            console.log(vendors)
            if (Meteor.userId()){
                Meteor.subscribe('Profile', ()=>{
                    let user = Meteor.users.findOne({'_id': Meteor.userId()});
                    console.log(user)
                    this.subscribe(user);   
                    return;                 
                });
            }else{
                history.push('/entrar'); 
                return;
                //this.subscribe({});
            }
        });
    }
    subscribe(pack){
        let user = pack;
        let skip = 0; 
        let vendors = [];
        let index = 0;
        if (!user){ user = {}; skip = 1;}       
        if (!user.profile){ user.profile = {}; skip = 2; }
        this.profile = user.profile;
        if (!this.profile.mainAddress){ index = 0; }else{ index = this.profile.mainAddress; }
        if (!this.profile.address){ this.profile.address = []; skip = 3; }
        if (!this.profile.address.length > 0){ this.profile.address[0] = {}}
        if (!this.profile.address[index].coords){ this.profile.address[index].coords = {}; skip = 4; }
        var coords = this.profile.address[index].coords.selected;
        if (!coords){ coords = this.profile.address[index].coords.address; }
        if (!coords){ skip = 5; }
        if (skip > 0){
            if (skip == 1 || skip == 2){ Meteor.logout(); history.push('/entrar'); return; }       
            history.push('/destinatarios');
            return;
            /*let localization = JSON.parse(localStorage.getItem('MateriaisON_localization'));
            if (!localization){ history.push('/localizacao'); return; }
            if (!localization.address){history.push('/localizacao'); return; }
            coords = localization.address;*/
        };
        this.vendors.map( (vendor, index)=>{
            if (!vendor.address){ vendor.address = {}; }
            if (!vendor.address.coords){ vendor.address.coords = {}; }
            if (!vendor.address.coords.address){ vendor.address.coords.address = {lat: 0, lng: 0}; }
            if (!vendor.address.coords.selected){ vendor.address.coords.selected = {lat: 0, lng: 0}; }
            let _coords = vendor.address.coords.address;
            if (!_coords.lat || !_coords.lng){ _coords = vendor.address.coords.selected; }
            this.vendors[index].distance = '0';
            if (_coords.lat && _coords.lng && coords.lat && coords.lng){ 
                this.vendors[index].distance = distanceTo([coords, _coords]); 
                vendors.push(this.vendors[index]);
            }                        
        });   
        this.setState({vendors: vendors, vendorList: vendors, loading: false});
        this.applyFilter(this.state.filters, false);
    }
    editAddressDisplay(){
        if (!Meteor.user()){ 
            return(
            <div>
                <div style={{margin:'20px 20px 0px 20px', padding:'10px 40px 10px 10px', border:'1px solid #FF700050', borderRadius:'3px', backgroundColor:'white', fontSize:'14px', color:'#FF7000', position:'relative', cursor:'pointer'}} onClick={()=>{history.push('/registrar')}}>
                    <div>Crie sua conta e encontre as melhores ofertas em sua região!</div>
                    <div style={{width:'25px', height:'25px', margin:'auto', right:'10px', top:'0px', bottom:'0px', position:'absolute'}}>
                    <div style={{width:'25px', height:'25px', margin:'auto', backgroundImage:'url(/imgs/goArrow.png)', backgroundPosition:'center', backgroundRepeat:'no-repeat', backgroundSize:'contain', opacity:'0.6'}}></div>
                    </div>
                </div>
            </div>);
        }
        return(
        <div>
            <div style={{padding:'25px 40px', fontSize:'16px', display:(this.profile.firstName) ? 'block' : 'none'  }}>Olá {this.profile.firstName}</div>                
            <div style={{padding:'0px 20px',backgroundColor:'white'}}>
                <AddressDisplay profile={this.profile}/>
            </div>
        </div>);
    }
    applyFilter(filter, changeFilter, start){
        let vendors = this.state.vendors;
        let filterVendors = []; 
        if (filter.price || filter.open || filter.shipping || filter.distance ){                
            vendors.map(vendor=>{
                let push = true
                if (filter.distance){
                    if (vendor.distance > filter.distanceMax){ push = false; }
                    if ( filter.distanceMax >= 30){ push = true; }
                }
                if (filter.open){ if (!vendor.open){ push = false; } }
                if (filter.shipping){  }                    
                if (push){ filterVendors.push(vendor); }
            });              
            if (changeFilter){
                this.setState({ 
                    vendorList: filterVendors,
                    vendorFilters: filter 
                });
            }else{
                this.setState({ vendorList: filterVendors });
            }
        }else{
            filterVendors = vendors;
            if (changeFilter){
                this.setState({ 
                    vendorList: vendors,
                    vendorFilters: filter 
                });
            }else{
                this.setState({ vendorList: vendors });
            }
        }        
        this.applyOrder(filterVendors, false)
    }
    applyOrder(filterVendors, changeOrder){
        let vendors = this.state.vendorList;
        let order = filterVendors;
        if (!vendors){ 
            vendors = this.state.vendorList; 
            if (!vendors){ vendors = []; }             
        }
        switch(order){
            case '_popularity':
                vendors.sort((a,b)=>{
                    if (a.popularity < b.popularity){ return 1; }
                    if (a.popularity > b.popularity){ return -1; }
                    return 0;
                })
                if (changeOrder){ this.setState({ vendorList: vendors, vendorOrder: order }); }else{ this.setState({ vendorList: vendors }); }
                break;
            case '_distance':
                vendors.sort((a,b)=>{
                    if (a.distance > b.distance){ return 1; }
                    if (a.distance < b.distance){ return -1; }
                    return 0;
                })
                if (changeOrder){ this.setState({ vendorList: vendors, vendorOrder: order }); }else{ this.setState({ vendorList: vendors }); }
                break;
        }
    }    
    render(){  
        if (this.state.loading){
            return(
            <div className='mainContainerWithoutTop'>
                <Waiting open={this.state.loading} size='60px'/>
            </div>);
        }
        //FAZER A BUSCA APARECERE NA URL
        //CRIAR POPULARES DA REGIÃO
        //CRIAR DESTAQUES
        //PORQUISAR FILTROS UMA PORQUISSE
        return(
        <div className='mainContainerWithoutTop'>
            <div style={{display:'flex', padding:'20px 30px', paddingBottom:'20px', backgroundColor:'#ff7000'}}>
                <input className='indexSearch' style={{width:'100%', height:'30px', margin:'auto', border:'1px solid white', borderRadius:'5px', backgroundImage: 'url(/imgs/search.png)', backgroundRepeat:'no-repeat', backgroundPosition:'4px 1px', backgroundSize:'30px 30px', backgroundColor:'#ff7000', color:'white', paddingLeft:'40px', fontSize:'15px'}} type='text' placeholder='O que você esta procurando?' 
                    onClick={()=>{history.push('/buscar')}}
                />   
            </div>                         
            {this.editAddressDisplay()}
            <div style={{paddingTop:'30px'}}><img src='/imgs/banner1.png' style={{width:'100%'}}/></div>
            <div style={{width:'100%', paddingTop:'25px', display:'flex'}}>
                <div style={{width:'75px', height:'23px', backgroundImage:'url(/imgs/bricks.png)', backgroundPosition:'center', backgroundRepeat:'no-repeat', backgroundSize:'contain'}}></div>
                <div style={{width:'100%', fontSize:'16px', fontWeight:'bold', lineHeight:'23px', color:'#1c2f59', textAlign:'center'}}>Populares na sua região</div>
                <div style={{width:'75px', height:'23px', backgroundImage:'url(/imgs/bricks.png)', backgroundPosition:'center', backgroundRepeat:'no-repeat', backgroundSize:'contain'}}></div>
            </div>
            <div style={{paddingTop:'20px'}}> 
                <Slider infinite={true} type="vendor" slides={this.state.vendors.slice(0, 10)}/>
            </div>
            <div style={{backgroundColor:'#f1f2f2', paddingBottom:'25px', margin:'30px 0'}}>
                <div style={{width:'100%', padding:'23px 0px', fontSize:'19px', fontWeight:'bold', color:'#ff7000', textAlign:'center'}}>DESTAQUES</div> 
                <IndexTable featured={this.state.vendors.slice(0, 6)}/>
            </div>    
            <div style={{marginTop:'30px'}}>
                <Filters filter={this.state.filter} order={this.state.order} filterReturn={(filter)=>{this.applyFilter(filter, true)}} orderReturn={(order)=>{this.applyOrder(order, true)}}/>
                <div style={{marginTop:'15px'}}>
                    <VendorBox vendors={this.state.vendorList} profile={this.profile}/>
                </div>
            </div>
            <BottomMenu /> 
        </div>);
        if (!Meteor.userId()){
            Meteor.logout((error)=>{
                if (!error){history.push('/entrar')
            }else{
                console.log(error)
            }});
            return (<div></div>);
        }      
        
        if (!this.start){  
            this.load = 0;         
            this.start = true;
            var Distance = new DistanceHelper();
            Meteor.subscribe('vendorFields', 'IndexPage', 0, ()=>{                
                let vendors = Vendors.find({}).fetch();
                this.load += 1;  
                if (this.load == 3){
                    this.setState({vendors: vendors, loading: false});
                }else{
                    this.setState({vendors: vendors});
                }                                       
            });                        
            Meteor.subscribe('profileFields', 'IndexPage', Meteor.userId(), ()=>{
                let profile = Profile.findOne({'_id': Meteor.userId()}); 
                let filters = this.state.filters;
                if (!profile.profile.address){ return(<div></div>); }
                if (!profile.profile.address.length > 0){ return(<div></div>); }
                filters.distanceMax = profile.profile.filter.distance;
                this.load += 1;
                if (this.load == 3){
                    this.setState({
                        profile: profile.profile, 
                        loading: false,
                        filters: filters
                    });
                }else{
                    this.setState({
                        profile: profile.profile,
                        filters: filters                   
                    });
                }                                
                profile = profile.profile
                profile.loaded = true
                let mainAddress = profile.mainAddress;
                let position = profile.address[mainAddress].coords.selected;                
                let geoname = new GeoNamesHelper();
                geoname.findNearByCity(position.lat, position.lng);
                
                Meteor.subscribe('vendorFields', 'IndexPage', -1, ()=>{                    
                    this.allVendors = Vendors.find({}).fetch();
                    this.allVendors.map((vendor, index)=>{
                        this.vendorById[vendor.id]= vendor;
                        if (vendor.address.coords.selected){ 
                            this.vendorById[vendor.id].distance = Distance.distanceBetween(position, vendor.address.coords.selected);                            
                        }                        
                    })
                    this.load += 1; 
                    this.loadVendors()   
                });                
            });
        }      
        var profile = {
            name: '' 
        };
        var greetings = '';
        if (this.state.profile) { 
            profile = this.state.profile;
            profile.name ;
            greetings = 'Olá, ';
        }
        var vendors = this.state.vendors;        
        var vendorList = this.state.vendorList;
        if (this.state.loading){
            return(
            <div className='mainContainerWithoutTop'>
                <Waiting open={this.state.loading} size='60px'/>
                <BottomMenu />
            </div>)
        }
        return(
            <div className='mainContainerWithoutTop'>
                <div style={{display:'flex', padding:'20px 30px', paddingBottom:'20px', backgroundColor:'#ff7000'}}>
                    <input className='indexSearch' style={{width:'100%', height:'30px', margin:'auto', border:'1px solid white', borderRadius:'5px', backgroundImage: 'url(/imgs/search.png)', backgroundRepeat:'no-repeat', backgroundPosition:'4px 1px', backgroundSize:'30px 30px', backgroundColor:'#ff7000', color:'white', paddingLeft:'40px', fontSize:'15px'}} type='text' placeholder='O que você esta procurando?' onClick={()=>{history.push('/buscar')}}/>
                </div>                
                <div style={{padding:'25px 40px', fontSize:'16px'}}>{greetings + profile.name.split(' ')[0]}</div>                
                <div style={{padding:'0px 20px',backgroundColor:'white'}}>
                    <AddressDisplay profile={profile}/>
                </div>
                <div style={{paddingTop:'30px'}}>
                    {/*<Banner width='375' height='138' images={[{src: '/imgs/banner1.png'}]}/>*/}
                    <img src='/imgs/banner1.png' style={{width:'100%'}}/>
                </div>
                <div style={{width:'100%', paddingTop:'25px', display:'flex'}}>
                    <div style={{width:'75px', height:'23px', backgroundImage:'url(/imgs/bricks.png)', backgroundPosition:'center', backgroundRepeat:'no-repeat', backgroundSize:'contain'}}></div>
                    <div style={{width:'100%', fontSize:'16px', fontWeight:'bold', lineHeight:'23px', color:'#1c2f59', textAlign:'center'}}>Populares na sua região</div>
                    <div style={{width:'75px', height:'23px', backgroundImage:'url(/imgs/bricks.png)', backgroundPosition:'center', backgroundRepeat:'no-repeat', backgroundSize:'contain'}}></div>
                </div>
                <div style={{paddingTop:'20px'}}> 
                    <Slider infinite={true} type="vendor" slides={vendors.slice(0, 10)}/>
                </div>  
                <div style={{backgroundColor:'#f1f2f2', paddingBottom:'25px', margin:'30px 0'}}>
                    <div style={{width:'100%', padding:'23px 0px', fontSize:'19px', fontWeight:'bold', color:'#ff7000', textAlign:'center'}}>DESTAQUES</div> 
                    <IndexTable featured={vendors.slice(0, 6)}/>
                </div>
                <div style={{marginTop:'30px'}}>
                    <Filters filter={this.state.filter} order={this.state.order} filterReturn={(filter)=>{this.applyFilter(filter, true)}} orderReturn={(order)=>{this.applyOrder(order, true)}}/>
                    <div style={{marginTop:'15px'}}>
                        <VendorBox vendors={vendorList} profile={profile}/>
                    </div>
                </div>
                <BottomMenu /> 
            </div>                
        )
    }
}
export default Index;