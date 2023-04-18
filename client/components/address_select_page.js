import React, { Component } from 'react';
import { createContainer } from 'react-meteor-data';
import { Profile } from '../../imports/collections/profile';
import BottomMenu from './subcomponents/bottom_menu';
import BackButton from './subcomponents/back_button';
import history from './subcomponents/widgets/history';
import AddressBox from './subcomponents/address_box';
import MessageBox from './subcomponents/widgets/message_box';

class AddressSelectPage extends Component{
    constructor(props){
        super(props);
        this.null = false
        this.heading = '';
        this.state = {
            waiting: false,
            removeData: null,
            removeIndex: null,
            messageBox: false,
            error: {}
        };
    }  

    newAccount(){
        Meteor.call('profile.create.address')        
    }    
    destinationCreate(){
        history.push('/destinatarios/novo');
    }
    selectHandler(index){
        if (this.state.waiting == false){
            this.setState({
                waiting: true
            });            
            Meteor.call('profile.select.address', index, (error)=>{
                if (!error){
                    this.setState({
                        waiting: false
                    });
                }else{
                    this.setState({
                        waiting: false,
                        error: error
                    });
                }
            })
        }        
    }
    removeHandler(index){
        let profile = this.props.profile.profile;
        let data = profile.address[index];
        let mainAddress = profile.mainAddress;  
        let box = document.querySelector('._messageBox');      
        if (this.state.waiting == false && mainAddress != index && box){
            this.setState({
                waiting: true,
                removeData: data,
                removeIndex: index,
                messageBox: true                
            });            

            /*Meteor.call('profile.remove.address', data, index, (error)=>{
                if (!error){
                    this.setState({
                        waiting: false
                    });
                }else{
                    this.setState({
                        waiting: false,
                        error: error
                    });
                }
            })*/
        }
    }    
    confirmRemove(){
        if (this.state.removeData !=null && this.state.removeIndex != null && 
            this.state.waiting == true && this.state.messageBox == true){     
            Meteor.call('profile.remove.address', this.state.removeData, this.state.removeIndex, (error)=>{
                if (!error){
                    this.setState({
                        waiting: false,
                        removeData: null,
                        removeIndex: null,
                        messageBox: false
                    });
                }else{
                    this.setState({
                        waiting: false,
                        removeData: null,
                        removeIndex: null,
                        messageBox: false,
                        error: error
                    });
                }
            })
        }else{
            this.setState({
                waiting: false,
                removeData: null,
                removeIndex: null,
                messageBox: false
            });
        }
    }
    cancelRemove(){
        this.setState({
            waiting: false,
            removeData: null,
            removeIndex: null,
            messageBox: false
        });
    }


    nullAddress(){
        if (this.null == true){
            Meteor.call('profile.remove.nullAddress', (error)=>{
                if (!error){
                    this.null = false                    
                }else{
                    this.null = false
                }
            })    
        }
    }

    render(){
        if (!this.props.profile){return(<div></div>)}
        const profile = this.props.profile.profile;
        var mainAddress = 0;
        
        if (!profile.address){
            this.newAccount();
            this.heading = 'Precisamos de um endereço para iniciar sua conta!';                      
        }else{               
            if (profile.address.length < 1){
                this.heading = 'Precisamos de ao menos um destinatario';                    
            }else{
                if ( this.heading == ''){
                    this.heading = 'Selecione um destinatario';                                  
                }
            }
            if (profile.address.includes(null)){
                this.null = true
                this.nullAddress();                
            }            
            if (profile.mainProfile){
                mainAddress = profile.mainProfile;
            }
        }        

        return(<div className='mainContainer'>
            <BackButton title='Destinatarios'/>            
            <div style={{height:'50px', marginTop:'5px', display:'flex', textAlign:'center'}}>
                <div style={{margin:'auto', fontSize:'17px', fontWeight:'bold', color:'#ff7000'}}>{this.heading}</div>
            </div>
            <div style={{margin:'0 10px', marginTop:'15px', paddingBottom:'10px', backgroundColor:'#F7F7F7', fontSize:'13px', color:'#444'}}>
                <AddressBox profile={profile} select={this.selectHandler.bind(this)} remove={this.removeHandler.bind(this)}/>
            </div>            
            <div style={{margin:'0 10px', height:'45px', marginTop:'20px', backgroundColor:'#ff7000', display:'flex'}}>
                <div style={{width:'fit-content', display:'flex', margin:'auto'}}>
                    <div style={{width:'30px', height:'25px', margin:'auto 0', backgroundImage:'url(/imgs/icons/icon-add.png)', backgroundPosition:'center', backgroundRepeat:'no-repeat', backgroundSize:'contain'}}></div>
                    <div style={{margin:'auto 0', paddingLeft:'10px', fontSize:'17px', color:'white'}} onClick={()=>{this.destinationCreate()}}>Adicionar um novo destinatário</div>
                </div>               
            </div>
            <MessageBox open={this.state.messageBox} confirm={()=>{this.confirmRemove()}} cancel={()=>{this.cancelRemove()}} message='Tem certeza que deseja excluir este destinatário da sua lista?' options={['Excluir', 'Cancelar']}/>
            <BottomMenu/>
        </div>)
    }
}

export default createContainer(() => { 
    Meteor.subscribe('profile');
    var userData = Profile.findOne({_id: Meteor.userId()})
    if (!userData){
        return{};
    }    
    return{
        profile: userData
    }
}, AddressSelectPage)