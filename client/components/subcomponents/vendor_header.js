import React, { Component } from 'react';
import history from './widgets/history';
import NameBreaker from './widgets/name_break';

class VendorHeader extends Component{
    constructor(props){
        super(props);
        this.state={

        };
    }
    isOpen(open){
        if (open){
            return(<div style={{height:'fit-content', margin:'auto 0', fontWeight:'bold', fontSize:'12px', color:'#3BCD38'}}>ABERTO</div>);
        }else{
            return(<div style={{height:'fit-content', margin:'auto 0', fontWeight:'bold', fontSize:'12px', color:'#FF1414'}}>FECHADO</div>);
        }
    }
    deliveryMethods(vendor){
        let deliveryArray = [
            'Motoboy', 'Correios', 'Correios', 'Transportadora', 'Retirar na loja'
        ]
        return(
        <div style={{textAlign:'right', fontSize:'11px', lineHeight:'20px', marginTop:'5px'}}>
            {vendor.terms.delivery.map((delivery, index)=>{
            let key='delivery_'+index;
            if (delivery){
                if (index == 0){
                    return(
                    <div key={key}>
                        <div style={{width:'fit-content', height:'20px', marginLeft:'auto', paddingRight:'8px', display:'flex', borderBottom:'1px solid #BFBFBF'}}> 
                            <div style={{color:'#1C2F59'}}>Entrega Relâmpago</div>
                            <div style={{width:'20px', height:'16px', margin:'auto 0', backgroundImage:'url(/imgs/icons/icon-relampago.png)', backgroundPosition:'center', backgroundRepeat:'no-repeat', backgroundSize:'contain'}}></div>
                        </div>
                        <div style={{width:'fit-content', height:'20px', marginLeft:'auto', paddingRight:'8px', display:'flex', borderBottom:'1px solid #BFBFBF'}}>
                            <div style={{color:'#1C2F59'}}>{deliveryArray[index]}</div>
                            <div style={{width:'20px', height:'13px', margin:'auto 0', backgroundImage:'url(/imgs/icons/icon-motoboy.png)', backgroundPosition:'center', backgroundRepeat:'no-repeat', backgroundSize:'contain'}}></div>
                        </div>
                    </div>)
                }
                if (index == 1){
                    return(
                    <div style={{width:'fit-content', height:'20px', marginLeft:'auto', paddingRight:'8px', display:'flex', borderBottom:'1px solid #BFBFBF'}} key={key}>
                        <div style={{color:'#1C2F59'}}>{deliveryArray[index]}</div>
                        <div style={{width:'20px', height:'16px', margin:'auto 0', backgroundImage:'url(/imgs/icons/icon-correio.png)', backgroundPosition:'center', backgroundRepeat:'no-repeat', backgroundSize:'contain'}}></div>
                    </div>)
                }
                if (index == 2){
                    if (vendor.terms.delivery[1]){
                        return(<div key={key}></div>)
                    }
                    return(
                    <div style={{width:'fit-content', height:'20px', marginLeft:'auto', paddingRight:'8px', display:'flex', borderBottom:'1px solid #BFBFBF'}} key={key}>
                        <div style={{color:'#1C2F59'}}>{deliveryArray[index]}</div>
                        <div style={{width:'20px', height:'16px', margin:'auto 0', backgroundImage:'url(/imgs/icons/icon-correio.png)', backgroundPosition:'center', backgroundRepeat:'no-repeat', backgroundSize:'contain'}}></div>
                    </div>)
                }                
                if (index == 3){
                    return(
                    <div style={{width:'fit-content', height:'20px', marginLeft:'auto', paddingRight:'8px', display:'flex', borderBottom:'1px solid #BFBFBF'}} key={key}>
                        <div style={{color:'#1C2F59'}}>{deliveryArray[index]}</div>
                        <div style={{width:'20px', height:'16px', margin:'auto 0', backgroundImage:'url(/imgs/icons/icon-transportadora.png)', backgroundPosition:'center', backgroundRepeat:'no-repeat', backgroundSize:'contain'}}></div>
                    </div>)
                }
                return(<div key={key}></div>);
            }
        })}</div>)
    }
    render(){
        let vendor = this.props.vendor;
        let distance = vendor.distance;
        let screenSize = document.querySelector('.appContainer').clientWidth;
        let bannerHeight = Math.round(134 / 374 * screenSize);
        if (!vendor.img_url){ history.push('/'); return; }
        return(<div>
            <div style={{width:'100%', height:bannerHeight, backgroundImage:(vendor.bannerUrl) ? 'url('+vendor.bannerUrl+')' : 'url(/imgs/banners/banner_main.png)', backgroundPosition:'center', backgroundRepeat:'no-repeat', backgroundSize:'contain'}}></div>
            <div style={{display:'flex', padding:'0 5px', paddingRight:'0px'}}>
                <div style={{height:'65px', minWidth:'65px', border:'1px solid #f1f2f2', borderRadius:'50%', position:'relative', top:'-20px', backgroundImage: 'url('+vendor.img_url+')', backgroundSize:'contain', backgroundRepeat:'no-repeat', backgroundPosition: 'center', backgroundColor:'white'}}></div>
                <div style={{maxWidth:'145px', marginTop:'5px', marginLeft: '10px'}}>
                    <div style={{fontSize:'14px', fontWeight:'bold', color:(vendor.color) ? vendor.color : '#FF7000'}}><NameBreaker name={vendor.display_name}/></div>
                    <div style={{fontSize:'10px', padding:'5px 0', color:'#222'}}>{vendor.address.cidade} ({distance} km)</div>
                    <div style={{display:'flex', position:'relative', height:'18px'}}>
                        <div style={{width:'90px', height:'18px', fontSize:'10px', borderRadius:'15px', lineHeight:'18px', textAlign:'center', color:'white', backgroundColor:(vendor.color) ? vendor.color : '#FF7000', position:'absolute', left:'-15px'}} onClick={()=>{history.push('/fornecedor/condicoes/' + vendor._id)}}>MAIS DETALHES</div>                            
                        <div style={{width:'fit-content', height:'fit-content', margin:'auto 0', position:'absolute', top:'0px', right:'0px', bottom:'0px'}}>{this.isOpen(vendor.open)}</div>
                    </div>
                </div>
                <div style={{minWidth:'130px', height:'fit-content', marginLeft:'auto'}}>
                    {this.deliveryMethods(vendor)}
                </div>                                     
            </div>
        </div>);
    }
}
export default VendorHeader ;