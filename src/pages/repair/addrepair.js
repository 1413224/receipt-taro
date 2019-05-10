import Taro, { Component } from '@tarojs/taro'
import { View, Button, Text, Image, Input, Textarea } from '@tarojs/components'
import { AtTextarea, AtImagePicker,AtActionSheet,AtActionSheetItem } from 'taro-ui'
// import "~taro-ui/dist/style/components/action-sheet.scss";
import { getJSON } from '../../utils/request'
import './addrepair.less'

class Addrepair extends Component{
	config = {
		navigationBarTitleText: '我要报修'
	}

	state = {
		value:'',//控制文本框的输入文字
		files:[
			/*{url: 'https://storage.360buyimg.com/mtd/home/111543234387022.jpg',},
			{url: 'https://storage.360buyimg.com/mtd/home/221543234387016.jpg',},
			{url: 'https://storage.360buyimg.com/mtd/home/331543234387025.jpg',},*/
		],
		isopen:false,
		typeList:[],
		curType:'',
		curTypeText:''
	}

	componentWillMount(){
		this.getTypeList()
	}

	componentWillUnmount(){}

	componentDidShow(){}

	componentDidHide(){}

	showType(){
		this.setState({
	  		isopen:true
	  	})
	}

	handleChange(event){
  	this.setState({
  		value:event.target.value
  	})
  }

  fileChange(files){
  	// console.log(files)
  	var _this = this
  	var token = Taro.getStorageSync('_token_')
  	/*getJSON(Taro.url.UserUploadThumb,{
  		token:token,
  		thumb:JSON.stringify(files)
  	}).then(res=>{
  		if(res.data.ret=='200'){
  			// console.log(res.data.data)
  			_this.setState({
		  		files,
		  		isopen:false
		  	})
  		}
  	})*/
  	Taro.chooseImage({
  		success(res){
  			const tempFilePaths = res.tempFilePaths
  			Taro.uploadFile({
  				url:Taro.url.UserUploadThumb,
  				filePath:tempFilePaths[0],
  				name:'file',
  				encoding:'base64',
  				success(res){
  					const data = res.data
  					console.log(data)
  				},
  				fail(err){
  					console.log(err)
  				}
  			})

  		},
  		fail(err){
  			console.log(err)
  		}
  	})
  	
  }

  imgFail(mes){
  	console.log(mes)
  }

  imageClck(index,file){
  	console.log(index, file)
  }

  //获取报修类型数据
  getTypeList(){
  	var _this = this
		var token = Taro.getStorageSync('_token_')
  	getJSON(Taro.url.UserGetTypeList,{
  		token:token
  	}).then(res=>{
  		if(res.data.ret=='200'){
  			// console.log(res.data.data)
  			let data = res.data.data
  			_this.setState({
  				typeList:data,
  				curType:0,
  				curTypeText:data[0]
  			})

  		}
  	})
  }

  //更改报修类型
  changeType(item,index){
  	// console.log(item + index)
  	this.setState({
  		curType:index,
  		curTypeText:item,
  		isopen:false
  	})
  }

  //提交报修
  addRepair(){
  	var _this = this 
		var token = Taro.getStorageSync('_token_')
  	getJSON(Taro.url.UserAdd,{
  		type:_this.state.curTypeText,
  		desc:_this.state.value,
  		thumb:JSON.stringify(_this.state.files),
  		token:token
  	}).then(res=>{
  		if(res.data.ret=='200'){
  			Taro.showToast({
					title:'已成功提交报修信息',
					duration:1000
				})
				setTimeout(()=>{
					Taro.navigateTo({
						url:'/pages/repair/list'
					})
				},500)
  		}
  	})
  }

	render(){
		return(
			<View className='repair-wrap'>
				<View className='top'>
					<Text className='tit'>请选择故障的类型</Text>
					<Text className='req'>必填</Text>
					<View className='repair-type' onClick={this.showType.bind(this)}>
						<Text className='repair-phone'>{this.state.curTypeText}</Text>
						<Image className='fr ico' src={require('../../assets/repear/images/bluemore.png')}/>
					</View>
				</View>
				{/*内容开始*/}
				<View className='content'>
					<View className='tit'>
						<Text className='guzhang'>故障描述</Text>
						<Text className='req'>必填</Text>
					</View>
					<View className='cont'>
						<AtTextarea
			        value={this.state.value}
			        onChange={this.handleChange.bind(this)}
			        maxLength={200}
			        placeholder='请输入...'
			        height='200'
			      />
					</View>
					<View className='picwrap'>
						<View className='tit'>
							<Text className='guzhang'>故障图片</Text>
							<Text className='req'>请拍照清晰，方便报修人员查看</Text>
						</View>
						<View className='loadpic'>
							<AtImagePicker 
							files={this.state.files}
							onFail={this.imgFail.bind(this)}
							onImageClck={this.imageClck.bind(this)}
							onChange={this.fileChange.bind(this)}/>
						</View>
					</View>
				</View>
				{/*内容end*/}

				<View 
					className='pribtn'
					onClick={this.addRepair.bind(this)}>
					<Image className='gou' src={require('../../assets/repear/images/gou.png')}/>
					<Text className='submit'>提交报修</Text>
				</View>

				<AtActionSheet
					isOpened={this.state.isopen}
					cancelText='取消'
					>
					{
						this.state.typeList.map((item,index)=>{
							return(
								<AtActionSheetItem 
									key={index}
									onClick={this.changeType.bind(this,item,index)}>
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

export default Addrepair