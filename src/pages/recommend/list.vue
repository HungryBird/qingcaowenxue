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
        <el-select v-model="search.form.channel" placeholder="选择频道" class="filter-item" style="margin-left: 10px;">
          <el-option value="1" label="全部" />
          <el-option value="2" label="精选" />
          <el-option value="3" label="男生" />
          <el-option value="4" label="女生" />
          <el-option value="5" label="其它" />
        </el-select>
        <div class="filter-item" style="margin-left: 10px;">
          <el-input placeholder="输入需查询推荐位名臣">
            <el-button slot="append" icon="el-icon-search" />
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
              <el-button type="primary" size="mini" @click="showDataList(row)">
                数据列表
              </el-button>
              <el-button type="primary" size="mini" @click="edit(row)">
                编辑
              </el-button>
              <el-button type="danger" size="mini" @click="remove(row)">
                删除
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
                <el-button v-show="row.status" size="mini" type="primary">
                  开启
                </el-button>
                <el-button v-show="!row.status" size="mini" type="danger">
                  禁用
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
        <el-button type="primary">
          排序
        </el-button>
        <pagination v-show="dataList.table.total>0" :total="dataList.table.total" :page.sync="dataList.table.page" :limit.sync="dataList.table.limit" @pagination="getList" />
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { recommendList } from '@/api/recommend'
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
          limit: 10,
          columns: [
            {
              label: 'ID',
              prop: 'id',
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
              prop: 'name',
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
          channel: ''
        },
        loading: false
      },
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
            align: 'center',
            width: 55
          },
          {
            label: '频道',
            prop: 'channel',
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
      recommendList().then(response => {
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
