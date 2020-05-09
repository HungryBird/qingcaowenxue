<template>
  <div class="app-container">
    <div v-if="current === 'add' || current === 'edit'">
      <el-form ref="addForm" :model="add.form" :rules="add.rules" label-width="100px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="分类名称：" prop="name">
              <el-input v-model="add.form.name" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="上级分类：" prop="channel">
              <el-select v-model="add.form.channel">
                <el-option :value="0" label="男频" />
                <el-option :value="1" label="女频" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="推荐位状态：" prop="status">
              <el-radio-group v-model="add.form.status">
                <el-radio :label="1">
                  开启
                </el-radio>
                <el-radio :label="0">
                  关闭
                </el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <el-button type="success" @click="save">保存</el-button>
      <el-button type="danger" @click="toggleCurrent('')">返回</el-button>
    </div>
    <div v-else>
      <div class="filter-container">
        <el-button class="filter-item" type="primary" icon="el-icon-refresh" @click="refresh" />
        <el-button v-if="btnList[0].flag" class="filter-item" style="margin-left: 10px;" type="primary" @click="toggleCurrent('add', { type: 'rank' })">
          添加榜单
        </el-button>
        <el-select v-model="search.form.channel" placeholder="选择频道" class="filter-item" style="margin-left: 10px;">
          <el-option :value="1" label="精选" />
          <el-option :value="2" label="男生" />
          <el-option :value="3" label="女生" />
          <el-option :value="4" label="其它" />
        </el-select>
        <div class="filter-item" style="margin-left: 10px;">
          <el-input v-model="search.form.name" placeholder="输入需查询推荐位名称">
            <el-button slot="append" icon="el-icon-search" :loading="search.loading" @click="getList" />
          </el-input>
        </div>
      </div>

      <el-table
        v-loading="table.loading"
        :data="table.data"
        border
        fit
        highlight-current-row
        style="width: 100%;"
        @sort-change="sortChange"
      >
        <el-table-column v-for="cl in table.columns" :key="cl.prop" :prop="cl.prop" :label="cl.label" :width="cl.width" :align="cl.align">
          <template slot-scope="{ row }">
            <div v-if="cl.prop === 'action'">
              <el-button v-if="btnList[3].flag" type="primary" size="mini" @click="showDataList(row)">
                数据列表
              </el-button>
              <el-button v-if="btnList[1].flag" type="primary" size="mini" @click="edit(row)">
                编辑
              </el-button>
              <el-button v-if="btnList[2].flag" type="danger" size="mini" @click="remove(row)">
                删除
              </el-button>
            </div>
            <div v-else-if="cl.prop === 'sex'">
              <span style="background-color: #F9F2F4;border-radius: 4px;color: #ca4440;font-size: 90%;padding: 2px 4px;white-space: nowrap;">
                {{ row.sex===0 ? '男频' : '女频' }}
              </span>
            </div>
            <div v-else-if="cl.prop === 'sort'">
              <el-input v-model="row.sort" />
            </div>
            <div v-else-if="cl.prop === 'status'">
              <el-button size="mini" :type="row[cl.prop] === 1 ? 'primary' : 'danger'" @click="changeStatus(row)">
                {{ row[cl.prop] === 1 ? '开启' : '禁用' }}
              </el-button>
            </div>
            <div v-else-if="cl.prop === 'number'">
              <span style="background-color: #F9F2F4;border-radius: 4px;color: #ca4440;font-size: 90%;padding: 2px 4px;white-space: nowrap;">
                {{ row.number }}
              </span>
            </div>
            <div v-else>
              {{ row[cl.prop] }}
            </div>
          </template>
        </el-table-column>
      </el-table>
      <pagination v-show="table.total>0" :total="table.total" :page.sync="table.page" :limit.sync="table.size" @pagination="pagin" />
      <!-- 数据列表 -->
      <el-dialog ref="dataList" :visible.sync="dataList.visible" top="5vh" width="80%" title="数据列表">
        <el-table
          :data="dataList.table.data"
          border
          fit
          highlight-current-row
          style="width: 100%;"
        >
          <el-table-column v-for="dc in dataList.table.columns" :key="dc.prop" :prop="dc.prop" :label="dc.label" :width="dc.width" :align="dc.align">
            <template slot-scope="{ row }">
              <div v-if="dc.prop === 'action'">
                <el-button type="danger" size="mini" @click="dcRemove(row)">
                  删除
                </el-button>
              </div>
              <div v-else-if="dc.prop === 'sort'">
                <el-input v-model="row.sort" />
              </div>
              <div v-else-if="dc.prop === 'status'">
                <el-button size="mini" :type="row[dc.prop] === 1 ? 'primary' : 'danger'" @click="dChangeStatus(row)">
                  {{ row[dc.prop] === 1 ? '开启' : '禁用' }}
                </el-button>
              </div>
              <div v-else-if="dc.prop === 'number'">
                <span style="background-color: #F9F2F4;border-radius: 4px;color: #ca4440;font-size: 90%;padding: 2px 4px;white-space: nowrap;">
                  {{ row[dc.prop] || 0 }}
                </span>
              </div>
              <div v-else>
                {{ row[dc.prop] }}
              </div>
            </template>
          </el-table-column>
        </el-table>
        <el-button type="primary" style="margin-top:20px" @click="sortList">
          排序
        </el-button>
        <pagination :total="dataList.table.total" :page.sync="dataList.table.page" :limit.sync="dataList.table.size" @pagination="dPagin" />
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { recommendAdd, sortDataList } from '@/api/recommend/recommend'
import { rankList, rankUpdate,rankUpdateStatus, rankDelete, rankAdd, getBooks, delBooks } from '@/api/rank/list'
import mix from '@/mixs/mix'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

export default {
  name: 'ComplexTable',
  components: { Pagination },
  mixins: [mix],
  data() {
    return {
      // 数据列表
      dataList: {
        visible: false,
        table: {
          page: 1,
          total: 0,
          loading: false,
          size: 10,
          recommend_id: '',
          columns: [
            {
              label: 'ID',
              prop: 'book_id',
              align: 'center',
              width: 55
            },
            {
              label: '排序',
              prop: 'sort',
              align: 'center'
            },
            {
              label: '小说名称',
              prop: 'book_name',
              align: 'center'
            },
            {
              label: '状态',
              prop: 'status',
              align: 'center'
            },
            {
              label: '操作',
              prop: 'action',
              align: 'center'
            }
          ],
          data: []
        }
      },
      // 搜索
      search: {
        form: {
          channel: '',
          name: ''
        },
        loading: false
      },
      add: {
        active: 'first',
        type: '',
        form: {
          status: 1,
          name: '',
          sort: '',
          channel: ''
        },
        rules: {
          name: [
            { required: true, message: '请输入分类名称' }
          ]
        },
        loading: false
      },
      current: '',
      table: {
        columns: [
          {
            label: 'ID',
            prop: 'id',
            align: 'center',
            width: 55
          },
          {
            label: '频道',
            prop: 'sex',
            align: 'center'
          },
          {
            label: '推荐位名称',
            prop: 'name',
            align: 'center'
          },
          {
            label: '数量',
            prop: 'number',
            align: 'center'
          },
          {
            label: '状态',
            prop: 'status',
            align: 'center'
          },
          {
            label: '操作',
            prop: 'action',
            align: 'center',
            width: 249
          }
        ],
        data: [],
        total: 0,
        page: 1,
        size: 10,
        loading: false
      },
      btnList:[
        {
          name:'/recommed/list-2/add',
          flag:false,
        },
        {
          name:'/recommed/list-2/edit',
          flag:false,
        },
        {
          name:'/recommed/list-2/delete',
          flag:false,
        },
        {
          name:'/recommed/list-2/data',
          flag:false,
        }
      ]
    }
  },
  created() {
    this.$store.dispatch("user/showBtn",{name:'/recommed/list-2',btnName:''}).then(res=>{
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
    const query = this.$route.query
    const { current, type } = query
    this.add.type = type
    this.current = current
    if (!current) {
      this.getList()
    } else if (current === 'edit') {
      for (const key in query) {
        if (key === status) {
          this.$set(this.add.form, key, Number(query[key]))
        }
        if (key !== 'current') {
          this.$set(this.add.form, key, query[key])
        }
      }
    }
  },
  methods: {
    // 保存
    save() {
      this.$refs.addForm.validate(valid => {
        if (valid) {
          this.add.loading = true
          const obj = Object.assign({}, this.add.form)
          const submit = this.current === 'add' ? this.add.type === 'recommend' ? recommendAdd : rankAdd : rankUpdate
          submit(obj).then(res => {
            this.$message.success(res.message)
            this.add.loading = false
            if (this.current === 'add') {
              this.$refs.addForm.resetFields()
            }
          }).catch(() => {
            this.add.loading = false
          })
        }
      })
    },
    // 分页
    pagin({ page, limit }) {
      this.table.page = page
      this.table.size = limit
      this.getList()
    },
    // 数据列表分页
    dPagin({ page, limit }) {
      this.dataList.table.page = page
      this.dataList.table.size = limit
      this.getDataList()
    },
    // 数据列表切换开启禁用
    dChangeStatus(row) {
      this.dataList.table.loading = true
      const status = row.status === 1 ? 0 : 1
      console.log('row',row)
      rankUpdateStatus({
        status,
        id: row.id
      }).then(res => {
        this.$message.success(res.message)
        this.dataList.table.loading = false
        this.getDataList()
      })
    },
    // 切换开启禁用
    changeStatus(row) {
      this.table.loading = true
      const status = row.status === 1 ? 0 : 1
      rankUpdate({
        status,
        id: row.id
      }).then(res => {
        this.$message.success(res.message)
        this.table.loading = false
        this.getList()
      })
    },
    getList() {
      this.table.loading = true
      this.search.loading = true
      const data = Object.assign({}, this.search.form, {
        page: this.table.page,
        size: this.table.size
      })
      rankList(data).then(response => {
        this.table.data = response.data.data
        this.table.total = response.data.total
        this.table.loading = false
        this.search.loading = false
      })
    },
    toggleCurrent(current = '', query) {
      const { path } = this.$route
      this.$router.replace({
        path: '/redirect' + path,
        query: {
          current,
          ...query
        }
      })
    },
    sortChange() {
      //
    },
    edit(row) {
      this.toggleCurrent('edit', row)
    },
    remove(row) {
      this.$confirm('确认删除此记录吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.table.loading = true
        rankDelete({
          id: row.id
        }).then(res => {
          this.table.loading = false
          this.$message({
            type: 'success',
            message: res.message
          })
          this.getList()
        }).catch(() => {
          this.table.loading = false
        })
      }).catch(() => {
        //
      })
    },
    dcRemove(row) {
      this.$confirm('确认删除此记录吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.dataList.table.loading = true
        delBooks({
          id: this.dataList.table.recommend_id,
          book_ids: row.book_id
        }).then(res => {
          this.dataList.table.loading = false
          this.$message({
            type: 'success',
            message: res.message
          })
          this.getDataList()
        }).catch(() => {
          this.table.loading = false
        })
        /* bookDelete({
          id: row.id
        }).then(res => {
          this.dataList.table.loading = false
          this.$message({
            type: 'success',
            message: res.message
          })
          this.getDataList()
        }).catch(() => {
          this.dataList.table.loading = false
        }) */
      }).catch(() => {
        //
      })
    },
    showDataList(row) {
      this.dataList.table.page = 1
      this.dataList.table.recommend_id = row.id
      this.dataList.table.total = row.number
      this.dataList.visible = true
      this.getDataList()
    },
    // 获取数据列表
    getDataList(recommend_id) {
      this.dataList.table.loading = true
      getBooks({ id: this.dataList.table.recommend_id,page:this.dataList.table.page,size:this.dataList.table.size }).then(res => {
        this.dataList.table.total = res.data.total
        this.dataList.table.data = res.data.data
        this.dataList.table.loading = false
      }).catch(() => {
        this.dataList.table.loading = false
      })
    },
    // 排序
    sortList() {
      // console.log('dataList',this.dataList.table.data)
      const list = []
      const sortList = []
      console.log(this.dataList.table.data)
      this.dataList.table.data.map(item => {
        const json = { id: item.id, sort: item.sort }
        list.push(json)
        sortList.push(item.sort)
      })
      // const arr = sortList.sort()
      // // console.log(arr)
      // for (var i = 0; i < arr.length; i++) {
      //   if (arr[i] == arr[i + 1]) {
      //     this.$message({
      //       type: 'warning',
      //       message: '不能有重复的数字'
      //     })
      //     return
      //   }
      // }
      sortDataList({ sortArr: list }).then(res => {
        if (res.code == 0) {
          this.$message({
            type: 'success',
            message: '排序成功!'
          })
          this.getDataList()
        }
      })
    }
  }
}
</script>
