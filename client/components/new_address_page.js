import React, { Component } from 'react';
import { Profile } from '../../imports/collections/profile';
import BackButton from './subcomponents/back_button';
import BottomMenu from './subcomponents/bottom_menu';
import history from './subcomponents/widgets/history';
import { Mask } from './subcomponents/widgets/masks';
import Waiting from './subcomponents/widgets/waiting';
import { GoogleMap, LoadScript, Autocomplete, Marker} from '@react-google-maps/api';
class NewAddressPage extends Component{
    constructor(props){
        super(props);
        this.geocoder = null;
        this.autocomplete = null;
        this.map = null
        this.errors = [];
        this.formatedAddress = '';
        this.latitude = 0;
        this.longitude = 0;
        this.state = {
            errors: [],
            addressIndex: 0,
            page: 0,
            address: {},            
            addressNumberInput: '',
            numero: '',
            addressResults: [],
            loading: true
        };        
    }
    inputHandler(event){
        let name = event.target.name;
        let value = event.target.value;
        this.setState({
            [name]: value
        });
    }
    onLoad(autocomplete){       
        this.autocomplete = autocomplete;  
        this.autocomplete.setFields(['address_component', 'geometry', 'formatted_address']) 
        this.geocoder = new google.maps.Geocoder()   
        this.setState({loading: false}); 
    }
    addressFormat(_address){
        let address = _address;
        let formatedAddress = _address.rua;
        if (address.numero != undefined && address.numero != ''){
            formatedAddress += ', ' + address.numero;
        }
        if (address.bairro != undefined && address.bairro != ''){
            formatedAddress += ' - ' + address.bairro;
        }
        if (address.cidade != undefined && address.cidade != ''){
            formatedAddress += ', ' + address.cidade;
        }
        if (address.UF != undefined && address.UF != ''){
            formatedAddress += ' - ' + address.UF;
        }
        if (address.pais != undefined && address.pais != ''){
            formatedAddress += ', ' + address.pais;
        }
        return formatedAddress;
    }
    onPlaceChanged(){
        if (this.autocomplete !== null) {
            var place = this.autocomplete.getPlace();
            var address = {
                numero: '',
                rua: '',
                bairro: '',
                cidade: '',
                estado:'',
                UF: '',
                estado:'',
                pais: '',
                cep: '',
                coords: {
                    lat: 0,
                    lng: 0
                },
                nome: '',
                celular: '',
                complemento: ''
            }
            var addtional = {
                political: '',
                neighborhood: '',
                premise: '',
                subpremise: ''
            }
                  
            if (place != undefined){
                address.coords.lat = place.geometry.location.lat(),
                address.coords.lng = place.geometry.location.lng();
                this.latitude = place.geometry.location.lat();
                this.longitude = place.geometry.location.lng();
                this.formatedAddress = place.formatted_address;
                place.address_components.map(component=>{    
                    for(let i=0; i<=component.types.length; i++){
                        switch(component.types[i]){
                            case 'route':
                                address.rua = component.long_name
                                break;
                            case 'street_number':
                                address.numero = component.long_name
                                break;
                            case 'sublocality_level_1':
                                address.bairro = component.long_name
                                break;
                            case 'administrative_area_level_2':
                                address.cidade = component.long_name
                                break;
                            case 'administrative_area_level_1':
                                address.UF = component.short_name
                                address.estado = component.long_name
                                break;
                            case 'country':
                                address.pais = component.long_name
                                break;  
                            case 'postal_code':
                                address.cep = component.long_name
                                break;
                            case 'political':
                                addtional.political = component.long_name
                                break;
                            case 'neighborhood':
                                addtional.neighborhood = component.long_name
                                break;
                            case 'premise':
                                addtional.premise = component.long_name
                                break;
                            case 'subpremise':
                                addtional.subpremise = component.long_name
                                break;
                        }
                    }                                        
                });
                if (address.rua == '' && addtional.political != ''){address.rua = addtional.political}
                if (address.numero == ''){
                    if (addtional.premise != ''){
                        address.numero = addtional.premise;
                    }else{
                        if (addtional.subpremise != ''){
                            address.numero = subpremise;
                        }
                    }
                }
                if (address.bairro == '' && addtional.neighborhood != ''){address.bairro = addtional.neighborhood}
                if (address == '' && addtional.political == ''){
                    this.error = [];
                    this.errors.push('Favor fornecer o número e nome da rua do destinatario.');
                    this.setState({page: 0});
                    return; 
                }
                let googleApi = $(".pac-container");
                if (googleApi){
                    googleApi.remove();
                }
                if (address.numero == '' && addtional.premise == '' && addtional.subpremise == ''){
                    this.error = []                    
                    this.setState({
                        address: address,                        
                        page: 1
                    })
                    return;
                }
                
                this.setState({
                    addressResults: [address],
                    page: 2
                });
            }
        }
    }
    geoCode(numero){
        if (numero == undefined || numero == ''){ return; }
        this.errors = [];
        var addressResults = [];
        var address = this.state.address;
        address.numero = numero;
        this.geocoder.geocode({'address': this.addressFormat(address)}, (results, status)=>{
            if (status == google.maps.GeocoderStatus.OK) {
                if (results.length > 0){
                    results.map((result, index)=>{
                        var address = {
                            numero: '',
                            rua: '',
                            bairro: '',
                            cidade: '',
                            estado: '',
                            UF: '',
                            pais: '',
                            cep: '',
                            coords:{
                                lat:result.geometry.location.lat(),
                                lng: result.geometry.location.lng()                                
                            },
                            nome: '',
                            celular: '',
                            complemento: ''
                        }                        
                        var addtional={
                            political: '',
                            neighborhood: '',
                            premise: '',
                            subpremise: ''
                        }
                        result.address_components.map(component=>{ 
                            for(let i=0; i<=component.types.length; i++){
                                switch(component.types[i]){
                                    case 'route':
                                        if (address.rua == ''){
                                            address.rua = component.long_name
                                        }
                                        break;
                                    case 'street_number':
                                        if (address.numero == ''){
                                            address.numero = component.long_name
                                        }                                        
                                        break;
                                    case 'sublocality_level_1':
                                        if (address.bairro == ''){
                                            address.bairro = component.long_name
                                        }
                                        break;
                                    case 'administrative_area_level_2':
                                        if (address.cidade == ''){
                                            address.cidade = component.long_name
                                        }
                                        break;                                    
                                    case 'administrative_area_level_1':
                                        if (address.UF == ''){
                                            address.estado = component.long_name
                                            address.UF = component.short_name
                                        }
                                        break;
                                    case 'country':
                                        if (address.pais == ''){
                                            address.pais = component.long_name
                                        }
                                        break;  
                                    case 'postal_code':
                                        if (address.cep == ''){
                                            address.cep = component.long_name
                                        }
                                        break;
                                    case 'political':
                                        if (addtional.political == ''){
                                            addtional.political = component.long_name
                                        }
                                        break;
                                    case 'neighborhood':
                                        if (addtional.neighborhood == ''){
                                            addtional.neighborhood = component.long_name
                                        }
                                        break;
                                    case 'premise':
                                        if (addtional.premise == ''){
                                            addtional.premise = component.long_name
                                        }
                                        break;
                                    case 'subpremise':
                                        if (addtional.subpremise == ''){
                                            addtional.subpremise = component.long_name
                                        }
                                        break;
                                }
                            } 
                        });
                        if (address.rua == '' && addtional.political != ''){address.rua = addtional.political}
                        if (address.numero == ''){
                            if (addtional.premise != ''){
                                address.numero = addtional.premise;
                            }else{
                                if (addtional.subpremise != ''){
                                    address.numero = subpremise;
                                }
                            }
                        }
                        if (address.bairro == '' && addtional.neighborhood != ''){address.bairro = addtional.neighborhood}
                        if (address.numero != ''){
                            addressResults.push(address); 
                        }
                    })
                    if (addressResults.length > 0){
                        this.setState({ addressResults: addressResults });
                    }else{
                        this.errors.push('Não foi encontrado nenhum enedereço neste número, você pode e ser mais especifico na pesquisa!');
                        this.setState({ addressResults: [] });
                    }
                }else{
                    this.errors.push('Não foi encontrado nenhum endereço neste número, você pode voltar e ser mais especifico na pesquisa.');
                    this.setState({ addressResults: [] });
                }
            }
        })
    }    
    mapOnLoad(map){
        this.map = map;
        if (!this.map.marker){
            this.map.marker = new google.maps.Marker( {position: {lat:this.map.center.lat(), lng:this.map.center.lng()}, map: this.map} )
        }
        this.map.setCoords = (lat, lng)=>{
            if (
                lat < this.state.addressResults[this.state.addressIndex].coords.lat + 0.0018 &&
                lat > this.state.addressResults[this.state.addressIndex].coords.lat - 0.0018 &&
                lng < this.state.addressResults[this.state.addressIndex].coords.lng + 0.0018 &&
                lng > this.state.addressResults[this.state.addressIndex].coords.lng - 0.0018 
            ){
                this.latitude = lat;
                this.longitude = lng;
            }else{
                this.map.panTo({
                    lat: this.state.addressResults[this.state.addressIndex].coords.lat, 
                    lng: this.state.addressResults[this.state.addressIndex].coords.lng
                });
                this.map.marker.setPosition({
                    lat: this.state.addressResults[this.state.addressIndex].coords.lat, 
                    lng: this.state.addressResults[this.state.addressIndex].coords.lng
                });
            }
        }        
    }
    mapCenterChange(){
        if (this.map != null){
            if (!this.map.marker){
                this.map.marker = new google.maps.Marker( {position: {lat:this.map.center.lat(), lng:this.map.center.lng()}, map: this.map} )            
            }else{
                this.map.marker.setPosition({lat: this.map.center.lat(), lng: this.map.center.lng()})            
                this.map.setCoords(this.map.center.lat(), this.map.center.lng())
            }
        }        
    }
    addressHandler(event){
        let name = event.target.name;
        let value = event.target.value;  
        let _address = this.state.addressResults      
        switch(name){
            case 'nome':
                _address[this.state.addressIndex].nome = value
                this.setState({
                    addressResults: _address
                })
                break;
            case 'celular':
                value = Mask('phone', value );
                _address[this.state.addressIndex].celular = value
                this.setState({
                    addressResults: _address
                })
                break;
            case 'complemento':
                _address[this.state.addressIndex].complemento = value
                this.setState({
                    addressResults: _address
                })
                break;
            case 'cep':
                value = Mask('cep', value );
                _address[this.state.addressIndex].cep = value
                this.setState({
                    addressResults: _address
                })
                break;
        } 
    }
    submitAddress(){        
        this.errors = []
        let address = this.state.addressResults[this.state.addressIndex]
        if (address.cep.length < 9){this.errors.push('Favor inserir um cep válido para o endereço.')}
        if (address.nome.length < 3){this.errors.push('Favor inserir o nome de quem irá receber as encomendas.')}
        if (address.celular.length < 13){this.errors.push('Favor inserir um número de telefone válido.')}
        if (this.errors.length > 0){
            this.setState({errors: this.errors});
            return
        }
        let data = {
            name: address.nome,
            address: {
                numero: address.numero,
                rua: address.rua,
                bairro: address.bairro,
                cidade: address.cidade,
                UF: address.UF,
                estado: address.estado,
                pais: address.pais,
                cep: address.cep,
                complemento: address.complemento,
                celular: address.celular
            },
            coords:{
                selected:{
                    lat: this.latitude,
                    lng: this.longitude
                },
                address:{
                    lat:  address.coords.lat,
                    lng: address.coords.lng
                }
            }
        }
        Meteor.call('profile.insert.address', data, (error, result)=>{
            if (!error){
                history.push('/destinatarios')
            }else{
                console.log(error)
            }
        })
    }    
    pageRender(page){
        var width = document.querySelector('.appContainer').clientWidth+'px'; 
        document.querySelector('.appContainer').style.height = 'auto';   
        document.querySelector('.appContainer').style.minHeight = 'auto';   
        if (page == 0){                
            return(<div>
                <BackButton title='Novo endereço'/>      
                <div style={{padding: '0 20px', backgroundColor:'white'}}>      
                    <LoadScript id="script-loader" googleMapsApiKey="AIzaSyB2cI2xl2b40J1NNg4EZ2VXuD2JTBJ2GTg" libraries={["places"]}>
                        <div style={{fontSize:'15px', marginTop:'40px', lineHeight:'35px', textAlign:'center', fontWeight:'bold'}}>Endereço com número</div>
                        <div style={{padding:'0 10px', border:'1px solid #ff7000', borderRadius:'3px', backgroundColor:'white'}}>
                            <Autocomplete onLoad={this.onLoad.bind(this)} onPlaceChanged={this.onPlaceChanged.bind(this)} options={{ componentRestrictions: {country: 'br'} }}>
                                <input style={{height:'35px', width:'100%', lineHeight:'35px', fontSize:'14px', verticalAlign:'middle', border:'0px'}} placeholder='Endereço com número'/>                    
                            </Autocomplete>                        
                        </div>
                        {this.displayErrors()}  
                    </LoadScript>              
                </div>
                <Waiting open={this.state.loading}/> 
            </div>)
        }
        if (page == 1){
            return(
            <div style={{backgroundColor:'white'}}>
                <div style={{height:'34px'}}>
                    <div style={{width:'100%', backgroundColor:'white', borderBottom:'1px solid #ccc', position:'fixed', top:'0px', zIndex:'10', display:'flex', width: document.querySelector('.appContainer').clientWidth}}>
                        <div style={{width:'40px', height:'34px', marginLeft:'10px', position:'fixed', backgroundImage:'url(/imgs/backArrow.png)', backgroundPosition:'center', backgroundRepeat:'no-repeat'}} onClick={()=>{this.setState({addressResults: [], page: 0})}}></div>
                        <div style={{height:'34px', lineHeight:'34px', width:'100%', textAlign:'center', fontWeight:'bold', color:'#111', backgroundColor:'white'}}>Novo endereço</div>
                    </div>
                </div>
                <LoadScript id="script-loader" googleMapsApiKey="AIzaSyB2cI2xl2b40J1NNg4EZ2VXuD2JTBJ2GTg" libraries={["places"]}>
                    <div style={{fontSize:'15px', lineHeight:'35px', textAlign:'center', fontWeight:'bold'}}>Número</div>
                    <div style={{padding: '0 20px', paddingBottom:'15px', fontSize:'14px', lineHeight:'20px', textAlign:'center'}}>{this.addressFormat(this.state.address)}</div>
                    <div style={{width:'120px', margin:'0 auto', padding:'0 10px', border:'1px solid #ff7000', borderRadius:'3px', backgroundColor:'white'}}>
                        <input id='number' style={{height:'35px', width:'100%', lineHeight:'35px', fontSize:'14px', verticalAlign:'middle', border:'0px', textAlign:'center'}} placeholder='Número' onChange={this.inputHandler.bind(this)} value={this.state.numero} name='numero' onKeyDown={(e)=>{if (e.key==='Enter'){this.geoCode(this.state.numero)}}}/>
                    </div>
                    <div style={{margin:'10px auto', marginTop:'25px', width:'100px', backgroundColor:'#ff7000', padding:'5px 0', border:'2px solid #ff7000', borderRadius:'25px', textAlign:'center', fontSize:'16px', color:'white'}} onClick={()=>{this.geoCode(this.state.numero)}}>Buscar</div>
                    {this.displayErrors()}
                    {this.displayResults()}
                </LoadScript>
            </div>)
        }
        if (page == 2){            
            return(
            <div style={{backgroundColor:'white'}}>
                <div style={{height:'34px'}}>
                    <div style={{width:'100%', backgroundColor:'white', borderBottom:'1px solid #ccc', position:'fixed', top:'0px', zIndex:'10', display:'flex', width: document.querySelector('.appContainer').clientWidth}}>
                        <div style={{width:'40px', height:'34px', marginLeft:'10px', position:'fixed', backgroundImage:'url(/imgs/backArrow.png)', backgroundPosition:'center', backgroundRepeat:'no-repeat'}} onClick={()=>{this.setState({page: 0})}}></div>
                        <div style={{height:'34px', lineHeight:'34px', width:'100%', textAlign:'center', fontWeight:'bold', color:'#111', backgroundColor:'white'}}>Novo endereço</div>
                    </div>
                </div>
                <LoadScript id="script-loader" googleMapsApiKey="AIzaSyB2cI2xl2b40J1NNg4EZ2VXuD2JTBJ2GTg" libraries={["places"]}>
                <GoogleMap id='mainMap' mapContainerStyle={{height: "400px", width: width}} clickableIcons={false} zoom={18} center={{lat: this.state.addressResults[this.state.addressIndex].coords.lat, lng: this.state.addressResults[this.state.addressIndex].coords.lng}} onLoad={this.mapOnLoad.bind(this)} options={{disableDefaultUI: true}} onCenterChanged={this.mapCenterChange.bind(this)}>
                </GoogleMap>
                <div style={{backgroundColor:'white', paddingTop:'10px', paddingBottom:'20px'}}>
                    <div style={{margin:'0 auto', marginTop:'15px', width:'210px', backgroundColor:'#ff7000', padding:'5px 0', border:'2px solid #ff7000', borderRadius:'25px', textAlign:'center', fontSize:'16px', color:'white'}} onClick={()=>{this.setState({page: 3})}}>Confirmar localização</div>
                </div>
                </LoadScript>
            </div>)
        }
        if (page == 3){      
            if (this.state.addressResults[this.state.addressIndex].cep == '' || this.state.addressResults[this.state.addressIndex].cep.length < 9){
                return(<div>
                    <div style={{height:'34px'}}>
                        <div style={{width:'100%', backgroundColor:'white', borderBottom:'1px solid #ccc', position:'fixed', top:'0px', zIndex:'10', display:'flex', width: document.querySelector('.appContainer').clientWidth}}>
                            <div style={{width:'40px', height:'34px', marginLeft:'10px', position:'fixed', backgroundImage:'url(/imgs/backArrow.png)', backgroundPosition:'center', backgroundRepeat:'no-repeat'}} onClick={()=>{this.setState({addressResults: [], page: 0})}}></div>
                            <div style={{height:'34px', lineHeight:'34px', width:'100%', textAlign:'center', fontWeight:'bold', color:'#111', backgroundColor:'white'}}>Novo endereço</div>
                        </div>
                    </div>
                    <div style={{padding:'10px 20px', backgroundColor:'white'}}>
                        <div style={{fontSize:'14px', lineHeight:'25px'}}>Nome do destinatario</div>
                        <div style={{padding:'0 10px', border:'1px solid #ff7000', borderRadius:'3px', backgroundColor:'white'}}>
                            <input id='nome' style={{height:'25px', width:'100%', lineHeight:'25px', fontSize:'14px', verticalAlign:'middle', border:'0px'}} placeholder='Nome' value={this.state.addressResults[this.state.addressIndex].nome} onChange={this.addressHandler.bind(this)} name='nome' onKeyDown={(e)=>{if (e.key==='Enter'){document.getElementById('cep').focus();}}}/>                
                        </div>
                        <div style={{fontSize:'14px', lineHeight:'25px'}}>CEP</div>
                        <div style={{padding:'0 10px', border:'1px solid #ff7000', borderRadius:'3px', backgroundColor:'white'}}>
                            <input id='cep' style={{height:'25px', width:'100%', lineHeight:'25px', fontSize:'14px', verticalAlign:'middle', border:'0px'}} placeholder='CEP' value={this.state.addressResults[this.state.addressIndex].cep} onChange={this.addressHandler.bind(this)} name='cep' onKeyDown={(e)=>{if (e.key==='Enter'){document.getElementById('celular').focus();}}}/>                
                        </div>
                        <div style={{fontSize:'14px', lineHeight:'25px'}}>Celular do destinatario</div>
                        <div style={{padding:'0 10px', border:'1px solid #ff7000', borderRadius:'3px', backgroundColor:'white'}}>
                            <input id='celular' style={{height:'25px', width:'100%', lineHeight:'25px', fontSize:'14px', verticalAlign:'middle', border:'0px'}} placeholder='Celular' value={this.state.addressResults[this.state.addressIndex].celular} onChange={this.addressHandler.bind(this)} name='celular' onKeyDown={(e)=>{if (e.key==='Enter'){document.getElementById('complemento').focus();}}}/>                
                        </div>
                        <div style={{fontSize:'14px', lineHeight:'25px'}}>Complemento do endereço (opcional)</div>
                        <div style={{padding:'0 10px', border:'1px solid #ff7000', borderRadius:'3px', backgroundColor:'white'}}>
                            <input id='complemento' style={{height:'25px', width:'100%', lineHeight:'25px', fontSize:'14px', verticalAlign:'middle', border:'0px'}} placeholder='Complemento (opcional)' value={this.state.addressResults[this.state.addressIndex].complemento} onChange={this.addressHandler.bind(this)} name='complemento' onKeyDown={(e)=>{if (e.key==='Enter'){this.submitAddress();}}}/>                
                        </div>                
                        {this.displayErrors()}
                        <div style={{margin:'0 auto', marginTop:'30px', width:'210px', backgroundColor:'#ff7000', padding:'5px 0', border:'2px solid #ff7000', borderRadius:'25px', textAlign:'center', fontSize:'16px', color:'white'}} onClick={()=>{this.submitAddress()}}>Salvar destinatario</div>
                    </div>
                    
                    <Waiting open={this.state.loading}/>
                </div>)
            }
            return(<div>
                <div style={{height:'34px'}}>
                    <div style={{width:'100%', backgroundColor:'white', borderBottom:'1px solid #ccc', position:'fixed', top:'0px', zIndex:'10', display:'flex', width: document.querySelector('.appContainer').clientWidth}}>
                        <div style={{width:'40px', height:'34px', marginLeft:'10px', position:'fixed', backgroundImage:'url(/imgs/backArrow.png)', backgroundPosition:'center', backgroundRepeat:'no-repeat'}} onClick={()=>{this.setState({addressResults: [], page: 0})}}></div>
                        <div style={{height:'34px', lineHeight:'34px', width:'100%', textAlign:'center', fontWeight:'bold', color:'#111', backgroundColor:'white'}}>Novo endereço</div>
                    </div>
                </div>
                <div style={{padding:'10px 20px', backgroundColor:'white'}}>
                    <div style={{fontSize:'14px', lineHeight:'25px'}}>Nome do destinatário</div>
                    <div style={{padding:'0 10px', border:'1px solid #ff7000', borderRadius:'3px', backgroundColor:'white'}}>
                        <input style={{height:'25px', width:'100%', lineHeight:'25px', fontSize:'14px', verticalAlign:'middle', border:'0px'}} placeholder='Nome' value={this.state.addressResults[this.state.addressIndex].nome} onChange={this.addressHandler.bind(this)} name='nome'/>                
                    </div>
                    <div style={{fontSize:'14px', lineHeight:'25px'}}>Celular do destinátario</div>
                    <div style={{padding:'0 10px', border:'1px solid #ff7000', borderRadius:'3px', backgroundColor:'white'}}>
                        <input style={{height:'25px', width:'100%', lineHeight:'25px', fontSize:'14px', verticalAlign:'middle', border:'0px'}} placeholder='Celular' value={this.state.addressResults[this.state.addressIndex].celular} onChange={this.addressHandler.bind(this)} name='celular'/>                
                    </div>
                    <div style={{fontSize:'14px', lineHeight:'25px'}}>Complemento do endereço (opcional)</div>
                    <div style={{padding:'0 10px', border:'1px solid #ff7000', borderRadius:'3px', backgroundColor:'white'}}>
                        <input style={{height:'25px', width:'100%', lineHeight:'25px', fontSize:'14px', verticalAlign:'middle', border:'0px'}} placeholder='Complemento' value={this.state.addressResults[this.state.addressIndex].complemento} onChange={this.addressHandler.bind(this)} name='complemento'/>                
                    </div>              
                    {this.displayErrors()}  
                    <div style={{margin:'0 auto', marginTop:'30px', width:'210px', backgroundColor:'#ff7000', padding:'5px 0', border:'2px solid #ff7000', borderRadius:'25px', textAlign:'center', fontSize:'16px', color:'white'}} onClick={()=>{this.submitAddress()}}>Salvar destinatário</div>
                </div>
                <Waiting open={this.state.loading}/>
            </div>)
        }
    }
    displayErrors(){
        return(<div style={{margin:'10px'}}>
            {this.errors.map((error, index)=>{
                let key = 'Error_'+index;
                return(<div style={{fontSize:'14px', color:'red'}} key={key}>{error}</div>);
            })}
        </div>)
    }
    displayResults(){
        if (this.state.addressResults.length == 0){ return(<div></div>);}
        return(
        <div>
            <div style={{marginTop:'30px', lineHeight:'25px', padding:'0 20px'}}>Você quiz dizer:</div>
            <div style={{backgroundColor:'white', borderTop:'1px solid #ccc'}}> 
                {this.state.addressResults.map((address, index)=>{     
                    let key = 'Result_'+index;
                    let firstLine = address.rua;
                    if (address.numero != '' && address.numero != undefined){
                        firstLine += ', ' + address.numero;
                    }
                    let secondLine = '';
                    if (address.bairro != '' && address.bairro != undefined){
                        secondLine += address.bairro + ', '
                    }
                    if (address.cidade != '' && address.cidade != undefined){
                        secondLine += address.cidade;
                    }
                    if (address.UF != '' && address.UF != undefined){
                        secondLine += ' - ' + address.UF;
                    }
                    if (address.pais != '' && address.pais != undefined){
                        secondLine += ', ' + address.pais;
                    }
                    return(                    
                        <div style={{padding: '0 20px', borderBottom:'1px solid #ccc'}} key={key} onClick={()=>{
                            this.latitude = address.coords.lat;
                            this.longitude = address.coords.lng;
                            this.setState({page: 2, addressIndex: index})
                            }}>
                            <div style={{display:'flex', position:'relative'}}>
                                <div style={{width:'14px', height:'14px', position:'absolute', bottom:'3px', backgroundImage:'url(/imgs/miniPoint.png)', backgroundRepeat:'no-repeat'}}></div>
                                <div style={{paddingTop:'10px', marginLeft:'20px', lineHeight:'20px', fontSize:'15px'}}>{firstLine}</div>
                            </div>
                            <div style={{paddingBottom:'7px', marginLeft:'20px', lineHeight:'23px', fontSize:'14px', color:'#777'}}>{secondLine}</div>
                        </div>);
                })}
            </div>
        </div>)
    }
    render(){
        if (!Meteor.userId()){
            history.push('/entrar');
        }
        return(<div>
            {this.pageRender(this.state.page)}
        </div>); 
        
    }
}
export default NewAddressPage;