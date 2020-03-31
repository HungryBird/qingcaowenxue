<template>
  <div class="mixin-components-container">

    <el-container>
      <el-header>
        <!-- <el-button
        size="mini"
        type="primary"
          @click="handleOpen(scope.$index, scope.row)">刷新</el-button>
        </el-header> -->
        <el-button
          type="primary"
          @click="tiaozhuandaotianjia"
        >添加</el-button>
      </el-header>
      <el-main>
        <el-table
          :data="tableData"
          height="700"
          border
          style="width: 100%"
        >
          <el-table-column
            prop="id"
            label="ID"
            width="80"
          />
          <el-table-column
            prop="name"
            label="名称"
            width="180"
          />
          <el-table-column
            prop="original_id"
            label="原始ID"
            width="180"
          />
          <el-table-column
            prop="signIn_day"
            label="签到天数"
            width="180"
          />
          <el-table-column
            prop="continuity"
            label="每次签到获得积分"
            width="180"
          />
          <el-table-column
            prop="signIn_max"
            label="签到最高获得积分"
            width="180"
          />
          <el-table-column
            prop="wechat_account"
            label="微信账号"
            width="180"
          />
          <!-- <el-table-column
      prop="zhuangtai"
      label="状态"
      width="180">
      <template slot-scope="scope">
        <el-button
        size="mini"
        type="primary"
        v-if="tableData[scope.$index].zhuangtai==1"
          @click="handleOpen(scope.$index, scope.row)">开启</el-button>
          <el-button
        size="mini"
        type="primary" v-else
          @click="handleClose(scope.$index, scope.row)">关闭</el-button>
      </template>
    </el-table-column> -->
          <el-table-column
            prop="caozuo"
            label="操作"
          >
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="danger"
                @click="handleDelete(scope.$index, scope.row)"
              >删除</el-button>
              <el-button
                size="mini"
                type="success"
                @click="handleEdit(scope.$index, scope.row)"
              >配置</el-button>
              <el-button
                size="mini"
                type="success"
                @click="fuwuqi(scope.$index, scope.row)"
              >服务器对接</el-button>
            </template>
          </el-table-column>
        </el-table></el-main>
      <el-dialog title=" " :visible.sync="dialogTableVisible">
        <el-table :data="gridData">
          <el-table-column property="name" label="名称" width="400" />
          <el-table-column property="address" label="地址" />
        </el-table>
      </el-dialog>
    </el-container>

  </div>
</template>

<script>
import { fetchList, shanchu } from '@/api/wechat/wechat.js'
export default {
  name: 'WeChatList',
  data() {
    return {
      current: '',
      jiexiurlzifucuan: '',
      dialogTableVisible: false,
      gridData: [{
        name: 'URL(服务器地址)',
        address: ''
      }, {
        name: '业务域名',
        address: ''
      }, {
        name: 'JS接口安全域名',
        address: ''
      }, {
        name: '网页授权域名',
        address: ''
      }],
      tableData: [{
        ID: '3',
        mingcheng: '香蕉文刊',
        juese: '香蕉',
        shijian: '2016-05-03',
        xingming: '王小虎',
        zhuangtai: true,
        caozuo: 'jinrubianji'
      }, {
        ID: '5',
        mingcheng: 'xx文刊',
        juese: 'xx',
        shijian: '2012-03-01',
        xingming: 'xx',
        zhuangtai: 0,
        caozuo: 'jinrubianji'
      }]
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fuwuqi(index, row) {
      console.log(this.tableData[index].url)
      const jiexiurl = require('url')
      var jiexiurlzifucuan = jiexiurl.parse(this.tableData[index].url)
      console.log(jiexiurlzifucuan)
      this.gridData[0].address = this.tableData[index].url
      this.gridData[1].address = jiexiurlzifucuan.hostname
      this.gridData[2].address = jiexiurlzifucuan.hostname
      this.gridData[3].address = jiexiurlzifucuan.hostname
      this.dialogTableVisible = true
    },
    weixinshanchu(data) {
      shanchu(data).then(response => {
      })
    },

    fetchData() {
      fetchList().then(response => {
        console.log(response)
        this.tableData = response.data.data
      })
    },

    tiaozhuandaotianjia() {
      this.$router.push({
        path: 'add'
      })
    },
    handleEdit(index, row) {
      console.log(index, row)
      this.$router.push({
        path: 'edit',
        query: this.tableData[index]
      },)
    },
    handleOpen(index, row) {
      console.log(index, row)
      console.log(this.tableData[index].zhuangtai)
      this.tableData[index].zhuangtai = 0
    },
    handleClose(index, row) {
      console.log(index, row)
      this.tableData[index].zhuangtai = 1
    },
    handleDelete(index, row) {
      console.log(index, row)
      console.log(this.tableData[index].id)
      this.$confirm('确认要删除吗', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.weixinshanchu(this.tableData[index].id)
        this.$message({
          type: 'success',
          message: '已删除!'
        })
        location.reload()
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        })
      })
    }
  }

}
</script>

<style scoped>
  .el-header{
    background-color: #ffffff;
    color: #333;
    text-align: left;
    line-height: 60px;
  }

</style>
