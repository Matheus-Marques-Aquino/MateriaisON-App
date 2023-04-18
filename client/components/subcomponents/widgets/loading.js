import React, { Component } from 'react';

class Loading extends Component{
    render(){
        if (!this.props.waiting){ return (<div className='_loadingBox'></div>)}
        return(<div className='_loadingBox' style={{position:'absolute', left:'0', right:'0', top:'0', bottom:'0', margin:'auto', width:'100px', height:'30px', border:'1px solid black', backgroundColor:'white', textAlign:'center', lineHeight:'30px'}}>
            Carregando...
        </div>)
    }
}
export default Loading;