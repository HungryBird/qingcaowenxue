<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button class="filter-item" type="primary" icon="el-icon-refresh" @click="refresh" />
      <el-select v-model="search.form.myProxy" class="filter-item" placeholder="我的代理" style="margin-left: 10px;">
        <el-option :value="1" label="超级管理员" />
      </el-select>
      <el-select v-model="search.form.myProxy" class="filter-item" placeholder="支付状态" style="margin-left: 10px;">
        <el-option :value="1" label="已支付" />
        <el-option :value="2" label="未支付" />
      </el-select>
      <el-date-picker v-model="search.time" type="daterange" value-format="yyyy-MM-dd" placeholder="请选择时间范围" class="filter-item" style="margin-left: 10px;" @change="dateChange" />
      <div class="filter-item" style="margin-left: 10px;">
        <el-input placeholder="输入需查询活动名称">
          <el-button slot="append" type="primary" icon="el-icon-search">
            搜索
          </el-button>
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
          <div v-if="cl.prop === 'user'">
            <a @click.stop="seeMore(row)">
              <img :src="row[cl.prop].avatar" style="vertical-align: middle;border-radius: 50%;">
              {{ row[cl.prop].nickname }}
            </a>
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
            <!-- <el-button v-if="!row[cl.prop]" size="mini" type="danger">
              禁用
            </el-button>
            <el-button v-else size="mini" type="primary">
              开启
            </el-button> -->
            {{ row[cl.prop] === 1 ? '开启' : '禁用' }}
          </div>
          <div v-else>
            {{ row[cl.prop] }}
          </div>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="table.total>0" :total="table.total" :page.sync="table.page" :limit.sync="table.size" @pagination="pagin" />
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
    return {
      search: {
        form: {},
        loading: false
      },
      add: {
        loading: false,
        active: 'info',
        form: {
          keyword: '',
          linkid: null,
          wenzhi: ''
        },
        rules: {
          keyword: [
            { required: true, message: '请输入活动名称' }
          ],
          linkid: [
            { required: true, message: '请输入充值金额' }
          ],
          wenzhi: [
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
            label: '订单号',
            prop: 'ordersn',
            align: 'center'
          },
          {
            label: '商户号',
            prop: 'mchid',
            align: 'center'
          },
          {
            label: '用户',
            prop: 'users',
            align: 'center',
            width: 400
          },
          {
            label: '订单金额',
            prop: 'money',
            align: 'center'
          },
          {
            label: '支付方式',
            prop: 'way',
            align: 'center'
          },
          {
            label: '支付状态',
            prop: 'status',
            align: 'center'
          },
          {
            label: '支付日期',
            prop: 'paytime',
            align: 'center'
          },
          {
            label: '订单日期',
            prop: 'createtime',
            align: 'center'
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
  },
  methods: {
    // 查看更多
    seeMore(row) {
      console.log('see more')
    },
    // 改变时间
    dateChange(date) {
      if (date) {
        this.search.form.start_time = date[0]
        this.search.form.end_time = date[1]
      } else {
        this.search.form.start_time = ''
        this.search.form.end_time = ''
      }
    },
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
    toggleCurrent(current = '', data) {
      const { path } = this.$route
      this.$router.replace({
        path: '/redirect' + path,
        query: {
          current,
          ...data
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
