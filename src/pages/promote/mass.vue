<template>
  <div class="app-container">
    <div v-if="current === 'add' || current === 'edit'">
      <el-form ref="add" label-width="200px" :model="add.form" :rules="add.rules">
        <el-row>
          <el-col :span="12">
            <el-form-item label="推广名称：" prop="name">
              <el-input v-model="add.form.name" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="推广链接：" prop="link">
              <el-input v-model="add.form.link" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="封面图片：" prop="img">
              <el-upload
                class="upload-demo"
                :multiple="false"
                :limit="1"
                action="https://jsonplaceholder.typicode.com/posts/"
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
          <el-col :span="16">
            <el-form-item label="推广描述：" prop="descript">
              <el-input v-model="add.form.descript" type="textarea" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="接受粉丝[充值情况]：" prop="situation">
              <el-radio-group v-model="add.form.situation">
                <el-radio label="none">
                  不限
                </el-radio>
                <el-radio label="done">
                  己充值粉丝
                </el-radio>
                <el-radio label="should">
                  未充值粉丝
                </el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="接受粉丝[性别]：" prop="sex">
              <el-radio-group v-model="add.form.sex">
                <el-radio label="none">
                  不限
                </el-radio>
                <el-radio label="male">
                  男
                </el-radio>
                <el-radio label="female">
                  女
                </el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="状 态：" prop="switch">
              <el-radio-group v-model="add.form.switch">
                <el-radio label="on">
                  开启
                </el-radio>
                <el-radio label="off">
                  关闭
                </el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item>
              <el-button type="success" :loading="add.loading" @click="saveAdd">保存</el-button>
              <el-button type="danger" @click="toggleCurrent('')">返回</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div v-else>
      <div class="filter-container">
        <el-button class="filter-item" type="primary" icon="el-icon-refresh" @click="refresh" />
        <el-button class="filter-item" style="margin-left: 10px;" type="primary" plain @click="toggleCurrent('add')">
          添加群发链接
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
      <pagination v-show="table.total>0" :total="table.total" :page.sync="table.page" :limit.sync="table.limit" @pagination="getList" />
    </div>

    <!-- 测试发送 -->
    <el-dialog :visible.sync="test.visible" width="900px" top="35vh" title="测试发送">
      <el-form ref="test" :model="test.form" :rules="test.rules" label-width="120px">
        <el-row>
          <el-col :span="12">
            <el-form-item prop="fanId" label="测试粉丝ID">
              <el-input v-model="test.form.fanId" />
            </el-form-item>
          </el-col>
          <el-col :span="12" style="color: #f00;line-height: 2.5;padding-left: 10px;">
            用测试粉丝帐号点公众号菜单 "用户中心" > "个人中心"。
          </el-col>
        </el-row>
      </el-form>
      <div style="text-align: center;">
        <el-button type="primary" @click="toSend">
          发送
        </el-button>
      </div>
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
      // 测试发送
      test: {
        visible: false,
        loading: false,
        form: {},
        rules: {
          fanId: { required: true, message: '请您输入测试粉丝ID' }
        }
      },
      search: {
        form: {},
        loading: false
      },
      add: {
        loading: false,
        form: {
          name: '',
          link: '',
          img: '',
          descript: '',
          situation: 'none',
          sex: 'none',
          switch: 'on',
          payMethod: 'bankcard'
        },
        rules: {
          name: [
            { required: true, message: '请输入推广名称' }
          ],
          link: [
            { required: true, message: '请输入推广链接' }
          ],
          img: [
            { required: true, message: '请上传推广封面' }
          ],
          descript: [
            { required: true, message: '请输入推广描述' }
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
    // 开始测试发送
    toSend() {
      this.$refs.test.validate(valid => {
        if (valid) {
          this.$message({
            type: 'success',
            message: '发送成功'
          })
          this.test.visible = false
        } else {
          //
        }
      })
    },
    // 测试发送
    handleTest(row) {
      this.test.visible = true
    },
    getList() {
      this.table.loading = true
      fetchList(this.listQuery).then(response => {
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
