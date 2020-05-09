<template>
  <div class="mixin-components-container">
    <el-container>
      <el-header>
        <el-button v-if="btnList[0].flag" type="primary" @click="addData">添加</el-button>
      </el-header>
      <el-main>
        <el-table v-loading="loading" :data="tableData" border style="width: 100%">
          <el-table-column prop="id" label="ID" width="180" align="center" />
          <el-table-column prop="name" label="名称" align="center" />
          <el-table-column prop="create_time" label="创建时间" width="180" align="center" />
          <el-table-column label="状态" width="140" align="center">
            <template slot-scope="scope">
              <span
                v-if="scope.row.status==0"
                class="send-btn no-send"
                @click="handleStatus(scope.row)"
              >禁用</span>
              <span
                v-if="scope.row.status==1"
                class="send-btn already-send"
                @click="handleStatus(scope.row)"
              >开启</span>
            </template>
          </el-table-column>
          <el-table-column prop="caozuo" label="操作" width="250" align="center">
            <template slot-scope="scope">
              <el-button v-if="btnList[1].flag" size="mini" type="primary" @click="handleEdit(scope.row)">编辑</el-button>
              <el-button v-if="btnList[2].flag" size="mini" type="danger" @click="handleDelete(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <pagination v-show="listQuery.total>0" :total="listQuery.total" :page.sync="listQuery.page" :limit.sync="listQuery.size" @pagination="getList" />
      </el-main>
    </el-container>
    <el-dialog :title="titlePop" :visible.sync="dialogTableVisible" width="60%">
      <el-form ref="formPop" :model="formPop" label-width="120px">
        <el-form-item label="过虑广告名称：" style="width:80%">
          <el-input v-model="formPop.name" type="textarea" />
        </el-form-item>
        <el-form-item label="状态：" style="width:80%">
          <el-radio-group v-model="formPop.status">
            <el-radio
              v-for="(item,index) in statusList"
              :key="index"
              :label="item.id"
            >{{ item.label }}</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div class="pop-bottom-btn">
        <el-button type="primary" @click="handleSave">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getFiltrationList,
  editorFiltrationList,
  delFiltrationList,
  addFiltrationList
} from '@/api/book/list'
import Pagination from '@/components/Pagination' // 分页

export default {
  name: 'Filtration',
  components: { Pagination },
  data() {
    return {
      loading: false,
      listQuery:{
          page: 1,
          size: 20,
          total: 0
        },
      tableData: [],
      dialogTableVisible: false,
      jiexiurlzifucuan: '',
      dialogTableVisible: false,
      titlePop: '',
      formPop: {
        name: '',
        status: 0
      },
      statusList: [
        {
          label: '禁用',
          id: 0
        },
        {
          label: '开启',
          id: 1
        }
      ],
      editorId: '',
       btnList:[
        {
          name:'/novels/filtration/add',
          flag:false,
        },
        {
          name:'/novels/filtration/edit',
          flag:false,
        },
        {
          name:'/novels/filtration/delete',
          flag:false,
        }
      ]
    }
  },
  created() {
     this.$store.dispatch("user/showBtn",{name:'/novels/filtration',btnName:''}).then(res=>{
      // console.log('res',res)
      let arr = res
      if(arr.children){
        this.btnList.map(list=>{
          arr.children.map((item,i)=>{
              if(list.name == item.name ){
                list.flag = true
              }
          })
        })
      }
    })
    this.getList()
  },
  methods: {
    getList(val) {
      this.loading = true
      if (val != undefined) {
        const json = JSON.parse(JSON.stringify(val))
        this.listQuery.page = parseInt(json.page)
        this.listQuery.size = parseInt(json.limit)
      }
      const params = {
        page: this.listQuery.page,
        size: this.listQuery.size
      }
      getFiltrationList(params).then(response => {
        // console.log(response);
        this.loading = false
        this.tableData = response.data.data
        this.listQuery.total = response.data.total
      })
    },
    handleDelete(row) {
      this.$confirm('确认要删除吗', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          const params = {
            id: row.id
          }
          delFiltrationList(params).then(res => {
            if (res.message === 'sucessfull!') {
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
              location.reload()
            }
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          })
        })
    },
    handleEdit(row) {
      console.log(row)
      this.dialogTableVisible = true
      this.titlePop = '编辑'
      this.editorId = row.id
      this.formPop.name = row.name
      this.formPop.status = row.status
    },
    addData() {
      this.dialogTableVisible = true
      this.titlePop = '添加'
      this.formPop.name = ''
      this.formPop.status = 0
    },
    handleSave() {
      if (this.titlePop == '添加') {
        const params = {
          name: this.formPop.name,
          status: this.formPop.status
        }
        addFiltrationList(params).then(res => {
          if (res.code == 0) {
            this.$message({
              message: '添加成功',
              type: 'success'
            })
            this.dialogTableVisible = false
            this.getList()
          }
        })
      } else if (this.titlePop == '编辑') {
        const params = {
          id: this.editorId,
          name: this.formPop.name,
          status: this.formPop.status
        }
        editorFiltrationList(params).then(res => {
          if (res.code == 0) {
            this.$message({
              message: '修改成功',
              type: 'success'
            })
            this.dialogTableVisible = false
            this.getList()
          }
        })
      }
    },
    handleStatus(row) {
      let status
      if (row.status == 0) {
        status = 1
      } else if (row.status == 1) {
        status = 0
      }
      const params = {
        id: row.id,
        status: status
      }
      editorFiltrationList(params).then(res => {
        if (res.code == 0) {
          this.$message({
            message: '修改成功',
            type: 'success'
          })
          this.getList()
        }
      })
    }
  }
}
</script>

<style scoped>
.el-header {
  background-color: #ffffff;
  color: #333;
  text-align: left;
  line-height: 60px;
}

.small-reminder-img2 {
  width: 344px;
  height: 100px;
}
.send-btn {
  color: #fff;
  font-size: 10px;
  font-weight: 500;
  padding: 3px 8px;
  text-shadow: none;
  border-radius: 2px;
  cursor: pointer;
}
.no-send {
  background: #ed5565;
}
.already-send {
  background: #23c6c8;
}
.pop-bottom-btn {
  text-align: center;
}
</style>
