import React, { Contairner, Component} from 'react';
import FormatNumber from './format_number';
import history from './history';
import NameBreaker from './name_break';
import FormatDate from './format_date';
import SubProductsContainer from './sub_products_container';
import { Orders } from '../../../../imports/collections/orders';

class ResumeContainer extends Component{
    constructor(props){
        super(props)
        this.waiting = false;
    }

    orderClickProducts(){
        this.refs.subProducts.openDisplay();
    }

    render(){
        const type = this.props.type;
        const data = this.props.data;
        const screenSize = document.querySelector('.appContainer').clientWidth;        
        var hContainer = 70;
        var wContainer = screenSize / 2 - 10; 
        var image = '';
        
        if (type == 'product'){
            
            if (!data){ return; }
            if (!data.img_url){ image = ''; }else{ image = 'url('+data.img_url[0].src+')';}

            return(
            <div style={{height: hContainer, width: wContainer, display:'flex', border:'1px solid #ccc'}} onClick={()=>{
                    history.push('/produto/' + data.id_vendor + '/' + data.id); 
                }} >
                <div style={{height: hContainer, width: hContainer, backgroundImage: image, backgroundSize:'contain', backgroundRepeat:'no-repeat', backgroundPosition: 'center', backgroundColor:'white'}}></div>
                <div style={{
                    height: hContainer+'px', 
                    width: wContainer-hContainer+'px', 
                    backgroundColor:'white',                                        
                    fontSize: '11px',
                    position: 'relative',
                    paddingLeft: '5px'                                                                                                                                                           
                }}>
                    <div style={{paddingTop:'8px', lineHeight: '11px', wordBreak:'nomal', lineClamp:'3', overflow:'hidden', textOverflow:'ellipsis', maxHeight:'33px'}}>
                        {data.name}                        
                    </div>
                    <div style={{position:'absolute', bottom:'6px', fontSize:'12px', lineHeight: '12px', wordBreak:'nomal', width:'100%', textAlign:'center'}}>
                        R${<FormatNumber number={data.price}/>}
                    </div>
                </div>            
            </div>)
        } 

        if (type == 'productLine'){

            if (!data){ return; }
            if (!data.img_url){ image = ''; }else{ image = 'url('+data.img_url[0].src+')';}
            var color = '#FF1414';//'#ff4d4d';
            var maxWidth = screenSize - 116+'px';
            var maxHeight = '28px';
            var vendorDisplay = 'block';
            var clamp = '2';
            var vendorColor = '#ff7000';
            var price = parseFloat(data.price).toFixed(2).split('.');
            var opacity = '1';   
            var esgotado = 'none';
            if (data.vendorPage){
                maxHeight = '42px';
                vendorDisplay = 'none';
                clamp = '3';
            }
            if (data.canCart){
                color = '#3BCD38';//'#79b530';
            }            
            if (data.vendorColor){
                vendorColor = data.vendorColor;
            }
            if (!data.stock_quantity > 0){
                opacity = '0.25';
                color = '#FF1414';
                esgotado = 'block';
            }
            return(
                <div style={{height:'70px', margin:'0 10px', marginBottom:'5px', display:'flex', backgroundColor:'#fbfbfb', borderTopRightRadius:'5px', borderBottomRightRadius:'5px'}}onClick={()=>{
                    history.push('/produto/' + data.id_vendor + '/' + data.id); 
                }}>                    
                    <div style={{width:'100%', border:'1px solid #f2f2f2', borderLeft:'0px', display:'flex', borderTopRightRadius:'5px', borderBottomRightRadius:'5px', position:'relative'}}>
                    <div style={{width:'22px', height:'22px', position:'absolute', top:'0px', right:'0px', borderRadius:'5px', backgroundColor:color, backgroundImage:'url(/imgs/enabled.png)', backgroundPosition:'center', backgroundRepeat:'no-repeat', backgroundSize:'contain'}}></div>
                        <div style={{minWidth:'68px', height:'68px', borderRight:'1px solid #f2f2f2', borderLeft:'1px solid #f2f2f2', backgroundImage: image, backgroundSize:'contain', backgroundRepeat:'no-repeat', backgroundPosition: 'center', backgroundColor:'white', opacity:opacity}}></div>
                        <div style={{marginLeft:'10px', fontSize:'12px', padding:'5px 0', lineHeight:'14px', position:'relative'}}>
                            <div style={{width:maxWidth, height:maxHeight, maxHeight:maxHeight, textOverflow:'ellipsis', overflow:'hidden', display:'-webkit-box', WebkitLineClamp:clamp, WebkitBoxOrient:'vertical'}}>{data.name}</div>
                            <div style={{width:maxWidth, height:'14px', maxHeight:'14px', marginTop:'5px', display:vendorDisplay, fontSize:'10px', whiteSpace:'nowrap', textOverflow:'ellipsis', overflow:'hidden'}}>Vendedor: <span style={{fontWeight:'bold', fontSize:'11px', color:vendorColor}}>{data.vendorName}</span></div>
                            <div style={{position:'absolute', bottom:'3px', right:'5px', fontSize:'13px'}}>
                                <div style={{position:'relative', display:'flex'}}>
                                    <div>R$ {price[0]},</div>
                                    <div style={{fontSize:'9px', position:'relative', top:'-1px'}}>{price[1]}</div>
                                </div>
                            </div>
                        </div>
                        <div style={{width:'fit-content',height:'fit-content', position:'absolute', top:'2px', left:'3px', padding:'3px 4px', borderRadius:'5px', backgroundColor:'#d8d8d8', opacity:'0.7', fontSize:'9px', display:esgotado}}>Esgotado</div>                        
                    </div>
                                        
                </div>
            )
        }

        if (type == 'productVertical'){

            if (!data){ return; }
            if (!data.img_url){ image = ''; }else{ image = 'url('+data.img_url[0].src+')';}

            var maxWidth = ((screenSize - 30) / 3) + 'px';
            var containerHeight = '185px';
            var maxHeight = '42px';
            var clamp = 3;
            var vendorDisplay = '-webkit-box'
            var color = '#ff7000';
            var price = parseFloat(data.price).toFixed(2).split('.');
            if (this.props.page){
                vendorDisplay = 'none';
                containerHeight = '170px';
            }
            return(
            <div style={{height:containerHeight, width:maxWidth, backgroundColor:'#fbfbfb', border:'1px solid #f2f2f2', borderRadius:'3px'}}onClick={()=>{
                history.push('/produto/' + data.id_vendor + '/' + data.id); 
            }}>
                <div style={{width:maxWidth, height:'90px', backgroundColor:'white'}}>
                    <div style={{width:'100%', height:'100%', borderBottom:'1px solid #f2f2f2', borderRadius:'3px 3px 0px 0px', backgroundImage: image, backgroundSize:'contain', backgroundRepeat:'no-repeat', backgroundPosition: 'center', }}></div>
                </div>
                <div style={{height:maxHeight, maxHeight:maxHeight, margin:'5px', fontSize:'11px', lineHeight:'14px', textOverflow:'ellipsis', overflow:'hidden', display:'-webkit-box', WebkitLineClamp:clamp, WebkitBoxOrient:'vertical'}}>{data.name}</div>
                <div style={{maxHeight:'14px', fontSize:'11px', fontWeight:'bold', textAlign:'center', color:color, display:vendorDisplay, textOverflow:'ellipsis', overflow:'hidden', WebkitLineClamp:'1', WebkitBoxOrient:'vertical'}}>ConstruçãoON</div>
                <div style={{margin:'0 5px', marginTop:'8px', fontSize:'13px', fontWeight:'bold', fontColor:'#333', display:'flex'}}>
                    <div>R${price[0]},</div>
                    <div style={{fontSize:'10px', position:'relative', top:'1px'}}>{price[1]}</div>
                </div>
            </div>
            )
        }
        
        if (type == 'cart'){
            if (!data.product){ return; }
            if (!data.product.img_url){ image = ''; }else{ image = 'url('+data.product.img_url[0].src+')';}
            let isSelect = this.props.isSelect;
            let index = this.props.index;
            let selectColor = 'gray';
            let price = parseFloat(data.product.price).toFixed(2).split('.');
            let totalPrice = parseFloat(data.quantity*data.product.price).toFixed(2).split('.');
            if (isSelect == true){ selectColor = '#ff7000'; }else{ selectColor = '#F7F7F7'; }
            return(
            <div style={{height:'60px', padding:'5px', display:'flex', backgroundColor:'#F7F7F7', borderBottom:'1px solid #FFDBBF', position:'relative'}} 
            onClick={(e)=>{
                this.props.select(index); 
                e.stopPropagation();
            }}>
                <div style={{height:'50px', minWidth:'50px', margin:'auto 0', border:'1px solid '+selectColor, borderRadius:'10%', backgroundImage: image, backgroundSize:'contain', backgroundRepeat:'no-repeat', backgroundPosition: 'center', backgroundColor:'#F7F7F7'}} 
                onClick={(e)=>{
                    history.push('/produto/'+data.product.id_vendor+'/'+data.product.id); 
                    e.stopPropagation();
                }}></div>
                <div style={{height: '50px', fontSize: '11px', margin:'auto 0', marginLeft: '10px', position:'relative', width:'100%'}}>
                    <div style={{height:'26px', maxHeight:'26px', marginRight:'26px', lineHeight: '13px'}}>
                        <div style={{paddingTop:'2px', textOverflow:'ellipsis', overflow:'hidden', display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical'}}>{data.product.name}</div>
                    </div>
                    <div style={{position:'absolute', bottom:'2px', fontSize:'11px', lineHeight: '11px', wordBreak:'nomal', width:'100%', display:'flex'}}>
                        <span style={{width:'35%'}}>und: R$ {price[0]},<span style={{fontSize:'9px', position:'relative', top:'-1px'}}>{price[1]}</span></span> 
                        <span style={{marginLeft:'10px', width:'22%'}}>qtd: {data.quantity}</span>
                        <span style={{}}>Total: R$ {totalPrice[0]},<span style={{fontSize:'9px', position:'relative', top:'-1px'}}>{totalPrice[1]}</span></span>                        
                    </div>                       
                </div>
                <div style={{width:'100%', height:'25px', position:'absolute'}}>
                    <div style={{width:'25px', height:'25px', marginLeft:'auto', position:'relative', top:'3px', right:'13px', display:'flex'}}
                    onClick={(e)=>{
                        this.props.removeItem(index);
                        e.stopPropagation();
                    }}>
                        <div style={{width:'20px', height:'20px', margin:'auto', backgroundImage:'url(/imgs/icons/icon-thrash1.png)', backgroundPosition:'center', backgroundRepeat:'no-repeat', backgroundSize:'contain'}}></div>
                    </div>
                </div>                     
            </div>)
        } 

        if (type == 'vendor'){
            var distance = '';     
            console.log(data)       
            if (!data){ return; }
            if (!data.img_url){ image = ''; }else{ image = 'url('+data.img_url+')'; }            
            if (data.distance){ distance = '(' + data.distance + 'km)'; }
            return(<div style={{height: hContainer, width: wContainer, display:'flex', border:'1px solid #dde0e6', borderBottomLeftRadius:'5px',borderTopLeftRadius:'5px', borderRight:'1px solid #dde0e6' }} onClick={()=>{
                history.push('/fornecedor/' + data._id); 
            }}>
                <div style={{height: hContainer, width: hContainer, backgroundImage: image, backgroundSize:'contain', backgroundRepeat:'no-repeat', backgroundPosition: 'center', backgroundColor:'white', borderTopLeftRadius:'5px', borderBottomLeftRadius:'5px', borderRight:'1px solid #dde0e6'}}></div>
                <div style={{
                    height: hContainer+'px', 
                    width: wContainer-hContainer+'px', 
                    backgroundColor:'white',                                        
                    fontSize: '13px',
                    position: 'relative',
                    paddingLeft: '2px',
                    paddingRigtht: '2px',
                    display: 'flex'                                                                                                                                        
                }}>
                    <div style={{margin:'auto 0', width:'100%'}}>
                        <div style={{lineHeight: '13px', wordBreak:'break-all', textAlign:'center', paddingRight:'3px'}}>
                            <NameBreaker name={data.display_name}/>
                        </div>                        
                        <div style={{lineHeight: '13px', wordBreak:'break-all', width:'100%', textAlign:'center', paddingTop:'4px'}}>
                            {distance.toString().replace('.', ',')}
                        </div>
                    </div>                    
                </div>
            </div>)                      
        }

        if (type == 'address'){            

            const profile = this.props.profile;
            const address = this.props.address.address;
            const mainAddress = profile.mainAddress;
            const index = this.props.index;

            let firstLine = this.props.address.name;
            let secondLine = address.cidade + ' - ' + address.UF;            
            let thirdLine = address.rua + ', ' + address.numero;
            if (address.complemento != ''){ thirdLine += ' - ' + address.complemento; }

            let icon = 'url(/imgs/icons/icon-thrash.png)';            
            let point = 'url(/imgs/icons/icon-point3.png)';

            if (index == mainAddress){ 
                icon = 'url(/imgs/icons/icon-check.png)'; 
                point = 'url(/imgs/icons/icon-point2.png)';                
            }

            return(
            <div style={{minHeight:'65px', margin:'0 10px', borderBottom:'1px solid #F9D5B9', display:'flex'}} onClick={(e)=>{ this.props.select(index); e.stopPropagation(); }}>
                <div style={{width:'40px', height:'30px', margin:'auto 0', backgroundImage:point, backgroundPosition:'center', backgroundRepeat:'no-repeat', backgroundSize:'contain'}}></div>
                <div style={{margin:'auto 0', paddingLeft:'10px', maxWidth:'240px'}}>
                    <div style={{}}>{firstLine}</div>
                    <div style={{}}>{secondLine}</div>
                    <div style={{}}>{thirdLine}</div>
                </div>
                <div style={{width:'30px', height:'30px', margin:'auto 0', marginLeft: 'auto', marginRight:'6px', backgroundImage:icon, backgroundPosition:'center', backgroundRepeat:'no-repeat', backgroundSize:'contain'}} onClick={(e)=>{ this.props.remove(index); e.stopPropagation(); }}></div>                
            </div>)
        }
        

        if (type == 'order'){
            var order = this.props.data;
            var location = order.location+' ('+(order.distance).toString().replace('.',',')+' km)';            
            var statusColor = this.props.color;
            let showDate = this.props.showDate;
            let firstMargin = this.props.firstMargin;
            if (showDate){
                showDate='block';
            }else{
                showDate='none'
            }
            return(<div style={{marginBottom:'10px'}}>
                <div style={{height:'15px', lineHeight:'15px', fontSize:'16px', marginBottom:'10px', marginTop:firstMargin, display: showDate}}>
                    <FormatDate type='W-DMY' date={order.date}/>
                </div>
                <div style={{border:'1px solid #FFDBBF', borderRadius:'3px'}}>
                    <div style={{height:'80px', display:'flex'}}>   
                        <div style={{width:'85px', height:'80px', display:'flex'}}>
                            <div style={{width:'60px', height:'60px', margin:'auto', backgroundImage: order.vendor_img, backgroundSize:'contain', backgroundRepeat:'no-repeat', backgroundPosition: 'center', backgroundColor:'white'}}></div>
                        </div> 
                        <div style={{margin:'auto 0', marginLeft:'10px'}}>
                            <div style={{height:'20px', lineHeight:'20px', fontSize:'15px', fontWeight:'bold', color:order.color}}>{order.vendor_name}</div>
                            <div style={{height:'18px', lineHeight:'20px', fontSize:'11px'}}>{location}</div>
                            <div style={{height:'18px', lineHeight:'20px', fontSize:'11px', display:'flex'}}>
                                <div style={{height:'18px', fontWeight:'bold', color:statusColor}}>
                                    {order.status}{' #'+order.id}
                                </div>
                            </div>
                        </div>                   
                    </div>
                    <div style={{borderBottom:'1px solid #FFDBBF', borderTop:'1px solid #FFDBBF'}}>
                        <div style={{height:'25px', paddingLeft:'20px', fontSize:'11px', display:'flex'}} onClick={()=>{this.orderClickProducts()}}>
                            <div style={{margin:'auto 0', marginRight:'3px'}}>Produtos</div>
                            <div style={{width:'12px', height:'12px', margin:'auto 0', position:'relative', top:'-1px', backgroundImage:'url(/imgs/icons/icon-downArrow.png)', backgroundPosition:'center', backgroundRepeat:'no-repeat', backgroundSize:'contain'}}></div> 
                        </div>
                        <div>
                            <SubProductsContainer products={order.products} id={order.id} ref='subProducts'/>
                        </div>
                    </div>
                    <div style={{height:'25px', marginLeft:'20px', display:'flex'}}>                        
                        <div style={{height:'25px', fontSize:'11px', fontWeight:'bold', display:'flex'}}>
                            <div style={{margin:'auto 0', marginRight:'5px'}}>Total:</div>
                            <div style={{margin:'auto 0'}}>R$ <FormatNumber number={order.total}/></div>                            
                        </div>
                    </div>
                    <div style={{height:'30px', textAlign:'center', borderTop:'1px solid #FFDBBF', color:'white', display:'flex'}}>
                        <div style={{padding:'4px 20px', margin:'auto', backgroundColor:'#ff7000', borderRadius:'15px', fontSize:'11px'}} onClick={()=>{history.push('/pedido/'+order.id)}}>
                            Detalhes
                        </div>
                    </div>
                </div>                
            </div>)            
        }

        return(<div></div>);     
    }
}

export default ResumeContainer;