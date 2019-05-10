import Taro, { Component } from '@tarojs/taro'
import { View, Button, Text, Image, Input, ScrollView } from '@tarojs/components'
import { getJSON } from '../../utils/request'
import { getFormatDateTamp } from '../../utils/utils'
import Nolist from '../../components/nolist'

import './list.less'

class List extends Component{
	config = {
		navigationBarTitleText: '全部报修'
	}
	/*constructor(props){
		super(props);
	}*/

	state = {
		all_nums:'',//报修总数
		nolist:false,//控制有无工单列表
		tabs:[
			{num:'',text:'未接单',id:1},
			{num:'',text:'正处理',id:2},
			{num:'',text:'已处理',id:3}
		],
		currentIndex:1,
		status:1,//报修状态，1为未接单，2为正处理，3为已处理
		pageSize:10,//分页每页显示数量
		pageNum:1,//	页码
		list:[],//列表数据
		flag:true,//判断是否还要请求数据
	}

	componentWillMount(){
		this.getCount()
		this.getList(1,1)
	}

	componentDidMount(){
		/*this.getCount()
		this.getList(1,1)*/
	}

	componentWillUnmount(){}

	componentDidShow(){}

	componentDidHide(){}

	 tabChoiced(id){
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
		
		// console.log(id)
		this.setState({
			list:[]
		})
		
		setTimeout(()=>{
		 _this.getList(_this.state.status,_this.state.pageNum)

		},100)		
	}

	goAddRepair(){
		Taro.navigateTo({
			url:'/pages/repair/addrepair'
		})
	}

	goDetail(id){
		Taro.navigateTo({
			url:'/pages/repair/detail?id='+id
		})
	}

	//获取报修汇总数据
	  async getCount(){
		var _this = this
		var token = Taro.getStorageSync('_token_')
		// console.log(token)
		await getJSON(Taro.url.UserGetCount,{
			token:token
		}).then(res => {
			if(res.data.ret=='200'){
				let data = res.data.data
				_this.setState({
					all_nums:data.all_nums,
					tabs:[
						{num:data.wait_nums,text:'未接单',id:1},
		  			{num:data.deal_nums,text:'正处理',id:2},
		  			{num:data.done_nums,text:'已处理',id:3}
					]
				})
				
			}
		})
		
	}

	//获取列表
	//async function(){await}
	getList(status,pageNum){
		var _this = this
		var token = Taro.getStorageSync('_token_')
		getJSON(Taro.url.UserGetMyList,{
			status:status,
			pageNum:pageNum,
			pageSize:_this.state.pageSize,
			token:token
		}).then(res => {
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
					// let list = res.data.data.list
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

	//上拉加载（滚动到底部）
	onScrollToLower(){
		// console.log(0)
		var _this = this
		var currentPage = _this.state.pageNum
		// console.log(_this.state.pageNum)
		currentPage = currentPage + 1
		_this.setState({
			pageNum:currentPage
		})
		// console.log(currentPage)
		if(_this.state.flag == true){
			_this.getList(_this.state.status,currentPage)
		}
		// _this.getList(_this.state.status,currentPage)
	}

	//拨打电话
	tellPhone(phoneNum){
		// console.log(phoneNum)
		Taro.makePhoneCall({
			phoneNumber:phoneNum
		})
	}

	render(){

		return (

			<View className='list-wrap'>
				<View className='title clearfix'>
					<View className='left fl'>
						<Text className='repair'>我的保修</Text>
						<Text className='num'>{this.state.all_nums}</Text>
					</View>
					<View className='right fr' onClick={this.goAddRepair.bind(this)}>
						<Image className='add' src={require('../../assets/repear/images/jia.png')}/>
						<Text className='add-text'>我要报修</Text>
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

				<View className='test'>
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

						{/*内容开始*/}
							{
								this.state.nolist == false ?
									<View className='miss-order-wrap'>
									{
										this.state.list.map((item,index)=>{
										
											return(
												<View className='order-item' key={index}>
													<View onClick={this.goDetail.bind(this,item.id)}>
														<View className='title'>
															<Image className='icon' src={require('../../assets/repear/images/utils.png')}/>
															<Text className='tit-text'>{item.type}</Text>
															<View className='status-wrap'>
															{ item.status == 1 ?
																<Text className='status misorder'>未接单</Text>
																: ''
															}
															{ item.status == 2 ?
																<Text className='status handel'>正处理</Text>
																: ''
															}
															{ item.status == 3 ?
																<Text className='status completed'>已处理</Text>
																: ''
															}
																<Image className='more' src={require('../../assets/repear/images/leftmore.png')}/>
															</View>
															<View className='time'>{item.create_time}</View>
														</View>
														{/*内容开始*/}
														<View className='content'>
															<View className='cont'>{item.desc}</View>
															<View className='picwrap'>
															{
																item.thumb.map((ite,index)=>{
																	return(
																		<Image key={index} className='pic' src={ite}/>
																	)
																})
															}
															
															</View>
														</View>
														{/*内容end*/}
													</View>

													{
														item.status == 2 ?
														<View className='tel-wrap clearfix'>
															<View className='left fl'>
																<Image className='tel' src={require('../../assets/repear/images/phone.png')}/>
															</View>
															<View className='center fl'>
																<View className='headpic'>
																	{
																		item.worker_thumb != '' ?
																		<Image className='telpic' src={item.worker_thumb}/>
																		:
																	  <Image className='telpic' src={require('../../assets/repear/images/wxg.jpg')}/>
																	}
																</View>
																<Text className='name ellipsis'>{item.worker_name}</Text>
																<Text className='tel'>{item.worker_tel}</Text>
															</View>
															<View className='right fr' onClick={this.tellPhone.bind(this,item.worker_all_tel)}>联系TA</View>
														</View>
														: ''
													}
												</View>
											)
										})
									}
									</View>
									: ''
							}
						{/*内容end*/}


					</View>
				</ScrollView>
				</View>


			</View>
		)
	}

}

export default List