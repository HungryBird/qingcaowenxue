<template>
  <div class="app-container">
    <div v-if="current === 'add' || current === 'edit'">
      <el-form ref="addForm" :model="add.form" :rules="add.rules" label-width="150px">
        <el-form-item label="公告标题：" prop="name">
          <el-input v-model="add.form.name" />
        </el-form-item>
        <el-form-item label="可见对象：" prop="obj">
          <el-select v-model="add.form.obj">
            <el-options value="1" label="测试1" />
          </el-select>
        </el-form-item>
        <el-form-item label="内容：" prop="content">
          <tinymce ref="tinymce" v-model="add.form.content" :height="300" />
        </el-form-item>
        <el-form-item label="状 态：" prop="status">
          <el-radio-group v-model="add.form.status">
            <el-radio :label="1">
              开启
            </el-radio>
            <el-radio :label="0">
              关闭
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item>
          <el-button size="mini" type="primary" :loading="add.addLoading" @click="save">
            保存
          </el-button>
          <el-button size="mini" type="danger" @click="toggleCurrent('')">
            返回
          </el-button>
        </el-form-item>
      </el-form>
    </div>
    <div v-else>
      <el-alert :title="title" type="error" effect="dark" style="margin-bottom: 10px;" />
      <el-row :gutter="20">
        <el-col :span="6">
          <el-tabs v-model="tabActive" type="card" @tab-click="toggleTab">
            <el-tab-pane name="order" label="订单统计" />
            <el-tab-pane name="user" label="用户统计" />
          </el-tabs>
        </el-col>
        <el-col :span="18" style="display: flex;">
          <el-select style="flex: 1;">
            <el-option v-for="or in options.roles" :key="or.id" :label="or.label" :value="or.value" />
          </el-select>
          <el-button icon="el-icon-search" type="primary" style="margin-left: 10px;" />
        </el-col>
      </el-row>
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
              <el-button type="primary" size="mini" @click="edit(row)">
                编辑
              </el-button>
              <el-button v-if="row['pid'] !== 0" type="danger" size="mini" @click="categoryDelete(row.id)">
                删除
              </el-button>
            </div>
            <div v-else-if="cl.prop === 'sort'">
              <el-input v-if="row['pid'] !== 0" v-model="row.sort" @change="changeSort($event, row)" />
            </div>
            <div v-else-if="cl.prop === 'status'">
              <el-button :type="row[cl.prop] === 1 ? 'primary' : 'danger'" size="mini" @click="updateStatus(row)">{{ row[cl.prop] === 1 ? '开启' : '禁用' }}</el-button>
            </div>
            <div v-else>
              {{ row[cl.prop] }}
            </div>
          </template>
        </el-table-column>
      </el-table>
      <pagination v-show="table.total>0" :total="table.total" :page.sync="table.page" :limit.sync="table.size" @pagination="pagin" />
    </div>
  </div>
</template>

<script>
import { categoryList, categoryUpdate, categoryDelete, categoryAdd } from '@/api/book/category'
import Tinymce from '@/components/Tinymce'
import Pagination from '@/components/Pagination'
import mix from '@/mixs/mix'

export default {
  name: 'ComplexTable',
  components: {
    Pagination,
    Tinymce
  },
  mixins: [mix],
  data() {
    return {
      tabActive: 'order',
      title: '您好老哥',
      // 上传地址
      uploadUrl: 'http://admin_api.fuleien.com/main/common/upload_picture',
      // 上传头部
      headers: {
        token: ''
      },
      options: {
        roles: []
      },
      add: {
        form: {
          name: '',
          pid: null,
          thumb_id: '',
          thumb_url: '',
          status: 1
        },
        rules: {
          name: [
            { required: true, message: '请您输入分类名称' }
          ]
        },
        list: [],
        loading: false
      },
      current: '',
      table: {
        columns: [
          {
            label: 'ID',
            prop: 'id',
            align: 'center'
          },
          {
            label: '公告名称',
            prop: 'title',
            align: 'center'
          },
          {
            label: '内容',
            prop: 'content',
            align: 'center'
          },
          {
            label: '创建时间',
            prop: 'create_time',
            align: 'center'
          },
          {
            label: '状态',
            prop: 'status',
            align: 'center',
            width: 154
          },
          {
            label: '发布人',
            prop: 'real_name',
            align: 'center',
            width: 154
          },
          {
            label: '操作',
            prop: 'action',
            align: 'center'
          }
        ],
        data: [],
        total: 0,
        page: 1,
        size: 10,
        loading: false
      }
    }
  },
  created() {
    const { current } = this.$route.query
    this.headers.token = this.$store.getters.token
    this.current = current
    if (current === 'edit') {
      for (const key in this.$route.query) {
        if (key === 'thumb_url') {
          this.add.list = [{
            name: '',
            url: this.$route.query[key]
          }]
        } else if (key === 'pid' || key === 'status') {
          this.add.form.pid = Number(this.$route.query[key])
        } else if (key !== 'current') {
          this.$set(this.add.form, key, this.$route.query[key])
        }
      }
      console.log('this.add: ', this.add)
    }
    this.getList()
  },
  methods: {
    // 切换tab
    toggleTab(tab) {
      //
    },
    // 翻页
    pagin(data) {
      const { page, limit } = data
      this.table.page = page
      this.table.size = limit
      this.getList()
    },
    save() {
      this.$refs.addForm.validate(valid => {
        if (valid) {
          this.add.loading = true
          const obj = Object.assign({}, this.add.form)
          obj.pid = obj.pid ? obj.pid : 0
          const submit = this.current === 'add' ? categoryAdd : categoryUpdate
          submit(obj).then(res => {
            this.$message.success(res.message)
            this.add.loading = false
            if (this.current === 'add' && this.$refs.addForm.resetFields()) {
              this.add.list = []
            }
          })
        }
      })
    },
    addUploadImgSuccess(res, file, fileList) {
      const { id, url } = res.data
      this.add.form.thumb_url = url
      this.add.form.thumb_id = id
      this.add.list = fileList
    },
    handlePreview() {
      //
    },
    handleRemove() {
      this.add.form.thumb_id = ''
      this.add.form.thumb_url = ''
    },
    // 选择
    handleSelect() {

    },
    // 更新排序
    changeSort(sort, row) {
      this.table.loading = true
      categoryUpdate({
        id: row.id,
        sort
      }).then(res => {
        this.$message.success(res.message)
        this.getList()
        this.table.loading = false
      }).catch((err) => {
        this.table.loading = false
        this.$message.error(err.message)
      })
    },
    // 更新状态
    updateStatus(row) {
      const status = row.status === 1 ? 0 : 1
      this.table.loading = true
      categoryUpdate({
        id: row.id,
        status
      }).then(res => {
        this.$message.success(res.message)
        this.getList()
        this.table.loading = false
      }).catch((err) => {
        this.table.loading = false
        this.$message.error(err.message)
      })
    },
    // 获取列表
    getList() {
      this.table.loading = true
      categoryList({
        page: this.table.page,
        size: this.table.size
      }).then(response => {
        this.table.data = response.data.data.reverse()
        this.table.total = response.data.total
        this.table.loading = false
      })
    },
    toggleCurrent(current = '', row) {
      const { path } = this.$route
      this.$router.replace({
        path: '/redirect' + path,
        query: {
          current,
          ...row
        }
      })
    },
    querySearch(queryString, cb) {
      // 调用 callback 返回建议列表的数据
      cb([{
        value: '123'
      }])
    },
    sortChange() {
      //
    },
    handleClick(row) {
      console.log('handleClick: ', row)
    },
    recommend(row) {
      this.$confirm('确认要推荐微信菜单吗?此操作覆盖之前的菜单，新的菜单生效时间24小时内!', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message({
          type: 'success',
          message: '推送成功!'
        })
      }).catch(() => {
        //
      })
    },
    categoryDelete(id) {
      this.$confirm('确定删除该数据？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.table.loading = true
        categoryDelete({
          id
        }).then(res => {
          this.$message.success(res.message)
          this.getList()
          this.table.loading = false
        }).catch((err) => {
          this.table.loading = false
          this.$message.error(err.message)
        })
      })
    },
    edit(row) {
      this.toggleCurrent('edit', row)
    },
    onUploadKefuSuccess(res, file, fileList) {
      this.wechatConfig.kefu = fileList
    }
  }
}
</script>
