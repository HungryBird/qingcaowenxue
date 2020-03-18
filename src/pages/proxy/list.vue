<template>
  <div class="app-container">
    <div v-if="current === 'add'">
      <el-tabs v-model="add.active" @tab-click="handleClick">
        <el-tab-pane label="基本信息" name="first">
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
        </el-tab-pane>
        <el-tab-pane label="抽成设置" name="second">
          <el-form label-position="left" label-width="100px">
            <el-row>
              <el-col :span="8">
                <el-form-item label="抽成比例：" prop="password">
                  <el-input v-model="add.form.password" type="password" placeholder="请您输入抽成比例" />
                </el-form-item>
              </el-col>
              <el-col :span="16">
                <div style="line-height: 36px;padding: 0 10px;">
                  <span>填写 0 到 1 之间的数字。</span><span style="color: #f00;">若用户充值 1000 元, 抽成比例为 0.7，则需要向该代理打款 1000 x 0.7 = 700 元</span>
                </div>
              </el-col>
            </el-row>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="收款信息" name="third">
          <el-form label-width="100px">
            <el-row>
              <el-col :span="12">
                <el-form-item>
                  <el-radio-group v-model="add.form.payMethod">
                    <el-radio label="bankcard">银行卡</el-radio>
                    <el-radio label="alipay">支付宝</el-radio>
                    <el-radio label="wechat">微信</el-radio>
                  </el-radio-group>
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
                <el-form-item label="登录密码：" prop="password">
                  <el-input v-model="add.form.password" type="password" />
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
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="等级划分" name="fourth">等级划分</el-tab-pane>
      </el-tabs>
      <div />
      <el-button type="success">保存</el-button>
      <el-button type="danger" @click="toggleCurrent">返回</el-button>
    </div>
    <div v-else-if="current === 'edit'">
      <div>编辑</div>
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
              <el-button type="primary" size="mini" @click="handleUpdate(row)">
                推荐微信菜单
              </el-button>
              <el-button type="primary" size="mini" @click="handleUpdate(row)">
                微信配置
              </el-button>
              <el-button type="primary" size="mini" @click="handleUpdate(row)">
                编辑
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
            label: '名称',
            prop: 'username',
            align: 'center'
          },
          {
            label: '角色',
            prop: 'title',
            align: 'center'
          },
          {
            label: '上次登录时间',
            prop: 'last_login_time',
            align: 'center'
          },
          {
            label: '真实姓名',
            prop: 'real_name',
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
    handleClick() {
      //
    }
  }
}
</script>
