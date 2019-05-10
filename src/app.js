import '@tarojs/async-await'
import Taro, { Component } from '@tarojs/taro'
import { Provider } from '@tarojs/redux'
import configStore from './store'
import { getJSON } from './utils/request'

import url from './api/url.js'

import 'taro-ui/dist/style/index.scss' // 全局引入一次即可
import './app.less'

import Index from './pages/index'

Taro.url = url

// 如果需要在 h5 环境中开启 React Devtools
// 取消以下注释：
// if (process.env.NODE_ENV !== 'production' && process.env.TARO_ENV === 'h5')  {
//   require('nerv-devtools')
// }

const store = configStore()

class App extends Component {

  config = {
    pages: [
      'pages/repair/receiptlist',//接单人列表      
    
      'pages/user/sigperson',//接单人端登陆
    
      'pages/repair/list',//报修人列表
      'pages/user/user',//用户端登录
    
      'pages/repair/detail',//报修人详情
      'pages/repair/receipdetail',//接单人详情
      'pages/repair/addrepair',//我要报修
      
      // 'pages/index/index',
    ],
    window: {
      backgroundTextStyle: 'light',
      navigationBarBackgroundColor: '#fff',
      navigationBarTitleText: 'WeChat',
      navigationBarTextStyle: 'black'
    }
  }

  // state = {
  //   token:''
  // }
  // 
  // onShareAppMessage(){
  //   // getJSON(Taro.url.ManageShareInfo).then(res=>{
  //   //   if(res.data.ret=='200'){
  //   //     console.log(res.data)
  //   //     return {
  //   //       title: res.data.data.title,
  //   //       // path: `自定义转发的路径`+ &share= true,
  //   //       imageUrl: res.data.data.thumb,
  //   //       success: function (res) {
  //   //         console.log(res);
  //   //         console.log("转发成功:" + JSON.stringify(res));
  //   //       },
  //   //       fail: function (res) {
  //   //         // 转发失败
  //   //         console.log("转发失败:" + JSON.stringify(res));
  //   //       }
  //   //     }
  //   //   }
  //   // })
  //   return {
  //         title: 'res.data.data.title',
  //         // path: `自定义转发的路径`+ &share= true,
  //         // imageUrl: 'res.data.data.thumb',
  //         success: function (res) {
  //           console.log(res);
  //           console.log("转发成功:" + JSON.stringify(res));
  //         },
  //         fail: function (res) {
  //           // 转发失败
  //           console.log("转发失败:" + JSON.stringify(res));
  //         }
  //       }
  // }


  componentWillMount(){
    // console.log(this.$router.params.path)
    // console.log(this.$router)
    var _this = this 

    wx.showShareMenu({
      withShareTicket: true
    }); 

    getJSON(Taro.url.ManageShareInfo).then(res=>{
      if(res.data.ret=='200'){
        // console.log(res.data.data)
        Taro.setStorage({
          key:'title',
          data:res.data.data.title
        })
        Taro.setStorage({
          key:'imageUrl',
          data:res.data.data.thumb
        })
      }
    })

    var token = Taro.getStorageSync('_token_')

    if(!token){
      Taro.login().then(res=>{
        getJSON(Taro.url.GetSession3rd,{
          code:res.code,
          type:2
        }).then(res=>{
          // console.log(res)
          if(res.data.ret=='200'){
            Taro.setStorage({
              key:'_token_',
              data:res.data.data.token
            })
          }else{
            Taro.redirectTo({
              url:'/pages/user/sigperson'
            })
          }
        })
      }).catch(err =>{
        console.log(res)
      })  
    }
  }

  componentDidMount () {}

  componentDidShow () {}

  componentDidHide () {}

  componentCatchError () {}

  componentDidCatchError () {}

  getToken(){
    var _this = this 

    Taro.getStorageSync({
      key:'_token_'
    }).then(res=>{
      _this.setState({
        token:res.data
      })
    })
  }

  // 在 App 类中的 render() 函数没有实际作用
  // 请勿修改此函数
  render () {
    return (
      <Provider store={store}>
        <Index />
      </Provider>
    )
  }
}

Taro.render(<App />, document.getElementById('app'))
