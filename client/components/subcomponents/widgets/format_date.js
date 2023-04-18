import React, { Component } from 'react';

class FormatDate extends Component{
    getWeekString(date){
        let weekArray = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
        let week = date.getDay();
        return weekArray[week];
    }
    getMonthString(date){
        let monthArray = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
        let month = date.getMonth();
        return monthArray[month];
    }
    getMonthNumberString(date){        
        let month = date.getMonth();
        if (month < 10){ 
            month = '0'+month.toString();
        }else{
            month = month.toString()
        }
        return month;
    }
    getDayString(date){
        let days = date.getDate()
        if (days < 10){ 
            days = '0'+days.toString();
        }else{
            days = days.toString();
        }
        return days;
    }
    getHourString(date){
        let hours = date.getHours()
        if (hours < 10){ 
            hours = '0'+hours.toString();
        }else{
            hours = hours.toString();
        }
        return hours;
    }
    getMinuteString(date){
        let minutes = date.getMinutes()
        if (minutes < 10){ 
            minutes = '0'+minutes.toString();
        }else{
            minutes = minutes.toString();
        }
        return minutes;
    }
    getSecondsString(date){
        let seconds = date.getSeconds()
        if (seconds < 10){ 
            seconds = '0'+seconds.toString();
        }else{
            seconds = seconds.toString();
        }
        return seconds;
    }


    render(){
        var type = this.props.type;
        if (type == 'W-DMY'){
            let date = this.props.date;
            if (!date){return ('')}
            date = this.getWeekString(date)+' • '+this.getDayString(date)+' '+this.getMonthString(date)+' '+(date.getFullYear()).toString();
            return (date);
        }
        if (type == 'HM-DMY'){
            let date = this.props.date;
            if (!date){return ('')}
            date = this.getHourString(date)+'h'+this.getMinuteString(date)+' - '+this.getDayString(date)+'/'+this.getMonthNumberString(date)+'/'+date.getFullYear();
            return (date);
        }
        if (type == 'D/M'){
            let date = this.props.date;
            if (!date){return ('')}
            date = this.getDayString(date)+'/'+this.getMonthNumberString(date);
            return (date);
        }
        if (type == 'HM'){
            let date = this.props.date;
            if (!date){return ('')}
            date = this.getHourString(date)+'h'+this.getMinuteString(date);
            return (date);
        }
        return'';        
    }

}
export default FormatDate;