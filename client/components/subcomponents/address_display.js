import React, { Component } from 'react';
import history from './widgets/history';

class AddressDisplay extends Component{
    render(){
        if (this.props.profile.name == ''){ return(<div></div>); }
        const profile = this.props.profile; 
        const addressIndex = profile.mainAddress;
        const addressName = profile.address[addressIndex].name;
        const address = profile.address[addressIndex].address;

        var firstLine = addressName;
        var secondLine = address.rua + ', ' + address.numero;
        var thirdLine = address.cidade + ' - ' + address.UF;
        if (address.complemento != ''){ secondLine += ' - ' + address.complemento; }

        return(            
            <div style={{display:'flex', border:'1px solid #ff7000', borderRadius:'3px', position:'relative'}}>
                <div style={{}}>
                    <div style={{marginLeft:'19px', paddingTop:'5px', fontSize:'15px', fontWeight:'bold'}}>Destinatario:</div>
                    <div style={{marginLeft:'19px', height:'18px', paddingTop:'4px', fontSize:'14px'}}>{firstLine}</div>
                    <div style={{marginLeft:'19px', paddingTop:'2px', fontSize:'14px'}}>{secondLine}</div>
                    <div style={{marginLeft:'19px', paddingTop:'2px', paddingBottom:'10px', fontSize:'14px'}}>{thirdLine}</div>
                </div>
                <div style={{width:'35px', height:'35px', position:'absolute', top:'5px', right:'5px', backgroundImage:'url(/imgs/lapis1.png)', backgroundPosition:'center', backgroundRepeat:'no-repeat', backgroundSize:'contain'}} onClick={()=>{history.push('/destinatarios')}}></div>
            </div>
        )        
    }
}
export default AddressDisplay;