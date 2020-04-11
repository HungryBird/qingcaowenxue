<template>
  <div class="app-container">
    <div v-if="current === 'add' || current === 'edit'">
      <el-form ref="addForm" :model="add.form" :rules="add.rules" label-width="150px">
        <el-form-item label="轮播名称：" prop="name">
          <el-input v-model="add.form.name" />
        </el-form-item>
        <el-form-item prop="thumb_id" label="轮播图">
          <el-upload
            ref="upload"
            class="upload-demo"
            :multiple="false"
            :limit="1"
            name="image"
            :action="upload_picture"
            :on-remove="handleRemove"
            :file-list="add.list"
            :on-success="onUploadImgSuccess"
            list-type="picture"
          >
            <el-button size="small" type="primary">点击上传</el-button>
          </el-upload>
        </el-form-item>
        <el-form-item label="所属频道：" prop="channel">
          <el-select v-model="add.form.channel" clearable>
            <el-option v-for="oc in options.channel" :key="oc.value" :label="oc.name" :value="oc.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="书籍：" prop="book_id">
          <el-autocomplete
            v-model="add.form.book_name"
            placeholder="输入书籍名可快速搜索"
            class="inline-input"
            :fetch-suggestions="querySearch"
            @select="handleSelect"
          />
        </el-form-item>
        <el-form-item label="url：" prop="url">
          <el-input v-model="add.form.url" />
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
      <div class="filter-container">
        <el-button class="filter-item" type="primary" icon="el-icon-refresh" @click="refresh" />
        <el-button class="filter-item" style="margin-left: 10px;" type="primary" plain @click="toggleCurrent('add')">
          添加轮播
        </el-button>
        <div class="filter-item" style="margin-left: 10px;">
          <el-select v-model="search.form.channel">
            <el-option v-for="oc in options.channel" :key="oc.id" :value="oc.value" :label="oc.name" />
          </el-select>
        </div>
        <el-button class="filter-item" style="margin-left: 10px;" type="primary" :loading="search.loading" @click="getList">
          搜索
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
              <el-button type="danger" size="mini" @click="adDelete(row.id)">
                删除
              </el-button>
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
import { adList, adAdd, adDelete, adUpdate } from '@/api/ad/list'
import { bookList } from '@/api/book/list'
import Pagination from '@/components/Pagination'
import { urlGetName } from '@/utils'
import mix from '@/mixs/mix'

export default {
  name: 'ComplexTable',
  components: {
    Pagination
  },
  mixins: [mix],
  data() {
    return {
      search: {
        form: {
          channel: ''
        },
        loading: false
      },
      options: {
        channel: [
          {
            name: '精选',
            value: 1
          },
          {
            name: '男生',
            value: 2
          },
          {
            name: '女生',
            value: 3
          },
          {
            name: '其他',
            value: 4
          }
        ]
      },
      // 上传头部
      headers: {
        token: ''
      },
      add: {
        form: {
          name: '',
          channel: '',
          thumb_id: '',
          book_id: '',
          book_name: '',
          url: '',
          status: 1
        },
        rules: {
          name: [
            { required: true, message: '请您输入分类名称' }
          ],
          thumb_id: [
            { required: true, message: '请上传轮播图' }
          ],
          channel: [
            { required: true, message: '请选择一个频道' }
          ],
          book_id: [
            { required: true, message: '请选择一个书籍' }
          ],
          status: [
            { required: true, message: '请选择一个状态' }
          ],
          url: [
            { required: true, message: '请输入url' }
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
            label: '名称',
            prop: 'name',
            align: 'center'
          },
          {
            label: 'url',
            prop: 'url',
            align: 'center'
          },
          {
            label: '书籍',
            prop: 'book_name',
            align: 'center'
          },
          {
            label: '频道',
            prop: 'channel',
            align: 'center'
          },
          {
            label: '图片',
            prop: 'picture',
            align: 'center'
          },
          {
            label: '生成时间',
            prop: 'create_time',
            align: 'center',
            width: 200
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
            name: urlGetName(this.$route.query[key]),
            url: this.$route.query[key]
          }]
        } else if (key === 'status') {
          this.$set(this.add.form, key, Number(this.$route.query[key]))
        } else if (key !== 'current') {
          this.$set(this.add.form, key, this.$route.query[key])
        }
      }
      console.log('this.add: ', this.add)
    }
    this.getList()
  },
  methods: {
    // 输入查询
    querySearch(queryString, cb) {
      // bookList
      bookList({
        name: queryString,
        size: 9999999999999
      }).then(res => {
        cb(res.data.data.map(item => {
          item.value = item.name
          return item
        }))
      })
    },
    // 上传成功
    onUploadImgSuccess(...args) {
      this.add.list = args[2]
      this.add.form.thumb_id = args[0].data.id
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
          const submit = this.current === 'add' ? adAdd : adUpdate
          submit(obj).then(res => {
            this.$message.success(res.message)
            this.add.loading = false
            if (this.current === 'add') {
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
    handleSelect(item) {
      this.add.form.book_id = item.id
    },
    // 更新排序
    changeSort(sort, row) {
      this.table.loading = true
      adUpdate({
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
      adUpdate({
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
      this.search.loading = true
      const data = Object.assign({}, this.search.form, {
        page: this.table.page,
        size: this.table.size
      })
      adList(data).then(response => {
        this.table.data = response.data.data
        this.table.total = response.data.total
        this.table.loading = false
        this.search.loading = false
      }).catch(() => {
        this.table.loading = false
        this.search.loading = false
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
    adDelete(id) {
      console.log('id: ', id)
      this.$confirm('确定删除该数据？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.table.loading = true
        adDelete({
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
