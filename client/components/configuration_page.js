import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import history from './subcomponents/widgets/history';
import BottomMenu from './subcomponents/bottom_menu';
import BackButton from './subcomponents/back_button';

class ConfigurationPage extends Component{

    render(){ 
        return(<div className='mainContainer'>
            <BackButton/>            
            <div style={{height:'55px', display:'flex', backgroundColor:'#ff7000'}}>
                <div style={{margin:'auto', color:'white', fontSize:'19px', fontWeight:'bold'}}>Configurações</div>    
            </div> 
            <div style={{margin:'20px 10px', padding:'5px 15px', paddingRight:'40px', backgroundColor:'#F7F7F7', fontSize:'18px', fontWeight:'bold', color:'#8F8D8C'}}>
                <div style={{height:'65px', borderBottom:'1px solid #FFDBBF', display:'flex'}} onClick={()=>{history.push('/menu/perfil')}}>
                    <div style={{width:'56px', height:'56px', margin:'auto 0', border:'1px solid #ff7000', display:'flex'}}>
                        <div style={{width:'40px', height:'40px', margin:'auto', backgroundImage:'url(/imgs/icons/icon-perfil.png)', backgroundPosition:'center', backgroundRepeat:'no-repeat', backgroundSize:'contain'}}></div>
                    </div>
                    <div style={{margin:'auto 0', marginLeft:'20px'}}>Editar Perfil</div>
                </div>
                <div style={{height:'65px', borderBottom:'1px solid #FFDBBF', display:'flex'}} onClick={()=>{history.push('/menu/cobranca')}}>
                    <div style={{width:'56px', height:'56px', margin:'auto 0', border:'1px solid #ff7000', display:'flex'}}>
                        <div style={{width:'40px', height:'40px', margin:'auto', backgroundImage:'url(/imgs/icons/icon-cobranca.png)', backgroundPosition:'center', backgroundRepeat:'no-repeat', backgroundSize:'contain'}}></div>
                    </div>
                    <div style={{margin:'auto 0', marginLeft:'20px'}}>Endereço de Cobrança</div>
                </div>
                <div style={{height:'65px', borderBottom:'1px solid #FFDBBF', display:'flex'}} onClick={()=>{history.push('/menu/cartoes')}}>
                    <div style={{width:'56px', height:'56px', margin:'auto 0', border:'1px solid #ff7000', display:'flex'}}>
                        <div style={{width:'40px', height:'40px', margin:'auto', backgroundImage:'url(/imgs/icons/icon-pagamento.png)', backgroundPosition:'center', backgroundRepeat:'no-repeat', backgroundSize:'contain'}}></div>
                    </div>
                    <div style={{margin:'auto 0', marginLeft:'20px'}}>Formas de Pagamento</div>
                </div>
                <div style={{height:'65px', borderBottom:'1px solid #FFDBBF', display:'flex'}} onClick={()=>{history.push('/menu/ajuda')}}>
                    <div style={{width:'56px', height:'56px', margin:'auto 0', border:'1px solid #ff7000', display:'flex'}}>
                        <div style={{width:'40px', height:'40px', margin:'auto', backgroundImage:'url(/imgs/icons/icon-ajuda.png)', backgroundPosition:'center', backgroundRepeat:'no-repeat', backgroundSize:'contain'}}></div>
                    </div>
                    <div style={{margin:'auto 0', marginLeft:'20px'}}>Ajuda</div>
                </div>
                <div style={{height:'65px', display:'flex'}} onClick={()=>{Meteor.logout((e)=>{if (!e){history.push('/entrar')}else{}})}}>
                    <div style={{width:'56px', height:'56px', margin:'auto 0', border:'1px solid #ff7000', display:'flex'}}>
                        <div style={{width:'40px', height:'40px', margin:'auto', backgroundImage:'url(/imgs/icons/icon-sair.png)', backgroundPosition:'center', backgroundRepeat:'no-repeat', backgroundSize:'contain'}}></div>
                    </div>
                    <div style={{margin:'auto 0', marginLeft:'20px'}}>Sair</div>
                </div>
            </div>
            <BottomMenu/>
        </div>)
    }
}

export default ConfigurationPage