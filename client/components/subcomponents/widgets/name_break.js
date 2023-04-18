import React, { Component } from 'react';

class NameBreaker extends Component{
    render(){
        var name = this.props.name;
        if (!name) { return(<div style={{}}></div>) }
        var capitalArray = name.split(/(?=[A-Z])/);
        var nameArray = [];
        capitalArray.map(capitals=>{
            let spaceArray = capitals.split(/(\s+)/);
            spaceArray.map(word=>{
                nameArray.push(word)
            });            
        }) 
    return(<div style={{width:'100%', display:'block'}}>{
        nameArray.map((word, index)=>{
            let key = 'Name_'+index 
            return(<span style={{width:'fit-content', whiteSpace:'nowrap', display:'inline-block'}} key={key}>{word}</span>)
        })
    }</div>)
    }
}
export default NameBreaker;