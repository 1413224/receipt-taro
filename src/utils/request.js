import Taro from '@tarojs/taro'

export function getJSON(url,data){
	Taro.showLoading();
	return Taro.request({url:url,data:data,method:'GET'}).then(result => {
		Taro.hideLoading();
		// console.log(result)
		if(result.data.ret != '200'){
			Taro.showToast({
				icon:'none',
				title:result.data.msg,
				duration:1000
			})
			if(result.data.ret == '999'){
				Taro.removeStorageSync('_token_')
				console.log(222)
				/*Taro.login().then(res=>{
					Taro.request({
						url:Taro.url.GetSession3rd,
						data:{
							code:res.code,
          		type:2
						}
					}).then(res=>{
						if(res.data.ret == '200'){
							Taro.setStorage({
	              key:'_token_',
	              data:res.data.data.token
	            })
	            Taro.redirectTo({
	              url:'/pages/repair/receiptlist'
	            })
	            
						}else{
							Taro.redirectTo({
	              url:'/pages/user/sigperson'
	            })
						}
					})
				})*/
				
				Taro.redirectTo({
          url:'/pages/user/sigperson'
        })
			}
		}
		return result;
	})
}

export function postJSON(url,data){
	Taro.showLoading();
	return Taro.request({
		header:{
			'content-type': 'application/json'
		},
		url:url,
		data:data,
		method:'POST'
	}).then(result => {
		Taro.hideLoading();

		if(result.data.ret != '200'){
			Taro.showToast({
				title:result.data.msg,
				duration:1000
			})
			if(result.data.ret == '999'){
				Taro.navigateTo({
          url:'/pages/user/sigperson'
        })
			}
		}
		
		return result;
	})
}

export async function getList(){
	let result = await getJSON(Taro.url.GetTypeList)
	// console.log(0)
	return result
	
}