import React, { Component } from 'react';
import { createContainer } from 'react-meteor-data';
import { Meteor } from 'meteor/meteor'
import history from './subcomponents/widgets/history';
import BottomMenu from './subcomponents/bottom_menu';
import BackButton from './subcomponents/back_button';
import { Profile } from '../../imports/collections/profile';
import { Mask } from './subcomponents/widgets/masks';
import Waiting from './subcomponents/widgets/waiting';
import moment from 'moment';

class ProfilePage extends Component{
    constructor(props){
        super(props)
        this.start = false;
        this.error = '';
        this.success = '';
        this.state = {
            name: '',
            cpfCnpj: '',
            birthday: '',
            phone: '',
            email: '',
            loading: true
        }        
    } 
    inputHandler(event){
        let name = event.target.name;
        switch(name){
            case 'cpfCnpj':
                this.setState({ cpfCnpj: Mask('cpf/cnpj', event.target.value) });
                break;
            case 'birthday':
                this.setState({ birthday: Mask('birthday', event.target.value )});
                break;
            case 'phone':
                this.setState({ phone: Mask('phone', event.target.value )});
                break;
        }
    }

    subimitProfile(profile){
        this.error = '';
        this.success = '';
        if (this.state.loading){ return; }
        this.setState({loading: true})
        let cpfCnpj = this.state.cpfCnpj;
        let birthday = this.state.birthday;
        let phone = this.state.phone;
        let name = this.state.name;
        if (phone == ''){
            this.error = 'O número de celular é um campo obrigatório.';
            this.setState({ loading: false });
            return;
        }
        if (name == ''){
            this.error = 'O nome é um campo obrigatório.';
            this.setState({ loading: false });
            return;
        }       
        if (name.length < 3){
            this.error = 'Seu nome de haver ao menos 3 caracteres.';
            this.setState({ loading: false });
            return;            
        }
        if (!(/^(\([0-9]{2}\)([0-9]{5}|[0-9]{4}))\-[0-9]{4}/.test(phone))){
            this.error = 'O número de celular informado não é válido.';
            this.setState({ loading: false });
            return;
        }        
        if (cpfCnpj.length > 0){
            if (!(/^\d{2}.\d{3}.\d{3}\/\d{4}\-\d{2}$/.test(cpfCnpj))){            
                if (!(/^\d{3}.\d{3}.\d{3}\-\d{2}$/.test(cpfCnpj))){                
                    this.error = 'O CPF/CNPJ informado não é válido.';
                    this.setState({ loading: false });
                    return;
                }
            }
        }        
        if (birthday.length > 0){
            if (!(/^[0-9]{2}\/[0-9]{2}\/[0-9]{4}/.test(birthday))){
                this.error = 'A data de nascimento informada não esta em um formato válido(DD/MM/AAAA).';
                this.setState({ loading: false });
                return;
            }  
            if (!moment(birthday, 'DD/MM/YYYY',true).isValid()){
                this.error = 'A data de nascimento informada não esta em um formato válido (Dia/Mês/Ano).';
                this.setState({ loading: false });
                return;
            }
        }
        if (!(/^[A-zÀ-ú/\s]+$/.test(name))){
            this.error = 'Seu nome não pode conter caracteres especiais.';
            this.setState({ loading: false });
            return;
        }
        Meteor.call('profile.update', profile, (error, result)=>{
            if (!error){
                this.success = 'Perfil atualizado com sucesso!';
            }else{
                if (error.reason){ this.error = error.reason; }else{ this.error = 'Erro desconhecido, tente novamente mais tarde.'; }                
            }
            this.setState({ loading: false });
        })
    }

    displayError(){        
        if (this.success == ''){
            return(<div style={{color:'red', fontSize:'14px', padding:'15px 0'}}>{this.error}</div>);
        }else{
            return(<div></div>);
        }        
    }
    displaySuccess(){
        if (this.success != ''){
            return(<div style={{color:'#32CD32', fontSize:'14px', padding:'15px 0', textAlign:'center'}}>{this.success}</div>);
        }else{
            return(<div></div>);
        }        
    }

    render(){
        if (!this.start){
            this.start = true;
            Meteor.subscribe('profileFields', 'ProfilePage', Meteor.userId(), ()=>{
                let profile = Profile.findOne({'_id': Meteor.userId});                     
                this.setState({
                    name: profile.profile.name == undefined ? '' : profile.profile.name,
                    cpfCnpj: profile.profile.cpfCnpj == undefined ? '' : profile.profile.cpfCnpj,
                    birthday: profile.profile.birthday == undefined ? '' : profile.profile.birthday,
                    phone: profile.profile.phone == undefined ? '' : profile.profile.phone,
                    email: profile.username == undefined ? '' : profile.username,
                    loading: false
                });
            });    
        }
        return(<div className='mainContainer'>
            <BackButton/>       
            <div style={{height:'55px', display:'flex', backgroundColor:'#ff7000'}}>
                <div style={{margin:'auto', color:'white', fontSize:'19px', fontWeight:'bold'}}>Perfil</div>    
            </div>
            <div style={{height:'100px', fontSize:'16px', fontWeight:'bold', display:'flex'}}>
                <div style={{margin:'auto'}}>Editar informações</div>
            </div> 
            <div style={{margin:'0 20px'}}>
                <div style={{border:'1px solid #ff7000', borderRadius:'3px'}}>
                    <input id='nome' style={{height:'30px', width:'100%', lineHeight:'30px', fontSize:'14px', textAlign:'center', border:'0px', backgroundColor:'transparent'}} value={this.state.name} onChange={this.inputHandler.bind(this)} placeholder='NOME COMPLETO' name='name' onKeyDown={(e)=>{if (e.key==='Enter'){document.getElementById('email').focus();}}}/>
                </div>
                <div style={{marginTop:'10px', border:'1px solid #ff7000', borderRadius:'3px'}}>
                    <input id='email' style={{height:'30px', width:'100%', lineHeight:'30px', fontSize:'14px', textAlign:'center', border:'0px', backgroundColor:'transparent'}} value={this.state.email} onChange={this.inputHandler.bind(this)} placeholder='E-MAIL' name='email' onKeyDown={(e)=>{if (e.key==='Enter'){document.getElementById('celular').focus();}}}/>
                </div> 
                <div style={{marginTop:'10px', display:'flex'}}>
                    <div style={{width:'50%', paddingRight:'5px'}}>
                        <div style={{border:'1px solid #ff7000', borderRadius:'3px'}}>
                            <input className='smallInput' id='celular' style={{height:'30px', width:'100%', lineHeight:'30px', fontSize:'14px', textAlign:'center', border:'0px', backgroundColor:'transparent'}} value={this.state.phone} onChange={this.inputHandler.bind(this)} placeholder='CELULAR' name='phone' onKeyDown={(e)=>{if (e.key==='Enter'){document.getElementById('nascimento').focus();}}}/>
                        </div>
                    </div>
                    <div style={{width:'50%', paddingLeft:'5px'}}>
                        <div style={{border:'1px solid #ff7000', borderRadius:'3px'}}>
                            <input className='smallInput' id='nascimento' style={{height:'30px', width:'100%', lineHeight:'30px', fontSize:'14px', textAlign:'center', border:'0px', backgroundColor:'transparent'}} value={this.state.birthday} onChange={this.inputHandler.bind(this)} placeholder='DATA DE NASCIMENTO' name='birthday' onKeyDown={(e)=>{if (e.key==='Enter'){document.getElementById('cpfCnpj').focus();}}}/>
                        </div>
                    </div>
                </div>
                <div style={{marginTop:'10px', border:'1px solid #ff7000', borderRadius:'3px'}}>
                    <input id='cpfCnpj' style={{height:'30px', width:'100%', lineHeight:'30px', fontSize:'14px', textAlign:'center', border:'0px', backgroundColor:'transparent'}} value={this.state.cpfCnpj} onChange={this.inputHandler.bind(this)} placeholder='CPF/CNPJ' name='cpfCnpj' onKeyDown={(e)=>{if (e.key==='Enter'){this.subimitProfile(this.state)}}}/>
                </div>
                <div style={{marginTop:'30px'}}>
                    {this.displayError()}
                    {this.displaySuccess()}
                </div>
                <div style={{marginTop:'30px', marginBottom:'20px'}}>
                    <div style={{width:'fit-content', padding:'14px 45px', margin:'0 auto', borderRadius:'25px', color:'white', backgroundColor:'#3395F5', fontSize:'17px'}} onClick={()=>{this.subimitProfile(this.state)}}>SALVAR</div>
                </div>   
            </div>  
            <Waiting open={this.state.loading} size='60px'/>
            <BottomMenu/>
        </div>)
    }
}
export default ProfilePage;