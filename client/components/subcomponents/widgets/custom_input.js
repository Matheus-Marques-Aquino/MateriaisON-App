import React, { Component } from 'react';

class CustomInput extends Component {
    constructor(props){
        super(props);
        this.state = {
            name: this.props.name,
            value: this.props.value
        };        
    }
    componentDidUpdate(){
        if (this.state.value != this.props.value){
            this.setState({ value: this.props.value });
        }
    }
    inputHandler(e){
        let name = e.target.name;
        let value = e.target.value;        
        this.setState({ [name]: value });
        let event = { 
            target: {
                name: name,
                value: value
            }
        };
        this.props.onChange(event);
    } 
    insertUnit(unit){
        if (!unit){ return; }
        return(<div style={{margin:'auto 0', fontSize:'12px'}}>{unit}</div>);
    }
    insertStart(start){
        if (!start){ return; }
        return(<div style={{margin:'auto 0', paddingRight:'3px', fontSize:'15px'}}>{start}</div>);
    }   
    render(){
        let name = this.state.name;
        let value = this.state.value

        let width = this.props.width;
        let height = this.props.height;
        let margin = this.props.margin;
        
        let placeholder = '';
        if (this.props.placeholder){ placeholder = this.props.placeholder};
        let type = 'text';
        if (this.props.type){ type = this.props.type; }
        let unit = false;
        if (this.props.unit){ unit = this.props.unit; }
        let start = false;
        if (this.props.start){ start = this.props.start; }
        let customStyle = {};
        if (this.props.style){ customStyle = this.props.style; }
        let customInputStyle = {};
        if (this.props.inputStyle){ customInputStyle = this.props.inputStyle; }

        let mainStyle = {
            width:width, 
            height:height, 
            margin:margin, 
            padding:'0 10px', 
            lineHeight:'30px', 
            border:'1px solid #ff7000', 
            borderRadius:'3px', 
            backgroundColor:'white', 
            display:'flex'
        };
        let mainInputStyle = {
            width:'100%', 
            height:'100%', 
            border:'0px', 
            padding:'0px'
        };

        let style = Object.assign(mainStyle, customStyle);
        let inputStyle = Object.assign(mainInputStyle, customInputStyle);

        return(
        <div style={style}>
            {this.insertStart(start)}
            <input type={type} style={inputStyle} name={name} value={value} placeholder={placeholder} onChange={this.inputHandler.bind(this)} lang='br'/>
            {this.insertUnit(unit)}
        </div>);
    }
}
export default CustomInput;