<template>
  <div class="app-container">
    <div v-if="current === 'add' || current === 'edit'">
      <el-tabs v-model="add.active">
        <el-tab-pane label="微信配置" name="wechatConfig">
          <el-form ref="form1" label-width="200px" :rules="add.rules" :model="add.form">
            <el-row>
              <el-col :span="12">
                <el-form-item label="公众号名称" prop="name">
                  <el-input v-model="add.form.name" placeholder="请输入内容" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="公众号代理" prop="admin_id">
                  <el-select v-model="add.form.admin_id" clearable @visible-change="proxyListVisible">
                    <el-option v-for="op in options.proxyList" :key="op.id" :label="op.username" :value="op.id" />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <!-- <el-row>
              <el-col :span="12">
                <el-form-item label="子账号ID" prop="pid">
                  <el-select v-model="add.form.pid" placeholder="不选则为顶级分类">
                    <el-option v-for="td in table.data" :key="td.id" :value="td.id" :label="td.name" clearable>
                      <div v-if="td.pid === 0">
                        {{ td.name }}
                      </div>
                      <div v-else>
                        —— —— {{ td.name }}
                      </div>
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row> -->
            <el-row>
              <el-col :span="12">
                <el-form-item label="微信号" prop="wechat_account">
                  <el-input v-model="add.form.wechat_account" placeholder="请输入内容" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="原始ID" prop="original_id">
                  <el-input v-model="add.form.original_id" placeholder="请输入内容" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="AppID" prop="appid">
                  <el-input v-model="add.form.appid" placeholder="请输入内容" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="AppSecret" prop="appsecre">
                  <el-input v-model="add.form.appsecre" placeholder="请输入内容" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="客服二维码" prop="qrcode_thumb_id">
                  <el-upload
                    ref="kefuList"
                    class="upload-demo"
                    :multiple="false"
                    :limit="1"
                    :action="uploadUrl"
                    name="image"
                    :headers="headers"
                    :on-remove="kefuRemove"
                    :file-list="add.kefuList"
                    :on-success="kefuUploadSuccess"
                    list-type="picture"
                  >
                    <el-button size="small" type="primary">点击上传</el-button>
                  </el-upload>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="关注二维码" prop="sub_thumb_id">
                  <el-upload
                    ref="guanzhuList"
                    class="upload-demo"
                    :multiple="false"
                    :limit="1"
                    :action="uploadUrl"
                    name="image"
                    :headers="headers"
                    :on-remove="guanzhuRemove"
                    :file-list="add.guanzhuList"
                    :on-success="guanzhuUploadSuccess"
                    list-type="picture"
                  >
                    <el-button size="small" type="primary">点击上传</el-button>
                  </el-upload>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="Token(令牌)" prop="token">
                  <el-input v-model="add.form.token" placeholder="请输入令牌" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="EncodingAESKey(消息加密解密秘钥)" prop="encoding">
                  <el-input v-model="add.form.encoding" placeholder="请输入内容" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="公众域证明文件" prop="verify_file_id">
                  <el-upload
                    ref="proveList"
                    class="upload-demo"
                    :action="uploadFileUrl"
                    drag
                    name="files"
                    :headers="headers"
                    :on-remove="proveRemove"
                    :file-list="add.proveList"
                    :multiple="false"
                    :limit="1"
                    :on-success="proveUploadSuccess"
                  >
                    <i class="el-icon-upload" />
                    <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                  </el-upload>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="签到配置" name="signinConfig">
          <el-form ref="form2" :model="add.form" :rules="add.rules" label-width="100px">
            <el-row>
              <el-col :span="12">
                <el-form-item label="开始签到赠送书币" prop="signIn_first">
                  <el-input v-model="add.form.signIn_first" placeholder="请输入内容" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="每天签到送书币" prop="continuity">
                  <el-input v-model="add.form.continuity" placeholder="请输入内容" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="最高赠书币" prop="signIn_max">
                  <el-input v-model="add.form.signIn_max" placeholder="请输入内容" />
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-tab-pane>
      </el-tabs>
      <el-button type="success" :loading="add.loading" @click="save">保存</el-button>
      <el-button type="danger" @click="goback">返回</el-button>
    </div>
    <div v-else>
      <div class="filter-container">
        <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-refresh" @click="refresh" />
        <el-button class="filter-item" style="margin-left: 10px;" type="primary" @click="toggleCurrent('add', { admin_id: search.form.admin_id })">
          添加
        </el-button>
        <el-select v-model="search.form.admin_id" class="filter-item" style="margin-left: 10px;" clearable @visible-change="proxyListVisible">
          <el-option v-for="op in options.proxyList" :key="op.id" :label="op.username" :value="op.id" />
        </el-select>
        <el-button class="filter-item" style="margin-left: 10px;" type="primary" @click="getList">
          搜索
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
              <el-button type="danger" size="mini" @click="wechatDelete(row.id)">
                删除
              </el-button>
              <el-button type="primary" size="mini" @click="edit(row)">
                配置
              </el-button>
              <el-button type="primary" size="mini" @click="serverJoint(row)">
                服务器对接
              </el-button>
            </div>
            <div v-else>
              {{ row[cl.prop] }}
            </div>
          </template>
        </el-table-column>
      </el-table>
      <!-- <el-button type="primary" style="margin-top: 20px;">排序</el-button> -->
      <pagination v-show="table.total>0" :total="table.total" :page.sync="table.page" :limit.sync="table.limit" @pagination="pagin" />
    </div>
    <!-- 弹出接口弹窗 -->
    <el-dialog v-loading="joint.loading" :visible.sync="joint.visible" title="服务器对接" top="15vh">
      <el-form ref="joint" :model="joint.form" label-width="120px">
        <el-form-item label="业务域名" prop="ywym">
          {{ joint.form.ywym }}
        </el-form-item>
        <el-form-item label="JS接口安全域名" prop="aqym">
          {{ joint.form.ywym }}
        </el-form-item>
        <el-form-item label="网页域名授权" prop="ymsq">
          {{ joint.form.ywym }}
        </el-form-item>
        <el-form-item label="url(服务器地址)" prop="url">
          {{ joint.form.url }}
        </el-form-item>
        <el-form-item label="提示">
          <div class="imgs-wrap">
            <div class="img-wrap">
              <div class="mask">
                <i class="el-icon-zoom-in preview-btn" @click="toPreview(1)" />
              </div>
              <img src="../../assets/images/tishi-1.png">
            </div>
            <div class="img-wrap">
              <div class="mask">
                <i class="el-icon-zoom-in preview-btn" @click="toPreview(2)" />
              </div>
              <img src="../../assets/images/tishi-2.png">
            </div>
          </div>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 显示放大图片 -->
    <el-dialog :visible.sync="preview.visible" top="15vh" title="查看提示">
      <img v-if="preview.type === 1" src="../../assets/images/tishi-1.png" width="100%">
      <img v-else src="../../assets/images/tishi-2.png" width="100%">
    </el-dialog>
  </div>
</template>

<script>
import { wechatList, wechatDelete, wechatAdd, wechatUpdate } from '@/api/wechat/wechat'
import { adminList } from '@/api/proxy/list'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import mix from '@/mixs/mix'

export default {
  name: 'ComplexTable',
  components: {
    Pagination
  },
  mixins: [mix],
  data() {
    return {
      // 放大图片
      preview: {
        visible: false,
        type: 1
      },
      // 接口
      joint: {
        visible: false,
        form: {
          url: '',
          ywym: '',
          aqym: '',
          ymsq: ''
        },
        loading: false
      },
      options: {
        proxyList: []
      },
      search: {
        form: {
          admin_id: ''
        },
        loading: false
      },
      // 上传地址
      uploadUrl: process.env.VUE_APP_BASE_API + '/common/upload_picture',
      uploadFileUrl: process.env.VUE_APP_BASE_API + '/common/upload_files',
      // 上传头部
      headers: {
        token: ''
      },
      add: {
        form: {
          admin_id: '',
          name: '',
          wechat_account: '',
          original_id: '',
          appid: '',
          appsecre: '',
          token: '',
          encoding: '',
          qrcode_url: '',
          qrcode_thumb_id: '',
          signIn_first: '',
          sub_thumb_id: '',
          verify_file_id: '',
          continuity: '',
          signIn_max: ''
        },
        rules: {
          admin_id: [
            { required: true, message: '请您选择代理' }
          ],
          name: [
            { required: true, message: '请您输入公众号名称' }
          ],
          wechat_account: [
            { required: true, message: '请您输入微信账号' }
          ],
          original_id: [
            { required: true, message: '请您输入原始ID' }
          ],
          appid: [
            { required: true, message: '请您输入appid' }
          ],
          appsecre: [
            { required: true, message: '请您输入Appsecre' }
          ],
          token: [
            { required: true, message: '请您输入token(令牌)' }
          ],
          encoding: [
            { required: true, message: '请您输入EncodingAESKey(消息加解密密钥)' }
          ],
          qrcode_thumb_id: [
            { required: true, message: '请上传客服二维码' }
          ]
        },
        guanzhuList: [],
        kefuList: [],
        proveList: [],
        loading: false,
        active: 'wechatConfig'
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
            label: '名称',
            prop: 'name',
            align: 'center'
          },
          {
            label: '原始ID',
            prop: 'original_id',
            align: 'center'
          },
          {
            label: '签到天数',
            prop: 'signIn_first',
            align: 'center'
          },
          {
            label: '每次签到获得积分',
            prop: 'continuity',
            align: 'center'
          },
          {
            label: '微信账号',
            prop: 'wechat_account',
            align: 'center'
          },
          {
            label: '操作',
            prop: 'action',
            align: 'center',
            width: 280
          }
        ],
        data: [],
        total: 0,
        page: 1,
        size: 20,
        loading: false
      }
    }
  },
  created() {
    const query = this.$route.query
    const { current } = query
    this.headers.token = this.$store.getters.token
    this.current = current
    if (current === 'edit') {
      this.proxyListVisible(true)
      for (const key in query) {
        if (key === 'qrcode_thumb_url') {
          if (query[key]) {
            const arr = query[key].split('/')
            const name = arr.splice(arr.length - 1, arr.length)[0]
            this.add.kefuList = [{
              name,
              url: query[key]
            }]
          }
        } else if (key === 'sub_thumb_url') {
          if (query[key]) {
            const arr = query[key].split('/')
            const name = arr.splice(arr.length - 1, arr.length)[0]
            this.add.guanzhuList = [{
              name,
              url: query[key]
            }]
          }
        } else if (key === 'verify_file_url') {
          if (query[key]) {
            const arr = query[key].split('/')
            const name = arr.splice(arr.length - 1, arr.length)[0]
            this.add.proveList = [{
              name,
              url: query[key]
            }]
          }
        } else if (key !== 'current' && key) {
          this.$set(this.add.form, key, query[key])
        }
      }
    } else if (!current) {
      if (query.admin_id) {
        this.search.form.admin_id = Number(query.admin_id)
      }
      this.proxyListVisible(true)
      this.getList()
    }
  },
  methods: {
    // 打开显示
    toPreview(type) {
      this.preview.type = type
      this.preview.visible = true
    },
    // 返回
    goback() {
      const admin_id = this.$route.query.admin_id
      this.toggleCurrent('', {
        admin_id
      })
    },
    // 客服上传成功
    kefuUploadSuccess(res, file, fileList) {
      this.add.form.qrcode_thumb_id = res.data.id
    },
    // 客服删除图片
    kefuRemove() {
      this.add.form.qrcode_thumb_id = ''
    },
    // 关注二维码上传成功
    guanzhuUploadSuccess(res, file, fileList) {
      this.add.form.sub_thumb_id = res.data.id
    },
    // 关注二维码删除图片
    guanzhuRemove() {
      this.add.form.sub_thumb_id = ''
    },
    // 证明文件上传成功
    proveUploadSuccess(res, file, fileList) {
      this.add.form.verify_file_id = res.data.id
    },
    // 证明文件删除
    proveRemove() {
      this.add.form.verify_file_id = ''
    },
    // 翻页
    pagin(data) {
      const { limit, page } = data
      this.table.size = limit
      this.table.page = page
      this.getList()
    },
    // 打开代理列表下拉
    proxyListVisible(val) {
      if (val) {
        adminList({
          size: 99999
        }).then(res => {
          this.options.proxyList = res.data.data
        })
      }
    },
    save() {
      this.$refs.form1.validate(valid => {
        if (valid) {
          this.add.loading = true
          const obj = Object.assign({}, this.add.form)
          const submit = this.current === 'add' ? wechatAdd : wechatUpdate
          submit(obj).then(res => {
            this.$message.success(res.message)
            this.add.loading = false
            if (this.current === 'add') {
              this.toggleCurrent('add')
            }
          }).catch(() => {
            this.add.loading = false
          })
        }
      })
    },
    addUploadImgSuccess(res, file, fileList) {
      const { id, url } = res.data
      this.add.form.thumb_url = url
      this.add.form.thumb_id = id
      this.add.list = fileList
    },
    handlePreview() {
      //
    },
    handleRemove() {
      this.add.form.thumb_id = ''
      this.add.form.thumb_url = ''
    },
    // 获取列表
    getList() {
      this.table.loading = true
      wechatList({
        admin_id: this.search.form.admin_id,
        page: this.table.page,
        size: this.table.size
      }).then(response => {
        this.table.data = response.data.data
        this.table.total = response.data.total
        this.table.loading = false
      })
    },
    toggleCurrent(current = '', query) {
      const { path } = this.$route
      this.$router.replace({
        path: '/redirect' + path,
        query: {
          current,
          ...query
        }
      })
    },
    sortChange() {
      //
    },
    wechatDelete(id) {
      this.$confirm('确定删除该数据？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.table.loading = true
        wechatDelete({
          id
        }).then(res => {
          this.$message.success(res.message)
          this.getList()
          this.table.loading = false
        }).catch((err) => {
          this.table.loading = false
          this.$message.error(err.message)
        })
      })
    },
    edit(row) {
      const query = {
        admin_id: this.search.form.admin_id,
        ...row
      }
      this.toggleCurrent('edit', query)
    },
    // 服务器对接
    serverJoint(row) {
      this.joint.form.url = row.url
      this.joint.visible = true
    }
  }
}
</script>

<style lang="scss" scoped>
  .imgs-wrap{
    display: flex;
    .img-wrap{
      position: relative;
      margin-right: 20px;
      width: 160px;
      &:hover{
        .mask{
          display: block;
        }
      }
      .mask{
        display: none;
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.3);
        .preview-btn{
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
          cursor: pointer;
          color: #fff;
          font-size: 24px;
        }
      }
      img{
        display: block;
        width: 100%;
        object-fit: fill;
      }
    }
  }
</style>
