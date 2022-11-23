// 获取品牌列表的接口
// admin/product/baseTrademark/{page}/{limit}

import request from '@/utils/request'

export const reqTradeMarkList = (page, limit) => request({ url: `/admin/product/baseTrademark/${page}/${limit}`, method: 'get' })