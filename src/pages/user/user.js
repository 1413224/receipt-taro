import Taro, { Component } from '@tarojs/taro'
import { View, Button, Text, Image, Input } from '@tarojs/components'
import { getJSON } from '../../utils/request'
// import { connect } from '@tarojs/redux'

import { AtInput,AtToast } from 'taro-ui'

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

  goLogin(){
    var _this = this
    Taro.login().then(res=>{
        getJSON(Taro.url.UserLogin,{
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
              url:'/pages/repair/list'
            })
          }
        })
    }).catch(err =>{
      console.log(res)
    })  
  }

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

  render () {
    return (
      <View className='login-wrap'>
        <Image className='setup' src={setup}/>
        <Image className='setup-left' src={setup}/>
        <View className='logo-wrap'><Image className='logo' src={logo}/></View>
        <View className='text'>
          <Text className='left'>专注服务</Text>
          <Text className='right'>快速上门维修</Text>
        </View>
        <View className='title'>用户端登录</View>
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
        
        {/*<Input 
          className='phone-num' 
          type='number' 
          placeholder='请输入手机号码'
          onInput={this.changePhone.bind(this,value)}/>
        <Input 
          className='user-name' 
          type='' 
          placeholder='请输入姓名'
          value=''/>*/}
        
        <Button className='login-btn' onClick={this.goLogin.bind(this)}>登录</Button>

        {/*
          <AtToast 
          isOpened='true'
          text='ddsdsd s阿哈佛爱的是粉红色的 '
          duration='1000000'/>
        */}

      </View>
    )
  }
}

export default User
