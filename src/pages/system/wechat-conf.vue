<template>
  <div>
    <el-tabs v-model="activeName" type="card" class="top-menu-box">
      <el-tab-pane label="公众号配置" name="first">
        <el-form ref="form" :model="form" label-width="140px">
          <el-form-item label="类型：" style="width:70%">
            <el-radio-group v-model="form.resource">
              <el-radio label="0">认证服务号</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="原始ID：" style="width:60%" class="text-box">
            <el-input v-model="form.name"></el-input>
            <span>注意: 上线后请不要更改公众号，否则会影响先前的粉丝，如需换号请申请开新号</span>
          </el-form-item>
          <el-form-item label="微信号：" style="width:60%">
            <el-input v-model="form.name"></el-input>
          </el-form-item>
          <el-form-item label="微信公众号名称：" style="width:60%">
            <el-input v-model="form.name"></el-input>
          </el-form-item>
          <el-form-item label="App ID：" style="width:60%">
            <el-input v-model="form.name"></el-input>
          </el-form-item>
          <el-form-item label="App Secret：" style="width:60%">
            <el-input v-model="form.name"></el-input>
          </el-form-item>
          <el-form-item label="客服二维码" style="width:700px">
            <el-upload
              name="image"
              class="avatar-uploader"
              action
              :show-file-list="false"
              :on-success="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload"
            >
              <img v-if="kefuerweima" :src="kefuerweima" class="avatar" />
              <i v-else class="el-icon-plus avatar-uploader-icon" />
            </el-upload>
          </el-form-item>
          <el-form-item label="关注二维码" style="width:700px">
            <el-upload
              name="image"
              class="avatar-uploader"
              action
              :show-file-list="false"
              :on-success="handleAvatarSuccessguanzhu"
              :before-upload="beforeAvatarUpload"
            >
              <img v-if="guanzhuerweima" :src="guanzhuerweima" class="avatar" />
              <i v-else class="el-icon-plus avatar-uploader-icon" />
            </el-upload>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="公众号接入" name="second">
        <el-form ref="form" :model="form" label-width="140px">
          <div class="alert-warning">注意: 接入公众号必须是"认证服务号"</div>
          <div class="set-reminder">公众号设置 (微信后台 > 公众号设置 > 功能设置)</div>
          <el-form-item label="业务域名：" style="width:60%">
            <el-input v-model="form.name" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="JS接口安全域名：" style="width:60%">
            <el-input v-model="form.name" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="网页授权域名：" style="width:60%">
            <el-input v-model="form.name" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="授权文件" style="width:700px">
            <div>
              <el-tag v-if="form.verify_file_id" type="success">文件已成功上传，如需更改，请重新上传</el-tag>
              <el-tag v-else type="danger">请上传</el-tag>
            </div>
            <el-upload
              class="upload-demo"
              name="files"
              drag
              action
              :on-success="shangchuanwenjian"
              :before-upload="xianzhishangchuanwenjiandaxiao"
              :limit="1"
              :on-exceed="handleExceed"
              multiple
            >
              <i class="el-icon-upload" />
              <div class="el-upload__text">
                将文件拖到此处，或
                <em>点击上传</em>
              </div>
              <div slot="tip" class="el-upload__tip" />
            </el-upload>
          </el-form-item>
          <el-form-item label="白名单IP：" style="width:60%">
            <div>47.112.155.205</div>
          </el-form-item>
          <el-form-item label="网页授权登录域名：" style="width:60%">
            <div>qcxs.qc667.com</div>
          </el-form-item>
          <div class="set-reminder">公众号回复 (微信后台 > 基本配置)</div>
          <el-form-item label="URL(服务器地址)：" style="width:60%">
            <el-input v-model="form.name" :disabled="true"></el-input>
          </el-form-item>
          <div class="flex-box">
            <el-form-item label="Token(令牌)：" style="width:60%">
              <el-input v-model="form.token" :disabled="true"></el-input>
            </el-form-item>
            <el-button type="primary" class="margin-left-20" @click="getToken">生成Token</el-button>
          </div>
          <div class="flex-box">
            <el-form-item label="EncodingAESKey(消息加解密密钥)：" style="width:60%">
              <el-input v-model="form.encoding" :disabled="true"></el-input>
            </el-form-item>
            <el-button type="primary" class="margin-left-20" @click="getEncoding">生成解密密钥</el-button>
          </div>
          <el-form-item label="消息加解密方式：" style="width:60%">
            <div>明文模式</div>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="签到配置" name="third">
        <el-form ref="form" :model="form" label-width="140px">
          <el-form-item label="签到送书币：" style="width:60%">
            <el-input v-model="form.name"></el-input>
          </el-form-item>
          <el-form-item label="连续签到书币：" style="width:60%">
            <el-input v-model="form.name"></el-input>
          </el-form-item>
          <el-form-item label="最高赠送书币：" style="width:60%">
            <el-input v-model="form.name"></el-input>
          </el-form-item>
        </el-form>
      </el-tab-pane>
    </el-tabs>
    <div class="bottom-btn">
      <el-button type="primary">保存</el-button>
      <el-button type="danger">返回</el-button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      activeName: "first",
      form: {
        resource: "0",
        name: "",
        verify_file_id: "",
        encoding:'',
        token:''
      },
      kefuerweima: "",
      guanzhuerweima: "",
    };
  },
  methods: {
    handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw);
      console.log(res);
      //   this.form.qrcode_thumb_id = res.data.id;
      this.kefuerweima = res.data.url;
      this.$message("上传成功");
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error("上传图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },
    handleAvatarSuccessguanzhu(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw);
      console.log(res);
      //   this.form.sub_thumb_id = res.data.id;
      //   this.form.sub_thumb_url =  res.data.sub_thumb_url;
      this.guanzhuerweima = res.data.url.slice(0);
      this.$message("关注二维码上传成功");
    },
    xianzhishangchuanwenjiandaxiao(file) {
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        this.$message.error("上传文件大小不能超过 2MB!");
      }
      return isLt2M;
    },
    shangchuanwenjian(res, file) {
      console.log(res);
      this.form.verify_file_id = res.data.id;
      this.$message("上传文件成功");
    },
    handleExceed(files, fileList) {
      this.$message.warning(
        `当前限制选择 1 个文件，本次选择了 ${files.length} 个文件`
      );
    },
    randomWord(randomFlag, min, max){
      let  str = "",
      range = min,
      arr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
      // 随机产生
      if(randomFlag){
        range = Math.round(Math.random() * (max-min)) + min;
      }
      for(let i=0; i<range; i++){
        let pos = Math.round(Math.random() * (arr.length-1));
        str += arr[pos];
      }
      return str;
    },
    getToken(){
       this.form.token = this.randomWord(false, 32) 
    },
    getEncoding(){
      this.form.encoding = this.randomWord(false, 43) 
    }
  },
  mounted () {
    this.form.encoding = this.randomWord(false, 43)
    this.form.token = this.randomWord(false, 32)
  },
};
</script>

<style lang="scss" scoped>
.top-menu-box {
  margin-top: 30px;
  margin-left: 16px;
  .text-box {
    span {
      font-family: "open sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
      font-size: 13px;
      color: #676a6c;
    }
  }
  .alert-warning {
    color: rgb(49, 112, 143);
    background-color: rgb(217, 237, 247);
    border-color: rgb(188, 232, 241);
    padding: 20px 15px;
  }
  .set-reminder {
    padding: 20px 0;
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
    min-width: 100px;
    height: 100px;
    display: block;
  }
  .flex-box {
    display: flex;
    .margin-left-20 {
      margin-left: 20px;
      height: 36px;
    }
  }
}
.bottom-btn {
  padding-left: 400px;
  margin: 20px 0;
}
</style>
<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
</style>