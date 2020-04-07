<template>
  <div class="app-container">
    <div v-if="current === 'add' || current === 'edit'">
      <el-tabs v-model="add.active">
        <el-tab-pane label="活动信息" name="info">
          <el-form ref="add" label-width="200px" :model="add.form" :rules="add.rules">
            <el-row>
              <el-col :span="12">
                <el-form-item label="活动名称：" prop="name">
                  <el-input v-model="add.form.name" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="充值金额：" prop="money">
                  <el-input-number v-model="add.form.money" :precision="2" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="赠送金额：" prop="ac_money">
                  <el-input-number v-model="add.form.ac_money" :precision="2" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="开始时间：" prop="starttime">
                  <el-date-picker v-model="add.form.starttime" type="datetime" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="结束时间：" prop="endtime">
                  <el-date-picker v-model="add.form.endtime" type="datetime" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="限制次数：" prop="limit">
                  <el-input-number v-model="add.form.limit" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="促销文案：" prop="ac_title">
                  <el-input v-model="add.form.ac_title" />
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="模块选择" name="module">
          <el-form label-width="200px">
            <el-radio-group v-model="add.form.template">
              <el-form-item prop="template">
                <el-image />
                <el-radio label="4">
                  暑假降温福利
                </el-radio>
              </el-form-item>
            </el-radio-group>
          </el-form>
        </el-tab-pane>
        <div>
          <el-button type="primary">
            保存
          </el-button>
          <el-button type="danger" @click="toggleCurrent('')">
            返回
          </el-button>
        </div>
      </el-tabs>
    </div>
    <div v-else>
      <div class="filter-container">
        <el-button class="filter-item" type="primary" icon="el-icon-refresh" @click="refresh" />
        <el-button class="filter-item" style="margin-left: 10px;" type="primary" plain @click="toggleCurrent('add')">
          添加
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
              <el-button type="primary" size="mini" @click="send(row)">
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
                <a style="color: #069;" @click.stop="handleTest(row)">
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
      <pagination v-show="table.total>0" :total="table.total" :page.sync="table.page" :limit.sync="table.size" @pagination="pagin" />
    </div>
  </div>
</template>

<script>
import mix from '@/mixs/mix'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

export default {
  name: 'ComplexTable',
  components: { Pagination },
  mixins: [mix],
  data() {
    const endtimeValitor = (rule, value, callback) => {
      if (value < this.starttime) {
        callback(new Error('结束时间不能小于开始时间'))
      } else {
        callback()
      }
    }
    return {
      search: {
        form: {},
        loading: false
      },
      add: {
        loading: false,
        active: 'info',
        form: {
          name: '',
          money: null,
          ac_money: '',
          starttime: '',
          endtime: '',
          limit: null,
          ac_title: '',
          template: '4'
        },
        rules: {
          name: [
            { required: true, message: '请输入活动名称' }
          ],
          money: [
            { required: true, message: '请输入充值金额' }
          ],
          starttime: [
            { required: true, message: '请选择开始时间' }
          ],
          endtime: [
            { required: true, message: '请选择结束时间' },
            { validator: endtimeValitor }
          ],
          ac_title: [
            { required: true, message: '请输入促销文案' }
          ]
        },
        list: []
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
            align: 'left',
            'header-align': 'center',
            width: 400
          },
          {
            label: '描述',
            prop: 'descript',
            align: 'left',
            'header-align': 'center',
            width: 400
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
            width: 220
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
    this.current = current
    if (!current) {
      this.getList()
    }
    console.log('router: ', this.$route)
  },
  methods: {
    // 翻页
    pagin(data) {
      const { page, limit } = data
      this.table.page = page
      this.table.size = limit
      this.getList()
    },
    // 保存
    saveAdd() {
      this.$refs.add.validate(valid => {
        if (valid) {
          //
        }
      })
    },
    // 上传成功
    onUploadImgSuccess(...args) {
      //
    },
    // 删除上传封面
    handleRemove() {
      //
    },
    getList() {
      this.table.loading = true
      this.table.data = [{}, {}]
      this.table.total = 2
      this.table.loading = false
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
    send(row) {
      this.$confirm('确定要群发此推广链接吗?', '提示', {
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
