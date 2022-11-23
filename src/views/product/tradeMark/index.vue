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
            prop 对应列内容的字段名
        -->
        <el-table style="width: 100%" border :data="list">
            <el-table-column type="index" prop="prop" label="序号" width="80px" align="center">
            </el-table-column>
            <el-table-column prop="tmName" label="品牌名称" width="width" align="center">
            </el-table-column>
            <el-table-column prop="logoUrl" label="品牌LOGO" width="width" align="center">
                <template slot-scope="{row, $index}">
                    <img :src="row.logoUrl" alt="" style="width: 50px; height: 50px;">
                </template>
            </el-table-column>
            <el-table-column prop="prop" label="操作" width="width" align="center">
                <template slot-scope="{row, $index}">
                    <el-button type="warning" icon="el-icon-edit" size="mini">修改</el-button>
                    <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
                </template>
            </el-table-column>
        </el-table>

        <!-- 分页器
            https://element-plus.gitee.io/zh-CN/component/pagination.html#小型分页  
            @current-change="handleCurrentChange"   分页器点击事件触发切换页面   
        -->
        <el-pagination style="marign-top:20px;textAlign:center" :current-page="page" :total="total" :page-size="limit"
            :page-count="7" @current-change="handleCurrentChange" @size-change="handleSizeChange"
            :page-sizes="[3, 5, 10]" layout="prev,pager,next,jumper,->, total, sizes">
        </el-pagination>
    </div>
</template>

<script>
export default {
    name: 'tradeMark',
    // 初始化数据
    data() {
        return {
            // 代表分页器第几页
            page: 1,
            // 当前页面展示数据条数
            limit: 3,
            // 总的数据
            total: 0,
            // 列表展示的数据
            list: []
        }
    },
    // 组件挂载发送请求
    mounted() {
        // 调用获取列表数据的方法
        this.getPageList();
    },
    methods: {
        // 获取列表数据的方法
        async getPageList() {
            // 解构出参数
            const { page, limit } = this;
            // 获取品牌列表的接口 向服务器发送请求 需要入参
            let result = await this.$API.trademark.reqTradeMarkList(page, limit);
            console.log(result);
            if (result.code == 200) {
                this.total = result.data.total;
                this.list = result.data.records;
            }
        },
        // 分页器点击事件 会展示当前点击页数的信息
        handleCurrentChange(pager) {
            // 修改参数
            this.page = pager;
            this.getPageList();
        },
        // 当选择一页展示多少条 是触发
        handleSizeChange(limit){
            this.limit = limit;
            this.getPageList();
        },
    }
}
</script>
<style scoped>

</style>