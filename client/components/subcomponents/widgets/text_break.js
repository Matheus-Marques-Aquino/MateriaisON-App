import React, { Component } from 'react';

class BreakText extends Component{
    render(){
        const breaks = this.props.text.split(/\r\n|\r|\n/)
        return(<div style={{width:'100%'}}>{
                breaks.map((textBreak, index)=>{
                    let text = textBreak.replace(/&nbsp;/gi, ' ');
                    let key='line_'+index;
                    return(<div style={{width:'100%'}} key={key}>{text}</div>);
                })
            }</div>)
    }
}
export default BreakText;