<template>
  <div class="app-container">
    <div v-if="current === 'add' || current === 'edit'">
      <el-form ref="add" label-width="200px" :model="add.form" :rules="add.rules">
        <el-row>
          <el-col :span="12">
            <el-form-item label="关键字：" prop="keyword">
              <el-input v-model="add.form.keyword" placeholder="请输入关键字" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="推广链接：" prop="linkid">
              <el-select v-model="add.form.linkid" placeholder="请选择推广链接">
                <el-option label="1" value="1" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="欢迎语：" prop="wenzhi">
              <el-input v-model="add.form.wenzhi" placeholder="请输入欢迎语" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item>
              <el-button>
                保存
              </el-button>
              <el-button type="danger" @click="toggleCurrent('')">
                返回
              </el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
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
        <el-date-picker v-model="search.form.time" type="daterange" placeholder="请选择时间范围" class="filter-item" style="margin-left: 10px;" />
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
            <div v-if="cl.prop === 'action'">
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
            label: '关键词',
            prop: 'keywords',
            align: 'center'
          },
          {
            label: '推广链接',
            prop: 'link',
            align: 'center'
          },
          {
            label: '小说/章节',
            prop: 'descript',
            align: 'center',
            width: 400
          },
          {
            label: '欢迎语',
            prop: 'position',
            align: 'center',
            width: 500
          },
          {
            label: '创建时间',
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
