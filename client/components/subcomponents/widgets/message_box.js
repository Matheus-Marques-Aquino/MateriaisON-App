import React, { Component } from 'react';

class MessageBox extends Component{  

    render(){
        let message = this.props.message;
        let options = this.props.options;
        let width = document.querySelector('.appContainer').clientWidth;
        
        if (this.props.open == false) { return(<div className='_messageBox'></div>); }
        return(
        <div>
            <div style={{height:'100%', width: width, backgroundColor:'black', position:'fixed', top:'0px', opacity:'0.35'}} onClick={(e)=>{this.props.cancel(); e.stopPropagation();}}></div>
            <div className='_messageBox' style={{position:'fixed', left:'0', right:'0', top:'0', bottom:'0', margin:'auto', width:'260px', height:'145px', borderRadius:'10px', border:'1px solid #ccc', backgroundColor:'white'}}>
                <div style={{margin:'10px', height:'80px', display:'flex'}}>
                    <div style={{margin:'auto', textAlign:'center'}}>{message}</div>
                </div>
                <div style={{backgroundColor:'white', margin:'0 10px', marginTop:'5px', display:'flex'}}>
                <div style={{backgroundColor:'#ff7000', width:'100px', marginLeft:'10px', padding:'4px 0', border:'2px solid #ff7000', borderRadius:'25px', textAlign:'center',  color:'white'}} onClick={(e)=>{this.props.confirm(); e.stopPropagation();}}>{options[0]}</div>
                <div style={{backgroundColor:'#ff7000', width:'100px', marginRight:'10px', marginLeft:'auto', padding:'4px 0', border:'2px solid #ff7000', borderRadius:'25px', textAlign:'center', color:'white'}} onClick={(e)=>{this.props.cancel(); e.stopPropagation();}}>{options[1]}</div>
                </div>
            </div>
        </div>)
    }
}

export default MessageBox;