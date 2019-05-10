import Taro, { Component } from '@tarojs/taro'
import { View, Button, Text, Image, Input } from '@tarojs/components'
import './nolist.less'

class Nolist extends Component{
	render () {

		//这里可以执行js

		return (
			<View>
				<Image className='nolist' src={require('../assets/repear/images/nolist.png')}></Image>
				<Text className='nolist-text'>暂无工单</Text>
			</View>
		)
	}
}

export default Nolist