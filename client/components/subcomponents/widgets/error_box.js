import React, { Component } from 'react';

class ErrorBox extends Component{  

    render(){
        let message = this.props.message;        
        var width = document.querySelector('.appContainer').clientWidth;
        if (this.props.open == false) { return(<div className='_messageBox'></div>); }
        return(<div>
            <div style={{height:'100%', width: width, backgroundColor:'black', position:'fixed', top:'0px', opacity:'0.35'}} onClick={(e)=>{this.props.close(); e.stopPropagation();}}></div>
            <div className='_messageBox' style={{position:'fixed', left:'0', right:'0', top:'0', bottom:'0', margin:'auto', width:'260px', height:'min-content',borderRadius:'10px', border:'1px solid #ccc', backgroundColor:'white'}}>
                <div style={{backgroundColor:'white', margin:'auto 10px', marginTop:'10px', minHeight:'85px', display:'flex'}}>
                    <div style={{margin:'auto', textAlign:'center'}}>{message}</div>
                </div>
                <div style={{backgroundColor:'white', margin:'0 10px', marginTop:'10px', display:'flex'}}>
                    <div style={{backgroundColor:'#ff7000', width:'100px', margin:'0 auto', marginBottom:'15px', padding:'4px 0', border:'2px solid #ff7000', borderRadius:'25px', textAlign:'center', fontWeight:'600', color:'white' }} onClick={(e)=>{this.props.close(); e.stopPropagation();}}>Ok</div>            
                </div>
            </div>
        </div>)
    }
}

export default ErrorBox;