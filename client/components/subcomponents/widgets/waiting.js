import React, { Component } from 'react';

class Waiting extends Component{
    constructor(props){
        super(props);
        this.state = {

        }; 
    }
    render(){
        var display = 'none';
        var open = this.props.open;
        var size = this.props.size;
        var border = this.props.border;
        if (!size){
            size = '90px'
        }
        if (!border){
            border = '16px'
        }
        if (open){ display = 'block'; }else{ display = 'none'; }
        return(<div style={{display:display}}>
            <div style={{height:'100%', width: document.querySelector('.appContainer').clientWidth, backgroundColor:'black', position:'fixed', top:'0px', opacity:'0.35'}}></div>
            <div style={{position:'fixed', left:'0', right:'0', top:'0', bottom:'0', margin:'auto', width: size, height: size, border: border+' solid #f3f3f3', borderRadius:'50%', borderTop: border+' solid #ff7000', animation:'spin 2s linear infinite'}}></div>            
        </div>);
    }
}
export default Waiting;