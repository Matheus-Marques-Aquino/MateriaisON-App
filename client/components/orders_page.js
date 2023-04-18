import React, { Component } from 'react';
import history from './subcomponents/widgets/history';
import BottomMenu from './subcomponents/bottom_menu';
import BackButton from './subcomponents/back_button';
import { Orders } from '../../imports/collections/orders';
import OrdersBox from './subcomponents/orders_box';
import FormatDate from './subcomponents/widgets/format_date';

class OrdersPage extends Component{
    constructor(props){
        super(props);
        this.start = false;
        this.color = ['#777','#ff7000', '3px solid white', '3px solid #ff7000']
        this.state={
            page: 1,
            orders: []
        }
    }
    render(){
        if (!Meteor.userId()){
            Meteor.logout((error)=>{
                if (!error){history.push('/entrar')
            }else{
                console.log(error)
            }});
            return (<div></div>);
        } 
        if (!this.start){
            this.start = true;
            Meteor.subscribe('orderFields', 'OrdersPage', Meteor.userId(), ()=>{
                let orderArray = Orders.find({}).fetch();
                this.setState({
                    orders: orderArray
                });
            });
        }
        if (this.state.page == 0){
            this.color = ['#ff7000', '#A5A5A5']
        }else{
            this.color = ['#A5A5A5','#ff7000']
        } 

        return(<div className='mainContainer'>
            <BackButton/>
            <div style={{height:'55px', display:'flex', backgroundColor:'#ff7000'}}>
                <div style={{margin:'auto', color:'white', fontSize:'19px', fontWeight:'bold', }}>Pedidos</div>    
            </div>
            <div style={{height:'55px', display:'flex', marginTop:'15px'}}>
                <div style={{width:'50%', height:'30px', margin:'0 auto', lineHeight:'30px', textAlign:'center', fontSize:'18px', fontWeight:'600', borderRight:'1px solid #ff7000'}} onClick={()=>{if (this.state != 0){this.setState({ page: 0 })}}}>
                    <div style={{width:'fit-content', height:'26px', margin:'0 auto', color:this.color[0]}}>Anteriores</div>
                </div>
                <div style={{width:'50%', height:'30px', margin:'0 auto', lineHeight:'30px', textAlign:'center', fontSize:'18px', fontWeight:'600'}} onClick={()=>{if (this.state != 1){this.setState({ page: 1 })}}}>
                    <div style={{width:'fit-content', height:'26px', margin:'0 auto', color:this.color[1]}}>Em andamento</div>
                </div>
            </div>
            <div style={{padding:'20px 15px'}}>
                <OrdersBox orders={this.state.orders} page={this.state.page}/>                
            </div>
            <BottomMenu/>
        </div>)
    }
}
export default OrdersPage