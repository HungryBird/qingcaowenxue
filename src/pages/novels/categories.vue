<template>
  <div class="app-container">
    <div v-if="current === 'add' || current === 'edit'">
      <el-form ref="addForm" label-width="100px" :rules="add.rules" :model="add.form">
        <el-row>
          <el-col :span="12">
            <el-form-item label="分类名称：" prop="name">
              <!-- <el-autocomplete
                v-model="add.form.name"
                class="inline-input"
                :fetch-suggestions="querySearch"
                placeholder="请输入内容"
                @select="handleSelect"
              /> -->
              <el-input v-model="add.form.name" placeholder="请输入内容" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="上级分类：" prop="pid">
              <el-select v-model="add.form.pid" placeholder="不选则为顶级分类">
                <el-option v-for="td in table.data" :key="td.id" :value="td.id" :label="td.name" clearable>
                  <div v-if="td.pid === 0">
                    {{ td.name }}
                  </div>
                  <div v-else>
                    —— —— {{ td.name }}
                  </div>
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="分类图片：" prop="thumb_url">
              <el-upload
                ref="upload"
                class="upload-demo"
                :multiple="false"
                :limit="1"
                :action="uploadUrl"
                name="image"
                :headers="headers"
                :on-preview="handlePreview"
                :on-remove="handleRemove"
                :file-list="add.list"
                :on-success="addUploadImgSuccess"
                list-type="picture"
              >
                <el-button size="small" type="primary">点击上传</el-button>
              </el-upload>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
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
          </el-col>
        </el-row>
      </el-form>
      <el-button type="success" :loading="add.loading" @click="save">保存</el-button>
      <el-button type="danger" @click="toggleCurrent('')">返回</el-button>
    </div>
    <div v-else>
      <div class="filter-container">
        <el-button class="filter-item" type="primary" icon="el-icon-refresh" @click="refresh" />
        <el-button class="filter-item" style="margin-left: 10px;" type="primary" @click="toggleCurrent('add')">
          添加
        </el-button>
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
              <el-button :type="row[cl.prop] === 1 ? 'primary' : 'danger'" size="mini" @click="updateStatus(row)">{{ row[cl.prop] === 1 ? '显示' : '不显示' }}</el-button>
            </div>
            <div v-else-if="cl.prop === 'name'" style="text-align: left;">
              {{ row['pid'] === 0 ? row[cl.prop] : `—— —— ${row[cl.prop]}` }}
            </div>
            <div v-else-if="cl.prop === 'thumb_url'">
              <el-image v-if="row['pid'] !== 0" :src="row[cl.prop]" fit="cover" />
            </div>
            <div v-else>
              {{ row[cl.prop] }}
            </div>
          </template>
        </el-table-column>
      </el-table>
      <!-- <el-button type="primary" style="margin-top: 20px;">排序</el-button> -->
    </div>
  </div>
</template>

<script>
import { categoryList, categoryUpdate, categoryDelete, categoryAdd } from '@/api/book/category'
import { urlGetName } from '@/utils'
import mix from '@/mixs/mix'

export default {
  name: 'ComplexTable',
  mixins: [mix],
  data() {
    return {
      // 上传地址
      uploadUrl: process.env.VUE_APP_BASE_API + '/common/upload_picture',
      // 上传头部
      headers: {
        token: ''
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
            align: 'center',
            width: 50
          },
          {
            label: '排序',
            prop: 'sort',
            align: 'center',
            width: 150
          },
          {
            label: '图片',
            prop: 'thumb_url',
            align: 'center'
          },
          {
            label: '分类名称',
            prop: 'name',
            align: 'center',
            width: 450
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
            width: 100
          },
          {
            label: '操作',
            prop: 'action',
            align: 'center',
            width: 154
          }
        ],
        data: [],
        total: 0,
        page: 1,
        size: 9999,
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
            name: urlGetName(this.$route.query[key]),
            url: this.$route.query[key]
          }]
          console.log('this.add.list: ', this.add.list)
        } else if (key === 'pid') {
          this.add.form[key] = this.$route.query[key] === 0 ? null : Number(this.$route.query[key])
        } else if (key === 'status') {
          this.add.form[key] = Number(this.$route.query[key])
        } else if (key !== 'current') {
          this.$set(this.add.form, key, this.$route.query[key])
        }
      }
    }
    this.getList()
  },
  methods: {
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
            if (this.current === 'add') {
              this.add.list = []
              this.$refs.addForm.resetFields()
              this.$refs.upload.clearFiles()
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
        let list = []
        for (const item in response.data) {
          const obj = {}
          let children = []
          for (const key in response.data[item]) {
            if (key === 'children') {
              children = response.data[item][key]
            } else {
              obj[key] = response.data[item][key]
            }
          }
          list.push(obj)
          list = list.concat(children)
        }
        this.table.data = list
        console.log('data: ', this.table.data)
        this.table.total = list.length
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
      console.log('res: ', res, 'file: ', file, 'fileList: ', fileList)
      this.wechatConfig.kefu = fileList
    }
  }
}
</script>
