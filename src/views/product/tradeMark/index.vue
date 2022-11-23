<template>
    <div>
        <!-- 按钮 -->
        <el-button type="primary" icon="el-icon-plus" style="margin: 5px -3px;"></el-button>

        <!-- 表格组件 
             <el-table-column> 代表列 4列就需要4组
            border 给表格添加边框
            label 显示的标题
            width 对应列的宽度
            align 标题的对齐方式
        -->
        <el-table style="width: 100%" border>
            <el-table-column prop="prop" label="序号" width="80px" align="center">
            </el-table-column>
            <el-table-column prop="prop" label="品牌名称" width="width" align="center">
            </el-table-column>
            <el-table-column prop="prop" label="品牌LOGO" width="width" align="center">
            </el-table-column>
            <el-table-column prop="prop" label="操作" width="width" align="center">
            </el-table-column>
        </el-table>

        <!-- 分页器
            https://element-plus.gitee.io/zh-CN/component/pagination.html#小型分页       
        -->
        <el-pagination style="marign-top:20px;textAlign:center" :current-page="6" :total="99" :page-size="3"
            :page-sizes="[3, 5, 10]" layout="prev,pager,next,jumper,->, total, sizes">
        </el-pagination>
    </div>
</template>

<script>
export default {
    name: 'tradeMark',
}
</script>

<style scoped>

</style>