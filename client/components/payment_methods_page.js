import React, { Component } from 'react';
import BackButtom from './subcomponents/back_button';
import Waiting from './subcomponents/widgets/waiting';
import BottomMenu from './subcomponents/bottom_menu';
import { Mask } from './subcomponents/widgets/masks';
import { validate } from 'simple-card';
import MessageBox from './subcomponents/widgets/message_box'
class PaymentMethodsPage extends Component{
    constructor(props){
        super(props)
        this.start = false;
        this.errors = []
        this.state = {
            page: 0,
            loading: true,
            cardArray: [],
            cardPlaceholder: '',
            newCard: {
                numero: '',
                nome: '',
                vencimento: '',
                cvv: '',
                cpfCnpj: '',
                cardError: false,
            },
            removeId: -1,
            editIndex: -1,
            editId: -1,
            removeBox: false
        };
    }
    inputHandler(event){
        let name = event.target.name;
        let value = event.target.value;
        let card = this.state.newCard;
        switch(name){
            case 'nome':
                if (value.length > 0){
                    if (!(/^[A-zÀ-ú/\s]+$/.test(value))){
                        return;
                    }
                }
                break;
            case 'vencimento':
                value = Mask('validate', event.target.value); 
                break;
            case 'cvv':
                if (value.length > 4){ return; }
                break;
            case 'numero':
                value = Mask('creditCard', event.target.value);
                break;
            case 'cpfCnpj':
                value = Mask('cpf/cnpj', event.target.value);
                break;
            default:
                return;
        }
        card[name] = value;
        this.setState({
            newCard: card 
        });    
    }
    validateCard(card){
        if (card.numero == '' || card.cvv == '' || card.vencimento == ''){ 
            this.errors.push('Nem todos os campos foram preenchidos.');
            return false; 
        }                
        let _card = {
            number: card.numero,
            cvn: this.state.newCard.cvv,
            date: card.vencimento
        }
        let cardData = (validate(_card));
        if (!cardData.isValid || cardData.isExpired){
            this.errors.push('O cartão informado não é válido.');
            return false;
        }
        return true;
    }
    getCardFlag(card){
        var cardnumber = card.numero.replace(/[^0-9]+/g, '');
        var cards = {
            Visa      : /^4[0-9]{12}(?:[0-9]{3})/,
            MasterCard : /^5[1-5][0-9]{14}/,
            Diners    : /^3(?:0[0-5]|[68][0-9])[0-9]{11}/,
            Amex      : /^3[47][0-9]{13}/,
            Discover  : /^6(?:011|5[0-9]{2})[0-9]{12}/,
            HiperCard  : /^(606282\d{10}(\d{3})?)|(3841\d{15})/,
            Elo        : /^((((636368)|(438935)|(504175)|(451416)|(636297))\d{0,10})|((5067)|(4576)|(4011))\d{0,12})/
        };        
        for (var flag in cards) {
            if(cards[flag].test(cardnumber)) {
                return flag;
            }
        } 
        return '';
    }
    displayErrors(){
        return(<div style={{padding:'15px 10px'}}>{
            this.errors.map((error,index)=>{
                let key = 'Error_'+index;
                return(<div style={{color:'red', lineHeight:'16px', fontSize:'14px'}} key={key}>{error}</div>)
            })
        }</div>)
    }
    closeBox(){
        this.setState({removeBox: false, removeId: -1})
    }
    confirmRemove(){
        if (this.state.removeId < 0){ 
            this.setState({removeBox: false, removeId: -1});
            return;
        }
        this.setState({loading: true})
        Meteor.call('removeCard', Meteor.userId(), this.state.removeId, (error, result)=>{
            if (!error){
                if (result){
                    this.start = false;
                    this.setState({
                        removeBox: false,
                        removeId: -1
                    });
                }else{
                    this.start = false;
                    this.setState({
                        removeBox: false,
                        removeId: -1
                    });
                }
            }
        });
    }
    editCard(index, id){
        this.setState({
            editIndex: index,
            editId: id,
            cardPlaceholder: '•••• •••• •••• '+this.state.cardArray[index].lastDigits,
            newCard:{
                numero: '',
                cvv: '',
                nome: this.state.cardArray[index].nome,
                vencimento: this.state.cardArray[index].vencimento,
                cpfCnpj: this.state.cardArray[index].cpfCnpj,
                cardError: false,
            },
            page: 2
        })
    }
    cardList(){
        if (this.state.cardArray.length == 0){ return(<div></div>); }
        
        return(<div style={{backgroundColor:'white', marginTop:'35px'}}>{
            this.state.cardArray.map((card, index)=>{
                let key = 'Cartao_'+index;
                let cardImage = 'url(/imgs/icons/icon-simpleCard.png)';
                switch(card.bandeira){
                    case 'MasterCard':
                        cardImage = 'url(/imgs/masterCard65x45.png)';
                        break;
                    case 'Visa':
                        cardImage = 'url(/imgs/visa65x45.png)';
                        break;
                    case 'Elo':
                        cardImage = 'url(/imgs/elo65x45.png)';
                        break;                    
                }
                return(
                <div style={{height:'65px', borderBottom:'1px solid #FFDBBF', margin:'0 15px', display:'flex'}} key={key}>
                    <div style={{width:'fit-content', display:'flex', margin:'0 auto'}}>
                        <div style={{margin:'auto 0'}}>
                            <div style={{height:'35px', width:'45.5px', backgroundImage:cardImage, backgroundPosition:'center', backgroundSize:'contain', backgroundRepeat:'no-repeat'}}></div>
                        </div>                    
                        <div style={{width:'180px', height:'65px', paddingLeft:'15px', display:'flex'}}>
                            <div style={{margin:'auto 0'}}>
                                <div style={{lineHeight:'22px', fontSize:'13px'}}>Cartão de Crédito</div>
                                <div style={{lineHeight:'22px', fontSize:'13px'}}><span style={{marginRight:'8px'}}>{card.bandeira}</span><span style={{marginRight:'5px'}}>••••</span>{card.lastDigits}</div>
                            </div>
                        </div>
                        <div style={{width:'fit-content', height:'30px', margin:'auto', display:'flex'}}>
                            <div style={{width:'25px', height:'25px', margin:'auto 0', backgroundImage:'url(/imgs/lapis1.png)', backgroundPosition:'center', backgroundSize:'contain', backgroundRepeat:'no-repeat'}} onClick={()=>{if (!this.state.removeBox && !this.state.loading){ this.editCard(index, card.id) }}}></div>
                            <div style={{width:'25px', height:'25px', margin:'auto 0', marginLeft:'25px', backgroundImage:'url(/imgs/icons/icon-remover.png)', backgroundPosition:'center', backgroundSize:'contain', backgroundRepeat:'no-repeat'}} onClick={()=>{if (!this.state.removeBox && !this.state.loading){ this.setState({ removeId: card.id, removeBox: true}) }}}></div>
                        </div>
                    </div>                    
                </div>)
            })
        }</div>)
    }
    addCardButton(){
        if (this.state.loading){return(<div></div>)}
        return(
        <div style={{margin:'0 10px', height:'45px', marginTop:'20px', backgroundColor:'#ff7000', display:'flex'}}>
            <div style={{width:'fit-content', display:'flex', margin:'auto'}}>
                <div style={{width:'30px', height:'25px', margin:'auto 0', backgroundImage:'url(/imgs/icons/icon-add.png)', backgroundPosition:'center', backgroundRepeat:'no-repeat', backgroundSize:'contain'}}></div>
                <div style={{margin:'auto 0', paddingLeft:'10px', fontSize:'17px', color:'white'}} onClick={()=>{this.setState({page: 1})}}>Adicionar novo cartão</div>
            </div>               
        </div>)
    }
    addCardForm(){
        return(<div>
            <div style={{padding:'10px 20px'}}>
                <div style={{padding:'0 10px', border:'1px solid #ff7000', borderRadius:'3px'}}>
                    <input id='numero' style={{height:'30px', padding:'0px', width:'100%', lineHeight:'30px', fontSize:'14px', textAlign:'center', border:'0px'}} placeholder='NÚMERO DO CARTÃO' value={this.state.newCard.numero} onChange={this.inputHandler.bind(this)} name='numero' onKeyDown={(e)=>{if (e.key==='Enter'){document.getElementById('vencimento').focus();}}}/>
                </div>
                <div style={{display: 'flex', marginTop:'10px'}}>
                    <div style={{width:'50%', paddingRight:'5px'}}>                        
                        <div style={{padding:'0 10px', border:'1px solid #ff7000', borderRadius:'3px'}}>
                            <input id='vencimento' className='smallInput' style={{height:'30px', padding:'0px', width:'100%', lineHeight:'30px', fontSize:'14px', textAlign:'center', border:'0px'}} placeholder='VENCIMENTO (MM/AA)' value={this.state.newCard.vencimento} onChange={this.inputHandler.bind(this)} name='vencimento' onKeyDown={(e)=>{if (e.key==='Enter'){document.getElementById('cvv').focus();}}}/>
                        </div>
                    </div>
                    <div style={{width:'50%', paddingLeft:'5px'}}>                        
                        <div style={{padding:'0 10px', border:'1px solid #ff7000', borderRadius:'3px'}}>
                            <input id='cvv' className='smallInput' style={{height:'30px', padding:'0px', width:'100%', lineHeight:'30px', fontSize:'14px', textAlign:'center', border:'0px'}} placeholder='CVV' value={this.state.newCard.cvv} onChange={this.inputHandler.bind(this)} name='cvv' onKeyDown={(e)=>{if (e.key==='Enter'){document.getElementById('nome').focus();}}}/>
                        </div>
                    </div>
                </div>
                <div style={{marginTop:'10px'}}>                    
                    <div style={{padding:'0 10px', border:'1px solid #ff7000', borderRadius:'3px'}}>
                        <input id='nome' style={{height:'30px', padding:'0px', width:'100%', lineHeight:'30px', fontSize:'14px', textAlign:'center', border:'0px'}} placeholder='NOME COMO ESTÁ NO CARTÃO' value={this.state.newCard.nome} onChange={this.inputHandler.bind(this)} name='nome' onKeyDown={(e)=>{if (e.key==='Enter'){document.getElementById('cpf').focus();}}}/>
                    </div>
                </div>
                <div style={{marginTop:'10px'}}>                    
                    <div style={{padding:'0 10px', border:'1px solid #ff7000', borderRadius:'3px'}}>
                        <input id='cpf' style={{height:'30px', padding:'0px', width:'100%', lineHeight:'30px', fontSize:'14px', textAlign:'center', border:'0px'}} placeholder='CPF/CNPJ' value={this.state.newCard.cpfCnpj} onChange={this.inputHandler.bind(this)} name='cpfCnpj' onKeyDown={(e)=>{if (e.key==='Enter'){this.saveCreditCard(this.state.newCard, -1);}}}/>
                    </div>
                </div> 
                {this.displayErrors()}
                <div style={{width:'100%', display:'flex', marginTop:'0px'}}>
                <div style={{margin:'10px auto', width:'120px', padding:'8px 0', border:'2px solid #3395F5', borderRadius:'25px', textAlign:'center', fontSize:'15px', color:'white', backgroundColor:'#3395F5'}} onClick={()=>{if (!this.state.loading){this.start = false; this.setState({ page: 0, loading: true })}}}>VOLTAR</div>
                <div style={{margin:'10px auto', width:'120px', padding:'8px 0', border:'2px solid #3395F5', borderRadius:'25px', textAlign:'center', fontSize:'15px', color:'white', backgroundColor:'#3395F5'}} onClick={()=>{this.saveCreditCard(this.state.newCard, -1)}}>SALVAR</div>
                </div>
            </div>
        </div>)
    }
    editCardForm(){
        return(<div>
            <div style={{padding:'10px 20px'}}>                
                <div style={{padding:'0 10px', border:'1px solid #ff7000', borderRadius:'3px', backgroundColor:'white'}}>
                    <input id='numero_' style={{height:'30px', padding:'0px', width:'100%', lineHeight:'30px', fontSize:'14px', textAlign:'center', border:'0px'}} placeholder={this.state.cardPlaceholder} value={this.state.newCard.numero} onChange={this.inputHandler.bind(this)} name='numero' onKeyDown={(e)=>{if (e.key==='Enter'){document.getElementById('vencimento_').focus();}}}/>
                </div>
                <div style={{display: 'flex', marginTop:'10px'}}>
                    <div style={{width:'50%', paddingRight:'5px'}}>                        
                        <div style={{padding:'0 10px', border:'1px solid #ff7000', borderRadius:'3px', backgroundColor:'white'}}>
                            <input id='vencimento_' className='smallInput' style={{height:'30px', padding:'0px', width:'100%', lineHeight:'30px', fontSize:'14px', textAlign:'center', border:'0px'}} placeholder='VENCIMENTO (MM/AA)' value={this.state.newCard.vencimento} onChange={this.inputHandler.bind(this)} name='vencimento' onKeyDown={(e)=>{if (e.key==='Enter'){document.getElementById('cvv_').focus();}}}/>
                        </div>
                    </div>
                    <div style={{width:'50%', paddingLeft:'5px'}}>                        
                        <div style={{padding:'0 10px', border:'1px solid #ff7000', borderRadius:'3px', backgroundColor:'white'}}>
                            <input id='cvv_' className='smallInput' style={{height:'30px', padding:'0px', width:'100%', lineHeight:'30px', fontSize:'14px', textAlign:'center', border:'0px'}} placeholder='CVV' value={this.state.newCard.cvv} onChange={this.inputHandler.bind(this)} name='cvv' onKeyDown={(e)=>{if (e.key==='Enter'){document.getElementById('nome_').focus();}}}/>
                        </div>
                    </div>
                </div>
                <div style={{marginTop:'10px'}}>                    
                    <div style={{padding:'0 10px', border:'1px solid #ff7000', borderRadius:'3px', backgroundColor:'white'}}>
                        <input id='nome_' style={{height:'30px', width:'100%', padding:'0px', lineHeight:'30px', fontSize:'14px', textAlign:'center', border:'0px'}} placeholder='NOME COMO ESTÁ NO CARTÃO' value={this.state.newCard.nome} onChange={this.inputHandler.bind(this)} name='nome' onKeyDown={(e)=>{if (e.key==='Enter'){document.getElementById('cpf_').focus();}}}/>
                    </div>
                </div>
                <div style={{marginTop:'10px'}}>                    
                    <div style={{padding:'0 10px', border:'1px solid #ff7000', borderRadius:'3px', backgroundColor:'white'}}>
                        <input id='cpf_' style={{height:'30px', width:'100%', padding:'0px', lineHeight:'30px', fontSize:'14px', textAlign:'center', border:'0px'}} placeholder='CPF/CNPJ' value={this.state.newCard.cpfCnpj} onChange={this.inputHandler.bind(this)} name='cpfCnpj' onKeyDown={(e)=>{if (e.key==='Enter'){this.saveCreditCard(this.state.newCard, this.state.editId);}}}/>
                    </div>
                </div> 
                {this.displayErrors()}
                <div style={{width:'100%', display:'flex', marginTop:'0px'}}>
                <div style={{margin:'10px auto', width:'120px', padding:'8px 0', border:'2px solid #3395F5', borderRadius:'25px', textAlign:'center', fontSize:'15px', color:'white', backgroundColor:'#3395F5'}} onClick={()=>{if (!this.state.loading){this.start = false; this.setState({ page: 0, loading: true })}}}>VOLTAR</div>
                <div style={{margin:'10px auto', width:'120px', padding:'8px 0', border:'2px solid #3395F5', borderRadius:'25px', textAlign:'center', fontSize:'15px', color:'white', backgroundColor:'#3395F5'}} onClick={()=>{this.saveCreditCard(this.state.newCard, this.state.editId)}}>SALVAR</div>
                </div>
            </div>
        </div>)
    }
    customBackButton(page, title){
        let goBackPage = 0;
        let canGoBack = false;
        if (page == 1){
            goBackPage = 0;
            if (!this.state.loading){
                canGoBack = true;
            }
        }
        if (page == 2){
            goBackPage = 0;
            if (!this.state.loading){
                canGoBack = true;
            }
        }
        return(
        <div style={{height:'34px', backgroundColor:'white'}}>
            <div style={{backgroundColor:'white', position:'fixed', borderBottom:'1px solid #ccc', top:'0px', zIndex:'10', display:'flex', width: document.querySelector('.appContainer').clientWidth}}>
                <div style={{width:'40px', height:'34px', marginLeft:'10px', position:'fixed', backgroundImage:'url(/imgs/backArrow.png)', backgroundPosition:'center', backgroundRepeat:'no-repeat', backgroundColor:'white'}} onClick={()=>{ if (canGoBack){ this.setState({page: goBackPage}) } }}></div>
                <div style={{height:'34px', lineHeight:'34px', width:'100%', textAlign:'center', fontWeight:'bold', color:'#111', backgroundColor:'white'}}>{title}</div>
            </div>
        </div>)
    }
    saveCreditCard(newCard, id){
        this.errors = []
        this.setState({loading: true})
        let card = {
            nome: newCard.nome,
            numero: newCard.numero,
            vencimento: newCard.vencimento,
            cpfCnpj: newCard.cpfCnpj
        };
        card.bandeira = this.getCardFlag(card)
        let valid = this.validateCard(card);
        if (!valid){ 
            this.setState({ loading: false });
            return;
        }
        if (!(/^\d{2}.\d{3}.\d{3}\/\d{4}\-\d{2}$/.test(card.cpfCnpj))){
            if (!(/^\d{3}.\d{3}.\d{3}\-\d{2}$/.test(card.cpfCnpj))){
                this.errors.push('O CPF/CNPJ informado não é válido');
                this.setState({ loading: false });
                return;
            }
        }
        if (this.state.page == 1){
            Meteor.call('saveCard', Meteor.userId(), card, (error, result)=>{
                if (!error){
                    this.start = false
                    this.setState({ 
                        page: 0 
                    });
                }
            });
        }
        if (this.state.page == 2){
            Meteor.call('editCard', Meteor.userId(), id,  card, (error, result)=>{
                if (!error){
                    this.start = false
                    this.setState({ 
                        page: 0 
                    });
                }
            });
        }
                
    }    
    render(){
        if (!this.start){
            this.start = true
            Meteor.call('getCard', Meteor.userId(), (error, result)=>{
                if (!error){
                    this.setState({
                        page: 0,
                        loading: false,
                        cardArray: result,
                        newCard: {
                            numero: '',
                            nome: '',
                            vencimento: '',
                            cvv: '',
                            cpfCnpj: '',
                            cardError: false
                        }
                    })
                }
            });
        }
        if (this.state.page == 0){
            return(<div className='mainContainer'>
                <BackButtom/>
                <div style={{height:'55px', display:'flex', backgroundColor:'#ff7000'}}>
                    <div style={{margin:'auto', color:'white', fontSize:'19px', fontWeight:'bold', }}>Formas de Pagamento</div>    
                </div>
                {this.cardList()}
                {this.addCardButton()}
                <MessageBox open={this.state.removeBox} confirm={()=>{this.confirmRemove()}} cancel={()=>{this.closeBox()}} message='Tem certeza que deseja remover esta forma de pagamento?' options={['Remover', 'Cancelar']}/>
                <Waiting open={this.state.loading} size='60px'/>
                <BottomMenu/>
            </div>)
        }
        if (this.state.page == 1){
            return(<div className='mainContainer'>
                {this.customBackButton(this.state.page, '')}
                <div style={{height:'55px', display:'flex', backgroundColor:'#ff7000'}}>
                    <div style={{margin:'auto', color:'white', fontSize:'19px', fontWeight:'bold', }}>Formas de Pagamento</div>    
                </div>
                <div style={{height:'40px', marginTop:'35px', display:'flex'}}>
                    <div style={{fontSize:'16px', fontWeight:'bold', margin:'auto'}}>Adicionar novo cartão</div>
                </div>
                {this.addCardForm()}
                <Waiting open={this.state.loading} size='60px'/>
                <BottomMenu/>
            </div>)
        }
        if (this.state.page == 2){
            if (this.state.editIndex < 0){
                this.start = false;
                this.setState({page: 0, loading: true});
            }
            return(<div className='mainContainer'>
                {this.customBackButton(this.state.page, '')}
                <div style={{height:'55px', display:'flex', backgroundColor:'#ff7000'}}>
                    <div style={{margin:'auto', color:'white', fontSize:'19px', fontWeight:'bold', }}>Formas de Pagamento</div>    
                </div>
                <div style={{height:'40px', marginTop:'35px', display:'flex'}}>
                    <div style={{fontSize:'16px', fontWeight:'bold', margin:'auto'}}>Editar informações</div>
                </div>
                {this.editCardForm()}
                <Waiting open={this.state.loading} size='60px'/>
                <BottomMenu/>
            </div>)
        }
    }
}
export default PaymentMethodsPage;