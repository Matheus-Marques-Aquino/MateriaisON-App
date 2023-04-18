import React, { Component } from 'react';

class AskLocalization extends Component{  

    render(){   
        var width = document.querySelector('.appContainer').clientWidth;
        if (this.props.open == false) { return(<div className='_messageBox'></div>); }
        return(<div>
            <div style={{height:'100%', width: width, backgroundColor:'black', position:'fixed', top:'0px', opacity:'0.35'}} onClick={(e)=>{this.props.close(); e.stopPropagation();}}></div>
            <div style={{position:'fixed', left:'0', right:'0', top:'0', bottom:'0', margin:'auto', width:'260px', height:'min-content',borderRadius:'10px', border:'1px solid #ccc', backgroundColor:'white'}}>
                <div style={{paddingTop:'15px', paddingBottom:'15px', fontSize:'15px', fontWeight:'bold', color:'#FF7000'}}>
                    <div style={{width:'100%', textAlign:'center'}}>Localização automática</div>
                </div>
                <div style={{padding:'0 20px', margin:'auto 0', display:'flex'}}>
                    <div style={{margin:'auto', fontSize:'13px'}}>Permita o acesso à localização do dispositivo para podermos encontrar as melhores ofertas da sua região.</div>
                </div>
                <div style={{margin:'0 20px', marginTop:'20px', display:'flex'}}>
                    <div style={{backgroundColor:'#ff7000', width:'100px', margin:'0 auto', marginBottom:'15px', padding:'2px 0', border:'2px solid #ff7000', borderRadius:'25px', textAlign:'center', color:'white' }} onClick={(e)=>{this.props.close(); e.stopPropagation();}}>Ok</div>            
                </div>
            </div>
        </div>)
    }
}

export default AskLocalization;