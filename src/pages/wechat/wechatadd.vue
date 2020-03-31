<template>
  <el-container>
    <el-header height="0" />
    <el-main>
      <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
        <el-tab-pane label="微信配置" name="first">
          <el-form ref="form" :model="form" label-width="250px">
            <el-form-item label="公众号名称" style="width:700px">
              <el-input v-model="form.name" />
            </el-form-item>
            <el-form-item label="子账号ID" style="width:700px">
              <!-- <el-input v-model="form.manager_id" /> -->
              <el-select v-model="value" placeholder="请选择" style="width:450px">
                <el-option
                  v-for="item in zizhanghaoliebiao"
                  :key="item.username"
                  :label="item.username"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="微信号" style="width:700px">
              <el-input v-model="form.wechat_account" />
              <!-- <el-select v-model="value" placeholder="请选择"  style="width:450px">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select> -->
            </el-form-item>
            <el-form-item label="原始ID" style="width:700px">
              <el-input v-model="form.original_id" />
            </el-form-item>
            <el-form-item label="APPID" style="width:700px">
              <el-input v-model="form.appid" />
            </el-form-item>
            <el-form-item label="AppSecret" style="width:700px">
              <el-input v-model="form.appsecre" />
            </el-form-item>
            <el-form-item label="客服二维码" style="width:700px">
              <el-upload
                name="image"
                class="avatar-uploader"
                action="http://admin_api.fuleien.com/agent/uploadImage/"
                :show-file-list="false"
                :on-success="handleAvatarSuccess"
                :before-upload="beforeAvatarUpload"
              >
                <img v-if="kefuerweima" :src="kefuerweima" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon" />
              </el-upload>
            </el-form-item>
            <el-form-item label="关注二维码" style="width:700px">
              <el-upload
                name="image"
                class="avatar-uploader"
                action="http://admin_api.fuleien.com/agent/uploadImage/"
                :show-file-list="false"
                :on-success="handleAvatarSuccessguanzhu"
                :before-upload="beforeAvatarUpload"
              >
                <img v-if="guanzhuerweima" :src="guanzhuerweima" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon" />
              </el-upload>
            </el-form-item>
            <el-form-item label="Token(令牌)" style="width:700px">
              <el-input v-model="form.token" />
            </el-form-item>
            <el-form-item label="EncodingAESKey(消息加解密密钥)" style="width:700px">
              <el-input v-model="form.encoding" />
            </el-form-item>
            <el-form-item />
            <el-form-item label="公众号域名证明文件" style="width:700px">
              <el-upload
                class="upload-demo"
                name="files"
                drag
                action="http://admin_api.fuleien.com/agent/uploadFiles"
                :on-success="shangchuanwenjian"
                :before-upload="xianzhishangchuanwenjiandaxiao"
                :limit="1"
                :on-exceed="handleExceed"
                multiple
              >
                <i class="el-icon-upload" />
                <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                <div slot="tip" class="el-upload__tip" />
              </el-upload>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="签到配置" name="third">
          <el-form ref="form" :model="form" label-width="150px">
            <el-form-item label="签到天数" style="width:700px">
              <el-input v-model="form.signIn_day" />
            </el-form-item>
            <el-form-item label="签到送书币" style="width:700px">
              <el-input v-model="form.continuity" />
            </el-form-item>
            <!-- <el-form-item label="连续签到书币" style="width:700px" >
    <el-input v-model="form.name" ></el-input>
  </el-form-item> -->
            <el-form-item label="最高赠送书币" style="width:700px">
              <el-input v-model="form.signIn_max" />
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>
    </el-main>
    <el-footer>
      <el-button type="success" @click="baocun()">保存</el-button>
      <!-- <el-button type="info">返回</el-button> -->
    </el-footer>
  </el-container>
</template>
<script>
import { wechatAdd } from '@/api/wechat.js'
import { zizhanghaohuoqv } from '@/api/wechat.js'
export default {
  data() {
    return {
      kefuerweima: '',
      value: '',
      imageUrl: '',
      activeName: 'first',
      form: {
        name: '',
        wechat_account: '',
        original_id: '',
        appid: '',
        appsecre: '',
        url: '',
        token: '',
        encoding: '',
        qrcode_thumb_id: '',
        signIn_day: '',
        continuity: '',
        signIn_max: '',
        manager_id: ''
      },
      zizhanghaoliebiao: {},
      guanzhuerweima: ''
    }
  },
  created() {
    zizhanghaohuoqv(this.page).then(response => {
      console.log(response)
      this.zizhanghaoliebiao = response.data.data
    })
  },
  methods: {
    xianzhishangchuanwenjiandaxiao(file) {
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isLt2M) {
        this.$message.error('上传文件大小不能超过 2MB!')
      }
      return isLt2M
    },
    shangchuanwenjian(res, file) {
      console.log(res)
      this.form.verify_file_id = res.data.id
      this.$message('上传文件成功')
    },
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件`)
    },
    baocun() {
      this.form.manager_id = this.value
      wechatAdd(this.form).then(response => {
        console.log(this.form)
        console.log(response)
        if (response.message === 'sucessfull!') { alert('添加成功'); this.fanhui() }
      })
    },

    handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw)
      console.log(res)
      this.form.qrcode_thumb_id = res.data.id
      this.kefuerweima = 'http://' + res.data.url.slice(0)
      this.$message('上传成功')
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        this.$message.error('上传图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    },
    handleAvatarSuccessguanzhu(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw)
      console.log(res)
      this.form.sub_thumb_id = res.data.id
      this.guanzhuerweima = 'http://' + res.data.url.slice(0)
      this.$message('关注二维码上传成功')
    },
    handleClick(tab, event) {
      console.log(tab, event)
    },
    fanhui() {
      this.$router.push({ path: 'list' })
    }
  }
}
</script>
<style>
  .el-header, .el-footer {
    background-color: #ffffff;
    color: #333;
    text-align: center;
    width: 50%;
    line-height: 60px;
  }
    .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 100px;
    height: 100px;
    line-height: 100px;
    text-align: center;
  }
  .avatar {
    width: 100px;
    height: 100px;
    display: block;
  }
</style>
