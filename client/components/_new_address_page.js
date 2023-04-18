import React, { Component } from 'react';
import { createContainer } from 'react-meteor-data'
import { Profile } from '../../imports/collections/profile';
import { Meteor } from 'meteor/meteor';
import BackButton from './subcomponents/back_button';
import AddressResults from './subcomponents/address_results';
import history from './subcomponents/widgets/history';
import { GoogleMap, LoadScript, Autocomplete, Marker} from '@react-google-maps/api';
import { Mask } from './subcomponents/widgets/masks';

class NewAddressPage extends Component{
    constructor(props){
        super(props)
        this.autocomplete = null;
        this.hiddenMap = null;
        this.mainMap = null;
        this.onLoad = this.onLoad.bind(this);
        this.mainMapLoad = this.mainMapLoad.bind(this)
        this.hiddenOnLoad = this.hiddenOnLoad.bind(this);
        this.onPlaceChanged = this.onPlaceChanged.bind(this);
        this.resultsHandler = this.resultsHandler.bind(this);
        this.locationOnMap = this.locationOnMap.bind(this);
        this.latitude = 0;
        this.longitude = 0;        
        this.state = {
            nome: '',
            complemento: '',
            celular: '',
            numero: '',
            rua: '',
            bairro: '',
            cidade: '',
            UF: '',
            estado: '',
            pais: '',
            CEP: '',
            lat: 0,
            lng: 0,
            results: [],
            noResults: false,
            inputNumber: '', 
            confirmado: false
        };
    }
 
    onLoad(autocomplete) {   
        this.autocomplete = autocomplete
        this.autocomplete.updateStatus = (lat, lng, address)=>{
            if (address.street == ''){
                let warnning = document.querySelector('.warnningStreet');
                warnning.style.display='block';                
            }else{
                let warnning = document.querySelector('.warnningStreet');
                warnning.style.display='none';
                let container = document.querySelector('.pac-container');
                if (container){
                    container.parentNode.removeChild(container);
                }
                this.latitude = lat;
                this.longitude = lng;
                this.setState({
                    lat: lat,
                    lng: lng,
                    numero: address.number,
                    rua: address.street,
                    bairro: address.neighborhood,
                    cidade: address.city,
                    UF: address.UF,
                    estado: address.estado,
                    pais: address.country,
                    CEP: address.postCode,
                    results: [],
                    noResults: false,
                    inputNumber: ''         
                })
            }            
        }              
    }
    onPlaceChanged() {
        if (this.autocomplete !== null) {        
            let _address = {
                street: '',
                number: '',
                street: '',
                neighborhood: '',
                city: '',
                UF: '',
                state: '',
                country: '',
                postCode: ''
            };
            let place = this.autocomplete.getPlace();

            let lat = 0;
            let lng = 0;

            if (!place){ }else{

                lat = place.geometry.location.lat();
                lng = place.geometry.location.lng();
                
                place.address_components.map(address=>{
                    address.types.map(type=>{
                        switch(type){
                            case 'street_number':
                                _address.number = address.long_name
                                break;
                            case 'route':
                                _address.street = address.long_name
                                break;
                            case 'sublocality_level_1':
                                _address.neighborhood = address.long_name
                                break;
                            case 'administrative_area_level_2':
                                _address.city = address.long_name
                                break;
                            case 'administrative_area_level_1':
                                _address.UF = address.short_name
                                _address.state = address.long_name
                                break;
                            case 'country':
                                _address.country = address.long_name
                                break;
                            case 'postal_code':
                                _address.postCode = address.long_name
                                break;                            
                        }                            
                    })
                })
                this.autocomplete.updateStatus(lat, lng, _address)
            }
                      
        }
    }    
    hiddenOnLoad(){
        this.hiddenMap = hiddenMap;
        this.hiddenMap.updateStatus = (lat, lng, number, postCode)=>{
            this.latitude = lat;
            this.longitude = lng;
            this.setState({
                numero: number,
                lat: lat,
                lng: lng,
                CEP: postCode
            });
        }
        this.hiddenMap.multipleResults = (results, number)=>{
            this.setState({
                results: results,
                noResults: false,
                inputNumber: number
            });
        }
        this.hiddenMap.noResults = (number)=>{
            this.setState({
                results: [],
                noResults: true,
                inputNumber: number
            });
        }
        this.hiddenMap.geoCodding = (_address, number)=>{
            
            var geocoder = new google.maps.Geocoder();

            let formatted_adress = '';

            if (_address.rua != ''){ formatted_adress += _address.rua; }
            if (number != ''){ formatted_adress += ', ' + number; }
            if (_address.bairro != ''){ formatted_adress += ' - ' + _address.bairro; }
            if (_address.cidade != ''){ formatted_adress += ', ' + _address.cidade; }
            if (_address.UF != ''){ formatted_adress += ' - ' + _address.UF; }
            if (_address.pais != ''){ formatted_adress += ', ' + _address.pais; }

            var _number = number

            geocoder.geocode({"address":formatted_adress }, function(results, status) {

                if (status == google.maps.GeocoderStatus.OK) {

                    if (results.length > 0){

                        let threshold = 0;
                        let matchNumber = 0;
                        let postCode = '';
                        let addressList = [];
                        let hasRoute = false;
                        let hasNumber =false;

                        for(let i = 0; i < results.length; i++){
                            threshold = 0;
                            matchNumber = false;
                            hasRoute = false;
                            hasNumber = false;
                            results[i].address_components.map(result=>{
                                result.types.map(type=>{
                                    switch(type){
                                        case 'street_number':
                                            if (result.long_name == String(_number)){
                                                matchNumber = true;                                                
                                            }
                                            hasNumber = true;        
                                            break;
                                        case 'route':
                                            if (result.long_name == _address.rua){
                                                threshold += 1;
                                            }
                                            hasRoute = true;                                        
                                            break;                                        
                                        case 'administrative_area_level_2':
                                            if (result.long_name == _address.cidade){
                                                threshold += 1;
                                            }   
                                            break;
                                        case 'administrative_area_level_1':
                                            if (result.short_name == _address.UF || result.long_name == _address.estado){
                                                threshold += 1;
                                            }   
                                            break;
                                        case 'country':
                                            if (result.long_name == _address.pais){
                                                threshold += 1;
                                            }   
                                            break;
                                        case 'postal_code':
                                            postCode = result.long_name;
                                            break;                                    
                                    }
                                })
                            })
                            if ( threshold > 3 && matchNumber && hasRoute ){
                                let lat = results[i].geometry.location.lat();
                                let lng = results[i].geometry.location.lng();
                                hiddenMap.updateStatus(lat, lng, _number, postCode);                                
                                break;
                            }
                            if ( threshold > 2 && hasRoute && hasNumber ){                                
                                addressList.push(results[i]);                              
                            }
                        }
                        if (addressList.length > 0){
                            hiddenMap.multipleResults(addressList, number);
                        }else{
                            hiddenMap.noResults(number);
                        } 
                    }      
                }
            });
        }
    }
    submitNumber(){
        let dom= document.querySelector('#inputNumber');  
        if (dom){
            let value = dom.value;
            this.hiddenMap.geoCodding(this.state, value)            
        }     
    }
    resultsHandler(lat, lng, number, postCode){
        this.latitude = lat;
        this.longitude = lng;
        this.setState({
            numero: number,
            lat: lat,
            lng: lng,
            CEP: postCode
        });
    }
    locationOnMap(){
        this.setState({
            numero: this.state.inputNumber
        });
    }
    mainMapLoad(mainMap){
        this.mainMap = mainMap;
        this.mainMap.setCoords = (lat, lng)=>{            
            if (
                lat < this.state.lat + 0.0018 &&
                lat > this.state.lat - 0.0018 &&
                lng < this.state.lng + 0.0018 &&
                lng < this.state.lng + 0.0018 
            ){
                this.latitude = lat;
                this.longitude = lng;
            }else{
                this.mainMap.panTo({lat: this.state.lat, lng: this.state.lng})
                this.mainMap.marker.setPosition({lat: this.state.lat, lng: this.state.lng})
            }            
        }
    }
    mapCenterChange(){
        if (!this.marker){
            this.marker = new google.maps.Marker( {position: {lat:this.center.lat(), lng:this.center.lng()}, map: this} )
            
        }else{
            this.marker.setPosition({lat: this.center.lat(), lng: this.center.lng()})            
            this.setCoords(this.center.lat(), this.center.lng())
        }
    }
    markerLoad(marker){
        this.marker = marker        
    }
    confirmAddress(){
        this.setState({
            confirmado: true
        })
    }
    submitHandler(event){
        let value = event.target.value;
        let name = event.target.name;
        if (name == 'celular'){
            this.setState({ [name]: Mask('phone', value )})
        }else{
            this.setState({
                [name]: value
            });
        }        
    }
    submitAddress(){
        let data = {
            name: this.state.nome,
            address: {
                numero: this.state.numero,
                rua: this.state.rua,
                bairro: this.state.bairro,
                cidade: this.state.cidade,
                UF: this.state.UF,
                estado: this.state.estado,
                pais: this.state.pais,
                cep: this.state.CEP,
                complemento: this.state.complemento,
                celular: this.state.celular
            },
            coords:{
                selected:{
                    lat: this.latitude,
                    lng: this.longitude
                },
                address:{
                    lat: this.state.lat,
                    lng: this.state.lng
                }
            }
        }
        Meteor.call('profile.insert.address', data, (error, result)=>{
            if (!error){
                history.push('/destinatarios')
            }
        })
    }
    render(){   
        if (this.state.lat == 0 && this.state.lng == 0){
            return(                
                <LoadScript
                id="script-loader"
                googleMapsApiKey="AIzaSyB2cI2xl2b40J1NNg4EZ2VXuD2JTBJ2GTg"
                libraries={["places"]}
                >
                    <BackButton title='Novo endereço'/>
                    <div style={{padding:'0 20px', backgroundColor:'white'}}>
                        <div style={{marginTop:'10px', lineHeight:'35px', fontSize:'15px'}}>Endereço</div>
                        <div className='addressInput' style={{height:'30px', padding:'0 10px', display:'flex', border:'1px solid #888', backgroundColor:'white'}}>
                        <Autocomplete
                        onLoad={this.onLoad}
                        onPlaceChanged={this.onPlaceChanged}
                        options={{
                            componentRestrictions: {country: 'br'}                                                   
                        }}
                        >
                            <input className='clearInput1' style={{height:'30px', width:'100%', fontSize:'15px'}} type='text' placeholder='Endereço com número'/>
                        </Autocomplete>                        
                        </div>
                        <div className='warnningStreet' style={{color:'red', display: 'none'}}>*Favor informar o nome da rua</div>
                    </div>
                </LoadScript>
            )
        }

        if (this.state.rua == '' || this.state.numero == ''){            
            return(<LoadScript
            id="script-loader"
            googleMapsApiKey="AIzaSyB2cI2xl2b40J1NNg4EZ2VXuD2JTBJ2GTg"
            libraries={["places"]}
            >                
                <GoogleMap
                id='hiddenMap'
                mapContainerStyle={{
                    display:'none !important'
                }}
                onLoad={this.hiddenOnLoad}
                inputData={this.state}>                    
                </GoogleMap>

                <div style={{height:'34px'}}>
                    <div style={{width:'100%', backgroundColor:'white', position:'fixed', top:'0px', zIndex:'10', display:'flex', width: document.querySelector('.appContainer').clientWidth}}>
                        <div style={{width:'40px', height:'34px', marginLeft:'10px', position:'fixed', backgroundImage:'url(/imgs/backArrow.png)', backgroundPosition:'center', backgroundRepeat:'no-repeat'}} onClick={()=>{this.setState({lat: 0, lng: 0})}}></div>
                        <div style={{height:'34px', lineHeight:'34px', width:'100%', textAlign:'center', fontWeight:'bold', color:'#111', backgroundColor:'white'}}>Novo endereço</div>
                    </div>
                </div>
                <div style={{backgroundColor:'white'}}>         
                    <div style={{fontSize:'15px', lineHeight:'35px', width:'100%', textAlign:'center'}}>Número</div>
                    <div style={{width:'160px', height:'25px', display:'flex', margin:'0 auto', marginBottom:'15px', border:'1px solid #888', backgroundColor:'white'}}>
                        <input id='inputNumber' className='clearInput1' style={{width:'160px', height:'25px', width:'100%', textAlign:'center', fontSize:'15px'}} placeholder='Número'/>
                    </div>                
                    <div style={{margin:'0 auto', marginTop:'15px', width:'110px', backgroundColor:'white', padding:'4px 0', border:'2px solid #ff7000', borderRadius:'25px 0px', textAlign:'center', fontSize:'16px', fontWeight:'600', color:'#ff7000'}} onClick={()=>{this.submitNumber()}}>Confirmar</div>
                </div>
                <AddressResults results={this.state.results} noResults={this.state.noResults} submitResult={this.resultsHandler} mapaLocation={this.locationOnMap}/>                
            </LoadScript>)
        }

        const screenSize = document.querySelector('.appContainer').clientWidth+'px';
        
        if (!this.state.confirmado){
            return(<div className='mainContainer'>
                <LoadScript
                id="script-loader"
                googleMapsApiKey="AIzaSyB2cI2xl2b40J1NNg4EZ2VXuD2JTBJ2GTg"            
                >
                    <div style={{height:'34px'}}>
                        <div style={{width:'100%', backgroundColor:'white', position:'fixed', top:'0px', zIndex:'10', display:'flex', width: document.querySelector('.appContainer').clientWidth}}>
                            <div style={{width:'40px', height:'34px', marginLeft:'10px', position:'fixed', backgroundImage:'url(/imgs/backArrow.png)', backgroundPosition:'center', backgroundRepeat:'no-repeat'}} onClick={()=>{this.setState({lat: 0, lng: 0, rua:'', numero:''})}}></div>
                            <div style={{height:'34px', lineHeight:'34px', width:'100%', textAlign:'center', fontWeight:'bold', color:'#111', backgroundColor:'white'}}>Novo endereço</div>
                        </div>
                    </div>
                    <GoogleMap 
                    id='mainMap'
                    mapContainerStyle={{
                        height: "400px",
                        width: screenSize
                    }}
                    clickableIcons={false}
                    zoom={18}
                    center={{
                        lat: this.state.lat,
                        lng: this.state.lng
                    }}
                    onLoad={this.mainMapLoad}
                    options={{disableDefaultUI: true}}
                    onCenterChanged={this.mapCenterChange}
                    inputData={this.state}           
                    >  
                    </GoogleMap>
                    <div style={{backgroundColor:'white', paddingTop:'10px', paddingBottom:'20px'}}>
                        <div style={{margin:'0 auto', marginTop:'15px', width:'210px', backgroundColor:'white', padding:'4px 0', border:'2px solid #ff7000', borderRadius:'25px 0px', textAlign:'center', fontSize:'16px', fontWeight:'600', color:'#ff7000'}} onClick={()=>{this.confirmAddress(this.state)}}>Confirmar localização</div>
                    </div>
                </LoadScript>       
            </div>);
        }
        return(<div className='mainContainer'>
            <div style={{height:'34px'}}>
                <div style={{width:'100%', backgroundColor:'white', position:'fixed', top:'0px', zIndex:'10', display:'flex', width: document.querySelector('.appContainer').clientWidth}}>
                    <div style={{width:'40px', height:'34px', marginLeft:'10px', position:'fixed', backgroundImage:'url(/imgs/backArrow.png)', backgroundPosition:'center', backgroundRepeat:'no-repeat'}} onClick={()=>{this.latitude = 0; this.longitude = 0; this.setState({lat: 0, lng: 0, nome: '', complemento: '', confirmado: false});}}></div>
                    <div style={{height:'34px', lineHeight:'34px', width:'100%', textAlign:'center', fontWeight:'bold', color:'#111', backgroundColor:'white'}}>Novo endereço</div>
                </div>
            </div>
            <div style={{padding:'10px 20px', backgroundColor:'white'}}>
                
                <div style={{fontSize:'14px', lineHeight:'25px'}}>Nome do destinatario</div>
                <div style={{padding:'0 10px', border:'1px solid #888', backgroundColor:'white'}}>
                    <input style={{height:'25px', width:'100%', lineHeight:'25px', fontSize:'14px', verticalAlign:'middle', border:'0px'}} placeholder='Nome' value={this.state.nome} onChange={this.submitHandler.bind(this)} name='nome'/>                
                </div>
                <div style={{fontSize:'14px', lineHeight:'25px'}}>Celular do destinatario</div>
                <div style={{padding:'0 10px', border:'1px solid #888', backgroundColor:'white'}}>
                    <input style={{height:'25px', width:'100%', lineHeight:'25px', fontSize:'14px', verticalAlign:'middle', border:'0px'}} placeholder='Celular' value={this.state.celular} onChange={this.submitHandler.bind(this)} name='celular'/>                
                </div>
                <div style={{fontSize:'14px', lineHeight:'25px'}}>Complemento do endereço (opcional)</div>
                <div style={{padding:'0 10px', border:'1px solid #888', backgroundColor:'white'}}>
                    <input style={{height:'25px', width:'100%', lineHeight:'25px', fontSize:'14px', verticalAlign:'middle', border:'0px'}} placeholder='Complemento (opcional)' value={this.state.complemento} onChange={this.submitHandler.bind(this)} name='complemento'/>                
                </div>                
                <div style={{margin:'0 auto', marginTop:'30px', width:'210px', backgroundColor:'white', padding:'4px 0', border:'2px solid #ff7000', borderRadius:'25px 0px', textAlign:'center', fontSize:'16px', fontWeight:'600', color:'#ff7000'}} onClick={()=>{this.submitAddress(this.state)}}>Salvar destinatario</div>
            </div>
            
        </div>)
    }
}

export default createContainer(()=>{
    if (!Meteor.userId()){history.push('/entrar')}
    var userData = Profile.findOne({_id: Meteor.userId()})
    return{
        profile: userData
    }
}
, NewAddressPage)