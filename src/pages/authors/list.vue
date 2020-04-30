<template>
  <div class="app-container">
    <div v-if="current === 'add' || current === 'edit'">
      <el-tabs v-model="add.active" @tab-click="handleClick">
        <el-tab-pane label="基本信息" name="first">
          <el-form ref="addForm1" :model="add.form" :rules="add.rules" label-width="120px">
            <el-row>
              <el-col :span="12">
                <el-form-item label="登录账号：" prop="username">
                  <el-input v-model="add.form.username" />
                </el-form-item>
              </el-col>
            </el-row>
            <!-- <el-row>
              <el-col :span="12">
                <el-form-item label="代理级别：" prop="level">
                  <el-select>
                    <el-option value="1">一级代理</el-option>
                    <el-option value="2">二级代理</el-option>
                    <el-option value="3">三级代理</el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row> -->
            <el-row>
              <el-col :span="12">
                <el-form-item label="登录密码：" prop="password">
                  <el-input v-model="add.form.password" type="password" show-password />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="手机号码：" prop="mobile">
                  <el-input v-model="add.form.mobile" type="mobile" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="真实名：" prop="truename">
                  <el-input v-model="add.form.truename" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="笔名：" prop="nickname">
                  <el-input v-model="add.form.nickname" />
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
        </el-tab-pane>
        <el-tab-pane label="抽成设置" name="second">
          <el-form :model="add.form" :rules="add.rules" label-width="120px">
            <el-row>
              <el-col :span="8">
                <el-form-item label="抽成百分比：" prop="percentage">
                  <el-input v-model="add.form.percentage" placeholder="请您输入抽成比例" />
                </el-form-item>
              </el-col>
              <el-col :span="16">
                <div style="line-height: 36px;padding: 0 10px;">
                  <span>填写 0 到 100 之间的数字。</span><span style="color: #f00;">若用户充值 1000 元, 抽成比例为 70，则需要向该代理打款 1000 x 70% = 700 元</span>
                </div>
              </el-col>
            </el-row>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="收款信息" name="third">
          <el-form ref="addForm" :model="add.form" :rules="add.rules" label-width="120px">
            <!-- <el-row>
              <el-col :span="12">
                <el-form-item>
                  <el-radio-group v-model="add.form.payMethod">
                    <el-radio label="bankcard">银行卡</el-radio>
                    <el-radio label="alipay">支付宝</el-radio>
                    <el-radio label="wechat">微信</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
            </el-row> -->
            <el-row>
              <el-col :span="24">
                <el-row>
                  <el-col :span="12">
                    <el-form-item label="持卡人姓名：" prop="name">
                      <el-input v-model="add.form.author.name" />
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="12">
                    <el-form-item label="银行卡号：" prop="bank_card">
                      <el-input v-model="add.form.author.bank_card" />
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="12">
                    <el-form-item label="开户行：" prop="bank_address">
                      <el-input v-model="add.form.author.bank_address" />
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-row>
                  <el-col :span="12">
                    <el-form-item label="支付宝账号：" prop="alipay">
                      <el-input v-model="add.form.author.alipay" />
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-row>
                  <el-col :span="12">
                    <el-form-item label="微信号：" prop="wepay">
                      <el-input v-model="add.form.author.wepay" />
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </el-form>
        </el-tab-pane>
      </el-tabs>
      <div />
      <el-button type="success" :loading="add.loading" @click="saveAdd">保存</el-button>
      <el-button type="danger" @click="toggleCurrent('')">返回</el-button>
    </div>
    <div v-else>
      <div class="filter-container">
        <el-button class="filter-item" type="primary" icon="el-icon-refresh" @click="toggleCurrent('')" />
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
              <el-button type="danger" size="mini" @click="remove(row)">
                删除
              </el-button>
              <el-button type="primary" size="mini" @click="edit(row)">
                编辑
              </el-button>
            </div>
            <div v-else-if="cl.prop === 'status'">
              <el-button size="mini" :type="row[cl.prop] === 1 ? 'primary' : 'danger'" @click="changeStatus(row)">{{ row[cl.prop] === 1 ? '开启' : '关闭' }}</el-button>
            </div>
            <div v-else>
              {{ row[cl.prop] }}
            </div>
          </template>
        </el-table-column>
      </el-table>

      <pagination v-show="table.total>0" :total="table.total" :page.sync="table.page" :limit.sync="table.limit" @pagination="pagin" />
    </div>
  </div>
</template>

<script>
import { getEditOther } from '@/api/proxy/list'
import { authorList, authorAdd, authorDelete, authorUpdate } from '@/api/author/list'
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
          bank_address: '',
          username: '',
          password: '',
          nickname: '',
          mobile: '',
          status: 1,
          percentage: '',
          name: '',
          wepay: '',
          alipay: '',
          bank_card: ''
        },
        loading: false,
        rules: {
          username: [
            { required: true, message: '请输入用户名称' }
          ],
          bank_card: [
            { required: true, message: '请输入银行卡号' }
          ],
          name: [
            { required: true, message: '请输入银行持卡人' }
          ],
          bank_address: [
            { required: true, message: '请输入银行开户行' }
          ]
        }
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
            label: '名称',
            prop: 'username',
            align: 'center'
          },
          {
            label: '上次登录时间',
            prop: 'last_time',
            align: 'center'
          },
          {
            label: '真实姓名',
            prop: 'truename',
            align: 'center'
          },
          {
            label: '昵称',
            prop: 'nickname',
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
            width: 198
          }
        ],
        data: [],
        total: 0,
        page: 1,
        size: 20,
        loading: false
      }
    }
  },
  created() {
    const query = this.$route.query
    const { current } = query
    this.current = current
    if (!current) {
      this.getList()
    }
    if (current === 'edit') {
      for (const key in query) {
        if (key !== 'password') {
          this.$set(this.add.form, key, query[key])
        }
      }
      console.log('this.add.form.author: ', JSON.stringify(this.add.form.author))
      // this.getEditOther()
    }
  },
  methods: {
    // 开启关闭
    changeStatus(row) {
      const status = row.status === 1 ? 0 : 1
      this.table.loading = true
      authorUpdate({
        id: row.id,
        status
      }).then(res => {
        this.$message.success(res.message)
        this.table.loading = false
        this.getList()
      }).catch(err => {
        this.$message.error(err.message)
        this.table.loading = false
      })
    },
    // 获取其他编辑数据
    getEditOther() {
      const id = this.add.form.id
      getEditOther({ id }).then(res => {
        const data = res.data
        data.password = ''
        for (const key in data) {
          this.$set(this.add.form, key, data[key])
        }
      })
    },
    saveAdd() {
      let isTrue1 = false
      let isTrue2 = false
      this.$refs.addForm1.validate(valid => {
        isTrue1 = valid
      })
      this.$refs.addForm.validate(valid => {
        isTrue2 = valid
      })
      if (isTrue1 && isTrue2) {
        this.add.loading = true
        const obj = Object.assign({}, this.add.form)
        obj.pid = obj.pid ? obj.pid : 0
        // obj.id = obj.admin_id
        obj.id = obj.id
        console.log('obj', obj)
        const submit = this.current === 'add' ? authorAdd : authorUpdate
        submit(obj).then(res => {
          this.$message.success(res.message)
          this.add.loading = false
          if (this.current === 'add' && this.$refs.addForm.resetFields()) return
          this.toggleCurrent()
        }).catch(() => {
          this.add.loading = false
        })
      } else {
        this.$message.error('请您填写完整数据')
        this.add.loading = false
      }
    },
    // 翻页
    pagin(data) {
      const { limit, page } = data
      this.table.size = limit
      this.table.page = page
      this.getList()
    },
    getList() {
      this.table.loading = true
      authorList({
        size: this.table.size,
        page: this.table.page
      }).then(response => {
        this.table.data = response.data.data
        this.table.size = response.data.per_page
        this.table.total = response.data.total
        this.table.loading = false
      })
    },
    toggleCurrent(current = '', obj) {
      const { fullPath } = this.$route
      this.$router.replace({
        path: '/redirect' + fullPath,
        query: {
          current,
          ...obj
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
    setWechatConfig(row) {
      this.toggleCurrent('wechatConfig')
      for (const key in row) {
        if (row.hasOwnProperty(key)) {
          this.$set(this.wechatConfig.form, key, row[key])
        }
      }
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
        authorDelete({
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
      })
    }
  }
}
</script>
