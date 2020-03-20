<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button class="filter-item" type="primary" icon="el-icon-refresh" @click="refresh" />
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" @click="toggleCurrent('export')">
        导出
      </el-button>
      <el-select v-model="search.form.proxy" placeholder="我的代理" class="filter-item" style="margin-left: 10px;">
        <el-option value="1" label="全部代理" />
        <el-option value="2" label="精选" />
        <el-option value="3" label="男生" />
        <el-option value="4" label="女生" />
        <el-option value="5" label="其它" />
      </el-select>
      <div class="filter-item" style="margin-left: 10px;">
        <el-date-picker
          v-model="search.form.date"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        />
      </div>
      <el-button class="filter-item" style="margin-left: 10px;" icon="el-icon-search" type="primary" />
    </div>
    <aside>
      <a href="javascript:;">
        金额：总充值<span style="color: #f00;">1000</span>元，提现<span style="color: #f00;">666</span>元。
      </a>
    </aside>
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
            <el-button type="primary" size="mini" @click="seeMore(row)">
              查看详情
            </el-button>
          </div>
          <div v-else-if="cl.prop === 'sort'">
            <el-input v-model="row.sort" />
          </div>
          <div v-else-if="cl.prop === 'status'">
            <el-button v-show="row.status" size="mini" type="primary" @click="changeStatus(row)">
              已打款
            </el-button>
            <el-button v-show="!row.status" size="mini" type="danger" @click="changeStatus(row)">
              未打款
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
    <!-- 查看详情 -->
    <el-dialog :visible.sync="detail.visible" title="查看详情" width="80%" top="5vh">
      <el-tabs v-model="detail.active">
        <el-tab-pane name="txxq" label="提现详情">
          <el-form :model="detail.form" label-width="120px">
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="渠道：">
                  {{ detail.form.qudao }}
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="日期：">
                  {{ detail.form.rq }}
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="打款金额：">
                  <div>{{ detail.form.qudao }}</div>
                  <div>提现金额：</div>
                  <div>手续费：</div>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="打款方式：">
                  {{ detail.form.rq }}
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item>
                  未打款
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item>
                  <el-button type="primary">
                    确认打款
                  </el-button>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-tab-pane>
        <el-tab-pane name="jsdmx" label="结算单明细">
          <el-table
            v-loading="detail.table.loading"
            style="width: 100%;"
            border
            fit
            highlight-current-row
            :data="detail.table.data"
          >
            <el-table-column v-for="ec in detail.table.columns" :key="ec.prop" :prop="ec.prop" :label="ec.label" :align="ec.align">
              <template slot-scope="{ row }">
                {{ row[cl.prop] }}
              </template>
            </el-table-column>
            <pagination v-show="detail.table.total>0" :total="detail.table.total" :page.sync="detail.table.page" :limit.sync="detail.table.limit" @pagination="getList" />
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>
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
      // 详情
      detail: {
        active: 'txxq',
        visible: false,
        loading: false,
        form: {},
        table: {
          columns: [
            {
              label: '日期',
              prop: 'rq',
              align: 'center'
            },
            {
              label: '充值金额',
              prop: 'czje',
              align: 'center'
            },
            {
              label: '抽成比例',
              prop: 'ccbl',
              align: 'center'
            },
            {
              label: '结算金额',
              prop: 'jsje',
              align: 'center'
            },
            {
              label: '利润',
              prop: 'lr',
              align: 'center'
            }
          ],
          data: [],
          page: 1,
          total: 0,
          limit: 10,
          loading: false
        }
      },
      // 搜索
      search: {
        form: {
          proxy: '',
          date: ''

        },
        loading: false
      },
      current: '',
      table: {
        columns: [
          {
            label: '申请人',
            prop: 'applyPerson',
            align: 'center'
          },
          {
            label: '提交时间',
            prop: 'submitTime',
            align: 'center'
          },
          {
            label: '充值金额',
            prop: 'rechargeMoney',
            align: 'center'
          },
          {
            label: '提现金额',
            prop: 'withDraw',
            align: 'center'
          },
          {
            label: '手续费',
            prop: 'serviceCharge',
            align: 'center'
          },
          {
            label: '实收金额',
            prop: 'shje',
            align: 'center'
          },
          {
            label: '利润',
            prop: 'lr',
            align: 'center'
          },
          {
            label: '收款人',
            prop: 'skr',
            align: 'center',
            width: 450
          },
          {
            label: '审核',
            prop: 'sh',
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
    changeStatus(row) {
      console.log('row: ', row)
    },
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
    seeMore(row) {
      this.detail.visible = true
      for (const key in row) {
        if (row.hasOwnProperty(key)) {
          this.$set(this.detail.form, key, row[key])
        }
      }
    }
  }
}
</script>
