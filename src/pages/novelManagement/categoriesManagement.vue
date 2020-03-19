<template>
  <div class="app-container">
    <div v-if="current === 'add' || current === 'edit'">
      <el-form label-position="left" label-width="100px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="分类名称：" prop="username">
              <el-autocomplete
                v-model="add.name"
                class="inline-input"
                :fetch-suggestions="querySearch"
                placeholder="请输入内容"
                @select="handleSelect"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="上级分类：" prop="level">
              <el-select>
                <el-option value="1">一级代理</el-option>
                <el-option value="2">二级代理</el-option>
                <el-option value="3">作者管理员</el-option>
                <el-option value="4">作者</el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="分类图片：" prop="password">
              <el-upload
                class="upload-demo"
                :multiple="false"
                :limit="1"
                action="https://jsonplaceholder.typicode.com/posts/"
                :on-preview="handlePreview"
                :on-remove="handleRemove"
                :file-list="wechatConfig.kefu"
                :on-success="onUploadKefuSuccess"
                list-type="picture"
              >
                <el-button size="small" type="primary">点击上传</el-button>
              </el-upload>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="状 态：" prop="switch">
              <el-radio-group v-model="add.form.switch">
                <el-radio label="on">
                  开启
                </el-radio>
                <el-radio label="off">
                  关闭
                </el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <el-button type="success">保存</el-button>
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
              <el-button type="danger" size="mini" @click="setWechatConfig(row)">
                删除
              </el-button>
            </div>
            <div v-else-if="cl.prop === 'sort'">
              <el-input v-model="row.sort" />
            </div>
            <div v-else-if="cl.prop === 'status'">
              <el-switch
                v-model="row.status"
                active-text="显示"
                inactive-text="不显示"
              />
            </div>
            <div v-else>
              {{ row[cl.prop] }}
            </div>
          </template>
        </el-table-column>
      </el-table>
      <el-button type="primary">排序</el-button>
    </div>
  </div>
</template>

<script>
import { fetchList } from '@/api/article'
import mix from '@/mixs/mix'

export default {
  name: 'ComplexTable',
  mixins: [mix],
  data() {
    return {
      add: {
        active: 'first',
        form: {
          switch: 'on',
          payMethod: 'bankcard'
        },
        loading: false
      },
      wechatConfig: {
        form: {
          kefu: ''
        },
        active: 'gzhpz',
        kefu: []
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
            label: '排序',
            prop: 'sort',
            align: 'center'
          },
          {
            label: '图片',
            prop: 'title',
            align: 'center'
          },
          {
            label: '分类名称',
            prop: 'last_login_time',
            align: 'center'
          },
          {
            label: '创建时间',
            prop: 'real_name',
            align: 'center'
          },
          {
            label: '状态',
            prop: 'status',
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
        limit: 10,
        loading: false
      }
    }
  },
  created() {
    const { current } = this.$route.query
    this.current = current
    if (!current) {
      this.getList()
    }
    console.log('router: ', this.$route)
  },
  methods: {
    getList() {
      this.table.loading = true
      fetchList(this.listQuery).then(response => {
        console.log('response: ', response)
        this.table.data = response.data.items
        this.table.total = response.data.total

        // Just to simulate the time of the request
        setTimeout(() => {
          this.table.loading = false
        }, 1.5 * 1000)
      })
    },
    toggleCurrent(current = '') {
      const { fullPath } = this.$route
      this.$router.replace({
        path: '/redirect' + fullPath,
        query: {
          current
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
    setWechatConfig(row) {
      this.toggleCurrent('wechatConfig')
      for (const key in row) {
        if (row.hasOwnProperty(key)) {
          this.$set(this.wechatConfig.form, key, row[key])
        }
      }
    },
    edit(row) {
      this.toggleCurrent('edit')
      for (const key in row) {
        if (row.hasOwnProperty(key)) {
          this.$set(this.add.form, key, row[key])
        }
      }
    },
    handlePreview() {
      //
    },
    handleRemove() {
      //
    },
    onUploadKefuSuccess(res, file, fileList) {
      console.log('res: ', res, 'file: ', file, 'fileList: ', fileList)
      this.wechatConfig.kefu = fileList
    }
  }
}
</script>
