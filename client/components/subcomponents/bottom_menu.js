import React, { Component } from 'react';
import { createContainer } from 'react-meteor-data';
import { Profile } from '../../../imports/collections/profile';
import history from './widgets/history';

class BottomMenu extends Component{

    render(){          
        /*if (this.props.profile && history.location.pathname != '/destinatarios' && history.location.pathname != '/menu' && history.location.pathname != '/menu/perfil' && history.location.pathname != '/menu/ajuda' && history.location.pathname != '/menu/cobranca' && history.location.pathname != '/menu/cartoes'){
            let profile = this.props.profile.profile;
            if (!profile.address){
                history.push(history.push("/destinatarios"))
            }else{
                if (profile.address.length < 1){
                    history.push(history.push("/destinatarios"))
                }
            }
        }
        if (!Meteor.userId() && history.location.pathname != '/entrar' && history.location.pathname != '/registrar'){ history.push('/entrar'); }
        */
        let googleContainer = document.querySelector('.pac-container');
        if (googleContainer){ googleContainer.parentNode.removeChild(googleContainer); }
        
        var display = 'block';
        /*if (this.props.profile){
            let profile = this.props.profile.profile;
            if (!profile.address){
                display = 'none';
            }else{
                if (profile.address.length < 1){
                    display = 'none';
                }
            }
        }*/
        //marginTop:'60px'
        //let height = document.documentElement.clientHeight - 45 + 'px';
        return(
            <div className='bottomMenu' style={{marginTop:'0px'}}>
                <div style={{display:'flex', height:'45px', width: document.querySelector('.appContainer').clientWidth, backgroundColor:'#ff7000', position:'fixed', bottom:0, zIndex:'100'}}>
                    <div style={{width:'45px', height:'45px', margin:'0 auto', display:'flex'}} onClick={()=>{if (history.location.pathname !='/'){history.push('/')}}}>
                        <div style={{width:'30px', height:'30px', margin:'auto', backgroundSize:'contain', backgroundImage:'url(/imgs/Casa.png)', backgroundRepeat:'no-repeat', backgroundPosition:'center'}}></div>
                    </div>
                    <div style={{width:'45px', height:'45px', margin:'0 auto', display:'flex'}} onClick={()=>{if (history.location.pathname !='/buscar'){history.push('/buscar')}}}>
                        <div style={{width:'30px', height:'30px', margin:'auto', display:display, backgroundSize:'contain', backgroundImage:'url(/imgs/Lupa.png)', backgroundRepeat:'no-repeat', backgroundPosition:'center'}}></div>
                    </div>
                    <div style={{width:'45px', height:'45px', margin:'0 auto', display:'flex'}} onClick={()=>{if (history.location.pathname !='/carrinho'){history.push('/carrinho')}}}>
                        <div style={{width:'30px', height:'30px', margin:'auto', display:display, backgroundSize:'contain', backgroundImage:'url(/imgs/Carrinho.png)', backgroundRepeat:'no-repeat', backgroundPosition:'center'}}></div>
                    </div>
                    <div style={{width:'45px', height:'45px', margin:'0 auto', display:'flex'}} onClick={()=>{if (history.location.pathname !='/pedidos'){history.push('/pedidos')}}}>
                        <div style={{width:'30px', height:'25px', margin:'auto', display:display, backgroundSize:'contain', backgroundImage:'url(/imgs/Pedidos.png)', backgroundRepeat:'no-repeat', backgroundPosition:'center'}}></div>
                    </div>
                    <div style={{width:'45px', height:'45px', margin:'0 auto', display:'flex'}} onClick={()=>{if (history.location.pathname !='/menu'){history.push('/menu')}}}>
                        <div style={{width:'30px', height:'30px', margin:'auto', backgroundSize:'contain', backgroundImage:'url(/imgs/Configuracoes.png)', backgroundRepeat:'no-repeat', backgroundPosition:'center'}}></div>
                    </div>
                </div>                
            </div>
        )
    }
}
export default createContainer(() => {
    var userData = Profile.findOne({_id: Meteor.userId()});
    return{
        profile: userData
    }    
}, BottomMenu);