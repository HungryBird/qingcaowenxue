<template>
  <div class="tuiguang text">
    <div class="rich_media">
      <h1 id="title" class="title">
        {{ title }}
      </h1>
      <div class="rich_media_content">
        <el-image :src="cover.src" style="margin-bottom: 20px;width: 100%;" />
        <div id="content">
          <template1 v-if="template === 1" :mode="mode" />
          <template2 v-if="template === 2" :mode="mode" />
          <template3 v-if="template === 3" :mode="mode" />
          <template4 v-if="template === 4" :mode="mode" />
          <template5 v-if="template === 5" :mode="mode" />
          <template6 v-if="template === 6" :mode="mode" />
          <template7 v-if="template === 7" :mode="mode" />
          <template10 v-if="template === 10" :mode="mode" />
          <template11 v-if="template === 11" :mode="mode" />
          <template12 v-if="template === 12" :mode="mode" />
        </div>
      </div>
    </div>
    <nav class="navbar-default navbar-fixed-bottom">
      <div class="container">
        <el-dropdown trigger="click" @command="replaceTitle">
          <span>
            文案标题<i class="el-icon-caret-top el-icon--right" />
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="黄金糕">黄金糕</el-dropdown-item>
            <el-dropdown-item command="狮子头">狮子头</el-dropdown-item>
            <el-dropdown-item command="螺蛳粉">螺蛳粉</el-dropdown-item>
            <el-dropdown-item command="双皮奶">双皮奶</el-dropdown-item>
            <el-dropdown-item command="蚵仔煎">蚵仔煎</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <div class="el-dropdown" @click="cover.visible = true">
          <span>
            文案封面<i class="el-icon-caret-top el-icon--right" />
          </span>
        </div>
        <el-dropdown trigger="click" @command="toggleTextImg">
          <span>
            {{ mode === 'Text' ? '文本模式' : '图片模式' }}
            <i class="el-icon-caret-top el-icon--right" />
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="Text">文本模式</el-dropdown-item>
            <el-dropdown-item command="Img">图片模式</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <el-dropdown trigger="click" @command="chooseContentTemplate">
          <span>
            正文模板<i class="el-icon-caret-top el-icon--right" />
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item v-for="(sc, index) in contentSelect" :key="index" :command="sc.command" style="width: 153px;">
              <el-image :src="sc.src" style="width: 100%;" />
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <el-dropdown trigger="click">
          <span>
            原文引导模板<i class="el-icon-caret-top el-icon--right" />
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>黄金糕</el-dropdown-item>
            <el-dropdown-item>狮子头</el-dropdown-item>
            <el-dropdown-item>螺蛳粉</el-dropdown-item>
            <el-dropdown-item>双皮奶</el-dropdown-item>
            <el-dropdown-item>蚵仔煎</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <el-dropdown trigger="click" @command="handleCopy">
          <span>
            <i class="el-icon-document-copy el-icon--left" />复制<i class="el-icon-caret-top el-icon--right" />
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="title">复制标题</el-dropdown-item>
            <el-dropdown-item command="content">复制正文</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </nav>
    <!-- 选择文案封面 -->
    <el-dialog :visible.sync="cover.visible" width="90%" title="选择文案封面">
      <el-row :gutter="20" type="flex">
        <el-col v-for="(cl, index) in cover.list" :key="index" :span="4">
          <el-image :src="cl.src" fit="cover" style="width: 100%;height: 100%;" @click="chooseCoverImg(cl)" />
        </el-col>
      </el-row>
      <div style="text-align: center;padding-top: 60px;">
        <el-button type="primary" plain>
          加载更多
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import template1 from './templates/template1'
import template2 from './templates/template2'
import template3 from './templates/template3'
import template4 from './templates/template4'
import template5 from './templates/template5'
import template6 from './templates/template6'
import template7 from './templates/template7'
import template10 from './templates/template10'
import template11 from './templates/template11'
import template12 from './templates/template12'
import { selectText } from '@/utils'

export default {
  components: {
    template1,
    template2,
    template3,
    template4,
    template5,
    template6,
    template7,
    template10,
    template11,
    template12
  },
  data() {
    return {
      mode: '',
      img: '',
      template: 1,
      text: '',
      title: '你以为嫁了个没钱的男人，他就一定会对你好？',
      content: '',
      test: '',
      cover: {
        visible: false,
        list: [
          {
            src: 'http://new.fuleien.com/uploads/copywriting/images/1541051530.jpg'
          },
          {
            src: 'http://new.fuleien.com/uploads/copywriting/images/1541051512.jpg'
          },
          {
            src: 'http://new.fuleien.com/uploads/copywriting/images/1541050929.jpg'
          }
        ],
        total: 0,
        page: 1,
        size: 20,
        src: 'http://new.fuleien.com/uploads/copywriting/images/1541051530.jpg'
      },
      contentSelect: [
        {
          command: 1,
          src: require('../../assets/text-select/body1.jpg')
        },
        {
          command: 2,
          src: require('../../assets/text-select/body2.jpg')
        },
        {
          command: 3,
          src: require('../../assets/text-select/body3.jpg')
        },
        {
          command: 4,
          src: require('../../assets/text-select/body4.jpg')
        },
        {
          command: 5,
          src: require('../../assets/text-select/body5.jpg')
        },
        {
          command: 6,
          src: require('../../assets/text-select/body6.jpg')
        },
        {
          command: 7,
          src: require('../../assets/text-select/body7.jpg')
        },
        {
          command: 10,
          src: require('../../assets/text-select/body10.jpg')
        },
        {
          command: 11,
          src: require('../../assets/text-select/body11.jpg')
        },
        {
          command: 12,
          src: require('../../assets/text-select/body12.jpg')
        }
      ]
    }
  },
  created() {
    const { mode } = this.$route.query
    this.mode = mode
  },
  methods: {
    // 切换文本和图片模式
    toggleTextImg(mode) {
      this.mode = mode
    },
    // 选择封面
    chooseCoverImg(cl) {
      this.cover.src = cl.src
      this.cover.visible = false
    },
    // 选择正文模板
    chooseContentTemplate(command) {
      this.template = command
    },
    // 替换标题
    replaceTitle(command) {
      this.title = command
    },
    // 复制
    handleCopy(command) {
      const dom = command === 'title' ? '#title' : '#content'
      selectText(dom).then(res => {
        document.execCommand('Copy')
        this.$message.success('复制成功')
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .tuiguang{
    height: 100%;
    overflow-y: auto;
    .navbar-default{
      background-color: #f8f8f8;
      border-color: #e7e7e7;
    }
    .navbar-fixed-bottom{
      bottom: 0;
      margin-bottom: 0;
      border-width: 1px 0 0;
      position: fixed;
      right: 0;
      left: 0;
      z-index: 1030;
    }
    .rich_media{
      padding-bottom: 50px;
      .title{
        line-height: 1.4;
        font-weight: 400;
        font-size: 24px;
      }
      @media screen and (min-width: 1024px) {
        .title {
            padding-bottom: 10px;
            margin-bottom: 14px;
            border-bottom: 1px solid #e7e7eb;
        }
      }
    }
    @media screen and (min-width: 1025px) {
      .rich_media {
          position: relative;
      }
    }
    @media screen and (min-width: 1024px) {
      .rich_media {
        width: 740px;
        margin-left: auto;
        margin-right: auto;
      }
    }
    @media screen and (min-width: 1025px) {
      .rich_media {
          position: relative;
      }
    }
    @media screen and (min-width: 1024px) {
      .rich_media {
          width: 740px;
          margin-left: auto;
          margin-right: auto;
      }
    }
    @media (min-width: 1200px) {
      .container {
          width: 1170px;
      }
    }
    @media (min-width: 992px) {
      .container {
        width: 970px;
      }
    }
    @media (min-width: 768px) {
      .container {
        width: 750px;
      }
    }
    .container {
      padding-right: 15px;
      padding-left: 15px;
      margin-right: auto;
      margin-left: auto;
      .el-dropdown{
        padding: 15px;
        cursor: pointer;
      }
    }
  }
</style>
