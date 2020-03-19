<template>
  <el-container style="height: calc(100vh - 84px);" class="novel-management">
    <el-aside width="200px">
      <el-tree :props="defaultProps" :data="treeData" />
    </el-aside>
    <el-main>
      <div v-if="current === 'add' || current === 'edit'">
        <div>
          <el-form ref="add" :model="add.form" :rules="add.rules" label-width="120px">
            <el-row>
              <el-col :span="12">
                <el-form-item label="小说名称：" prop="name">
                  <el-input v-model="add.form.name" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="封面图片：">
                  <el-upload
                    class="upload-demo"
                    :multiple="false"
                    :limit="1"
                    action="https://jsonplaceholder.typicode.com/posts/"
                    :on-preview="handlePreview"
                    :on-remove="handleRemove"
                    :file-list="add.list"
                    :on-success="onUploadImgSuccess"
                    list-type="picture"
                  >
                    <el-button size="small" type="primary">点击上传</el-button>
                  </el-upload>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="状 态：">
                  <el-radio-group v-model="add.form.status">
                    <el-radio label="serialize">连载</el-radio>
                    <el-radio label="done">完结</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="万字：">
                  <el-input v-model="add.form.w" placeholder="万字" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="总章节：">
                  <el-input v-model="add.form.total" placeholder="总章节" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="收费章节起始：">
                  <el-input v-model="add.form.begin" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item label="小说简介：">
                  <el-input v-model="add.form.free" type="textarea" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="限时免费：">
                  <el-radio-group v-model="add.form.status">
                    <el-radio label="off">关闭</el-radio>
                    <el-radio label="on">开启</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="是否上架：">
                  <el-radio-group v-model="add.form.status">
                    <el-radio label="yes">是</el-radio>
                    <el-radio label="no">否</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
          <el-button type="success">保存</el-button>
          <el-button type="danger" @click="toggleCurrent('index')">返回</el-button>
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
        >
          <el-table-column v-for="cl in table.columns" :key="cl.prop" :prop="cl.prop" :type="cl.type" :label="cl.label" :width="cl.width" :align="cl.align">
            <template slot-scope="{ row }">
              <div v-if="cl.prop === 'action'">
                <el-button type="primary" size="mini" @click="toShare(row)">
                  分享
                </el-button>
                <el-button type="primary" size="mini" @click="toCopyNovel(row)">
                  复制
                </el-button>
                <el-button type="primary" size="mini" @click="edit(row)">
                  编辑
                </el-button>
                <el-button type="danger" size="mini" @click="remove(row)">
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
                <div style="display: flex;align-items: center;">
                  <span>
                    备注：
                  </span>
                  <a style="font-size: 12px;color: #337ab7;padding-right: 4px;" @click.stop="addRemark(row)">原著：【XXX】历险记<i class="el-icon-edit" /></a>
                </div>
              </div>
              <div v-else-if="cl.prop === 'update'">
                <a style="color: #337ab7;" href="javascript:;" @click="toUpdate(row)">
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
              <div v-else-if="cl.prop === 'done'">
                <el-button v-if="!row[cl.prop]" size="mini" type="primary">
                  连载
                </el-button>
                <el-button v-else size="mini" type="danger">
                  完结
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
    <!-- 快速进入 -->
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
    <!-- 修改小说备注 -->
    <el-dialog :visible.sync="remark.visible" title="修改小说备注" width="450px" top="35vh">
      <el-form ref="remark" :model="remark.form" :rules="remark.rules" label-width="80px">
        <el-form-item label="备注：" prop="remark">
          <el-input v-model="remark.form.remark" />
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button type="success" :loading="remark.loading" @click="saveRemark">提交</el-button>
      </div>
    </el-dialog>
    <!-- 更换作者 -->
    <el-dialog :visible.sync="update.visible" title="修改小说备注" width="800px" top="35vh">
      <el-form ref="update" :model="update.form" :rules="update.rules" label-width="140px">
        <el-form-item label="请选择作者：" prop="author">
          <el-input v-model="update.form.author" />
        </el-form-item>
        <el-form-item label="当前作者：">
          {{ update.currentAuthor }}
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button type="success" :loading="update.loading" @click="saveUpdate">提交</el-button>
      </div>
    </el-dialog>
    <!-- 处理中 -->
    <div v-show="share.visible" class="mask">
      <div class="text">正在进行执行分章处理，时间可能比较长，请务刷新页面!...</div>
    </div>
    <!-- 复制小说 -->
    <el-dialog :visible.sync="copy.visible" title="复制小说" width="80%" top="5vh">
      <el-container>
        <el-aside width="200px">
          <el-tree :props="defaultProps" :data="treeData" />
        </el-aside>
        <el-main>
          <el-form ref="copy" :model="copy.form" :rules="copy.rules" label-width="120px">
            <el-row>
              <el-col :span="12">
                <el-form-item label="小说分类：">
                  <el-input v-model="copy.form.category" :disabled="true" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="[原]小说名称：">
                  <el-input v-model="copy.form.category" :disabled="true" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="[新]小说名称：">
                  <el-input v-model="copy.form.newName" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="封面图片：">
                  <el-upload
                    class="upload-demo"
                    :multiple="false"
                    :limit="1"
                    action="https://jsonplaceholder.typicode.com/posts/"
                    :on-preview="handlePreview"
                    :on-remove="handleRemove"
                    :file-list="copy.list"
                    :on-success="onUploadImgSuccess"
                    list-type="picture"
                  >
                    <el-button size="small" type="primary">点击上传</el-button>
                  </el-upload>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="状 态：">
                  <el-radio-group v-model="copy.form.status">
                    <el-radio lable="serialize">
                      连载
                    </el-radio>
                    <el-radio label="done">
                      完结
                    </el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="总章节：">
                  <el-input v-model="copy.form.total" :disabled="true" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="收费章节起始：">
                  <el-input-number v-model="copy.form.begin" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="收费书币：">
                  <el-input-number v-model="copy.form.money" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item label="小说简介：">
                  <el-input v-model="copy.form.intro" type="textarea" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="是否上架：">
                  <el-radio-group v-model="copy.form.status">
                    <el-radio lable="yes">
                      是
                    </el-radio>
                    <el-radio label="no">
                      否
                    </el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-main>
      </el-container>
      <div slot="footer">
        <el-button type="primary" :loading="copy.loading" :disabled="copy.loading" @click="copyNovel">{{ copy.loading ? '正在执行复制，时间可能比较长，请务刷新/点击/关闭页面!...' : '执行复制' }}</el-button>
      </div>
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
      copy: {
        visible: false,
        form: {
          //
        },
        loading: false,
        list: []
      },
      // 添加或者编辑
      add: {
        form: {
          name: ''
        },
        rules: {
          name: [
            { required: true, message: '请输入小说名称' }
          ]
        },
        list: [],
        loading: false
      },
      // 分享
      share: {
        visible: false

      },
      // 备注
      remark: {
        form: {
          remark: ''
        },
        visible: false,
        loading: false,
        rules: {
          remark: [
            { required: true, message: '请您输入备注' }
          ]
        }
      },
      // 更新
      update: {
        form: {
          author: ''
        },
        visible: false,
        loading: false,
        currentAuthor: '',
        rules: {
          author: [
            { required: true, message: '请您选择一个作者' }
          ]
        }
      },
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
            align: 'center'
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
            prop: 'author',
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
    } else if (this.current === 'index') {
      this.getList()
    }
  },
  methods: {
    // 复制小说
    toCopyNovel(row) {
      this.copy.visible = true
      for (const key in row) {
        if (row.hasOwnProperty(key)) {
          this.$set(this.copy.form, key, row[key])
        }
      }
    },
    // 开始复制
    copyNovel() {
      console.log('this.copy: ', this.copy)
      this.copy.loading = true
      setTimeout(() => {
        this.copy.loading = false
      }, 5000)
    },
    handlePreview() {
      //
    },
    handleRemove() {
      //
    },
    onUploadImgSuccess(res, file, fileList) {
      console.log('res: ', res, 'file: ', file, 'fileList: ', fileList)
      this.add.list = fileList
    },
    // 切换页面
    toggleCurrent(current = '') {
      const { fullPath } = this.$route
      this.$router.replace({
        path: '/redirect' + fullPath,
        query: {
          current
        }
      })
    },
    // 备注
    addRemark(row) {
      this.remark.form.remark = row.remark
      this.remark.visible = true
    },
    // 保存备注
    saveRemark() {
      this.remark.loading = true
      this.$refs.remark.validate(valid => {
        if (valid) {
          //
        }
        this.remark.loading = false
      })
    },
    // 获取列表
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
    // 输入查询
    querySearch(queryString, cb) {
      cb([{
        value: '123'
      }])
    },
    // 选择查询结果
    handleSelect() {
      this.dialogTableVisible = false
      this.current = 'index'
      this.getList()
    },
    // 更换作者
    toUpdate(row) {
      this.update.currentAuthor = row.author
      this.update.visible = true
    },
    // 保存更换作者
    saveUpdate() {
      this.update.loading = true
      this.$refs.update.validate(valid => {
        if (valid) {
          //
        }
        this.update.loading = false
      })
    },
    // 复制
    handleCopy(text, event) {
      clip(text, event)
    },
    // 删除
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
    // 分享
    toShare(row) {
      this.$confirm('确认要将此书分章节处理吗?此操作不可恢复!', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.share.visible = true
        setTimeout(() => {
          this.share.visible = false
        }, 5000)
      }).catch(() => {
        //
      })
    },
    // 编辑
    edit(row) {
      this.toggleCurrent('edit')
      for (const key in row) {
        if (row.hasOwnProperty(key)) {
          this.$set(this.add.form, key, row[key])
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .novel-management{
    position: relative;
    .mask{
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: #000;
      opacity: 0.8;
      z-index: 999;
      .text{
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        text-align: center;
        width: 100%;
        color: #fff;
      }
    }
  }
</style>
