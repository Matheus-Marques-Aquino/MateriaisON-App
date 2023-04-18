import React, { Component } from 'react'
import Slider from './slider';
import history from './widgets/history';

class Categories extends Component{
    constructor(props){
        super(props);
        this.categories = {};
        this.categoryArray = [];
        this.state = {
            loading: true
        }
    }
    componentDidMount(){     
        let products = this.props.products;
        let categories = {};

        products.map((product, index)=>{
            let category = product.category;
            if (product.hidden == false){
                category.map((category, index)=>{
                    if (category.hasOwnProperty('name')){
                        if (!this.categories.hasOwnProperty(category.name)){
                            this.categoryArray.push(category.name);
                            this.categories[category.name] = [ product ];
                        }else{ this.categories[category.name] = [ product ]; }
                    }
                });
            }
        });
        this.categoryArray = this.categoryArray.sort();        
        this.categoryArray.map((name, i)=>{
            name = name;
            categories[name] = this.categories[name];      
        });
        this.categories = categories;
        this.setState({loading: false});
    }
    render(){ 
        if (this.state.loading){return(<div></div>)}    
        let vendor_id = history.location.pathname;
        vendor_id = vendor_id.split('/');
        vendor_id = vendor_id[vendor_id.length-1];  
        return(
            <div>{
                this.categoryArray.map((category, index)=>{
                    if (category.length > 0){
                        let key = 'Category_'+index;
                        return(
                        <div key={key}>
                            <div style={{marginTop:'35px', marginBottom:'20px', display:'flex'}} onClick={()=>{history.push('/categoria/'+ vendor_id +'/'+ index)}}>
                                <div style={{minWidth:'20px', height:'20px', padding:'0 10px', margin:'auto 0', backgroundImage:'url(/imgs/goArrow.png)', backgroundPosition:'center', backgroundRepeat:'no-repeat', backgroundSize:'contain'}}></div>
                                <div style={{minWidth:'fit-content', margin:'auto 0', fontSize:'14px', fontWeight:'bold', color:'#ff7000'}} >{category}</div>  
                                <div style={{width:'100%', height:'100%', margin:'auto 0', padding:'0 10px'}}>
                                    <div style={{width:'100%', borderBottom:'1px solid #ff7000'}}></div>
                                    <div style={{width:'100%', borderTop:'1px solid #ff7000'}}></div>
                                </div>
                                <div style={{minWidth:'fit-content', paddingRight:'10px', margin:'auto 0', fontSize:'14px', fontWeight:'bold', color:'#ff7000'}}>Ver mais</div>                                    
                            </div>
                            <div>
                                <Slider infinite={true} type="productVertical" slides={this.categories[category]} category={category} page={this.props.page}/>
                            </div>
                        </div>
                        )
                    }
                })  

            }</div>
        )   
    }
}
export default Categories;