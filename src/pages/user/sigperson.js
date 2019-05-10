import Taro, { Component } from '@tarojs/taro'
import { View, Button, Text, Image, Input } from '@tarojs/components'
// import { connect } from '@tarojs/redux'
import { getJSON } from '../../utils/request'
import { AtInput } from 'taro-ui'

import './user.less'
import setup from '../../assets/user/images/setup.png'
import logo from '../../assets/user/images/logo.png'
import star from '../../assets/user/images/statr.png'


// @connect(({ counter }) => ({
//   counter
// }), (dispatch) => ({
//   add () {
//     dispatch(add())
//   },
//   dec () {
//     dispatch(minus())
//   },
//   asyncAdd () {
//     dispatch(asyncAdd())
//   }
// }))
class User extends Component {

    config = {
      navigationBarTitleText: '登录'
    }

  state = {
    phoneValue:'',
    userName:''
  }

  componentWillReceiveProps (nextProps) {
    console.log(this.props, nextProps)
  }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  changePhone(value){
    this.setState({
      phoneValue:value
    })
  }

  changeUserName(value){
    this.setState({
      userName:value
    })
  }

  /*goLogin(){
    Taro.navigateTo({
      url:'/pages/repair/list'
    })
  }*/

  goLogin(){
    var _this = this

    Taro.login().then(res=>{
        getJSON(Taro.url.ManageLogin,{
          code:res.code,
          mobile:_this.state.phoneValue,
          realname:_this.state.userName
        }).then(res=>{
          // console.log(res)
          if(res.data.ret=='200'){
            Taro.showToast({
              title:'登录成功',
              duration:1000
            })
            Taro.setStorage({
              key:'_token_',
              data:res.data.data.token
            })
            Taro.redirectTo({
              url:'/pages/repair/receiptlist'
            })
          }
        })
    }).catch(err =>{
      console.log(res)
    })
  }

  render () {
    return (
      <View className='login-wrap'>
        <Image className='setup' src={setup}/>
        <Image className='setup-left' src={setup}/>
        <View className='logo-wrap'><Image className='logo' src={logo}/></View>
        <View className='text'>
          <Text className='left'>报障维修</Text>
          <Text className='right'>服务助手</Text>
        </View>
        <View className='tit'>
          <Text className='center'>雨花台公安分局</Text>
        </View>
        <View className='title'>管理员登录</View>
        <View className='tip'>
          <View className='icon'><Image className='iconimg' src={star}/></View>
          <Text className='tip-text'>登录信息</Text>
        </View>

        <AtInput 
          className='phone-num'
          placeholder='请输入手机号'
          type='phone'
          border={false}
          value={this.state.phoneValue}
          onChange={this.changePhone.bind(this)}/>
        
        <AtInput 
          className='phone-num'
          placeholder='请输入姓名'
          type='text'
          border={false}
          value={this.state.userName}
          onChange={this.changeUserName.bind(this)}/>

        {/*
          <Input className='phone-num' type='number' placeholder='请输入手机号码'/>
          <Input className='user-name' type='text' placeholder='请输入姓名'/>
        */}
        <Button className='login-btn' onClick={this.goLogin.bind(this)}>登录</Button>
      </View>
    )
  }
}

export default User
