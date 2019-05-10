import Taro, { Component } from '@tarojs/taro'
import { View, Button, Text, Image, Input, ScrollView } from '@tarojs/components'
import { getJSON } from '../../utils/request'
import Nolist from '../../components/nolist'

import './receiptlist.less'

class Receiptlist extends Component{
	config = {
    navigationBarTitleText: '报修处理'
  }

  state = {
  	all_nums:'',//保障总数
  	tabs:[
			{num:'',text:'待处理',id:1},
			{num:'',text:'正受理',id:2},
			{num:'',text:'已处理',id:3}
		],
		currentIndex:1,
		nolist:false,//控制有无工单列表
		status:1,//报修状态，1为未接单，2为正处理，3为已处理
		pageSize:10,//分页每页显示数量
		pageNum:1,//	页码
		list:[],//列表数据
		flag:true,//判断是否还要请求数据
  }

  onShareAppMessage(){
  	return{
			title:Taro.getStorageSync('title'),
			imageUrl:Taro.getStorageSync('imageUrl')
		}
  }

  componentWillMount(){
		this.getCount()
		this.getList(1,1)
	}

  componentWillUnmount(){}

  componentDidShow(){}

  componentDidHide(){}

  
	tabChoiced=(id)=>{
		//tab切换的方法
		
		var _this = this
		this.setState({
			pageNum:1
		})
		this.setState({
			currentIndex:id
		})
		this.setState({
			status:id
		})
		this.setState({
			flag:true
		})
		this.setState({
			list:[]
		})
		setTimeout(function(){
			_this.getList(_this.state.status,_this.state.pageNum)
			_this.getCount()
		},100)
		
	}

	//获取保障总数
	getCount(){
		var _this = this
		var token = Taro.getStorageSync('_token_')
		getJSON(Taro.url.ManageGetCount,{
			token:token
		}).then(res=>{
			if(res.data.ret=='200'){
				let data = res.data.data
				_this.setState({
					all_nums:data.all_nums,
					tabs:[
						{num:data.wait_nums,text:'待处理',id:1},
		  			{num:data.deal_nums,text:'正受理',id:2},
		  			{num:data.done_nums,text:'已处理',id:3}
					]
				})
			}
		})
	}

	//获取列表
	getList(status,pageNum){
		var _this = this
		var token = Taro.getStorageSync('_token_')
		getJSON(Taro.url.ManageGetMyList,{
			status:status,
			pageNum:pageNum,
			pageSize:_this.state.pageSize,
			token:token
		}).then(res=>{
			if(res.data.ret=='200'){
				let data = res.data.data

				if(pageNum == 1 && data.list.length == 0){
					_this.setState({
						nolist:true
					})
				}else{
					_this.setState({
						nolist:false
					})
				}

				if(data.list.length>0){
					_this.setState({
						list:_this.state.list.concat(data.list)
					})
				}else{
					Taro.showToast({
						title:'没有更多了',
						duration:1000
					})
					_this.setState({
						flag:false
					})
				}
			}
		})
	}

	//上拉加载，滚动到底部
	onScrollToLower(){
		var _this = this
		var currentPage = _this.state.pageNum
		// console.log(_this.state.pageNum)
		currentPage = currentPage + 1
		_this.setState({
			pageNum:currentPage
		})
		if(_this.state.flag == true){
			_this.getList(_this.state.status,currentPage)
		}
	}

	goDetail(id){
		Taro.navigateTo({
			url:'/pages/repair/receipdetail?id='+id
		})
	}

	tellPhone(phoneNum,event){
		Taro.makePhoneCall({
			phoneNumber:phoneNum
		})
		event.stopPropagation()
	}

  render(){
  	return(
  		<View className='list-wrap'>
  			<View className='title clearfix'>
					<View className='left fl'>
						<Text className='repair'>报修工单</Text>
						<Text className='num'>{this.state.all_nums}</Text>
					</View>
					<View className='right fr'>
						<Image className='icolog' src={require('../../assets/repear/images/icolog.png')}/>
					</View>
				</View>

				<View className='nav'>
					{
						this.state.tabs.map((item,index)=>{
							var tabStyle = item.id == this.state.currentIndex ? 'active' : '';
							return (
								<View 
									className='nav-wrap' 
									key={index}
									onClick={this.tabChoiced.bind(this,item.id)}>
									<Text className='nav-text num'>{item.num}</Text>
									<Text className={'nav-text text'+' '+tabStyle}>{item.text}</Text>
									<Text className={'nav-text xian'+' '+tabStyle}></Text>
								</View>
							)
						})
					}
				</View>
				
				<ScrollView
					className='scrollview'
					scrollY
					scrollWithAnimation
					scrollTop='0'
					lowerThreshold='20'
					upperThreshold='20'
					lowerThreshold='50'
					onScrollToLower={this.onScrollToLower.bind(this)}
				>
					<View className='content'>
						{ this.state.nolist == true ?
						 <Nolist/>
						 : ''
						}
						{
							this.state.nolist == false ?
							
								<View className='miss-order-wrap'>
									{
										this.state.list.map((item,index)=>{
											return(
												<View className='order-item' key={index}>
													<View onClick={this.goDetail.bind(this,item.id)}>
														<View className='title'>
															
															<Image className='icon' src={require('../../assets/repear/images/detail-left.png')}/>
															
															<Text className='tit-text'>维修编号</Text>
															<Text className='tit-num ellipsis'>{item.order_no}</Text>
															<View className='status-wrap'>
															{
																item.status == 1 ?
																<Text className='status misorder'>待处理</Text>
																: ''
															}
															{
																item.status == 2 ? 
																<Text className='status handel'>正受理</Text>
																: ''
															}
															{
																item.status == 3 ?
																<Text className='status completed'>已处理</Text>
																: ''
															}
															<Image className='more' src={require('../../assets/repear/images/leftmore.png')}/>
															</View>
														</View>

														<View className='cont-tit'>报修人员信息</View>
														<View className='info'>
															<View className='info-wrap'>
																<View className='phone-wrap'>
																	<Image className='ico' src={require('../../assets/repear/images/phone.png')}/>
																	<View className='phone'>
																		<Text className='user'>{item.user_name}</Text>
																		<Text>{item.user_tel}</Text>
																	</View>
																</View>
																<View className='address-wrap'>
																	<Image className='ico' src={require('../../assets/repear/images/address.png')}/>
																	<View className='address'>{item.user_address}</View>
																</View>
															</View>
															<View className='telto' onClick={this.tellPhone.bind(this,item.user_tel)}>联系他</View>
														</View>
														<Text className='xian'></Text>
														<View className='repair-wrap'>
															<View className='tit clearfix'>
																<Text className='left fl'>电话维修</Text>
																<Text className='right fr'>下单时间：{item.create_time}</Text>
															</View>
														</View>
														
														<View className='text-wrap'>
															<View className='ico-wap'>
																<Image className='ico' src={require('../../assets/repear/images/utilsb.png')}/>
															</View>
															<View className='text-cont'>{item.desc}</View>
														</View>
													</View>
												</View>
											)
										})
									}
								</View>
							
							: ''
						}
					</View>	
				</ScrollView>

  		</View>
  	)
  }

}

export default Receiptlist