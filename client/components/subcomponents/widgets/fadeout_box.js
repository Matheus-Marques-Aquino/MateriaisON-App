import React, { Component } from 'react';

class FadeOutBox extends Component{
    constructor(props){
        super(props);
        this.timeOut = undefined;
        this.state = { 
            class: '_fadeOutHide',
            display: 'none'
        }        
    }
    showFadeOut(){
        if (this.timeOut){ clearTimeout(this.timeOut); }
        this.setState({ 
            class: '_fadeOutShow',
            display: 'flex'
        });
        this.timeOut = setTimeout(()=>{this.fadeOut()}, 500);
    }
    fadeOut(){
        this.setState({ class: '_fadeOutHide' });        
        this.timeOut = setTimeout(()=>{this.displayOut()}, 1500);
    }
    displayOut(){
        this.setState({ display:'none'})
    } 

    render(){        
        const screenSize = document.querySelector('.appContainer').clientWidth+'px';
        const message = this.props.message;        
        return(<div className={this.state.class} style={{position:'fixed', left:'0', right:'0', top:'34px', margin:'auto', width: screenSize, height:'50px', color:'white', backgroundColor:'#32CD32', textAlign:'center', display:this.state.display, opacity:'1',}}>
            <span style={{margin:'auto'}}>{message}</span>
        </div>)
    }
}
export default FadeOutBox;