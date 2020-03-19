<template>
  <div class="app-container">
    <div v-if="current === 'detail'">
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
        <el-button class="filter-item" style="margin-left: 10px;" type="primary" @click="toggleCurrent('export')">
          导出
        </el-button>
        <el-select v-model="search.form.proxy" placeholder="我的代理" class="filter-item" style="margin-left: 10px;">
          <el-option value="1" label="全部代理" />
          <el-option value="2" label="精选" />
          <el-option value="3" label="男生" />
          <el-option value="4" label="女生" />
          <el-option value="5" label="其它" />
        </el-select>
        <div class="filter-item" style="margin-left: 10px;">
          <el-date-picker
            v-model="search.form.date"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />
        </div>
        <el-button class="filter-item" style="margin-left: 10px;" icon="el-icon-search" type="primary" />
      </div>
      <aside>
        <a href="javascript:;">
          金额：总充值<span style="color: #f00;">1000</span>元，提现<span style="color: #f00;">666</span>元。
        </a>
      </aside>
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
              <el-button type="primary" size="mini" @click="showDataList(row)">
                查看详情
              </el-button>
            </div>
            <div v-else-if="cl.prop === 'sort'">
              <el-input v-model="row.sort" />
            </div>
            <div v-else-if="cl.prop === 'status'">
              <el-button v-show="row.status" size="mini" type="primary">
                开启
              </el-button>
              <el-button v-show="!row.status" size="mini" type="danger">
                禁用
              </el-button>
            </div>
            <div v-else-if="cl.prop === 'number'">
              <span style="background-color: #F9F2F4;border-radius: 4px;color: #ca4440;font-size: 90%;padding: 2px 4px;white-space: nowrap;">
                {{ row[cl.prop] || 0 }}
              </span>
            </div>
            <div v-else>
              {{ row[cl.prop] }}
            </div>
          </template>
        </el-table-column>
      </el-table>
      <pagination v-show="table.total>0" :total="table.total" :page.sync="table.page" :limit.sync="table.limit" @pagination="getList" />
    </div>
  </div>
</template>

<script>
import { fetchList } from '@/api/article'
import mix from '@/mixs/mix'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

export default {
  name: 'ComplexTable',
  components: { Pagination },
  mixins: [mix],
  data() {
    return {
      // 搜索
      search: {
        form: {
          proxy: '',
          date: ''

        },
        loading: false
      },
      current: '',
      table: {
        columns: [
          {
            label: '申请人',
            prop: 'applyPerson',
            align: 'center'
          },
          {
            label: '提交时间',
            prop: 'submitTime',
            align: 'center'
          },
          {
            label: '充值金额',
            prop: 'rechargeMoney',
            align: 'center'
          },
          {
            label: '提现金额',
            prop: 'withDraw',
            align: 'center'
          },
          {
            label: '手续费',
            prop: 'serviceCharge',
            align: 'center'
          },
          {
            label: '实收金额',
            prop: 'shje',
            align: 'center'
          },
          {
            label: '利润',
            prop: 'lr',
            align: 'center'
          },
          {
            label: '收款人',
            prop: 'skr',
            align: 'center',
            width: 450
          },
          {
            label: '审核',
            prop: 'sh',
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
    },
    remove(row) {
      this.$confirm('确认删除此记录吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message({
          type: 'success',
          message: '删除成功!'
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
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
      }).catch(() => {
        //
      })
    },
    showDataList(row) {
      this.dataList.visible = true
    }
  }
}
</script>
