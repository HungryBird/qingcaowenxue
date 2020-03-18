<template>
  <el-container style="height: calc(100vh - 84px);" class="novel-management">
    <el-aside width="200px">
      <el-tree :props="defaultProps" :data="treeData" />
    </el-aside>
    <el-main>
      <div v-if="current === 'add' || current === 'edit'">
        <div>
          111
        </div>
      </div>
      <div v-else-if="current === 'index'">
        <div class="filter-container">
          <el-button class="filter-item" type="primary" icon="el-icon-refresh" @click="refresh" />
          <el-button class="filter-item" style="margin-left: 10px;" type="primary" @click="toggleCurrent('add')">
            添加
          </el-button>
          <el-select placeholder="搜索类型" class="filter-item" style="margin-left: 10px;">
            <el-option value="1">
              全部
            </el-option>
            <el-option value="2">
              本分类
            </el-option>
          </el-select>
          <el-select placeholder="状态" class="filter-item" style="margin-left: 10px;">
            <el-option value="1">
              全部
            </el-option>
            <el-option value="2">
              连载中
            </el-option>
            <el-option value="3">
              已完结
            </el-option>
          </el-select>
          <div class="filter-item" style="margin-left: 10px;">
            <el-input>
              <el-button slot="append" icon="el-icon-search" />
            </el-input>
          </div>

        </div>
        <div>数量：共<span style="color: #f00;">{{ table.total }}</span>个</div>
        <el-table
          v-loading="table.loading"
          :data="table.data"
          border
          fit
          highlight-current-row
          style="width: 100%;"
          @sort-change="sortChange"
        >
          <el-table-column v-for="cl in table.columns" :key="cl.prop" :prop="cl.prop" :type="cl.type" :label="cl.label" :width="cl.width" :align="cl.align">
            <template slot-scope="{ row }">
              <div v-if="cl.prop === 'action'">
                <el-button type="primary" size="mini" @click="edit(row)">
                  分享
                </el-button>
                <el-button type="primary" size="mini" @click="edit(row)">
                  复制
                </el-button>
                <el-button type="primary" size="mini" @click="edit(row)">
                  编辑
                </el-button>
                <el-button type="danger" size="mini" @click="setWechatConfig(row)">
                  删除
                </el-button>
              </div>
              <div v-else-if="cl.prop === 'sort'">
                <el-input v-model="row.sort" />
              </div>
              <div v-else-if="cl.prop === 'img'">
                <el-image style="width: 50px;" fit="fill" :src="row[cl.prop]" />
              </div>
              <div v-else-if="cl.prop === 'name'" style="text-align: left;">
                <div>
                  <span>小城女律师</span>
                  <span>总裁豪门</span>
                </div>
                <div>
                  共xxx章，xxx章后就要收费
                </div>
                <div style="display: flex;align-items: center;">
                  <a style="font-size: 12px;color: #337ab7;padding-right: 4px;">http://new.fuleien.com/index/books/bookinfo/uid/1/id/31.html</a>
                  <el-button size="mini" icon="el-icon-document" @click="handleCopy('http://new.fuleien.com/index/books/bookinfo/uid/1/id/31.html', $event)">
                    复制
                  </el-button>
                </div>
              </div>
              <div v-else-if="cl.prop === 'update'">
                <a style="color: #337ab7;" href="javascript:;" @click="update">
                  更换作者
                </a>
              </div>
              <div v-else-if="cl.prop === 'status'">
                <el-button v-if="!row[cl.prop]" size="mini" type="danger">
                  下架
                </el-button>
                <el-button v-else size="mini" type="primary">
                  上架
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
    </el-main>

    <el-dialog :visible.sync="dialogTableVisible" :modal="false" :show-close="false" :close-on-press-escape="false" :close-on-click-modal="false" width="450px" top="35vh">
      <div slot="title">
        快速进入
      </div>
      <div>
        <el-autocomplete
          v-model="categoryName"
          placeholder="输入分类名可快速搜索"
          class="inline-input"
          :fetch-suggestions="querySearch"
          @select="handleSelect"
        />
      </div>
      <div slot="footer" />
    </el-dialog>
  </el-container>
</template>

<script>
import mix from '@/mixs/mix'
import { fetchList } from '@/api/article'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import clip from '@/utils/clipboard' // use clipboard directly
export default {
  components: { Pagination },
  mixins: [mix],
  data() {
    return {
      defaultProps: {
        label: 'label',
        children: 'children'
      },
      categoryName: '',
      treeData: [
        {
          label: '一级 1',
          children: [{
            label: '二级 1-1'
          }]
        },
        {
          label: '一级 2',
          children: [{
            label: '二级 2-1'
          },
          {
            label: '二级 2-2'
          }]
        }
      ],
      dialogTableVisible: false,
      current: '',
      table: {
        columns: [
          {
            type: 'selection',
            width: 55
          },
          {
            label: 'ID',
            prop: 'id',
            align: 'center'
          },
          {
            label: '封面',
            prop: 'img',
            align: 'center'
          },
          {
            label: '名称',
            prop: 'name',
            align: 'center',
            width: 440
          },
          {
            label: '派单指数',
            prop: 'zhishu',
            align: 'center'
          },
          {
            label: '状态',
            prop: 'status',
            align: 'center',
            width: 168
          },
          {
            label: '完结',
            prop: 'done',
            align: 'center'
          },
          {
            label: '时间',
            prop: 'time',
            align: 'center'
          },
          {
            label: '限时免费',
            prop: 'free',
            align: 'center'
          },
          {
            label: '作者',
            prop: 'auth',
            align: 'center'
          },
          {
            label: '作者更新',
            prop: 'update',
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
  },
  mounted() {
    if (!this.current) {
      this.dialogTableVisible = true
      // this.getList()
    }
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
    sortChange() {
      //
    },
    querySearch(queryString, cb) {
      cb([{
        value: '123'
      }])
    },
    handleSelect() {
      this.dialogTableVisible = false
      this.current = 'index'
      this.getList()
    },
    update(row) {

    },
    handleCopy(text, event) {
      clip(text, event)
    }
  }
}
</script>

<style lang="scss" scoped>
  .novel-management{

  }
</style>
