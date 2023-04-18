import React, { Component } from 'react';
import ResumeContainer from './widgets/resume_container';

class AddressBox extends Component{
    
    selectHandler(index){
        this.props.select(index)
    }
    removeHandler(index){
        this.props.remove(index)
    }

    render(){               
        const profile = this.props.profile;
        const address = profile.address;
        
        return (<div>{
                address.map((_address, index)=>{ 
                let key = '_Address_'+index; 
                if ( _address != null ){                              
                    return (
                        <ResumeContainer type='address' address={_address} profile={profile} index={index} key={key} select={this.selectHandler.bind(this)} remove={this.removeHandler.bind(this)}/>
                    )
                }
            })
        }</div>)
        
    }
}
export default AddressBox;