import React, { Component } from 'react'
import AliceCarousel from 'react-alice-carousel';
import 'react-alice-carousel/lib/alice-carousel.css'
import history from './widgets/history';
import ResumeContainer from './widgets/resume_container';

class Slider extends Component{

    goToVendor(page_id){
        let link = '/fornecedor/'+page_id;
        history.push(link);
    }    
    goToProduct(vendor_id,page_id){
        let link = '/produto/'+vendor_id+'/'+page_id;
        history.push(link);
    }  

    render(){
        //const screenSize = document.querySelector('.appContainer').clientWidth;
        let itemsPerPage = 2;//Math.floor(screenSize/100);        
        let _autoPlayInverval = 10000;
        let slides = this.props.slides;
        console.log(slides)
        if (!slides){ slides = []; }
        if (this.props.type == 'product'){ _autoPlayInverval = 20000; }
        if (this.props.type == 'productVertical'){ _autoPlayInverval = 20000; itemsPerPage = 3; }
        const responsive = { 0: { items: itemsPerPage} };
        
        return(                 
            <AliceCarousel
                stagePadding = { {paddingLeft: 0, paddingRight: 0} }
                duration = { 2500 }
                autoPlay = { true }
                startIndex = { 0 }
                fadeOutAnimation = { true }
                mouseDragEnabled = { true }
                playButtonEnabled = { false }
                responsive = { responsive }
                autoPlayInterval = { _autoPlayInverval }
                autoPlayDirection = 'ltr'
                autoPlayActionDisabled = { true }
                buttonsDisabled = { true }
                dotsDisabled = { true }
                touchTrackingEnabled = { true }
                mouseTrackingEnabled = { true }
                infinite = { this.props.infinite }
            >
                {slides.map((slide, index)=>{
                    let key='Slide_'+index
                    if (this.props.type == 'vendor'){
                        return(                            
                        <div style={{position:'relative',left:'5px'}} key = {key}>
                            <ResumeContainer type='vendor' data={slide}/>
                        </div>)
                    }
                    if (this.props.type == 'product'){                        
                        return(
                        <div style={{position:'relative', left: '5px'}} key = {key}>
                            <ResumeContainer type='product' data={slide}/>   
                        </div>)
                    }
                    if (this.props.type == 'productVertical'){                        
                        return(
                        <div style={{position:'relative', left: '5px'}} key = {key}>
                            <ResumeContainer type='productVertical' data={slide} page={this.props.page}/>   
                        </div>)
                    }                                         
                })}
            </AliceCarousel>                           
        )
    }

}

export default Slider