import React, { Component } from 'react'

class Filters extends Component{

    constructor(props) {
        super(props);
        this.color = ['#ff7000', '#ff7000', 'white', 'white']
        this.state = {
            orderOpen: false,
            filterOpen: false,
            _shipping: false,
            _open: false,
            _distance: false,
            _price: false,
            _priceMin: 0,
            _priceMax: 0,
            _distanceMax: 10,            
            _order: '_popularity'
        };
        this.handleCheckChange = this.handleCheckChange.bind(this);
        this.handleValueChange = this.handleValueChange.bind(this);
    }

    componentDidUpdate(){
        if (!this.state.orderOpen && !this.state.filterOpen){            
            document.querySelector('.indexFilter').style.maxHeight = '0px';
            document.querySelector('.indexFilter').style.transition = '0.3s ease-in';
            document.querySelector('.indexOrder').style.maxHeight = '0px';
            document.querySelector('.indexOrder').style.transition = '0.3s ease-in';
            //closing filters
            if (document.querySelector('.priceRange')){
                document.querySelector('.priceRange').style.maxHeight = '0px';
            }            
            if (document.querySelector('.distanceRange')){
                document.querySelector('.distanceRange').style.maxHeight = '0px';
            }
        }
        if (this.state.orderOpen && this.state.filterOpen){
            this.setState({ 
                filterOpen: false,
                orderOpen: false
            });
            document.querySelector('.indexFilter').style.maxHeight = '0px';
            document.querySelector('.indexFilter').style.transition = '0s ease-in';
            document.querySelector('.indexOrder').style.maxHeight = '0px';
            document.querySelector('.indexOrder').style.transition = '0s ease-in';
            //closing filters
            if (document.querySelector('.priceRange')){
                document.querySelector('.priceRange').style.maxHeight = '0px';
            }            
            if (document.querySelector('.distanceRange')){
                document.querySelector('.distanceRange').style.maxHeight = '0px';
            }
        }        
        if (this.state.orderOpen){            
            if (this.state.filterOpen){ this.setState({ filterOpen: false })}
            document.querySelector('.indexFilter').style.maxHeight = '0px';
            document.querySelector('.indexFilter').style.transition = '0s ease-in';
            document.querySelector('.indexOrder').style.maxHeight = '205px';
            document.querySelector('.indexOrder').style.transition = '0.3s ease-in';
            //closing filters
            if (document.querySelector('.priceRange')){
                document.querySelector('.priceRange').style.maxHeight = '0px';
            }            
            if (document.querySelector('.distanceRange')){
                document.querySelector('.distanceRange').style.maxHeight = '0px';
            }

        }
        if (this.state.filterOpen){  
            if (this.state.orderOpen){ this.setState({ orderOpen: false })}
            document.querySelector('.indexOrder').style.maxHeight = '0px';
            document.querySelector('.indexOrder').style.transition = '0s ease-in';
            document.querySelector('.indexFilter').style.maxHeight = '290px';
            document.querySelector('.indexFilter').style.transition = '0.3s ease-in';
        }
        //openning filters
        if (document.querySelector('.distanceRange')){
            if (this.state._distance){
                document.querySelector('.distanceRange').style.maxHeight = '50px';
                document.querySelector('.distanceRange').style.transition = '0.3s ease-in';
            }else{
                document.querySelector('.distanceRange').style.maxHeight = '0px';
            }
        }
        if (document.querySelector('.priceRange')){
            if (this.state._price){
                document.querySelector('.priceRange').style.maxHeight = '40px';
                document.querySelector('.priceRange').style.transition = '0.3s ease-in';
            }else{
                document.querySelector('.priceRange').style.maxHeight = '0px';
            }
        }       
    }
    checkController(name, check){
        if (check){
            return(
            <div style={{height:'12px', width:'12px', borderRadius:'50%', border:'2px solid #ff7000', margin:'auto 10px', marginLeft:'20px', marginRight:'10px', display:'flex'}}>
                <div style={{width:'8px', height:'8px', margin:'auto', borderRadius:'50%', backgroundColor:'#ff7000'}}></div>
            </div>);
        }else{
            return(<div style={{height:'12px', width:'12px', borderRadius:'50%', border:'2px solid #b3b3b3', margin:'auto 10px', marginLeft:'20px', marginRight:'10px'}}></div>);
        }
    }
    inputController(name, check){
        if (check == name){
            return(
            <div style={{height:'12px', width:'12px', borderRadius:'50%', border:'2px solid #ff7000', margin:'auto 10px', marginLeft:'20px', marginRight:'10px', display:'flex'}}>
                <div style={{width:'8px', height:'8px', margin:'auto', borderRadius:'50%', backgroundColor:'#ff7000'}}></div>
            </div>);
        }else{
            return(<div style={{height:'12px', width:'12px', borderRadius:'50%', border:'2px solid #b3b3b3', margin:'auto 10px', marginLeft:'20px', marginRight:'10px'}}></div>);
        }
    }    
    handleCheckChange(name, value) {
        this.setState({
            [name]: value            
        });
    }
    handleInputChange(name) {
        this.setState({
            _order: name            
        });
    }
    handleValueChange(event) {
        const target = event.target;  
        const value =  target.value;
        const name = target.name;   
        this.setState({
            [name]: value            
        });
    }
    filterList(){
        let filters = {}
        if (this.state._price){
            if (this.state._priceMax > 0){
                filters.price = true;
                filters.priceMin = parseFloat(this.state._priceMin);
                filters.priceMax = parseFloat(this.state._priceMax);
            }else{
                filters.price = false;
            }
        }else{
            filters.price = false;
        }       
            
        if (this.state._distance){
            if (this.state._distanceMax > 0){
                filters.distance = true;
                filters.distanceMax = parseFloat(this.state._distanceMax);
            }else{
                filters.distance = false;
            }
        }else{
            filters.distance = false;
        }

        filters.shipping = this.state._shipping;

        filters.open = this.state._open;
        
        this.props.filterReturn(filters);
    }
    orderList(){
        let order = this.state._order;        
        this.props.orderReturn(order);
    }

    render(){
        if (this.state.filterOpen){
            this.color = ['white', '#ff7000', '#ff7000', 'white'];            
        }
        if (this.state.orderOpen){
            this.color = ['#ff7000', 'white','white', '#ff7000'];
        }
        if (!this.state.orderOpen && !this.state.filterOpen){
            this.color = ['#ff7000', '#ff7000', 'white', 'white'];
        }
        if (this.state.orderOpen && this.state.filterOpen){
            this.color = ['#ff7000', '#ff7000', 'white', 'white'];
        }
        var maxDistance = this.state._distanceMax;
        var distanceText = 'Menos de 10km'
        if (maxDistance == 30){ 
            distanceText = 'Sem limite de distancia';
        }else{ 
            distanceText = 'Menos de ' + maxDistance + 'km'; 
        }        
        var order = this.props.order; 
        var filter = this.props.filter
        var padding = '20px';
        if (this.props.padding){
            padding = this.props.padding;
        }        
        return(
            <div>
                <div style={{paddingLeft:padding, display:'flex'}}>                    
                    <div style={{width:'100px', height:'26px', lineHeight:'26px', fontSize:'14px', textAlign:'center', fontWeight:'600', border:'2px solid #ff7000', borderRadius:'15px', color:this.color[0], backgroundColor:this.color[2]}}onClick={()=>{ this.setState({ filterOpen: !this.state.filterOpen, orderOpen: false }); }}>Filtros</div>
                    <div style={{width:'100px', height:'26px', lineHeight:'26px', fontSize:'14px', textAlign:'center', fontWeight:'600', border:'2px solid #ff7000', borderRadius:'15px', color:this.color[1], backgroundColor:this.color[3], marginLeft:'10px'}}onClick={()=>{ this.setState({ filterOpen: false, orderOpen: !this.state.orderOpen });}}>Ordenar</div>                
                </div>                 
                <div className='indexFilter' style={{backgroundColor:'white', maxHeight:'0px', overflow:'hidden', fontSize:'14px'}}>
                    <div style={{paddingBottom:'5px', marginTop:'5px', borderTop:'1px solid #ccc'}}>  
                        {filter.map((select, index)=>{
                            let key = 'filterK_'+index
                            switch(select){
                                case 'shipping':
                                    return(<div style={{height:'35px', lineHeight:'35px', borderBottom:'1px solid #ccc', display:'flex'}} onClick={()=>{this.handleCheckChange('_shipping', !this.state._shipping)}} key={key}>
                                            {this.checkController('shipping', this.state._shipping)}
                                            Frete grátis
                                        </div>)
                                    break;
                                case 'open':
                                    return(<div style={{height:'35px', lineHeight:'35px', borderBottom:'1px solid #ccc', display:'flex'}} onClick={()=>{this.handleCheckChange('_open', !this.state._open)}} key={key}>
                                        {this.checkController('shipping', this.state._open)}
                                        Aberto
                                    </div>)
                                    break;
                                case 'price':
                                    return(<div key={key}>
                                        <div style={{height:'35px', lineHeight:'35px', display:'flex'}} onClick={()=>{this.handleCheckChange('_price', !this.state._price)}}>
                                            {this.checkController('price', this.state._price)}
                                            Faixa de preço
                                        </div>
                                        <div className='priceRange' style={{height:'40px', maxHeight:'0px', overflow:'hidden', borderBottom:'1px solid #ccc', display:'flex'}}>
                                            <div style={{paddingLeft:'20px', margin:'auto 0'}}>
                                                De: R$ <input onChange={this.handleValueChange} value={this.state._priceMin} name='_priceMin' style={{width:'90px', height:'20px'}} type="number"/> até R$ <input onChange={this.handleValueChange} value={this.state._priceMax} name='_priceMax' style={{width:'90px', height:'20px'}} type="number"/>
                                            </div>
                                        </div>
                                    </div>)
                                    break;
                                case 'distance':
                                    return(<div key={key}>
                                        <div style={{height:'35px', lineHeight:'35px', display:'flex'}} onClick={()=>{this.handleCheckChange('_distance', !this.state._distance)}}>
                                            {this.checkController('distance', this.state._distance)}
                                            Distancia máxima
                                        </div>                    
                                        <div className='distanceRange' style={{height:'50px', lineHeight:'20px', maxHeight:'0px', overflow:'hidden', borderBottom:'1px solid #ccc', padding:'0 20px'}}>
                                            <div className='distanceShow'style={{height:'20px', lineHeight:'20px', fontSize:'13px', position:'relative', top:'-4px', width:'100%'}}>{distanceText}</div>
                                            <div style={{display:'flex', height:'30px'}}>
                                                <input style={{margin:'auto'}} id='slider' value={this.state._distanceMax} onChange={this.handleValueChange} name='_distanceMax' className='_distanceRange' type="range" min="1" max="30"/>
                                            </div>                                                                    
                                        </div>
                                    </div>)
                                    break;
                            }})}                            
                        <div style={{width:'85px', height:'26px', lineHeight:'26px', marginLeft:'20px', marginTop:'10px', color:'white', fontWeight:'600', fontSize:'14px', border:'2px solid #ff7000', borderRadius:'15px', textAlign:'center', backgroundColor:'#ff7000'}} onClick={()=>{this.filterList()}}>Aplicar</div>
                    </div>  
                </div>   
                <div className='indexOrder' style={{backgroundColor:'white', maxHeight:'0px', overflow:'hidden', fontSize:'14px'}}>
                    <div style={{paddingBottom:'5px', marginTop:'5px', borderTop:'1px solid #ccc'}}>
                        {order.map((select, index)=>{
                            let key = 'orderK_'+index
                            switch(select){                               
                                case 'price':
                                    return(<div key={key}>
                                        <div style={{height:'35px', lineHeight:'35px', display:'flex', borderBottom:'1px solid #ccc'}} onClick={()=>{this.handleInputChange('_lowPrice')}}>
                                            {this.inputController('_lowPrice', this.state._order)}
                                            Menor preço
                                        </div>
                                        <div style={{height:'35px', lineHeight:'35px', display:'flex', borderBottom:'1px solid #ccc'}} onClick={()=>{this.handleInputChange('_highPrice')}}>
                                            {this.inputController('_highPrice', this.state._order)}
                                            Maior preço
                                        </div>
                                    </div>)
                                    break;
                                case 'distance':
                                    return(<div style={{height:'35px', lineHeight:'35px', display:'flex', borderBottom:'1px solid #ccc'}} key={key} onClick={()=>{this.handleInputChange('_distance')}}>
                                        {this.inputController('_distance', this.state._order)}
                                        Distancia
                                    </div>)
                                    break;
                                case 'popularity':
                                    return(<div style={{height:'35px', lineHeight:'35px', display:'flex', borderBottom:'1px solid #ccc'}} key={key} onClick={()=>{this.handleInputChange('_popularity')}}>
                                        {this.inputController('_popularity', this.state._order)}
                                        Popularidade
                                    </div>)
                                    break;
                            }                
                        })}
                        <div style={{width:'85px', height:'26px', lineHeight:'26px', marginLeft:'20px', marginTop:'10px', color:'white', fontWeight:'600', fontSize:'14px', border:'2px solid #ff7000', borderRadius:'15px', textAlign:'center', backgroundColor:'#ff7000'}} onClick={()=>{this.orderList()}}>Aplicar</div>
                    </div>     
                </div>
            </div>
        )
    }
}
export default Filters;
