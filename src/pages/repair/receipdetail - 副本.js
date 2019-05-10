import Taro, { Component } from '@tarojs/taro'
import { View, Button, Text, Image, } from '@tarojs/components'
import { AtCurtain } from 'taro-ui'
import './receipdetail.less'

class Receipdetail extends Component{
	config = {
  	navigationBarTitleText: '详情'
	}

	state = {
		faultList:[
			{url:'../../assets/repear/images/detail-left.png'},
			{url:'../../assets/repear/images/detail-left.png'},
			{url:'../../assets/repear/images/detail-left.png'},
			{url:'../../assets/repear/images/detail-left.png'},
		],
		isOpened: false,
	}

	componentWillUnmount(){}

	componentDidShow(){}

	componentDidHide(){}

	handleChange(){
		console.log(9)
		this.setState({
			isOpened: true
		})
	}

	onClose(){
		this.setState({
			isOpened: false
		})
	}

	render(){
		return (
			<View className='detail-wrap'>
				<View className='ba-wrap misorder'>
					<View className='top clearfix'>
						<View className='left fl padleft'>
							<Image className='img' src={require('../../assets/repear/images/detail-left.png')}/>
							<Text className='desc'>订单号</Text>
							<Text className='num ellipsis'>164894945619846</Text>
						</View>
						<View className='right fr'>
							<Image className='img' src={require('../../assets/repear/images/miss.png')}/>
							{/*  此处已注释，区分不同的状态
							<Image src={require('../../assets/repear/images/clock.png')}/>
							<Image src={require('../../assets/repear/images/gou2.png')}/>
							<Text className='status handel'>正处理</Text>
							<Text className='status completed'>已处理</Text>
							*/}
							<Text className='status misorder'>未接单</Text>
						</View>
					</View>

					{/*维修内容开始*/}
					<View className='receipt-cont'>
						<View className='item'>
							<View className='left'>维修问题</View>
							<View className='right wx'>
                  301室，电话已坏，请尽快叫人上门维修
              </View>
						</View>
						<View className='item'>
							<View className='left'>维修类型</View>
							<View className='right phone'>电话维修</View>
						</View>
						<View className='item'>
							<View className='left'>下单时间</View>
							<View className='right time'>2018.10.10  10:00</View>
						</View>
					</View>
					{/*维修内容end*/}

					<View className='user-wrap'>
						<View className='left padleft'><Image className='ico' src={require('../../assets/repear/images/addressg.png')}/></View>
						<View className='right'>
							<View className='top'>
								<Text className='name'>林新生</Text>
								<Text className='phone'>13987865356</Text>
							</View>
							<View className='bottom'>广东广州市海珠区滨江西路海天四望32号 门卫传达室</View>
						</View>
					</View>
				</View>
		
				<View className='fault-wrap'>
					<Text className='title'>故障图片</Text>
					<View className='pic-wrap'>
						{/*幕帘组件*/}

						{
							this.state.faultList.map((item,index)=>{
								return (
									<View 
										className='item' 
										onClick={this.handleChange}
									>
										<Image className='pic' src={require(item.url)}/>
									</View>
								)
							})
						}

						<AtCurtain 
							isOpened={this.state.isOpened}
							onClose = {this.onClose.bind(this)}
						>
							<View>haodee</View>
						</AtCurtain>
						
					</View>
				</View>

				<View className='btn-wrap'>
					<Text className='btn wangong'>完工</Text>
					<Text className='btn jiedan'>一键接单</Text>
				</View>

			</View>



			

			
		)
	}

}

export default Receipdetail