<template>
  <div class="app-container">
    <el-alert :title="title" type="error" effect="dark" style="margin-bottom: 10px;" />
    <el-row :gutter="20">
      <el-col :span="6">
        <el-tabs v-model="tabActive" type="card" @tab-click="toggleTab">
          <el-tab-pane name="order" label="订单统计" />
          <el-tab-pane name="user" label="用户统计" />
        </el-tabs>
      </el-col>
      <el-col :span="18" style="display: flex;">
        <el-select v-model="search.form.role" style="flex: 1;">
          <el-option v-for="or in options.roles" :key="or.id" :label="or.label" :value="or.value" />
        </el-select>
        <el-button icon="el-icon-search" type="primary" style="margin-left: 10px;" />
      </el-col>
    </el-row>
    <div v-show="tabActive === 'order'">
      <orders :role="search.form.role" />
    </div>
    <div v-show="tabActive === 'user'">
      <users :role="search.form.role" />
    </div>
  </div>
</template>

<script>
import Orders from './orders'
import Users from './users'
import mix from '@/mixs/mix'

export default {
  name: 'Stat',
  components: {
    Orders,
    Users
  },
  mixins: [mix],
  data() {
    return {
      tabActive: 'order',
      title: '',
      search: {
        form: {
          role: ''
        },
        loading: false
      },
      options: {
        roles: [
          {
            label: '超级管理员',
            value: 1
          }
        ]
      },
      table: {
        columns: [
          {
            label: 'ID',
            prop: 'id',
            align: 'center'
          },
          {
            label: '公告名称',
            prop: 'title',
            align: 'center'
          },
          {
            label: '内容',
            prop: 'content',
            align: 'center'
          },
          {
            label: '创建时间',
            prop: 'create_time',
            align: 'center'
          },
          {
            label: '状态',
            prop: 'status',
            align: 'center',
            width: 154
          },
          {
            label: '发布人',
            prop: 'real_name',
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
            name: '',
            url: this.$route.query[key]
          }]
        } else if (key === 'pid' || key === 'status') {
          this.add.form.pid = Number(this.$route.query[key])
        } else if (key !== 'current') {
          this.$set(this.add.form, key, this.$route.query[key])
        }
      }
    }
    this.showTime()
    this.getList()
  },
  methods: {
    // 展示时间
    showTime() {
      const timer = setInterval(() => {
        const date = new Date()
        const time_quantum = date.getHours > 12 ? '下午' : '上午'
        const role = '超级管理员'
        const year = date.getFullYear()
        const M = date.getMonth() + 1 > 9 ? date.getMonth() + 1 : '0' + (date.getMonth() + 1)
        const d = date.getDate()
        const h = date.getHours() > 9 ? date.getHours() : '0' + date.getHours()
        const m = date.getMinutes() > 9 ? date.getMinutes() : '0' + date.getMinutes()
        const s = date.getSeconds() > 9 ? date.getSeconds() : '0' + date.getSeconds()
        const D = date.getDay()
        this.title = `尊敬的${role}，${time_quantum}好！现在时间是：${year}年${M}月${d}日 星期${D} ${h}:${m}:${s}`
      }, 500)
      this.$once('hook:beforeDestroy', () => {
        clearInterval(timer)
      })
    },
    // 切换tab
    toggleTab(tab) {
      //
    },
    // 翻页
    pagin(data) {
      const { page, limit } = data
      this.table.page = page
      this.table.size = limit
      this.getList()
    },
    // 获取列表
    getList() {
      // this.table.loading = true
      // categoryList({
      //   page: this.table.page,
      //   size: this.table.size
      // }).then(response => {
      //   this.table.data = this.table.data.concat(response.data.data)
      //   this.table.total = response.data.total
      //   this.table.loading = false
      // })
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
    }
  }
}
</script>
