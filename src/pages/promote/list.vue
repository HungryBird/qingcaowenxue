<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button class="filter-item" type="primary" icon="el-icon-refresh" @click="refresh" />
      <el-button class="filter-item" style="margin-left: 10px;" type="default" @click="toggleCurrent('export')">
        添加推广链接
      </el-button>
      <el-button class="filter-item" type="primary" @click="toggleShow">
        {{ show ? '隐藏' : '显示' }}
      </el-button>
      <el-button class="filter-item" type="primary">
        全部
      </el-button>
      <el-button class="filter-item" type="default">
        内链
      </el-button>
      <el-button class="filter-item" type="default">
        外链
      </el-button>
      <el-input class="filter-item" style="width: 160px;" placeholder="输入需要查询的链接备注" />
      <el-select v-model="search.form.proxy" placeholder="我的代理" class="filter-item" style="margin-left: 10px;">
        <el-option value="1" label="全部代理" />
        <el-option value="2" label="精选" />
        <el-option value="3" label="男生" />
        <el-option value="4" label="女生" />
        <el-option value="5" label="其它" />
      </el-select>
      <el-button class="filter-item" style="margin-left: 10px;" icon="el-icon-search" type="primary" />
    </div>
    <aside>
      <a href="javascript:;">
        链接数量：共<span style="color: #f00;">{{ table.total }}</span>个，总充值金额：<span style="color: #f00;">666</span>元。
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
            <div>
              <el-button type="primary" size="mini" @click="seeMore(row)">
                订单明细
              </el-button>
              <el-button type="danger" size="mini" @click="remove(row)">
                删除
              </el-button>
              <el-button type="danger" size="mini" @click="remove(row)">
                真删除
              </el-button>
              <div style="font-size:12px; color:#ccc; margin:3px 0 0;line-height: 20px;height: 20px; padding:0">
                创建时间：2020-03-19 15:28:06
              </div>
            </div>
          </div>
          <div v-else-if="cl.prop === 'tglj'" style="text-align: left;font-size: 12px;">
            <div>
              备注：<a href="javascript:;" style="color: #069;">
                测试测试
              </a>
            </div>
            <div>
              URL：<a href="javascript:;" style="color: #069;">
                http://we.fuleien.com/index/books/bookprom/uid/1/porid/272/bookid/17/number/1.html
              </a>
            </div>
            <div>
              操作：<el-button size="mini" @click="copy('http://we.fuleien.com/index/books/bookprom/uid/1/porid/272/bookid/17/number/1.html', $event)">复制</el-button>
              <el-button size="mini" @click="generateQRcode(row)">生成二维码</el-button>
            </div>
          </div>
          <div v-else-if="cl.prop === 'rkym'">
            <div>
              <a href="javascript:;">
                星际工业时代
              </a>
            </div>
            <div>
              第1章，秦毅
            </div>
            <div>
              关注章节：1 章
            </div>
          </div>
          <div v-else-if="cl.prop === 'xzgzyh'" style="text-align: right;">
            <div v-show="show">
              5(总)
            </div>
            <div v-show="show">
              5(净)
            </div>
            <div>
              25.35元
            </div>
          </div>
          <div v-else-if="cl.prop === 'czbl'" style="text-align: right;">
            <div v-show="show">
              1笔
            </div>
            <div>
              50%
            </div>
          </div>
          <div v-else-if="cl.prop === 'scffl'" style="text-align: right;">
            <div v-show="show">
              1人
            </div>
            <div>
              50%
            </div>
          </div>
          <div v-else-if="cl.prop === 'gdl'">
            <a class="el-icon-edit" href="javascript:;" @click="setGdl(row)">设置</a>
          </div>
          <div v-else-if="cl.prop === 'tgcb'">
            <a href="javascript:;" @click="setTgcb(row)">
              <i class="el-icon-edit" />
              <span class="code">666</span>
            </a>
          </div>
          <div v-else-if="cl.prop === 'czje'">
            <span class="code">
              {{ row[cl.prop] || 0 }}
            </span>
          </div>
          <div v-else-if="cl.prop === 'lr'" style="text-align: right;">
            <span class="code">
              120
            </span>
            <div style="font-size:12px; color:#ccc;">
              回本率：0
            </div>
          </div>
          <div v-else>
            {{ row[cl.prop] }}
          </div>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="table.total>0" :total="table.total" :page.sync="table.page" :limit.sync="table.limit" @pagination="getList" />
    <!-- 查看详情 -->
    <el-dialog :visible.sync="detail.visible" title="推广链接－订单明细" width="80%" top="5vh">
      <div class="filter-container">
        <el-button class="filter-item" type="primary" icon="el-icon-refresh" @click="refresh" />
        <el-button class="filter-item" type="primary">
          全部
        </el-button>
        <el-button class="filter-item" type="default">
          已支付
        </el-button>
        <el-button class="filter-item" type="default">
          未支付
        </el-button>
      </div>
      <aside>
        <a href="javascript:;">
          订单总数量：共<span style="color: #f00;">{{ table.total }}</span>个，总金额：<span style="color: #f00;">666</span>元。己支付：<span style="color: #f00;">0</span>元，未支付：<span style="color: #f00;">0</span>元。
        </a>
      </aside>
      <el-table
        v-loading="detail.table.loading"
        :data="detail.table.data"
        border
        fit
        highlight-current-row
        style="width: 100%;"
      >
        <el-table-column v-for="cl in detail.table.columns" :key="cl.prop" :prop="cl.prop" :label="cl.label" :width="cl.width" :align="cl.align">
          <template slot-scope="{ row }">
            <div>
              {{ row[cl.prop] }}
            </div>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
    <!-- 设置跟读率 -->
    <el-dialog :visible.sync="gdl.visible" title="设置跟读率" width="800px">
      <el-form :model="gdl.form" :rules="gdl.rules" label="80px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="开始章节" prop="begin">
              <el-input-number v-model="gdl.form.begin" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="结束章节" prop="end">
              <el-input-number v-model="gdl.form.end" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <el-button slot="footer" :loading="gdl.loading" type="primary">
        提交
      </el-button>
    </el-dialog>
    <!-- 设置推广成本 -->
    <el-dialog :visible.sync="tgcb.visible" title="设置推广成本" width="800px">
      <el-form :model="tgcb.form" :rules="tgcb.rules" label="80px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="推广成本：" prop="begin">
              <el-input-number v-model="tgcb.form.tgcb" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <el-button slot="footer" :loading="tgcb.loading" type="primary">
        提交
      </el-button>
    </el-dialog>
    <!-- 生成二维码 -->
    <el-dialog :visible.sync="erweima.sVisible" title="生成图片二维码－推广链接－[点击]选择二维码模板" width="730px">
      <el-row :gutter="20">
        <el-col v-for="(ed, index) in erweima.data" :key="index" :span="12">
          <p>
            图片模板{{ ++index }}
          </p>
          <el-image :src="ed.src" style="width: 100%;" @click.native="chooseImg(ed)" />
        </el-col>
      </el-row>
    </el-dialog>
    <!-- 推广二维码 -->
    <el-dialog :visible.sync="erweima.tVisible" width="574px" title="推广二维码">
      <el-image :src="erweima.src" style="width: 100%;" />
    </el-dialog>
  </div>
</template>

<script>
import { fetchList } from '@/api/article'
import mix from '@/mixs/mix'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import clip from '@/utils/clipboard' // use clipboard directly

export default {
  name: 'ComplexTable',
  components: { Pagination },
  mixins: [mix],
  data() {
    const endValidator = (rule, value, callback) => {
      if (value < this.gdl.form.beigin) {
        callback(new Error('结束章节不能小于开始章节'))
      } else {
        callback()
      }
    }
    return {
      // 图片模板
      erweima: {
        loading: false,
        sVisible: false,
        tVisible: false,
        data: [{}, {}, {}, {}],
        src: ''
      },
      // 跟读率
      gdl: {
        form: {
          begin: 0,
          end: 0
        },
        visible: false,
        loading: false,
        rules: {
          begin: [
            { required: true, message: '请输入开始章节' }
          ],
          end: [
            { required: true, message: '请输入结束章节' },
            { validator: endValidator, trigger: 'blur' }
          ]
        }
      },
      // 推广成本
      tgcb: {
        form: {
          tgcb: 0
        },
        visible: false,
        loading: false,
        rules: {
          tgcb: [
            { required: true, message: '请输入推广成本' }
          ]
        }
      },
      // 切换显示隐藏
      show: true,
      // 详情
      detail: {
        active: 'txxq',
        visible: false,
        loading: false,
        form: {},
        table: {
          columns: [
            {
              label: 'ID',
              prop: 'id',
              align: 'center'
            },
            {
              label: '订单号',
              prop: 'ddh',
              align: 'center'
            },
            {
              label: '用户',
              prop: 'yh',
              align: 'center'
            },
            {
              label: 'ddje',
              prop: 'ccbl',
              align: 'center'
            },
            {
              label: '充值次数',
              prop: 'czcs',
              align: 'center'
            },
            {
              label: '支付方式',
              prop: 'zffs',
              align: 'center'
            },
            {
              label: '支付状态',
              prop: 'zfzt',
              align: 'center'
            },
            {
              label: '支付日期',
              prop: 'zfrq',
              align: 'center'
            },
            {
              label: '订单日期',
              prop: 'ddrq',
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
            label: 'ID',
            prop: 'id',
            align: 'center'
          },
          {
            label: '推广人',
            prop: 'tgr',
            align: 'center'
          },
          {
            label: '推广链接',
            prop: 'tglj',
            align: 'center',
            width: 506
          },
          {
            label: '入口页面',
            prop: 'ymrk',
            align: 'center'
          },
          {
            label: '点击',
            prop: 'dj',
            align: 'center'
          },
          {
            label: '阅读用户',
            prop: 'ydyh',
            align: 'center'
          },
          {
            label: '新增关注用户',
            prop: 'xzgzyh',
            align: 'center'
          },
          {
            label: '充值金额(元)',
            prop: 'czje',
            align: 'center'
          },
          {
            label: '充值比例',
            prop: 'czbl',
            align: 'center'
          },
          {
            label: '首充付费率',
            prop: 'scffl',
            align: 'center'
          },
          {
            label: '跟读率',
            prop: 'gdl',
            align: 'center'
          },
          {
            label: '推广成本(元)',
            prop: 'tgcb',
            align: 'center',
            width: 160
          },
          {
            label: '利润(元)',
            prop: 'lr',
            align: 'center'
          },
          {
            label: '回复量',
            prop: 'hfl',
            align: 'center'
          },
          {
            label: '操作',
            prop: 'action',
            align: 'center',
            width: 268
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
    // 复制
    copy(text, event) {
      clip(text, event)
    },
    // 设置跟读率
    setGdl(row) {
      this.gdl.visible = true
    },
    saveGdl() {
      //
    },
    // 设置推广成本
    setTgcb(row) {
      this.tgcb.visible = true
    },
    saveTgcb() {
      //
    },
    // 切换显示隐藏
    toggleShow() {
      this.show = !this.show
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
    },
    // 选择图片模板
    chooseImg(ed) {
      this.$message({
        type: 'success',
        message: '生成成功'
      })
      setTimeout(() => {
        this.erweima.sVisible = false
        this.erweima.tVisible = true
      }, 2000)
    },
    // 打开二维码
    generateQRcode(row) {
      this.erweima.sVisible = true
    }
  }
}
</script>

<style lang="scss" scoped>
.code{
  background-color: rgb(249, 242, 244);
  border-radius: 4px; color: rgb(202, 68, 64);
  font-size: 90%; padding: 2px 4px;
  white-space: nowrap;
}
</style>
