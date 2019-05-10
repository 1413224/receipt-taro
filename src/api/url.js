const baseUrl = 'https://api.9yetech.com/public/?service='
const baseUrl2 = 'https://weixin.njlanniu.com/app/index.php?i=137&c=entry&a=wxapp&m=lnapp_gongan_repair&do='

let url={
	GetSession3rd:baseUrl2 + 'getSession3rd',//
	UserGetMyList: baseUrl2 + 'userMyList',//用户端获取报修列表信息接口
	UserAdd: baseUrl2 + 'userAdd',//用户端新增报修信息
	UserGetCount: baseUrl2 +'userGetCount',//用户端获取报修汇总数据
	UserGetInfoById: baseUrl2 + 'userGetInfoById',//用户端获取报修详情信息接口
	UserGetTypeList: baseUrl2 + 'getTypeList',//用户端获取报修类型数据
	UserGetCateList: baseUrl2 + 'getCateList',//用户端获取报修类型数据（接单人端）
	UserCancelOrder: baseUrl2 + 'userCancelOrderById',//用户端取消报障
	UserLogin: baseUrl2 + 'userLogin',//用户端登录

	UserUploadThumb: baseUrl2 + 'uploadThumb',//用户端上传图片

	//管理端
	ManageLogin: baseUrl2 + 'manageLogin',//管理端登录
	ManageGetMyList: baseUrl2 + 'manageMyList',//管理端获取报修列表信息接口
	ManageGetInfo: baseUrl2 + 'manageGetInfoById',//管理端获取报修详情信息接口
	ManageGetCount: baseUrl2 + 'manageGetCount',//管理端获取报修汇总数据
	ManageDeal: baseUrl2 + 'manageDealById',//管理端接单报修信息接口
	ManageFinish: baseUrl2 + 'manageFinishById',//管理端完成报修信息接口
	ManageShareInfo:baseUrl2 + 'manageShareInfo',//管理端用户分享设置信息
}

export default url;
