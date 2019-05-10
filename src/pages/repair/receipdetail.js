import Taro, { Component } from '@tarojs/taro'
import { View, Button, Text, Image, Swiper, SwiperItem} from '@tarojs/components'
import { AtCurtain, AtModal, AtModalHeader, AtModalContent,AtActionSheet,AtActionSheetItem,
AtModalAction,AtForm,AtButton,AtTextarea,AtRate} from 'taro-ui'
import { getJSON } from '../../utils/request'

import './receipdetail.less'

class Receipdetail extends Component{
	config = {
  	navigationBarTitleText: '详情'
	}

	state = {
		faultList:[
			/*{url:'../../assets/repear/images/detail-left.png'},
			{url:'../../assets/repear/images/detail-left.png'},
			{url:'../../assets/repear/images/detail-left.png'},
			{url:'../../assets/repear/images/detail-left.png'},*/
		],
		isOpened: false,
		data:{},
		bgColor:'',
		currentIndex:0,
		dealModal:false,
		dealModalTitle:'',//一键接单时的title
		finishModel:false,
		orderId:'',//订单号
		isopenSheet:false,//控制完工类型
		finishValue:'',
		typeList:['测试1','测试2'],
		curTypeText:'测试0',
		mask:''
	}

	componentWillMount(){
		/*console.log(0)*/
		// console.log(this.$router.params.id)
		this.setState({
			orderId:this.$router.params.id
		})
		this.getInfo(this.$router.params.id)
		this.getTypeList()
	}

	componentWillUnmount(){}

	componentDidMount(){
		/*await setTimeout(()=>{
			this.changebgColor()
		},200)*/
	}

	componentDidShow(){}

	componentDidHide(){}

	onShareAppMessage(){
  	return{
			title:Taro.getStorageSync('title'),
			imageUrl:Taro.getStorageSync('imageUrl')
		}
  }

	handleChangeImg(index){
		// console.log(9)
		this.setState({
			currentIndex:index
		})
		this.setState({
			isOpened: true
		})
	}

	onClose(){
		this.setState({
			isOpened: false
		})
	}

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

	//获取用户基本信息
	getInfo(id){
		var _this = this
		var token = Taro.getStorageSync('_token_')
		getJSON(Taro.url.ManageGetInfo,{
			id:id,
			token:token
		}).then(res=>{
			if(res.data.ret=='200'){
				let data = res.data.data
				_this.setState({
					data:data,
					faultList:data.thumb
				})
				setTimeout(()=>{
					_this.changebgColor()
				},200)
			}
		})
	}

	//点击取消
	finishCancel(){
		this.setState({
			finishModel:false,
			mask:''
		})
		Taro.removeStorageSync('_formIds_')
	}

	//点击确定
	modalConfirm(){
		this.setState({
			dealModal:false
		})
		/*setTimeout(()=>{
			Taro.navigateTo({
				url:'/pages/repair/receiptlist'
			})
		},200)*/
		Taro.redirectTo({
			url:'/pages/repair/receiptlist'
		})
	}

	//一键接单
	receipt(){

		var _this = this 
		var token = Taro.getStorageSync('_token_')
		getJSON(Taro.url.ManageDeal,{
			id:_this.$router.params.id,
			token:token,
			formIds:JSON.stringify(Taro.getStorageSync('_formIds_'))
		}).then(res=>{
			if(res.data.ret=='200'){
				_this.setState({
					dealModal:true
				})
				Taro.removeStorageSync('_formIds_')
				_this.setState({
					dealModalTitle:res.data.data.title
				})
			}
		})
	}

	//点击完工
	finishOrder(){
		this.setState({
			finishModel:true
		})
	}

	//点击确定（完工）
	finishConfirm(){
		var _this = this 
		var token = Taro.getStorageSync('_token_')

		if(_this.state.curTypeText=="请选择处理类型"){
			Taro.showToast({
				icon:'none',
				title:"请选择处理类型",
				duration:1000
			})
			return false;
		}

		if(_this.state.finishValue==""){
			Taro.showToast({
				icon:'none',
				title:"请输入描述信息",
				duration:1000
			})
			return false;
		}

		getJSON(Taro.url.ManageFinish,{
			id:_this.$router.params.id,
			token:token,
			formIds:JSON.stringify(Taro.getStorageSync('_formIds_')),
			type:_this.state.curTypeText,
			desc:_this.state.finishValue
		}).then(res=>{
			if(res.data.ret=='200'){
				_this.setState({
					finishModel:false
				})
				Taro.removeStorageSync('_formIds_')
				/*setTimeout(()=>{
					Taro.navigateTo({
						url:'/pages/repair/receiptlist'
					})
				},200)*/
				Taro.redirectTo({
					url:'/pages/repair/receiptlist'
				})
				
			}
		})
	}

	onSubmit(e){
		let formId = e.detail.formId;
		// console.log(0)
		this.setState({
			mask:'maskhid'
		})
    this.collectFormIds(formId);
	}

	//一键接单
	onSubmitReceipt(e){
		let formId = e.detail.formId;
		this.JDcollectFormIds(formId)
	}
	//接单
	async JDcollectFormIds(formId){
		let formIds = Taro.getStorageSync('_formIds_')
    let _this = this
    if(!formIds){
      formIds = []
    }
    let data = {
      formId : formId
    }
    formIds.push(data)
    Taro.setStorage({
      key:'_formIds_',
      data:formIds
    })
    await _this.receipt()
	}

	async collectFormIds(formId){
    let formIds = Taro.getStorageSync('_formIds_')
    let _this = this
    if(!formIds){
      formIds = []
    }
    let data = {
      formId : formId
    }
    formIds.push(data)
    Taro.setStorage({
      key:'_formIds_',
      data:formIds
    })
    await _this.finishOrder()
  }

  showType(){
		this.setState({
  		isopenSheet:true,
  		mask:'maskhid'
  	})
	}

	closeSheet(){
    this.setState({
      isopenSheet:false,
      mask:''
    })
  }

  cancelSheet(){
    this.setState({
      isopenSheet:false
    })
  }

  //更改报修类型
  changeType(item,index){
  	// console.log(item + index)
  	this.setState({
  		// curType:index,
  		curTypeText:item,
  		isopenSheet:false,
  		mask:''
  	})
  }

  handleChange(event){
  	this.setState({
  		finishValue:event.target.value,
      isopenSheet:false,
      mask:''
  	})
  }

  getTypeList(){
  	var _this = this
		var token = Taro.getStorageSync('_token_')
  	getJSON(Taro.url.UserGetCateList,{
  		token:token
  	}).then(res=>{
  		if(res.data.ret=='200'){
  			// console.log(res.data.data)
  			let data = res.data.data
  			_this.setState({
  				typeList:data,
  				// curType:0,
  				curTypeText:data[0]
  			})

  		}
  	})
  }

  tellPhone(phoneNum,event){
		Taro.makePhoneCall({
			phoneNumber:phoneNum
		})
		event.stopPropagation()
	}

	render(){
		return (
			<View className='detail-wrap'>
				<View className={'ba-wrap'+' '+this.state.bgColor}>
					{/*头部开始*/}
					<View className='top clearfix'>
						<View className='left fl padleft'>
							<Image className='img' src={require('../../assets/repear/images/detail-left.png')}/>
							<Text className='desc'>维修编号</Text>
							<Text className='num ellipsis'>{this.state.data.order_no}</Text>
						</View>
						<View className='right fr'>

							{
								this.state.data.status == 1 ? 
								<Image className='img' src={require('../../assets/repear/images/miss.png')}/>
								: ''
							}
							{
								this.state.data.status == 1 ? 
								<Text className='status missText'>待处理</Text>
								: ''
							}
							{
								this.state.data.status == 2 ?
								<Image className='img' src={require('../../assets/repear/images/clock.png')}/>
								: ''
							}
							{
								this.state.data.status == 2 ?
								<Text className='status clockText'>正受理</Text>
								: ''
							}
							{
								this.state.data.status == 3 ?
								<Image className='img' src={require('../../assets/repear/images/gou2.png')}/>
								: ''
							}
							{
								this.state.data.status == 3 ?
								<Text className='status completedText'>已处理</Text>
								: ''
							}
						</View>
					</View>
					{/*头部end*/}
					{/*维修内容开始*/}
					<View className='receipt-cont'>
						<View className='item'>
							<View className='left'>维修问题</View>
							<View className='right wx'>
                  {this.state.data.desc}
              </View>
						</View>
						<View className='item'>
							<View className='left'>维修类型</View>
							<View className='right phone'>{this.state.data.type}</View>
						</View>
						<View className='item'>
							<View className='left'>下单时间</View>
							<View className='right time'>{this.state.data.create_time}</View>
						</View>
					</View>
					{/*维修内容end*/}
					{/*用户信息开始*/}
					{/*
						<View className='user-wrap'>
						<View className='left padleft'><Image className='ico' src={require('../../assets/repear/images/addressg.png')}/></View>
						<View className='right'>
							<View className='top'>
								<Text className='name'>{this.state.data.user_name}</Text>
								<Text className='phone'>{this.state.data.user_tel}</Text>
							</View>
							<View className='bottom'>{this.state.data.user_address}</View>
						</View>
					</View>
					*/}
					{/*用户信息end*/}
				</View>
				{/*故障图开始*/}
				<View className='fault-wrap'>
					{
						this.state.faultList.length != 0 ? 
						<Text className='title'>故障图片</Text>
						:''
					}
					<View className='pic-wrap'>
						{/*幕帘组件*/}

						{
							this.state.faultList.map((item,index)=>{
								return (
									<View
										className='item'
										key={index}
										onClick={this.handleChangeImg.bind(this,index)}>
										<Image className='pic' src={item}/>
									</View>
								)
							})
						}

						<AtCurtain 
							isOpened={this.state.isOpened}
							onClose = {this.onClose.bind(this)}>
							<Swiper
								className='swiper-wrap'
								indicatorColor='#999'
								indicatorActiveColor='#333'
								circular
								indicatorDots
								current={this.state.currentIndex}>
								{
									this.state.faultList.map((item,index)=>{
										return (
											<SwiperItem key={index}>
												 <Image className='pic' src={item}/>
											</SwiperItem>
										)
									})
								}

							</Swiper>
						</AtCurtain>
						
					</View>
				</View>
				{/*故障图end*/}

			{/*用户信息开始*/}
				{
					this.state.data.status !=1 ?
					<View className='user-wrap2'>
						<View className='name'>{this.state.data.user_name}</View>
						<View className='phone'>{this.state.data.user_tel}</View>
						<View className='address'>
							<Text className='le-text'>联系地址</Text>
							<Text className='ri-text'>{this.state.data.user_address}</Text>
						</View>
						<View className='lianxi' onClick={this.tellPhone.bind(this,this.state.data.user_tel)}>联系他</View>
					</View>
					:''
				}
			{/*用户信息结束*/}

			{/*接单员信息开始*/}

				{
					this.state.data.worker_type ==2 && this.state.data.worker_name!='' ?
					<View className='user-wrap2'>
						<View className='name'>服务人员：{this.state.data.worker_name}</View>
						<View className='phone'>{this.state.data.worker_tel}</View>
						<View className='lianxi' onClick={this.tellPhone.bind(this,this.state.data.worker_all_tel)}>联系他</View>
					</View>
					:''
				}

			{/*接单员信息结束*/}

			{/*评价开始*/}
				{
					this.state.data.status == 3 && this.state.data.star!=0 ?
					<View className='pj-wrap'>
						<View className='top'>
							<Text className='tit-txt'>本单评价</Text>
							<AtRate margin='30' value={this.state.data.star} />
						</View>
						<View className='bottom'>
							<View className='item'>
								<View className='left'>处理类型</View>
								<View className='right ty'>{this.state.data.cate_name}</View>
							</View>
							<View className='item'>
								<View className='left'>处理描述</View>
								<View className='right'>{this.state.data.finish_desc}</View>
							</View>
							<View className='item'>
								<View className='left'>服务评价</View>
								<View className='right'>{this.state.data.comment}</View>
							</View>
						</View>
					</View>
					: ''
				}
			{/*评价结束*/}

			{/*完工描述*/}
			{
				this.state.data.status == 2 && this.state.data.worker_type == 1 ?
				<View className='tops'>
					<Text className='tit'>请选择完工类型</Text>
					<Text className='req'>必填</Text>
					<View className='repair-type' onClick={this.showType.bind(this)}>
						<Text className='repair-phone'>{this.state.curTypeText}</Text>
						<Image className='fr ico' src={require('../../assets/repear/images/bluemore.png')}/>
					</View>
					<View className='tit'>完工描述：</View>
					<View className={'textarea-wrap'+' '+ mask}>
						<AtTextarea
			        value={this.state.finishValue}
			        onChange={this.handleChange.bind(this)}
			        maxLength={200}
			        placeholder='请输入...'
			      />
					</View>
				</View>

				:''
			}


				<View className='btn-wrap'>
			{/*
						<Text className='btn jiedan' onClick={this.receipt.bind(this)}>一键接单</Text>

			*/}
					{
						this.state.data.status == 1 && this.state.data.worker_type == 1 ?
						<View className='btn jiedan'>
							<AtForm className='pribtn' onSubmit={this.onSubmitReceipt.bind(this)}>
		            <AtButton formType='submit'>一键接单</AtButton>
		          </AtForm>
						</View>
						:''
					}
					{
						this.state.data.status == 2 && this.state.data.worker_type == 1 ?
						<View className='tijiao'>
							<AtForm className='pribtn' onSubmit={this.onSubmit.bind(this)}>
		            <AtButton formType='submit'>处理完成</AtButton>
		          </AtForm>
						</View>

						: ''
					}
				{/*
						<Text className='btn wangong' onClick={this.finishOrder.bind(this)}>完工</Text>

				*/}
				</View>

				<View className='jiedan'>
					<AtModal
					  isOpened = {this.state.dealModal}
					  title={this.state.dealModalTitle}
					  confirmText='我知道了'
					  onConfirm={ this.modalConfirm.bind(this) }
					  content='请联系报修人员取的具体问题信息'
					/>
				</View>

				<AtModal
					isOpened = {this.state.finishModel}
					title='温馨提示'
				  cancelText='取消'
				  confirmText='确认'
				  onCancel={ this.finishCancel.bind(this) }
				  onClose={this.finishCancel.bind(this)}
				  onConfirm={ this.finishConfirm.bind(this) }
				  content='您确定提交已处理该报修订单吗？'
				/>


				<AtActionSheet
					isOpened={this.state.isopenSheet}
					cancelText='取消'
          onClose={this.closeSheet.bind(this)}
          onCancel={this.cancelSheet.bind(this)}
					>
					{
						this.state.typeList.map((item,index)=>{
							return(
								<AtActionSheetItem onClick={this.changeType.bind(this,item,index)}>
							    {item}
							  </AtActionSheetItem>
							)
						})
					}
				</AtActionSheet>



			</View>
		)
	}

}

export default Receipdetail