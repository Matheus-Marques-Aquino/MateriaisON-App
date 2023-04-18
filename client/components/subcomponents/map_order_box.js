import React, { Component } from 'react';
import ReactMeteorData from 'react-meteor-data/lib/ReactMeteorData';

class MapOrderBox extends Component{
    constructor(props){
        super(props);
        this.start = false;
        this.duplicate = -1;
        this.state = { 
            errorCount: 0,
            trackingHistory: []    
        };
    } 
    formatData(data){
        data = data[0];
        data.reverse();
        let formatedHistory = [];
        let duplicate = 0;
        data.map((status, index)=>{
            if (status.status){
                status.status = status.status.replace('Status: ', '');
                if (status.status == 'Objeto entregue ao destinatário'){ this.duplicate = index; }
            }
            if (status.data){
                status.data = status.data.replace('Data  : ', '');
                status.data = status.data.replace('| Hora: ', ' - ');
            }
            if (status.destino){
                if (status.status == 'Objeto saiu para entrega ao destinatário' || status.status == 'Objeto entregue ao destinatário'){
                    status.destino = status.destino.replace('Local: ', '');
                }else{
                    status.destino = status.destino.replace('Destino: ', 'para ');
                }                
                status.destino = status.destino.replace(' - ', ', ');
                status.destino = status.destino.replace(' / ', '/');
            }
            if (status.origem){ 
                if (status.status == 'Objeto saiu para entrega ao destinatário' || status.status == 'Objeto entregue ao destinatário'){
                    status.origem = status.origem.replace('Local: ', '');
                    
                }else{
                    status.origem = status.origem.replace('Origem: ', 'de ');
                }                
                status.origem = status.origem.replace(' - ', ', ');
                status.origem = status.origem.replace(' / ', '/');
            }            
            if (duplicate == 0){ formatedHistory.push(status); }       
        });
        this.setState({trackingHistory: formatedHistory});
    }        
    
    trackingContainer(){
        let data = this.state.trackingHistory;       
        return(
        <div style={{padding:'5px 10px', paddingLeft:'20px', paddingBottom:'15px', fontSize:'12px', color:'#666'}}>{
            data.map((status, index)=>{
                if (this.duplicate != index){
                    let key='Cod_'+index;
                    return(
                    <div key={key}>
                        <div style={{fontWeight:'bold', width:'100%', padding:'2px 0'}}>{status.status}</div>
                        <div style={{width:'100%'}}>{status.destino}</div>
                        <div style={{width:'100%'}}>{status.origem}</div>
                        <div style={{width:'100%', paddingBottom:'4px', borderBottom:'1px solid #FFDBBF'}}>{status.data}</div>
                    </div>)
                }                
            })
        }</div>)                     
    }
    deliveryRegistry(delivery, status, orderId){
        switch(status){
            case 0:
                return(
                <div style={{padding:'15px', paddingTop:'10px', fontSize:'11px'}}>
                    Aguardando a confiramação do pagamento.
                </div>);
            case 1:
                return(
                <div style={{padding:'15px', paddingTop:'10px', fontSize:'11px'}}>
                    Seu pedido está sendo preparado para o envio.
                </div>);            
            case 4:
                return(
                <div style={{padding:'15px', paddingTop:'10px', fontSize:'11px'}}>
                    Seu pedido foi cancelado.
                </div>);
            case 5:
                return(
                <div style={{padding:'15px', paddingTop:'10px', fontSize:'11px'}}>
                    Seu pedido não pode ser enviado.
                </div>);
        }     
        if (delivery.trackingCode == undefined){
            return(<div></div>);
        }
        if (delivery.trackingCode == ''){
            return(<div style={{padding:'15px', paddingTop:'10px', fontSize:'11px'}}>Seu pedido foi enviado, aguarde o vendedor postar o código de rastreamento.</div>)
        }        
    }
    render(){
        const vendor = this.props.vendor;
        const delivery = this.props.delivery;
        const address = this.props.address;
        const status = this.props.status;
        const orderId = parseInt(this.props.orderId);
        var estimate = '';
        var display = 'none'
        
        if (!this.start){
            this.start = true;
            if (delivery.name == 'Correios Sedex:' || delivery.name == 'Correios PAC:'){
                Meteor.call('trackCorreios', Meteor.userId(), orderId, (error, hist)=>{
                    if (!error){
                        this.formatData(hist);  
                    }else{
                        let errorCount = this.state.errorCount += 1;
                        if (errorCount < 4){ 
                            this.setState({ errorCount: erroCount });
                        }else{
                            return(
                            <div style={{padding:'15px', paddingTop:'10px', fontSize:'11px'}}>
                                Ocorreu um erro ao recuperar os dados do servidor, favor verificar sua 
                                conexão com a internet ou tentar novamente mais tarde.
                            </div>);
                        }
                    }
                });
            }
        }

        if (status == 0){
            estimate = 'Aguardando a confiramação do pagamento.';
            display = 'none'
        }
        if (status == 1){
            estimate = 'Seu pedido está sendo preparado para o envio.';
            display = 'none'
        }        
        if (status == 6){
            estimate = 'Ocorreu um problema durante a entrega de seu pedido.'
        }     
        return(
            <div style={{marginBottom:'10px', backgroundColor:'#F7F7F7'}}>
                <div style={{height:'20px', lineHeight:'20px', padding:'5px 10px', fontSize:'15px', fontWeight:'bold', color:'#ff7000', display:'flex'}}>
                    <div style={{width:'10px', height:'10px', margin:'auto 0', backgroundImage:'url(/imgs/icons/icon-rightArrow.png)', backgroundPosition:'center', backgroundRepeat:'no-repeat', backgroundSize:'contain'}}></div>
                    <div style={{marginLeft:'5px'}}>{delivery.name}</div>
                </div>
                {this.deliveryRegistry(delivery, status, orderId)}
                {this.trackingContainer()}                
                {/*<div style={{height:'140px', margin:'10px 20px', marginBottom:'5px', border:'1px solid black', display: display}}></div>
                <div style={{height:'20px', lineHeight:'20px', textAlign:'center', fontSize:'13px', padding:'10px'}}>{estimate}</div>*/}
            </div>)
    }
}
export default MapOrderBox;