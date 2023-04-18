import React, { Component } from 'react';

class AddressResults extends Component{    

    render(){
        const results = this.props.results;
        const noResults = this.props.noResults;
        if (!results){ return(<div></div>); }
        
        if (results.length > 0){
            return(<div>
                <div style={{padding:'0 20px', marginTop:'15px', paddingBottom:'5px', borderBottom:'1px solid black'}}>Você quis dizer:</div>
                {
                    results.map((result, index)=>{
                        let _address = {
                            street: '',
                            number: '',
                            street: '',
                            neighborhood: '',
                            city: '',
                            UF: '',
                            country: '',
                            postCode: ''
                        }
                        let firstLine = '';
                        let secondLine = '';
                        let key = 'address_'+index;
                        result.address_components.map(address=>{
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
                                        break;
                                    case 'country':
                                        _address.country = address.long_name
                                        break;
                                    case 'postal_code':
                                        _address.postCode = address.long_name
                                        break;  
                                }
                            });
                        });
                        let lat = result.geometry.location.lat();
                        let lng = result.geometry.location.lng();
                        let number = _address.number;
                        let postCode = _address.postCode;

                        if (_address.street != ''){ firstLine += _address.street;}
                        if (_address.number != ''){ firstLine += ', '+_address.number;}
                        if (_address.neighborhood != ''){ secondLine += _address.neighborhood + ', ';}
                        if (_address.city != ''){ secondLine += _address.city;}
                        if (_address.UF != ''){ secondLine += ' - '+_address.UF;}
                        if (_address.country != ''){ secondLine += ', '+_address.country;}
                        return(<div style={{minHeight:'50px', display:'flex', borderBottom:'1px solid black'}} onClick={()=>{this.props.submitResult(lat, lng, number, postCode)}} key={key}>
                            <div style={{margin:'auto 0'}}>
                                <div style={{margin:'0 20px', fontSize:'14px'}}>{firstLine}</div>
                                <div style={{margin:'0 20px', fontSize:'14px'}}>{secondLine}</div>
                            </div>
                        </div>)
                    })
                }
                <div style={{width:'210px', margin:'0 auto', marginTop:'10px', height:'35px', lineHeight:'35px', textAlign:'center', border:'1px solid black'}} onClick={()=>{this.props.mapaLocation()}}>Procurar no mapa</div>    
            </div>);
        }
        if (noResults){ 
            return(<div>
                <div className='warnningResults' style={{color:'red', margin:'20px'}}>Nenhum resultado encontrado para este número</div>
                <div style={{width:'210px', margin:'0 auto', height:'35px', lineHeight:'35px', textAlign:'center', border:'1px solid black'}} onClick={()=>{this.props.mapaLocation()}}>Procurar no mapa</div> 
            </div>); 
        }
        return(<div></div>)
    }
}
export default AddressResults;