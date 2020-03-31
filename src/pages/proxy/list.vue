<template>
  <div class="app-container">
    <div v-if="current === 'add' || current === 'edit'">
      <el-tabs v-model="add.active" @tab-click="handleClick">
        <el-tab-pane label="基本信息" name="first">
          <el-form ref="addForm" :model="add.form" :rules="add.rules" label-width="120px">
            <el-row>
              <el-col :span="12">
                <el-form-item label="管理员账号：" prop="username">
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
                  <el-input v-model="add.form.password" type="password" />
                </el-form-item>
              </el-col>
            </el-row>
            <!-- <el-row>
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
            </el-row> -->
            <!-- <el-row>
              <el-col :span="12">
                <el-form-item label="代理名称：" prop="username">
                  <el-input />
                </el-form-item>
              </el-col>
            </el-row> -->
            <el-row>
              <el-col :span="12">
                <el-form-item label="手机号码：" prop="mobile">
                  <el-input v-model="add.form.mobile" type="mobile" />
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
          <el-form ref="addForm" :model="add.form" :rules="add.rules" label-width="120px">
            <el-row>
              <el-col :span="8">
                <el-form-item label="抽成比例：" prop="percentage">
                  <el-input v-model="add.form.percentage" placeholder="请您输入抽成比例" />
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
                      <el-input v-model="add.form.name" />
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="12">
                    <el-form-item label="银行卡号：" prop="bank_card">
                      <el-input v-model="add.form.bank_card" />
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="12">
                    <el-form-item label="开户行：" prop="bank_address">
                      <el-input v-model="add.form.bank_address" />
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
                      <el-input v-model="add.form.alipay" />
                    </el-form-item>
                  </el-col>
                </el-row>
                <!-- <el-row>
                  <el-col :span="12">
                    <el-form-item label="姓名：" prop="password">
                      <el-input v-model="add.form.password" />
                    </el-form-item>
                  </el-col>
                </el-row> -->
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-row>
                  <el-col :span="12">
                    <el-form-item label="微信号：" prop="wepay">
                      <el-input v-model="add.form.wepay" />
                    </el-form-item>
                  </el-col>
                </el-row>
                <!-- <el-row>
                  <el-col :span="12">
                    <el-form-item label="昵称：" prop="password">
                      <el-input v-model="add.form.password" />
                    </el-form-item>
                  </el-col>
                </el-row> -->
              </el-col>
            </el-row>
          </el-form>
        </el-tab-pane>
        <!-- <el-tab-pane label="等级划分" name="fourth">
          <el-form label-position="left" label-width="100px">
            <el-row>
              <el-col :span="12">
                <el-form-item label="等级：" prop="username">
                  <el-select filterable>
                    <el-option value="admin">admin</el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="备注：" prop="level">
                  <el-input type="textarea" />
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-tab-pane> -->
        <!-- <el-tab-pane v-if="current === 'edit'" label="联系信息" name="five">
          <el-form label-position="left" label-width="100px">
            <el-row>
              <el-col :span="12">
                <el-form-item label="联系人姓名：" prop="level">
                  <el-input />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="联系电话：" prop="level">
                  <el-input />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="公司名称：" prop="level">
                  <el-input />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="对接公众号昵称：" prop="level">
                  <el-input />
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-tab-pane> -->
      </el-tabs>
      <div />
      <el-button type="success" :loading="add.loading" @click="saveAdd">保存</el-button>
      <el-button type="danger" @click="toggleCurrent('')">返回</el-button>
    </div>
    <div v-else-if="current === 'wechatConfig'">
      <el-tabs v-model="wechatConfig.active">
        <el-tab-pane label="公众号配置" name="gzhpz">
          <el-form label-position="left" label-width="100px">
            <el-row>
              <el-col :span="12">
                <el-form-item label="类型：" prop="username">
                  <el-radio>
                    认证服务号
                  </el-radio>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="原始ID：" prop="level">
                  <el-input />
                </el-form-item>
              </el-col>
              <el-col :span="12" style="padding: 10px;">
                注意: 上线后请不要更改公众号，否则会影响先前的粉丝，如需换号请申请开新号
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="微信号：" prop="password">
                  <el-input v-model="add.form.password" type="password" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="微信公众号名称：" prop="password">
                  <el-input v-model="add.form.password" type="password" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="App ID：" prop="password">
                  <el-input v-model="add.form.password" type="password" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="App Secret：" prop="password">
                  <el-input v-model="add.form.password" type="password" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="客服二维码：" prop="switch">
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
          </el-form>
        </el-tab-pane>
        <el-tab-pane name="gzhjr" label="公众号接入">
          <el-row>
            <el-col :span="12">
              <el-alert
                title="注意: 接入公众号必须是&quot;认证服务号&quot;"
                :closable="false"
              />
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12" style="line-height: 36px;">
              公众号设置 (微信后台 > 公众号设置 > 功能设置)
            </el-col>
          </el-row>
          <el-form label-width="187px">
            <el-row>
              <el-col :span="12">
                <el-form-item label="业务域名：">
                  <el-input :disabled="true" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="JS接口安全域名：">
                  <el-input :disabled="true" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="网页授权域名：">
                  <el-input :disabled="true" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col style="line-height: 36px;" :span="12">
                公众号回复 (微信后台 > 基本配置)
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="URL(服务器地址)：">
                  <el-input :disabled="true" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="Token(令牌)：">
                  <el-input :disabled="true" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-button type="success">
                  生成token
                </el-button>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="EncodingAESKey(消息加解密密钥)：">
                  <el-input :disabled="true" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-button type="success">
                  生成解密秘钥
                </el-button>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="消息加解密方式：">
                  明文模式
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-tab-pane>
        <el-tab-pane name="qdpz" label="签到配置">
          <el-form label-width="187px">
            <el-row>
              <el-col :span="12">
                <el-form-item label="签到送书币：">
                  <el-input />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="连续签到书币：">
                  <el-input />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="最高赠送书币：">
                  <el-input />
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-tab-pane>
      </el-tabs>
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
              <!-- <el-button type="primary" size="mini" @click="recommend(row)">
                推荐微信菜单
              </el-button> -->
              <el-button type="primary" size="mini" @click="setWechatConfig(row)">
                公众查看
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
import { adminList, add_agent, update_agent, getEditOther } from '@/api/proxy/list'
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
            label: '角色',
            prop: 'title',
            align: 'center'
          },
          {
            label: '上次登录时间',
            prop: 'update_time',
            align: 'center'
          },
          {
            label: '真实姓名',
            prop: 'truename',
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
        size: 10,
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
        this.$set(this.add.form, key, query[key])
      }
      this.getEditOther()
    }
  },
  methods: {
    // 开启关闭
    changeStatus(row) {
      const status = row.status === 1 ? 0 : 1
      this.table.loading = true
      update_agent({
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
        for (const key in data) {
          this.$set(this.add.form, key, data[key])
        }
      })
    },
    saveAdd() {
      this.$refs.addForm.validate(valid => {
        if (valid) {
          this.add.loading = true
          const obj = Object.assign({}, this.add.form)
          obj.pid = obj.pid ? obj.pid : 0
          const submit = this.current === 'add' ? add_agent : update_agent
          submit(obj).then(res => {
            this.$message.success(res.message)
            this.add.loading = false
            if (this.current === 'add' && this.$refs.addForm.resetFields()) return
          })
        } else {
          this.$message.error('请您填写完整数据')
          this.add.loading = false
        }
      })
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
      adminList({
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
