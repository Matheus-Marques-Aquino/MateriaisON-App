import React, { Component } from 'react';
import history from './widgets/history';

class BackButton extends Component{
    
    goBackPage(){    
        if (history.location.pathname == '/entrar'){ history.push('/registrar')}    
        history.goBack();
    }
    
    render(){
        var title = ''
        if (this.props.title){
            title = this.props.title;
        }
        if (this.props.invert == true){
            return(
            <div style={{height:'34px', backgroundColor:'#ff7000', position:'fixed', top:'0', zIndex:'100'}}>
                <div style={{position:'relative', borderBottom:'1px solid #FF7000', top:'0px', zIndex:'10', display:'flex', width: document.querySelector('.appContainer').clientWidth, backgroundColor:'#FF7000'}}>
                    <div style={{width:'40px', height:'34px', marginLeft:'10px', position:'fixed', backgroundImage:'url(/imgs/backArrow2.png)', backgroundPosition:'center', backgroundRepeat:'no-repeat'}} onClick={()=>{history.goBack();}}></div>
                    <div style={{height:'34px', lineHeight:'34px', width:'100%', textAlign:'center', fontWeight:'bold', color:'white'}}>{title}</div>
                </div>
            </div>);
        }        
        return(
        <div style={{height:'34px', backgroundColor:'white', position:'fixed', top:'0', zIndex:'100'}}>
            <div style={{position:'relative', borderBottom:'1px solid #ccc', top:'0px', zIndex:'10', display:'flex', width: document.querySelector('.appContainer').clientWidth, backgroundColor:'white'}}>
                <div style={{width:'40px', height:'34px', marginLeft:'10px', position:'fixed', backgroundImage:'url(/imgs/backArrow.png)', backgroundPosition:'center', backgroundRepeat:'no-repeat'}} onClick={()=>{history.goBack();}}></div>
                <div style={{height:'34px', lineHeight:'34px', width:'100%', textAlign:'center', fontWeight:'bold', color:'#111'}}>{title}</div>
            </div>
        </div>);
    }

}
export default BackButton