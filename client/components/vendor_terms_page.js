import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import { Vendors } from '../../imports/collections/vendors';
import Waiting from './subcomponents/widgets/waiting';
import BackButton from './subcomponents/back_button';
import BottomButtom from './subcomponents/bottom_menu';
import DistanceHelper from './subcomponents/widgets/distance_helper';
import history from './subcomponents/widgets/history';
import { distanceTo } from './subcomponents/widgets/distance_to';

class VendorTermsPage extends Component{
    constructor(props){
        super(props);
        this.start = false;
        this.profile = {};
        this.state = {
            vendor: {},
            loading: true            
        };
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
            if (!vendor.banner_url.includes('http')){ vendor.banner_url = {} }
            if (!vendor.img_url.includes('http')){ history.goBack('/'); return; }
            if (!vendor.terms){ vendor.terms = {}; }
            if (!vendor.terms.delivery){ vendor.terms.delivery = [false, false, false, false, false]; }            
            if (vendor.hidden == true){ history.goBack(); return; }
            if (!vendor.openTime){ 
                vendor.openTime = [
                    {start: '08:00', end: '18:00', open: false},
                    {start: '08:00', end: '18:00', open: false},
                    {start: '08:00', end: '18:00', open: false},
                    {start: '08:00', end: '18:00', open: false},
                    {start: '08:00', end: '18:00', open: false},
                    {start: '08:00', end: '18:00', open: false},
                    {start: '08:00', end: '18:00', open: false}
                ];
            };
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
        console.log(pack)
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
        if (!vendor.phone){ history.push('/'); return; }
        if (!vendor.img_url){ history.push('/'); return; }        
        if (!vendor.address){ vendor.address = {}; }
        if (!vendor.address.coords){ vendor.address.coords = {}; }
        if (!vendor.address.coords.address){ vendor.address.coords.address = {lat: 0, lng: 0}; }
        if (!vendor.address.coords.selected){ vendor.address.coords.selected = {lat: 0, lng: 0}; }
        let _coords = vendor.address.coords.selected;
        if (!_coords.lat || !_coords.lng){ _coords = vendor.address.coords.address; }
        if (!_coords.lat || !_coords.lng){ history.push('/destinatarios'); return; }
        vendor.distance = distanceTo([coords, _coords]);       
        this.setState({vendor: vendor, loading: false});       
    }
    sameDayDelivery(vendor){
        if (vendor.terms.delivery[0]){
            return(
            <div style={{margin:'0 20px', marginTop:'20px', backgroundColor:'#F7F7F7', borderRadius:'3px', display:'flex'}}>
                <div style={{width:'30px', height:'40px', margin:'0 3px', display:'flex'}}>
                    <div style={{width:'24px', height:'24px', margin:'auto', backgroundImage:'url(/imgs/icons/icon-relampago.png)', backgroundPosition:'center', backgroundRepeat:'no-repeat', backgroundSize:'contain'}}></div>
                </div>
                <div style={{margin:'auto 0px', fontSize:'16px', color:'#444'}}>Entrega no mesmo dia. *</div>
            </div>)
        }else{ return; }
    }
    deliveryMethods(vendor){
        var deliveryArray = [
            'Motoboy',
            'Correios PAC',
            'Correios Sedex',
            'Transportadora',
            'Retirar no local'
        ];
        var deliveryDaysArray = [
            ' (24 horas)',
            ' (4 à 7 dias úteis)',
            ' (1 à 2 dias úteis)',
            ' (1 à 7 dias úteis)',
            ''
        ];
        return(
        <div style={{margin:'0 20px', marginTop:'5px', padding:'5px 0', backgroundColor:'#F7F7F7', borderRadius:'3px'}}>
            <div style={{display:'flex'}}>
                <div style={{width:'30px', height:'30px', margin:'0 3px', display:'flex'}}>
                    <div style={{width:'15px', height:'15px', margin:'auto', backgroundImage:'url(/imgs/icons/icon-rightArrow.png)', backgroundPosition:'center', backgroundRepeat:'no-repeat', backgroundSize:'contain'}}></div>
                </div>
                <div style={{margin:'auto 0px', fontSize:'16px', color:'#444'}}>Formas de envio:</div>
            </div>
            <div style={{margin:'5px 0'}}>
                {vendor.terms.delivery.map((delivery, index)=>{                    
                let key = 'deliver_'+index;                    
                if (delivery){
                    let icon = '';
                    if (index == 0){ icon = 'motoboy'; }
                    if (index == 1){ icon = 'correio'; }
                    if (index == 2){ icon = 'correio'; }
                    if (index == 3){ icon = 'transportadora'; }
                    if (index == 4){ icon = 'home'; }
                    return(
                    <div style={{display:'flex', height:'25px'}} key={key}>
                        <div style={{margin:'auto 0px', height:'25px', margin:'0 3px', display:'flex'}}>
                            <div style={{width:'30px', height:'20px', margin:'auto', backgroundImage:'url(/imgs/icons/icon-'+icon+'.png)', backgroundPosition:'center', backgroundRepeat:'no-repeat', backgroundSize:'contain'}}></div>
                        </div>
                        <div style={{margin:'auto 0px', fontSize:'15px', color:'#444'}}>{deliveryArray[index]} </div>
                        <div style={{margin:'auto 0px', fontSize:'14px', color:'#444', marginLeft:'5px'}}>{deliveryDaysArray[index]} </div>
                    </div>)
                    }                    
                })}
            </div>            
        </div>);
    }
    openDays(vendor){
        var weekArray = ['Domingo:', 'Segunda-feira:', 'Terça-feira:', 'Quarta-feira:', 'Quinta-feira:', 'Sexta-feira:', 'Sábado:'];
        return(
        <div style={{margin:'0 20px', marginTop:'15px', padding:'8px 5px', letterSpacing:'0.5px', backgroundColor:'#ff7000', borderRadius:'10px', color:'white'}}>
            <div style={{width:'fit-content', margin:'0 auto', display:'flex'}}>
                <div style={{width:'25px', height:'25px', marginRight:'5px', backgroundImage:'url(/imgs/icons/icon-clock.png)', backgroundPosition:'center', backgroundRepeat:'no-repeat', backgroundSize:'contain'}}></div>
                <div style={{margin:'auto 0px', fontSize:'16px'}}>Horário de funcionamento:</div>
            </div>
            <div style={{width:'fit-content', margin:'0 auto', marginTop:'10px', marginBottom:'5px'}}>
                {vendor.terms.openTime.map((week, index)=>{
                    let key = 'week_'+index;
                    let weekLine = 'Fechado'
                    let color = 'red';
                    if (vendor.terms.openTime[index].open){
                        weekLine = week.start + ' - ' + week.end;
                        color = 'black';
                    }                    
                    return(
                    <div style={{display:'flex', height:'22px', fontSize:'13px'}} key={key}>                        
                        <div style={{width:'100px', margin:'auto 0'}}>{weekArray[index]}</div>
                        <div style={{margin:'auto 0px', marginLeft:'20px'}}>{weekLine}</div>
                    </div>)
                })}
            </div>
        </div>);
    }
    canPickUp(vendor){
        return(<div></div>);
        /*if (vendor.terms.delivery[4]){            
            return(
            <div style={{margin:'0 20px', marginTop:'5px', display:'flex'}}>
                <div style={{fontSize:'11px'}}>**Checar a tabela de horários de funcionamento antes de realizar um pedido ou ir retirá-lo...</div>
            </div>)
        }else{
            return(<div></div>);
        }*/
    }
    render(){
        if (this.state.loading){
            return(
            <div className='mainContainer'>
                <BackButton/>
                <Waiting open={this.state.loading}/>
                <BottomButtom/>
            </div>);
        }

        let vendor = this.state.vendor; 
        let screenSize = document.querySelector('.appContainer').clientWidth;
        let bannerHeight = Math.round(134 / 374 * screenSize);

        return(
        <div className='mainContainer'>
            <BackButton title={vendor.display_name}/>
            <div style={{width:'100%', height:bannerHeight, backgroundImage:(vendor.banner_url) ? 'url(' + vendor.banner_url + ')' : 'url(/imgs/banners/banner_main.png)', backgroundPosition:'center', backgroundRepeat:'no-repeat', backgroundSize:'contain'}}></div>
            <div style={{display:'flex', padding:'0 10px', paddingRight:'0px'}}>
                <div style={{height:'65px', width:'65px', border:'1px solid #f1f2f2', borderRadius:'50%', position:'relative', top:'-20px', backgroundImage:'url(' + vendor.img_url + ')', backgroundSize:'contain', backgroundRepeat:'no-repeat', backgroundPosition: 'center', backgroundColor:'white'}}></div>
                <div style={{marginTop:'10px', marginLeft: '10px'}}>
                    <div style={{fontSize:'14px', fontWeight:'bold', color:(vendor.color) ? vendor.color : '#FF7000'}}>{vendor.display_name}</div>
                </div>
            </div>            
            <div style={{margin:'0 30px', textAlign:'center', fontSize:'11px', color:'#555', position:'relative', top:'-10px'}}>As condições podem variar de acordo com o endereço do destinatário selecionado.</div>
            <div style={{width:'fit-content', height:'30px', margin:'5px auto', display:'flex', backgroundColor:'#ff7000'}}>
                <div style={{width:'30px', height:'30px', borderRight:'1px solid white', display:'flex'}}>
                    <div style={{width:'24px', height:'24px', margin:'auto', backgroundImage:'url(/imgs/icons/icon-point.png)', backgroundPosition:'center', backgroundRepeat:'no-repeat', backgroundSize:'contain'}}></div>
                </div>
                <div style={{padding:'0px 5px', margin:'auto 0', fontSize:'14px', color:'white'}}>{vendor.address.cidade} ({vendor.distance} km)</div>
            </div>            
            {this.sameDayDelivery(vendor)}
            {this.deliveryMethods(vendor)}
            {this.openDays(vendor)}
            <div style={{margin:'0 20px', marginTop:'20px', display:'flex'}}>
                <div style={{fontSize:'11px', display:(vendor.terms.timeLimit) ? 'block' : 'none'}}>*Só serão entregue no mesmo dia pedidos feitos até as {vendor.terms.timeLimit}</div>
            </div>
            {this.canPickUp(vendor)}
            <Waiting open={this.state.loading}/>
            <BottomButtom/>
        </div>);
    }
}
export default VendorTermsPage;