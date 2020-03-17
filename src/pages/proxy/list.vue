<template>
  <div class="app-container">
    <div v-if="current === 'add'">
      <div>新增</div>
    </div>
    <div v-else-if="current === 'edit'">
      <div>编辑</div>
    </div>
    <div v-else>
      <div class="filter-container">
        <el-button class="filter-item" type="primary" icon="el-icon-refersh" />
        <el-button class="filter-item" style="margin-left: 10px;" type="primary" @click="handleCreate">
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
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

export default {
  name: 'ComplexTable',
  components: { Pagination },
  data() {
    return {
      current: 'index',
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
    this.getList()
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
    handleCreate() {
      const { fullPath } = this.$route
      console.log('fullPath: ', fullPath)
      this.$router.replace({
        path: '/redirect' + fullPath,
        params: {
          current: 'add'
        },
        query: {
          current: 'add'
        }
      })
    },
    sortChange() {
      //
    }
  }
}
</script>
