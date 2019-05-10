import Taro, { Component } from '@tarojs/taro'
import { View, Button, Text, Image, } from '@tarojs/components'
import { getJSON } from '../../utils/request'

import './detail.less'

class Detail extends Component {
	config = {
  	navigationBarTitleText: '详情'
	}

	state = {
		data:{},
		bgColor:'',
		orderId:''
	}

	componentWillMount(){
		/*console.log(0)
		console.log(this.$router.params)*/
		this.setState({
			orderId:this.$router.params.id
		})
		this.getInfo(this.$router.params.id)
	}

	componentDidMount(){
		setTimeout(()=>{
			this.changebgColor()
		},300)
	}

	componentWillUnmount(){
	}

	componentDidShow(){}

	componentDidHide(){}

	//控制背景颜色
	changebgColor(){
		var _this = this
		if(_this.state.data.status == 1){
			_this.setState({
				bgColor:'missbg'
			})
		}else if(_this.state.data.status == 2){
			_this.setState({
				bgColor:'clockbg'
			})
		}else if(_this.state.data.status == 3){
			_this.setState({
				bgColor:'completedbg'
			})
		}
	}

	//用户获取报修详情
	getInfo(id){
		var _this = this
		var token = Taro.getStorageSync('_token_')

		getJSON(Taro.url.UserGetInfoById,{
			id:id,
			token:token
		}).then(res=>{
			if(res.data.ret=='200'){
				// console.log(res.data.data.worker_all_tel)
				let data = res.data.data
				_this.setState({
					data:data
				})
				
			}
		})
	}

	tellPhone(phoneNum){
		Taro.makePhoneCall({
			phoneNumber:phoneNum
		})
	}

	render(){
		return(
			<View className='detail-wrap'>
				
				<View className={'tit-wrap clearfix'+' '+this.state.bgColor}>
					<View className='left fl'>
						<Image className='img' src={require('../../assets/repear/images/detail-left.png')}/>
						<Text className='desc'>订单号</Text>
						<Text className='num ellipsis'>{this.$router.params.id}</Text>
					</View>
					<View className='right fr'>
						{
							this.state.data.status == 1 ? 
							<Image className='img' src={require('../../assets/repear/images/miss.png')}/>
							: ''
						}
						{
							this.state.data.status == 1 ? 
							<Text className='status misorder'>未接单</Text>
							: ''
						}
						{
							this.state.data.status == 2 ?
							<Image className='img' src={require('../../assets/repear/images/clock.png')}/>
							: ''
						}
						{
							this.state.data.status == 2 ?
							<Text className='status handel'>正处理</Text>
							: ''
						}
						{
							this.state.data.status == 3 ?
							<Image className='img' src={require('../../assets/repear/images/gou2.png')}/>
							: ''
						}
						{
							this.state.data.status == 3 ?
							<Text className='status completed'>已处理</Text>
							: ''
						}	
					</View>
				</View>

				<View className='content'>
					<View className='item'>
						<Text className='left'>故障描述</Text>
						<Text className='right'>{this.state.data.desc}</Text>
					</View>
					<View className='item'>
						<Text className='left'>故障类型</Text>
						<Text className='right sta'>{this.state.data.type}</Text>
					</View>
					<View className='item'>
						<Text className='left'>下单时间</Text>
						<Text className='right'>{this.state.data.create_time}</Text>
					</View>
					<View className='item'>
						<Text className='left'>故障图片</Text>
						<View className='right'>
							{
								this.state.data.thumb.map((item,index)=>{
									return (
										<Image className='img' src={item} key={index}/>
									)
								})
							}
						</View>
					</View>
				</View>

				{
					this.state.data.status != 1 ?
					<View className='fuwu'>
						<Text className='tit'>服务人员</Text>
						<View className='tel-wrap clearfix'>
							<View className='left fl'>
								<Image className='tel' src={require('../../assets/repear/images/phone.png')}/>
							</View>
							<View className='center fl'>
								<View className='headpic'>
									{
										this.state.data.worker_thumb != '' ?
										<Image className='telpic' src={this.state.data.worker_thumb}/>
										:
										<Image className='telpic' src={require('../../assets/repear/images/wxg.jpg')}/>
									}
								</View>
								<Text className='name ellipsis'>{this.state.data.worker_name}</Text>
								<Text className='tel'>{this.state.data.worker_tel}</Text>
							</View>
							{
								this.state.data.status != 1 ?
								<View 
									className='right fr lan'
									onClick={this.tellPhone.bind(this,this.state.data.worker_all_tel)}>联系TA</View>
								: ''
							}
							{/*
								this.state.data.status == 3 ?
								<View className='right fr hui'>联系TA</View>
								:''
							*/}
						</View>
					</View>
					: ''
				}
			</View>
		)
	}

}

export default Detail