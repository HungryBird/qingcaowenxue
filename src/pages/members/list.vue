<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button class="filter-item" type="primary" icon="el-icon-refresh" @click="refresh" />
      <!-- <el-button class="filter-item" style="margin-left: 10px;" type="primary" @click="toggleCurrent('export')">
        导出
      </el-button> -->
      <el-select v-model="search.form.status" placeholder="我的代理" class="filter-item" style="margin-left: 10px;" clearable>
        <el-option :value="1" label="超级管理员" />
      </el-select>
      <el-select v-model="search.form.wechat_id" placeholder="公众号列表" class="filter-item" style="margin-left: 10px;" clearable @visible-change="wechatVisibleChange">
        <el-option v-for="ow in options.wechat" :key="ow.id" :value="ow.id" :label="ow.name" />
      </el-select>
      <el-select v-model="search.form.sub_status" placeholder="关注状态" class="filter-item" style="margin-left: 10px;" clearable>
        <el-option :value="1" label="已关注" />
        <el-option :value="0" label="未关注" />
      </el-select>
      <div class="filter-item" style="margin-left: 10px;">
        <el-date-picker
          v-model="search.date"
          type="daterange"
          range-separator="至"
          value-format="yyyy-MM-dd"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :unlink-panels="true"
          @change="dateChange"
        />
      </div>
      <div class="filter-item" style="margin-left: 10px;">
        <el-input v-model="search.form.nickname" placeholder="请输入会员昵称">
          <el-button slot="append" icon="el-icon-search" type="primary" @click="getList" />
        </el-input>
      </div>
    </div>
    <!-- <aside>
      <a href="javascript:;">
        金额：总充值<span style="color: #f00;">1000</span>元，提现<span style="color: #f00;">666</span>元。
      </a>
    </aside> -->
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
            <el-button v-if="btnList[0].flag" type="danger" size="mini" @click="remove(row)">
              删除
            </el-button>
          </div>
          <div v-else-if="cl.prop === 'sort'">
            <el-input v-model="row.sort" />
          </div>
          <div v-else-if="cl.prop === 'ssje'">
            {{ row['amount'] - row['fee'] }}
          </div>
          <div v-else-if="cl.prop === 'status'">
            <el-button size="mini" :type="row[cl.prop] === 1 ? 'primary' : 'danger'">
              {{ row[cl.prop] === 1 ? '已打款' : '未打款' }}
            </el-button>
          </div>
          <div v-else-if="cl.prop === 'number'">
            <span style="background-color: #F9F2F4;border-radius: 4px;color: #ca4440;font-size: 90%;padding: 2px 4px;white-space: nowrap;">
              {{ row[cl.prop] || 0 }}
            </span>
          </div>
           <div v-else-if="cl.prop === 'nickname'" style="text-align: left;">
             <img :src="row['head_uri']" alt="" class="header-img">
              <a style="color: #337ab7;" href="javascript:;" >
                {{row[cl.prop]}}
              </a>
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
import { memberList, memberDelete } from '@/api/member/list'
import { wechatList } from '@/api/wechat/wechat'
import mix from '@/mixs/mix'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

export default {
  name: 'ComplexTable',
  components: { Pagination },
  mixins: [mix],
  data() {
    return {
      options: {
        wechat: []
      },
      // 搜索
      search: {
        date: [],
        form: {
          start_time: '',
          end_time: '',
          sub_status: '',
          wechat_id: '',
          nickname: ''
        },
        loading: false
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
            label: '用户OPENID',
            prop: 'openid',
            align: 'center'
          },
          {
            label: '公众号名称',
            prop: 'wechat_name',
            align: 'center'
          },
          {
            label: '用户',
            prop: 'nickname',
            align: 'center'
          },
          {
            label: '会员等级',
            prop: 'vip_level',
            align: 'center'
          },
          {
            label: '书币',
            prop: 'gold',
            align: 'center'
          },
          {
            label: 'VIP时间',
            prop: 'vip_time',
            align: 'center'
          },
          {
            label: '关注时间',
            prop: 'sub_time',
            align: 'center'
          },
          {
            label: '取关时间',
            prop: 'unsub_time',
            align: 'center'
          },
          {
            label: '创建日期',
            prop: 'create_time',
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
        loading: false
      },
      btnList:[
        {
          name:'/members/list/delete',
          flag:false,
        }
      ]
    }
  },
  created() {
     this.$store.dispatch("user/showBtn",{name:'/members/list',btnName:''}).then(res=>{
      // console.log('res',res)
      let arr = res
      if(arr.children){
        this.btnList.map(list=>{
          arr.children.map((item,i)=>{
              if(list.name == item.name ){
                list.flag = true
              }
          })
        })
      }
    })
    const { current } = this.$route.query
    this.current = current
    if (!current) {
      this.getList()
      this.getWechatList()
    }
  },
  methods: {
    // 公众号下拉
    wechatVisibleChange(val) {
      if (val) {
        this.getWechatList()
      }
    },
    getWechatList() {
      wechatList({
        size: 9999999999
      }).then(res => {
        this.options.wechat = res.data.data
      })
    },
    // 删除
    remove(row) {
      this.$confirm('确认删除此记录吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.table.loading = true
        memberDelete({
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
    },
    // 翻页
    pagin({ page, limit }) {
      this.table.page = page
      this.table.size = limit
      this.getList()
    },
    // 修改时间
    dateChange(date) {
      if (date) {
        this.search.form.start_time = date[0]
        this.search.form.end_time = date[1]
      } else {
        this.search.form.start_time = ''
        this.search.form.end_time = ''
      }
    },
    changeStatus(row) {
      console.log('row: ', row)
    },
    getList() {
      this.table.loading = true
      const form = Object.assign({}, this.search.form, { page: this.table.page, size: this.table.size })
      memberList(form).then(response => {
        this.table.data = response.data.data
        this.table.total = response.data.total
        this.table.loading = false
      }).catch(() => {
        this.table.loading = false
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
    }
  }
}
</script>
<style lang="scss" scoped>
  .header-img{
    width: 25px;
    height: 25px;
    vertical-align: middle;
  }
</style>