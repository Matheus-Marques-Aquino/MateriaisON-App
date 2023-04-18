import React, { Component } from "react"


class AddToCartBox extends Component{
    constructor(props){
        super(props);
        this.state={
            display: 'none',
            quantity: 1
        }
    }
    openBox(qtd){
        this.setState({
            display:'block',
            quantity: qtd
        });
        setTimeout(()=>{this.close()}, 2500);
    }
    close(){ 
        if (this.state.display != 'none'){
            this.setState({
                display: 'none',
                qtd: 1
            });
        }            
    }
    render(){
        if (this.props.images.length == 0){
            var image = 'https://via.placeholder.com/150';
        }else{            
            var image = 'url('+this.props.images[0].src+')';
        }
         
        var width = document.querySelector('.appContainer').clientWidth;
        var firstLine = '';
        var secondLine = '';
        if (this.state.quantity == 1){
            firstLine = 'Foi adicionada 1 unidade';
            secondLine = 'ao Carrinho';
        }else{
            firstLine = 'Foram adicionadas '+this.state.quantity;
            secondLine = 'unidades ao Carrinho';
        }

        return(<div style={{display: this.state.display}}>        
            <div style={{minHeight:'100%', width: width, backgroundColor:'black', position:'fixed', top:'0px', opacity:'0.35'}} onClick={(e)=>{this.close(); e.stopPropagation();}}></div>
            <div style={{width: width, borderTop:'1px solid #ccc', backgroundColor:'white', position:'fixed', bottom:'45px', borderTopLeftRadius:'5%', borderTopRightRadius:'5%'}}>
                <div style={{width:'65px', margin:'15px auto', height:'65px', boxShadow:'rgba(0, 0, 0, 0.1) 0px 0px 15px', backgroundImage: image, border:'1px solid #ccc', borderRadius:'5%', backgroundSize:'contain', backgroundRepeat:'no-repeat', backgroundPosition: 'center', backgroundColor:'white'}}></div>
                <div style={{width:'100%', textAlign:'center', fontSize:'16px', fontWeight:'bold', paddingBottom:'10px', color:'#333'}}>{firstLine}</div>
                <div style={{width:'100%', textAlign:'center', fontSize:'16px', fontWeight:'bold', paddingBottom:'30px', color:'#333'}}>{secondLine}</div>                    
            </div>
        </div>)
    }
}
export default AddToCartBox;
