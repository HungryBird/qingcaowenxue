<template>
  <div class="app-container">
    <div v-if="current === 'add' || current === 'edit'">
      <el-form label-position="left" label-width="100px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="管理员账号：" prop="username">
              <el-select filterable>
                <el-option value="admin">admin</el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="代理级别：" prop="level">
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
            <el-form-item label="登录密码：" prop="password">
              <el-input v-model="add.form.password" type="password" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="上级代理：" prop="username">
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
            <el-form-item label="代理名称：" prop="username">
              <el-input />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="手机号码：" prop="username">
              <el-input type="tel" />
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
        <el-button class="filter-item" style="margin-left: 10px;" type="primary" plain @click="toggleCurrent('add')">
          添加群发链接
        </el-button>
        <el-select v-model="search.form.myProxy" class="filter-item" placeholder="我的代理" style="margin-left: 10px;">
          <el-option value="1" label="超级管理员" />
        </el-select>
        <el-button class="filter-item" type="primary" icon="el-icon-search" style="margin-left: 10px;">
          搜索
        </el-button>
        <div class="filter-item" style="margin-left: 10px;color: #f00;">
          注：[ 仅 48 小时内和公众号有过交互 (点击菜单, 回复等) 的粉丝才能收到 ]
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
              <el-button type="primary" size="mini" @click="recommend(row)">
                发送
              </el-button>
              <el-button type="primary" size="mini" @click="edit(row)">
                编辑
              </el-button>
              <el-button type="danger" size="mini" @click="remove(row)">
                删除
              </el-button>
            </div>
            <div v-else-if="cl.prop === 'cover'">
              <el-image :src="row[cl.prop]" />
            </div>
            <div v-else-if="cl.prop === 'name'">
              <div>
                推荐精彩文章：医流高手
                <a href="javascript:;" style="color: #069;">
                  [测试发送]
                </a>
              </div>
              <div>
                URL：<a href="javascript:;" style="color: #069;">http://new.fuleien.com/index/user/history/uid=1</a>
              </div>
            </div>
            <div v-else-if="cl.prop === 'status'">
              <el-button v-if="!row[cl.prop]" size="mini" type="danger">
                禁用
              </el-button>
              <el-button v-else size="mini" type="primary">
                开启
              </el-button>
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
      search: {
        form: {},
        loading: false
      },
      add: {
        active: 'first',
        form: {
          switch: 'on',
          payMethod: 'bankcard'
        }
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
            label: '封面',
            prop: 'cover',
            align: 'center'
          },
          {
            label: '名称',
            prop: 'name',
            align: 'center'
          },
          {
            label: '描述',
            prop: 'descript',
            align: 'center'
          },
          {
            label: '接受粉丝[充值情况]',
            prop: 'position',
            align: 'center'
          },
          {
            label: '接受粉丝[性别]',
            prop: 'sex',
            align: 'center'
          },
          {
            label: '状态',
            prop: 'status',
            align: 'center'
          },
          {
            label: '创建时间',
            prop: 'create_time',
            align: 'center'
          },
          {
            label: '操作',
            prop: 'action',
            align: 'center',
            width: 298
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
    edit(row) {
      this.toggleCurrent('edit')
      for (const key in row) {
        if (row.hasOwnProperty(key)) {
          this.$set(this.add.form, key, row[key])
        }
      }
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
    }
  }
}
</script>
