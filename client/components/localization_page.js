import React, { Component } from 'react';
import { Mask } from './subcomponents/widgets/masks';
import history from './subcomponents/widgets/history';
import { Meteor } from 'meteor/meteor';
import Waiting from './subcomponents/widgets/waiting';
import AskLocalization from './subcomponents/widgets/ask_localization';
import CustomInput from './subcomponents/widgets/custom_input';
import { LoadScript } from '@react-google-maps/api';

class LocalizationPage extends Component{
    constructor(props){
        super(props);
        this.geocoder = null;
        this.start = true;
        this.complete = 0;
        this.state = {
            popUp: true,
            loading: true,
            geolocation: false,
            address: {
                cep: '',
                lat: null,
                lng: null
            },
            error: ''
        };
    }
    componentDidMount(){
        var cache = JSON.parse(localStorage.getItem('MateriaisON_localization'));
        console.log(cache)
        if (Meteor.userId()){
            let user = Meteor.users.findOne({'_id': Meteor.userId()});
            user = user.profile;
            if (user.address.length > 0){ 
                history.push('/');
            }                
        }/*else{
            if (!this.state.geolocation){
                this.complete += 1;
                if (!this.complete < 2){ this.setState({ loading: false }); }
            }else{
                history.push('/')
            }            
        }*/
    }

    closePopUp(){
        async function checkPermission(){            
            let response = await navigator.permissions.query({ name: 'geolocation' });
            return response;
        }         
        let permission = checkPermission();
        console.log(permission);
        navigator.geolocation.getCurrentPosition(
            (success)=>{
                let cache = {cache:true, cep:'', ddd:'', geolocation:true, address:{lat:success.coords.latitude, lng:success.coords.longitude }};
                localStorage.removeItem('MateriaisON_localization');
                localStorage.setItem('MateriaisON_localization', JSON.stringify(cache));                
                if (Meteor.userId()){                                        
                    Meteor.call('insertGeoloation', cache, (result, error)=>{
                        if (error){
                            console.log(error);
                        }
                        history.push('/');
                        return;                
                    });
                }else{
                    history.push('/');
                    return;
                }
            },
            (error)=>{
                console.log(error);
                this.error = 'Não foi possível determinar sua localização.';
                this.setState({ popUp: false, loading: false, geolocation:false });                
            }, 
            { timeout:10000 }
        );
    }

    inputHandler(event){
        let name = event.target.name;
        let value = event.target.value;
        if (name == 'cep'){            
            let address = this.state.address;
            value = Mask('cep', value );
            address.cep = value;
            this.setState({ [name]: value });
            return;
        }
        
        this.setState({ [name]: value });
    }

    displayError(){
        if (this.state.error != ''){
            return(<div style={{padding:'25px 20px', paddingBottom:'0px', color:'red', fontSize:'13px'}}>{this.state.error}</div>)
        }               
    }
    
    onLoad(){
        if (this.geocoder == null){
            this.geocoder = new google.maps.Geocoder();
            this.setState({loading: false})
        }        
    }

    checkCEP(){
        if (this.state.address.cep.length < 9){
            this.setState({error:'O CEP informado não é valido.'})
            return;
        }
        if (!(/^\d{5}-\d{3}$/.test(this.state.address.cep))){
            this.setState({error:'O CEP informado não é valido.'})
            return;
        }
        if ( this.geocoder == null ){ this.setState({ loading: true }); return; }

        this.setState({error:'', loading:true})
        var address = {
            cep: this.state.address.cep,
            lat: '',
            lng: '',
        }        
        this.geocoder.geocode({'address': address.cep}, (results, status)=>{
            if (status == google.maps.GeocoderStatus.OK) {
                let location = results[0].geometry.location
                address.lat = location.lat();
                address.lng = location.lng();
                let cache = {
                    cache:true,                      
                    ddd:'', 
                    geolocation:false, 
                    address:{
                        cep:address.cep,
                        lat:address.lat, 
                        lng:address.lng 
                    }
                };
                localStorage.removeItem('MateriaisON_localization');
                localStorage.setItem('MateriaisON_localization', JSON.stringify(cache)); 
                if (Meteor.userId()){
                    Meteor.call('insertGeoloation', cache, (result, error)=>{
                        if (!error){
                            history.push('/');                            
                        }else{
                            console.log(error);
                            let error = error.reason;
                            this.setState({ popUp: false, loading: false, error: error });
                        }
                    });
                }else{
                    history.push('/');
                }                
            }else{
                console.log(status)
                let error = '';
                switch(status){
                    case 'INVALID_REQUEST':
                        error = 'O CEP informado não é valido.';
                        break;
                    case 'ZERO_RESULTS':
                        error = 'Não foi encontrado nenhum endereço no CEP informado.';
                        break;
                    case 'ERROR':
                        error = 'Ocorreu um erro ao se conectar com a internet.'
                        break;
                    default:
                        error = 'Ocorreu um erro na validação do CEP.'
                }
                address.cep = null;
                this.setState({ address: address, error: error, loading: false })
            }
        });
    }
    render(){
        /*if (this.state.loading){
            return(
            <div className='mainContainerWithoutTop'>
                <LoadScript id="script-loader" googleMapsApiKey="AIzaSyB2cI2xl2b40J1NNg4EZ2VXuD2JTBJ2GTg" libraries={["places"]} onLoad={()=>{this.onLoad()}}>
                    <div style={{height:'210px', borderBottom:'1px solid #FF7000', display:'flex'}}>
                        <div style={{width:'220px', height:'140px', margin:'auto', backgroundImage:'url(/imgs/logo2.png)', backgroundPosition:'center', backgroundSize:'contain', backgroundRepeat:'no-repeat'}}></div>
                    </div>
                    <div style={{width:'60px', height:'60px', margin:'15px auto', backgroundImage:'url(/imgs/icons/icon-point2.png)', backgroundPosition:'center', backgroundRepeat:'no-repeat', backgroundSize:'contain'}}></div>
                    <div style={{maxWidth:'145px', margin:'0 auto', textAlign:'center', color:'#585858'}}>Precisamos saber onde você está!</div>
                    <CustomInput style={{maxWidth:'160px', marginTop:'30px'}} inputStyle={{textAlign:'center'}} width='100%' height='30px' margin='auto' name='cep' placeholder='Digite seu CEP' value={this.state.cep} onChange={(e)=>{this.inputHandler(e)}}/>
                    <Waiting size='60px' open={this.state.loading}/>
                    <div style={{margin:'0 auto', marginTop:'50px', width:'175px', height:'40px', lineHeight:'40px', backgroundColor:'#3395f5', border:'2px solid #3395f5', borderRadius:'25px', textAlign:'center', fontSize:'17px', color:'white'}} onClick={()=>{this.checkCEP()}}>ENTRAR</div>
                    <div style={{width:'100%', textAlign:'center', fontSize:'14px', marginTop:'20px'}}>Não sabe seu CEP?</div>
                    <div style={{width:'fit-content', margin:'3px auto', fontSize:'16px', color:'#3395f5', fontWeight:'600'}} onClick={()=>{if (!this.state.loading){history.push('/localizacao/ddd')}}}>CLIQUE AQUI</div>
                </LoadScript>
            </div>) 
        }*/
        return(
        <div className='mainContainerWithoutTop'>
            <LoadScript id="script-loader" googleMapsApiKey="AIzaSyB2cI2xl2b40J1NNg4EZ2VXuD2JTBJ2GTg" libraries={["places"]} onLoad={()=>{this.onLoad()}}>
                <div style={{height:'210px', borderBottom:'1px solid #FF7000', display:'flex'}}>
                    <div style={{width:'220px', height:'140px', margin:'auto', backgroundImage:'url(/imgs/logo2.png)', backgroundPosition:'center', backgroundSize:'contain', backgroundRepeat:'no-repeat'}}></div>
                </div>
                <div style={{paddingTop:'15px', fontSize:'14px', textAlign:'center', color:'red', display:(!this.state.popUp && !this.state.geolocation) ? 'block' : 'none'}}>Não foi possível encontrar sua localização.</div>
                <div style={{width:'60px', height:'60px', margin:'15px auto', backgroundImage:'url(/imgs/icons/icon-point2.png)', backgroundPosition:'center', backgroundRepeat:'no-repeat', backgroundSize:'contain'}}></div>
                <div style={{maxWidth:'145px', margin:'0 auto', textAlign:'center', color:'#585858'}}>Precisamos saber onde você está!</div>
                <CustomInput style={{maxWidth:'160px', marginTop:'30px'}} inputStyle={{textAlign:'center'}} width='100%' height='30px' margin='auto' name='cep' placeholder='Digite seu CEP' value={this.state.address.cep} onChange={(e)=>{this.inputHandler(e)}}/>
                <AskLocalization open={this.state.popUp} close={()=>{this.closePopUp()}}/>                           
                <div style={{width:'170px', height:'30px', margin:'0 auto', marginTop:'40px', border:'2px solid #3395f5', borderRadius:'25px', lineHeight:'30px', textAlign:'center', fontSize:'15px', color:'white', backgroundColor:'#3395f5'}} onClick={()=>{this.checkCEP()}}>ENTRAR</div>
                {this.displayError()} 
                <div style={{width:'100%', textAlign:'center', fontSize:'14px', marginTop:'20px'}}>Não sabe seu CEP?</div>
                <div style={{width:'fit-content', margin:'3px auto', fontSize:'15px', color:'#3395f5', fontWeight:'600'}} onClick={()=>{if (!this.state.loading){history.push('/localizacao/ddd')}}}>CLIQUE AQUI</div>
            </LoadScript>
        </div>);
    }
}
export default LocalizationPage;