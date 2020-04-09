<template>
  <div v-loading="loading" class="tuiguang text">
    <div class="rich_media">
      <h1 id="title" class="title">
        {{ title }}
      </h1>
      <div class="rich_media_content">
        <el-image :src="cover.src" style="margin-bottom: 20px;width: 100%;" />
        <div id="content">
          <template1 v-if="template === 1" :mode="mode" :title="chapter_title" :content="chapter_content" />
          <template2 v-if="template === 2" :mode="mode" :title="chapter_title" :content="chapter_content" />
          <template3 v-if="template === 3" :mode="mode" :title="chapter_title" :content="chapter_content" />
          <template4 v-if="template === 4" :mode="mode" :title="chapter_title" :content="chapter_content" />
          <template5 v-if="template === 5" :mode="mode" :title="chapter_title" :content="chapter_content" />
          <template6 v-if="template === 6" :mode="mode" :title="chapter_title" :content="chapter_content" />
          <template7 v-if="template === 7" :mode="mode" :title="chapter_title" :content="chapter_content" />
          <template10 v-if="template === 10" :mode="mode" :title="chapter_title" :content="chapter_content" />
          <template11 v-if="template === 11" :mode="mode" :title="chapter_title" :content="chapter_content" />
          <template12 v-if="template === 12" :mode="mode" :title="chapter_title" :content="chapter_content" />
        </div>
      </div>
    </div>
    <nav class="navbar-default navbar-fixed-bottom">
      <div class="container">
        <el-dropdown trigger="click" @command="replaceTitle">
          <span>
            文案标题<i class="el-icon-caret-top el-icon--right" />
          </span>
          <el-dropdown-menu slot="dropdown" class="astrict-height">
            <el-dropdown-item v-for="ot in options.title" :key="ot.id" :command="ot.title">{{ ot.title }}</el-dropdown-item>
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
          <el-dropdown-menu slot="dropdown" class="astrict-height">
            <el-dropdown-item v-for="(sc, index) in options.content" :key="index" :command="sc.command" style="width: 153px;">
              <el-image :src="sc.picture_url" style="width: 100%;" />
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <el-dropdown trigger="click">
          <span>
            原文引导模板<i class="el-icon-caret-top el-icon--right" />
          </span>
          <el-dropdown-menu slot="dropdown" class="astrict-height">
            <el-dropdown-item v-for="og in options.guide" :key="og.id" :command="og.title">
              <el-image :src="og.picture_url" />
            </el-dropdown-item>
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
      <el-row :gutter="20" type="flex" style="flex-wrap: wrap;max-height: 600px;overflow: auto;">
        <el-col v-for="(cl, index) in cover.list" :key="index" :span="4" style="padding: 30px 15px;">
          <el-image :src="cl.picture_url" fit="cover" style="width: 100%;height: 100%;" @click="chooseCoverImg(cl)" />
        </el-col>
        <el-col :span="24" style="text-align: center;">
          <el-button v-if="cover.total !== cover.list.length" type="primary" plain @click="getMore">
            加载更多
          </el-button>
        </el-col>
      </el-row>
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
import { materialList } from '@/api/material/list'
import { chapterContent } from '@/api/book/list'

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
      loading: false,
      chapter_id: '',
      chapter_title: '',
      chapter_content: '',
      options: {
        title: [],
        content: [],
        guide: [],
        welcome: []
      },
      mode: '',
      img: '',
      template: 1,
      text: '',
      title: '',
      content: '',
      test: '',
      cover: {
        visible: false,
        list: [],
        total: 0,
        page: 1,
        size: 20,
        src: ''
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
    const { mode, id, title } = this.$route.query
    this.chapter_id = id
    this.chapter_title = title
    this.mode = mode
    for (let i = 1; i <= 5; i++) {
      this.materialList(i)
    }
    this.getContent()
  },
  methods: {
    // 获取文章内容
    getContent() {
      this.loading = true
      chapterContent({ id: this.chapter_id }).then(res => {
        this.chapter_content = res.data
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    // 获取更多封面
    getMore() {
      this.cover.page++
      this.materialList(2)
    },
    // 获取下拉
    materialList(type) {
      const size = type === 2 ? 30 : 9999999999
      const page = type === 2 ? this.cover.page : 1
      materialList({
        type,
        size,
        page
      }).then(res => {
        switch (type) {
          case 1:
            var first = this.options.title.length === 0
            this.options.title = res.data.data
            if (first) this.title = this.options.title[0].title
            break
          case 2:
            this.cover.list = this.cover.list.concat(res.data.data)
            this.cover.total = res.data.total
            if (this.cover.page === 1) {
              this.cover.src = this.cover.list[0].picture_url
            }
            break
          case 3:
            this.options.content = res.data.data
            break
          case 4:
            this.options.guide = res.data.data
            break
          case 5:
            this.options.welcome = res.data.data
            break
        }
      })
    },
    // 切换文本和图片模式
    toggleTextImg(mode) {
      this.mode = mode
    },
    // 选择封面
    chooseCoverImg(cl) {
      this.cover.src = cl.picture_url
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
  .astrict-height{
    max-height: 300px;
    overflow: auto;
  }
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
