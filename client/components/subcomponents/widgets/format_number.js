import React, { Component } from 'react';

class FormatNumber extends Component{

    render(){
        var number = Math.round(this.props.number*100)/100;
        number = String(number);
        if (!number){ return(<div></div>); }
        
        if (number.includes('.')){
            number = number.replace('.',',')
        }else{
            number = number+',00'
        }
        if (number.length - number.indexOf(',') == 2){
            number = number+'0'
        }
        return(number);
    }

}
export default FormatNumber;