<template>
  <el-container style="height: calc(100vh - 84px);" class="novel-management">
    <el-aside width="200px">
      <el-tree
        ref="tree"
        :props="defaultProps"
        :data="treeData"
        default-expand-all
        highlight-current
        node-key="id"
        @node-click="handlerCategory"
      />
    </el-aside>
    <el-main style="position: relative;">
      <div v-if="current === 'add' || current === 'edit'">
          <el-form ref="add" :model="add.form" :rules="add.rules" label-width="120px">
            <el-row>
              <el-col :span="12">
                <el-form-item label="小说分类：" prop="book_category_value">
                  <el-input v-model="add.form.book_category_value" :disabled="true"/>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="小说名称：" prop="name">
                  <el-input v-model="add.form.name" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="封面图片：" prop="thumb_url">
                  <el-upload
                    ref="addUpload"
                    class="upload-demo"
                    :multiple="false"
                    :action="uploadUrl"
                    name="image"
                    :headers="headers"
                    :on-preview="handlePreview"
                    :on-remove="handleRemove"
                    :file-list="add.list"
                    :on-success="addUploadImgSuccess"
                    list-type="picture"
                  >
                    <el-button size="small" type="primary">点击上传</el-button>
                  </el-upload>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="状 态：" prop="serial">
                  <el-radio-group v-model="add.form.serial">
                    <el-radio :label="1">连载</el-radio>
                    <el-radio :label="2">完结</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="万字：" prop="book_length">
                  <el-input-number v-model="add.form.book_length" :precision="2" placeholder="万字" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="总章节：" prop="chapter_num">
                  <el-input v-model="add.form.chapter_num" placeholder="总章节" />
                </el-form-item>
              </el-col>
            </el-row>
            <!-- <el-row>
              <el-col :span="12">
                <el-form-item label="收费章节起始：">
                  <el-input v-model="add.form.begin" />
                </el-form-item>
              </el-col>
            </el-row> -->
            <el-row>
              <el-col :span="24">
                <el-form-item label="小说简介：" prop="description">
                  <el-input v-model="add.form.description" type="textarea" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="限时免费：" prop="is_fee">
                  <el-radio-group v-model="add.form.is_fee">
                    <el-radio :label="0">关闭</el-radio>
                    <el-radio :label="1">开启</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row v-show="add.form.is_fee === 1">
              <el-col :span="12">
                <el-form-item label="限免结束时间：" prop="fee_time">
                  <el-date-picker v-model="add.form.fee_time" type="datetime" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="是否上架：" prop="status">
                  <el-radio-group v-model="add.form.status">
                    <el-radio :label="1">是</el-radio>
                    <el-radio :label="0">否</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
          <el-button type="success" :loading="add.loading" @click="bookAdd">保存</el-button>
          <el-button type="danger" @click="toggleCurrent('index', { book_category_id })">返回</el-button>
        </div>
      </div>
      <div v-else-if="current === 'story'">
        <el-row :gutter="22" style="padding-bottom: 10px;">
          <el-col :span="6">
            <el-row>
              <el-col :span="8">
                <!-- <el-image style="width: 100%;" :src="story.cover" fit="fill" /> -->
                <img :src="story.cover" style="width: 100%;object-fit: fill;display: block;">
              </el-col>
              <el-col :span="16">
                <div style="font-weight: bold;font-size: 14px;color: rgb(51, 122, 183);">
                  {{ story.name }}
                </div>
                <div>
                  章节数量：共
                  <span class="code">
                    {{ story.chapter_num }}
                  </span>章
                </div>
              </el-col>
            </el-row>
          </el-col>
          <el-col :span="18" style="border-left: 1px solid #e7eaec;line-height: 28px;">
            {{ story.description }}
          </el-col>
        </el-row>
        <div class="filter-container">
          <div style="display: flex;align-items: center;">
            <div>
              <el-button class="filter-item" type="primary" icon="el-icon-refresh" @click="refresh" />
              <el-button class="filter-item" style="margin-left: 10px;" type="primary" :plain="story.is_pay == 0 || story.is_pay == 1" @click="toggleCurrent('story', { id: story.book_id, description: story.description, name: story.name, chapter_num: story.chapter_num })">
                全部
              </el-button>
              <el-button class="filter-item" style="margin-left: 10px;" type="primary" :plain="story.is_pay == 0 || story.is_pay === undefined" @click="toggleCurrent('story', { id: story.book_id, description: story.description, name: story.name, chapter_num: story.chapter_num, is_pay: 1 })">
                收费
              </el-button>
              <el-button class="filter-item" style="margin-left: 10px;" type="primary" :plain="(story.is_pay && story.is_pay == 1) || story.is_pay === undefined" @click="toggleCurrent('story', { id: story.book_id, description: story.description, name: story.name, chapter_num: story.chapter_num, is_pay: 0 })">
                免费
              </el-button>
              <el-button class="filter-item" style="margin-left: 10px;" type="primary" plain @click="toggleCurrent('storyAdd', { num: story.table.total, book_category_id, book_id: story.book_id, description: story.description, name: story.name, chapter_num: story.chapter_num, page: story.table.page, size: story.table.size })">
                添加章节
              </el-button>
              <el-button class="filter-item" style="margin-left: 10px;" type="warning" plain @click="toggleCurrent('storyImport', { num: story.table.total, book_id: story.book_id, description: story.description, name: story.name, chapter_num: story.chapter_num })">
                章节导入
              </el-button>
              <!-- <el-button class="filter-item" style="margin-left: 10px;" type="primary" plain @click="updateSelection">
                更新章节
              </el-button> -->
              <el-button class="filter-item" style="margin-left: 10px;" type="primary" plain @click="clearViews">
                清除阅读量
              </el-button>
              <el-button class="filter-item" style="margin-left: 10px;" type="danger" @click="toggleCurrent('index', { id: story.book_id, book_category_id })">
                返回
              </el-button>
            </div>
            <div style="flex: 1;display: flex;flex-direction: row-reverse;">
              <div class="filter-item" style="margin-left: 10px;">
                <el-input v-model="story.chapter_name" placeholder="输入需查询的章节名称">
                  <el-button slot="append" icon="el-icon-search" @click="chapterList(story.book_id)" />
                </el-input>
              </div>
            </div>
          </div>
        </div>
        <div class="filter-container">
          <div class="filter-item">
            <el-input v-model="story.handler.charge" placeholder="先选择设置章节，再点此输入收费金额" style="width: 370px;">
              <el-button slot="append" :loading="story.massSetLoading" @click="massSet">
                批量设置
              </el-button>
            </el-input>
          </div>
          <!-- <el-button type="primary" class="filter-item" style="margin-left: 10px;">
            章节重排
          </el-button> -->
          <div class="filter-item" style="margin-left: 10px;">
            <el-input v-model="story.handler.free" placeholder="输入前多少章节免费">
              <el-button slot="append" :loading="story.loading" @click="setfree">
                提交
              </el-button>
            </el-input>
          </div>
          <!-- <div class="filter-item" style="margin-left: 10px;">
            <el-input v-model="story.handler.text" placeholder="请输入要处理的文字">
              <el-button slot="append">
                提交
              </el-button>
            </el-input>
          </div> -->
          <div class="filter-item" style="margin-left: 10px;">
            <el-input v-model="story.handler.remove" placeholder="输入要删除的章节区间：格式[1-20]" style="width: 330px;">
              <el-button slot="append" :loading="story.loading" @click="sectionDelete">
                提交
              </el-button>
            </el-input>
          </div>
          <el-table
            ref="storyTable"
            v-loading="story.table.loading"
            :data="story.table.data"
            border
            fit
            highlight-current-row
            @selection-change="handleStorySelectionChange"
          >
            <el-table-column width="55" type="selection" align="center" />
            <el-table-column v-for="sc in story.table.columns" :key="sc.prop" :type="sc.type" :label="sc.label" :prop="sc.prop" :width="sc.width" :align="sc.align">
              <template slot-scope="{ row }">
                <div v-if="sc.prop === 'name'" style="text-align: left;">
                  <a href="javascript:;" style="color: #337ab7;" @click="handleStoryEdit({...row, num: story.table.total, book_id: story.book_id, description: story.description, book_name: story.name, chapter_num: row.num, book_category_id, page: story.table.page, size: story.table.size})">
                    <b style="color: #900;">
                      [{{ row['num'] }}]
                    </b>
                    {{ row[sc.prop] }}
                    <i v-if="row.is_pay === 1" class="el-icon-trophy" />
                  </a>
                </div>
                <div v-else-if="sc.prop === 'tuiguang' && row.num <= 5">
                  <el-button size="mini" type="primary" plain @click="openTuiguangwenan(row)">
                    生成推广文案
                  </el-button>
                  <!-- <el-button size="mini" type="danger" plain @click="getTuiguang(row)">
                    获取推广链接
                  </el-button> -->
                </div>
                <span v-else-if="sc.prop === 'glod'" class="code">
                  {{ row[sc.prop] }}
                </span>
                <div v-else-if="sc.prop === 'is_pay'">
                  <el-button size="mini" :type="row[sc.prop] ? 'primary' : 'danger'" @click="togglePay(row)">
                    {{ row[sc.prop] === 1 ? '是' : '否' }}
                  </el-button>
                </div>
                <div v-else-if="sc.prop === 'status'">
                  <el-button size="mini" :type="row[sc.prop] ? 'primary' : 'danger'" @click="toggleStoryStatus(row)">
                    {{ row[sc.prop] === 1 ? '开启' : '禁用' }}
                  </el-button>
                </div>
                <div v-else-if="sc.prop === 'action'">
                  <el-button size="mini" type="primary" plain @click="handleStoryEdit({...row, num: story.table.total, book_id: story.book_id, description: story.description, book_name: story.name, chapter_num: row.num, page: story.table.page, size: story.table.size})">
                    编辑
                  </el-button>
                  <el-button size="mini" type="danger" plain @click="handleStoryRemove(row)">
                    删除
                  </el-button>
                </div>
                <div v-else>
                  {{ row[sc.prop] }}
                </div>
              </template>
            </el-table-column>
          </el-table>
          <pagination v-if="showPagin" :total="story.table.total" :page-sizes="[10, 20, 30, 50, 100, 200, 300, 400, 500]" :page.sync="story.table.page" :limit.sync="story.table.size" @pagination="storyPagein" />
        </div>
        <!-- 生成推广链接 -->
        <el-dialog :visible.sync="story.tuiguanglianjie.visible" title="生成推广链接">
          <el-form ref="tuiguanglianjie" :model="story.tuiguanglianjie.form" :rules="story.tuiguanglianjie.rules" label-width="150px">
            <el-form-item label="入口页面：" prop="entry">
              <el-input v-model="story.tuiguanglianjie.form.entry" disabled />
            </el-form-item>
            <el-form-item label="备注：" prop="remark">
              <el-input v-model="story.tuiguanglianjie.form.remark" />
            </el-form-item>
            <el-form-item label="推广类型：" prop="entry">
              <el-radio-group v-model="story.tuiguanglianjie.form.type">
                <el-radio label="inner">
                  内推
                </el-radio>
                <el-radio label="outter">
                  外推
                </el-radio>
              </el-radio-group>
              <el-alert show-icon type="warning" title="内推链接 无法引导关注公众号，仅限公众号内部推文使用，如需推广引粉请选择外推" />
            </el-form-item>
            <el-form-item label="首章显示章节：" prop="firt">
              <el-input v-model="story.tuiguanglianjie.form.first" />
            </el-form-item>
            <el-form-item label="关注章节序号：" prop="focus">
              <el-input v-model="story.tuiguanglianjie.form.focus" placeholder="可选，如不填则使用小说默认设置" />
            </el-form-item>
          </el-form>
          <div style="text-align: center;">
            <el-button type="primary">
              生成链接
            </el-button>
          </div>
        </el-dialog>
        <!-- 推广方式 -->
        <el-dialog :visible.sync="story.tuiguang.visible" title="选择推广文案方式">
          <el-form label-width="250">
            <el-form-item label="选择推广方式：">
              <el-button type="primary" plain @click="chooseTuiguang('Text')">
                文字模式
              </el-button>
              <el-button type="primary" plain @click="chooseTuiguang('Img')">
                图片模式
              </el-button>
            </el-form-item>
          </el-form>
        </el-dialog>
      </div>
      <!-- 添加或者编辑章节 -->
      <div v-else-if="current === 'storyAdd' || current === 'storyEdit'">
        <el-form ref="storyAdd" :model="story.add.form" :rules="story.add.rules" label-width="150px">
          <el-form-item label="章节标题：" prop="name">
            <el-input v-model="story.add.form.name" />
          </el-form-item>
          <el-form-item label="输入章节：" prop="chapter_num">
            <el-input v-model="story.add.form.chapter_num" />
          </el-form-item>
          <el-form-item label="章节内容：" prop="content">
            <tinymce ref="tinymce" v-model="story.add.form.content" :height="300" />
          </el-form-item>
          <el-form-item label="是否免费：" prop="is_pay">
            <el-radio-group v-model="story.add.form.is_pay">
              <el-radio :label="0">
                免费
              </el-radio>
              <el-radio :label="1">
                收费
              </el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item v-show="story.add.form.is_pay === 1" label="收费书币：" prop="glod">
            <el-input v-model="story.add.form.glod" />
          </el-form-item>
          <el-form-item label="状 态：" prop="status">
            <el-radio-group v-model="story.add.form.status">
              <el-radio :label="1">
                开启
              </el-radio>
              <el-radio :label="0">
                关闭
              </el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item>
            <el-button size="mini" type="primary" :loading="story.add.addLoading" @click="chapterAdd">
              保存
            </el-button>
            <el-button size="mini" type="danger" @click="toggleCurrent('story', { id: story.book_id, description: story.description, name: story.name, chapter_num: story.chapter_num, book_category_id, page: story.table.page, size: story.table.size })">
              返回
            </el-button>
            <el-button v-if="current === 'storyEdit'" size="mini" type="primary" @click="toggleCurrent('story', { id: story.book_id, description: story.description, name: story.name, chapter_num: story.chapter_num, book_category_id, page: story.table.page, size: story.table.size })">
              目录
            </el-button>
            <el-button v-if="current === 'storyEdit'" size="mini" type="primary" @click="goFont">
              上一章
            </el-button>
            <el-button v-if="current === 'storyEdit'" size="mini" type="primary" @click="goNext">
              下一章
            </el-button>
          </el-form-item>
        </el-form>
      </div>
      <!-- 章节导入 -->
      <div v-else-if="current === 'storyImport'">
        <el-form ref="storyImport" :model="storyImport.form" :rules="storyImport.rules" label-width="150px">
          <el-row :gutter="20">
            <el-col :span="6">
              <el-form-item label="章节标题：" prop="file">
                <el-upload
                  ref="storyImportUpload"
                  :action="upload_novfiles"
                  class="upload-demo"
                  name="files"
                  :file-list="storyImport.list"
                  :on-remove="handleImportRemove"
                  :on-success="handleImportSuccess"
                  :before-upload="handleImportBeforeUplod"
                  accept="application/x-zip-compressed"
                >
                  <el-button size="small" type="primary">选择压缩包</el-button>
                </el-upload>
              </el-form-item>
            </el-col>
            <el-col :span="18">
              <el-form-item>
                <el-alert type="error" :closable="false" title="说明：自动添加小说，上传zip文件，压缩包内直接为txt格式文件内容，文件名不能为中文，压缩前，如果文档内每一行有书名或者其它信息，请删除再压缩上传！" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="是否分章导入：" prop="is_div">
            <el-radio-group v-model="storyImport.form.is_div">
              <el-radio :label="1">
                开启
              </el-radio>
              <el-radio :label="0">
                关闭
              </el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item>
            <el-button size="mini" type="primary" :loading="storyImport.loading" @click="importChapter">
              保存
            </el-button>
            <el-button size="mini" type="danger" @click="toggleCurrent('story', { id: story.book_id, description: story.description, name: story.name, chapter_num: story.chapter_num, page: story.table.page, size: story.table.size })">
              返回
            </el-button>
          </el-form-item>
        </el-form>
      </div>
      <!-- 主页 -->
      <div v-else-if="current === 'index'">
        <div class="filter-container">
          <el-button class="filter-item" type="primary" icon="el-icon-refresh" @click="refresh" />
          <el-button class="filter-item" style="margin-left: 10px;" type="primary" @click="toggleCurrent('add', { book_category_id })">
            添加本地小说
          </el-button>
          <!-- <el-select v-model="search.form.category_id" placeholder="搜索类型" class="filter-item" style="margin-left: 10px;">
            <el-option :value="1" label="全部" />
            <el-option :value="2" label="本分类" />
          </el-select> -->
          <el-select v-model="search.form.serial" placeholder="状态" class="filter-item" style="margin-left: 10px;">
            <el-option :value="null" label="全部" />
            <el-option :value="1" label="连载中" />
            <el-option :value="2" label="已完结" />
          </el-select>
          <div class="filter-item" style="margin-left: 10px;">
            <el-input v-model="search.form.name" placeholder="输入需查询的小说名称">
              <el-button slot="append" icon="el-icon-search" @click="getList(book_category_id)" />
            </el-input>
          </div>
        </div>
        <!-- <el-form label-width="100px">
          <el-form-item label="小说属性：">
            <el-radio-group v-model="search.form.category_id">
              <el-radio :label="1">全部</el-radio>
              <el-radio :label="2">本分类</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="读者性别：">
            <el-radio-group v-model="search.form.sex">
              <el-radio-button :label="null">全部</el-radio-button>
              <el-radio-button :label="1">男频</el-radio-button>
              <el-radio-button :label="2">女频</el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="连载状态：">
            <el-radio-group v-model="search.form.serial">
              <el-radio-button :label="null">全部</el-radio-button>
              <el-radio-button :label="1">连载中</el-radio-button>
              <el-radio-button :label="2">已完结</el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="小说类型：">
            <el-radio-group v-model="search.form.book_category_id">
              <el-radio-button :label="null">全部</el-radio-button>
              <el-radio-button v-for="ot in options.types" :key="ot.id" :label="ot.id" style="margin-bottom: 10px;">
                {{ ot.name }}
              </el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="派单指数：">
            <el-radio-group v-model="search.form.sex">
              <el-radio :label="null">全部</el-radio>
              <el-radio :label="1">男频</el-radio>
              <el-radio :label="2">女频</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form> -->
        <aside>
          <a>数量：共<span style="color: #f00;">{{ table.total }}</span>个</a>
        </aside>
        <div class="filter-container">
          <el-button class="filter-item" type="primary" @click="handleRecommend">
            <svg-icon icon-class="guide" />推荐
          </el-button>
          <el-button class="filter-item" type="primary" @click="handleRand">
            榜单
          </el-button>
          <!-- <el-button class="filter-item" type="primary" style="margin-left: 10px;" plain>全部小说</el-button>
          <el-button class="filter-item" type="primary" style="margin-left: 10px;" plain>本地小说</el-button>
          <el-button class="filter-item" type="primary" style="margin-left: 10px;" plain>采集小说</el-button>
          <el-button class="filter-item" type="primary" style="margin-left: 10px;" plain>API小说</el-button>
          <el-button class="filter-item" type="primary" style="margin-left: 10px;" plain>更新小说</el-button> -->
        </div>
        <el-table
          ref="table"
          v-loading="table.loading"
          :data="table.data"
          border
          fit
          highlight-current-row
          style="width: 100%;"
          @selection-change="handleSelectionChange"
        >
          <el-table-column width="55" type="selection" align="center" />
          <el-table-column v-for="cl in table.columns" :key="cl.prop" :prop="cl.prop" :type="cl.type" :label="cl.label" :width="cl.width" :align="cl.align">
            <template slot-scope="{ row }">
              <div v-if="cl.prop === 'action'">
                <!-- <el-button type="primary" size="mini" @click="toShare(row)">
                  分章
                </el-button> -->
                <!-- <el-button type="primary" size="mini" @click="toCopyNovel(row)">
                  复制
                </el-button> -->
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
              <div v-else-if="cl.prop === 'thumb_url'">
                <el-image style="width: 50px;" fit="fill" :src="row[cl.prop]" />
              </div>
              <div v-else-if="cl.prop === 'is_fee'">
                {{ row[cl.prop] === 0 ? '否' : '是' }}
              </div>
              <div v-else-if="cl.prop === 'name'" style="text-align: left;">
                <div>
                  <a href="javascript:;" style="font-size: 12px;color: #337ab7;cursor: pointer;" @click="toggleCurrent('story', { id: row.id, description: row.description, name: row.name, chapter_num: row.chapter_num, is_pay: null, thumb_url: row. thumb_url, book_category_id })">{{ row['name'] }}</a>
                  <span v-for="rr in row.recommend_name" :key="rr" class="code">{{ rr }}</span>
                  <span v-for="rr in row.rank_name" :key="rr" class="code" style="color: #46a6ff;">{{ rr }}</span>
                </div>
                <div style="color: #999;">
                  <!-- 开始收费备注 -->
                  <!-- {{ row['description'] }} -->
                </div>
                <div style="display: flex;align-items: center;">
                  <!-- <a style="font-size: 12px;color: #337ab7;padding-right: 4px;">http://new.fuleien.com/index/books/bookinfo/uid/1/id/31.html</a> -->
                  <!-- <el-button size="mini" icon="el-icon-document" @click="handleCopy('http://new.fuleien.com/index/books/bookinfo/uid/1/id/31.html', $event)">
                    复制
                  </el-button> -->
                </div>
                <div style="display: flex;align-items: center;">
                  <span>
                    备注：
                  </span>
                  <a style="font-size: 12px;color: #337ab7;padding-right: 4px;" @click.stop="addRemark(row)">
                    {{ row['remarks'] }}
                    <i class="el-icon-edit" />
                  </a>
                </div>
              </div>
              <div v-else-if="cl.prop === 'update'">
                <a style="color: #337ab7;" href="javascript:;" @click="toUpdate(row)">
                  更换作者
                </a>
              </div>
              <div v-else-if="cl.prop === 'status'">
                <el-button :type="row[cl.prop] === 1 ? 'primary' : 'danger'" size="mini" @click="toggleStatus(row)">
                  {{ row[cl.prop] === 1 ? '上架' : '下架' }}
                </el-button>
              </div>
              <div v-else-if="cl.prop === 'serial'">
                <el-button size="mini" :type="row[cl.prop] === 1 ? 'primary' : 'danger'">
                  {{ row[cl.prop] === 1 ? '连载' : '完结' }}
                </el-button>
              </div>
              <div v-else>
                {{ row[cl.prop] }}
              </div>
            </template>
          </el-table-column>
        </el-table>
        <pagination v-show="table.total>0" :total="table.total" :page.sync="table.page" :limit.sync="table.size" @pagination="pagein" />
      </div>
      <!-- 快速进入 -->
      <div v-if="dialogTableVisible && !current" class="quick-entry">
        <div class="title">
          快速进入
        </div>
        <div class="body">
          <el-autocomplete
            v-model="categoryName"
            placeholder="输入分类名可快速搜索"
            class="inline-input"
            :fetch-suggestions="querySearch"
            @select="handleSelect"
          />
        </div>
      </div>
    </el-main>
    <!-- 修改小说备注 -->
    <el-dialog :visible.sync="remark.visible" title="修改小说备注" width="450px" top="35vh">
      <el-form ref="remark" :model="remark.form" :rules="remark.rules" label-width="80px">
        <el-form-item label="备注：" prop="remarks">
          <el-input v-model="remark.form.remarks" />
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button type="success" :loading="remark.loading" @click="saveRemark">提交</el-button>
      </div>
    </el-dialog>
    <!-- 更换作者 -->
    <el-dialog :visible.sync="update.visible" title="修改小说备注" width="800px" top="35vh">
      <el-form ref="update" :model="update.form" :rules="update.rules" label-width="140px">
        <el-form-item label="请选择作者：" prop="nickname">
          <el-autocomplete
            v-model="update.form.nickname"
            :fetch-suggestions="queryAuthorSearch"
            @select="handleAuthorSelect"
          />
        </el-form-item>
        <el-form-item label="当前作者：">
          {{ update.currentAuthor }}
        </el-form-item>
      </el-form>
      <div slot="footer" style="text-align: center;">
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
          <el-tree :props="defaultProps" :default-expand-all="true" highlight-current :data="treeData" />
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
                <el-form-item label="封面图片：" prop="thumb_url">
                  <el-upload
                    ref="copyUpload"
                    class="upload-demo"
                    :multiple="false"
                    :headers="headers"
                    :limit="1"
                    :action="uploadUrl"
                    name="image"
                    :on-preview="handlePreview"
                    :on-remove="handleCopyRemove"
                    :file-list="copy.list"
                    :on-success="copyUploadImgSuccess"
                    list-type="picture"
                  >
                    <el-button size="small" type="primary">点击上传</el-button>
                  </el-upload>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="状 态：" prop="status">
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
                <el-form-item label="总章节：" prop="chapter_num">
                  <el-input v-model="copy.form.chapter_num" :disabled="true" />
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
    <!-- 推荐小说 -->
    <el-dialog ref="recommend" :visible.sync="recommend.visible" title="选择-推荐位">
      <el-form ref="recommend" :model="recommend.form" :rules="recommend.rules" label-width="120px">
        <el-row :gutter="20">
          <el-col :span="18">
            <el-form-item label="选择推荐位：" prop="id">
              <el-select v-model="recommend.form.id" @visible-change="recommendVisibleChange">
                <el-option v-for="or in options.recommend" :key="or.id" :value="or.id" :label="or.recommend_name" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="18">
            <el-form-item>
              <el-button type="primary" :loading="recommend.loading" @click="recommendSave">保存</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-dialog>
    <!-- 榜单小说 -->
    <el-dialog ref="rank" :visible.sync="rank.visible" title="选择-榜单">
      <el-form ref="rank" :model="rank.form" :rules="rank.rules" label-width="120px">
        <el-row :gutter="20">
          <el-col :span="18">
            <el-form-item label="选择榜单：" prop="id">
              <el-select v-model="rank.form.id" @visible-change="rankVisibleChange">
                <el-option v-for="or in options.rank" :key="or.id" :value="or.id" :label="or.bank_name" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="18">
            <el-form-item>
              <el-button type="primary" :loading="rank.loading" @click="rankSave">保存</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-dialog>
  </el-container>
</template>

<script>
import mix from '@/mixs/mix'
import { chapterAllId, bookList, bookDelete, chapterList, chapterContent, setcost, setfree, sectionDelete, clearRead, importChapter, chapterAdd, chapterUpdate, bookAdd, chapterDelete, bookUpdate, getNextChapter } from '@/api/book/list'
import { categoryList, categoryListAll } from '@/api/book/category'
import { recommendList, recommendAddBooks } from '@/api/recommend/recommend'
import { rankList, rankAddbooks } from '@/api/rank/list'
import { authorList } from '@/api/author/list'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import clip from '@/utils/clipboard' // use clipboard directly
import Tinymce from '@/components/Tinymce'
import { urlGetName, isEmpty } from '@/utils'

export default {
  components: { Pagination, Tinymce },
  mixins: [mix],
  data() {
    return {
      showPagin: true,
      // 章节导入
      storyImport: {
        form: {
          is_div: 1,
          file: ''
        },
        rules: {
          file: [
            { required: true, message: '请选择一个上传的文件' }
          ]
        },
        list: [],
        loading: false
      },
      // 首页搜索
      search: {
        form: {
          sex: null,
          serial: null,
          category_id: null,
          name: ''
        }
      },
      // 所有下拉选项
      options: {
        recommend: [],
        rank: [],
        admin: [],
        types: []
      },
      // index选中的小说
      selections: [],
      // 推荐
      recommend: {
        visible: false,
        loading: false,
        form: {
          id: ''
        },
        rules: {
          id: [
            { required: true, message: '请选择一个推荐位' }
          ]
        }
      },
      // 排名
      rank: {
        visible: false,
        loading: false,
        form: {
          id: ''
        },
        rules: {
          id: [
            { required: true, message: '请选择一个榜单' }
          ]
        }
      },
      // 上传地址
      uploadUrl: process.env.VUE_APP_BASE_API + '/common/upload_picture',
      // 小说类型
      book_category_id: null,
      // 选择推广模式
      chooseTuiguang(mode) {
        const id = this.story.tuiguang.id
        const title = this.story.tuiguang.title
        const routeUrl = this.$router.resolve({
          path: `/tuiguang?mode=${mode}`,
          query: { id, title }
        })
        this.story.tuiguang.visible = false
        window.open(routeUrl.href, '_blank')
      },
      // 小说内容
      story: {
        // 小说封面
        thumb_url: '',
        is_pay: null,
        // 小说id
        book_id: '',
        // 小说章节数量
        chapter_num: 0,
        // 章节名称
        chapter_name: '',
        // 小说名字
        name: '',
        // 小说描述
        description: '',
        // 按钮loading
        addLoading: false,
        // 批量设置loading
        massSetLoading: false,
        // 清除loading
        clearLoading: false,
        // 处理章节
        handler: {
          charge: '',
          text: '',
          free: null,
          remove: ''
        },
        // 选择的章节
        selections: [],
        // 编辑或者添加
        add: {
          form: {
            id: '',
            name: '',
            num: '',
            chapter_num: '',
            content: '',
            is_pay: 1,
            status: 1,
            glod: 0
          },
          rules: {
            name: [
              { required: true, message: '请输入小说标题' }
            ],
            thumb_url: [
              { required: true, message: '请选择小说封面' }
            ],
            chapter_num: [
              { required: true, message: '请输入小说章节' }
            ],
            content: [
              { required: true, message: '请您输入章节内容' }
            ]
          }
        },
        // 推广链接
        tuiguanglianjie: {
          visible: false,
          form: {
            entry: '',
            remark: '',
            type: 'inner'
          },
          rules: {
            remark: [
              { required: true, message: '请输入备注' }
            ]
          }
        },
        // 推广
        tuiguang: {
          visible: false,
          id: '',
          title: ''
        },
        // 编辑
        edit: {
          visible: false
        },
        // 搜索
        search: {
          form: {},
          loading: false
        },
        table: {
          columns: [
            {
              label: '章节名称',
              prop: 'name',
              align: 'center',
              width: 360
            },
            {
              label: '推广',
              prop: 'tuiguang',
              align: 'center',
              width: 260
            },
            {
              label: '阅读量',
              prop: 'read_num',
              align: 'center'
            },
            {
              label: '是否收费',
              prop: 'is_pay',
              align: 'center'
            },
            {
              label: '书币',
              prop: 'glod',
              align: 'center'
            },
            {
              label: '状态',
              prop: 'status',
              align: 'center'
            },
            {
              label: '操作',
              prop: 'action',
              align: 'center',
              width: 148
            }
          ],
          data: [],
          total: 0,
          page: 1,
          size: 10,
          loading: false
        }
      },
      // 复制小说
      copy: {
        visible: false,
        form: {
          thumb_url: '',
          thumb_id: ''
        },
        loading: false,
        list: []
      },
      // 添加或者编辑
      add: {
        form: {
          book_category_value:'',
          name: '',
          author_id: '',
          serial: 1,
          chapter_num: null,
          book_length: null,
          description: '',
          is_fee: 0,
          remarks: '',
          status: 1,
          thumb_url: '',
          thumb_id: '',
          fee_time: ''
        },
        rules: {
          book_category_value: [
            { required: true, message: '请选择小说分类' }
          ],
          name: [
            { required: true, message: '请输入小说名称' }
          ],
          description: [
            { required: true, message: '请输入小说描述' }
          ]
          /* thumb_url: [
            { required: true, message: '请您上传封面' }
          ] */
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
          remarks: ''
        },
        visible: false,
        loading: false,
        rules: {
          remarks: [
            { required: true, message: '请您输入备注' }
          ]
        }
      },
      // 更新
      update: {
        form: {
          author_id: '',
          nickname: '',
          id: ''
        },
        visible: false,
        loading: false,
        currentAuthor: '',
        rules: {
          nickname: [
            { required: true, message: '请您选择一个作者' }
          ]
        }
      },
      defaultProps: {
        label: 'name',
        children: 'children'
      },
      categoryName: '',
      treeData: [],
      dialogTableVisible: false,
      current: 'index',
      table: {
        columns: [
          {
            label: 'ID',
            prop: 'id',
            align: 'center'
          },
          {
            label: '封面',
            prop: 'thumb_url',
            align: 'center'
          },
          {
            label: '名称',
            prop: 'name',
            align: 'center',
            width: 440
          },
          // {
          //   label: '派单指数',
          //   prop: 'zhishu',
          //   align: 'center'
          // },
          {
            label: '状态',
            prop: 'status',
            align: 'center'
          },
          {
            label: '完结',
            prop: 'serial',
            align: 'center'
          },
          {
            label: '时间',
            prop: 'create_time',
            align: 'center'
          },
          {
            label: '限时免费',
            prop: 'is_fee',
            align: 'center'
          },
          {
            label: '作者',
            prop: 'author_name',
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
        loading: false
      },
      ids: [],
      currentId: ''
    }
  },
  created() {
    const { current } = this.$route.query
    this.headers.token = this.$store.getters.token
    this.current = current || 'index'
    this.getCategory()
  },
  mounted() {
    this.getCategoryList()
    const { book_category_id } = this.$route.query
    // 没有选择分类
    if (!this.current) {
      this.dialogTableVisible = true
    // 选择了分类
    } else if (this.current === 'index') {
      if (book_category_id) {
        this.book_category_id = book_category_id
        this.getList(book_category_id)
      } else {
        this.getList(this.book_category_id)
      }
    // 点击了某个作品
    } else if (this.current === 'story') {
      const { id, description, chapter_num, name, is_pay, thumb_url, book_category_id, page, size } = this.$route.query
      this.book_category_id = book_category_id
      this.story.book_id = id
      this.story.cover = thumb_url
      this.story.description = description
      this.story.chapter_num = chapter_num
      this.story.name = name
      this.description = description
      this.story.is_pay = is_pay
      this.story.table.page = Number(page)
      this.story.table.size = size
      this.chapterList(id)
    // 导入章节
    } else if (this.current === 'storyImport') {
      const { num, book_id, description, chapter_num, name } = this.$route.query
      this.story.add.form.num = num + 1
      this.story.book_id = book_id
      this.story.description = description
      this.story.chapter_num = chapter_num
      this.story.name = name
      this.description = description
    // 添加或者编辑章节
    } else if (this.current === 'storyAdd' || this.current === 'storyEdit') {
      const { num, book_id, description, chapter_num, name, book_category_id, page, size } = this.$route.query
      this.story.add.form.num = num + 1
      this.story.book_id = book_id
      this.story.description = description
      this.story.chapter_num = chapter_num
      this.story.name = name
      this.description = description
      this.book_category_id = book_category_id
      this.story.table.page = page
      this.story.table.size = size
      if (this.current === 'storyEdit') {
        const { id, is_pay, status, name, book_name, glod, num, chapter_num, book_id } = this.$route.query
        this.story.add.form.id = id
        this.story.name = book_name
        this.story.add.form.name = name
        this.story.add.form.num = num
        this.story.add.form.chapter_num = chapter_num
        this.story.add.form.glod = glod
        this.story.add.form.is_pay = Number(is_pay)
        this.story.add.form.status = Number(status)
        this.currentId = id
        console.log('story', this.story)
        this.chapterContent(id)
        this.chapterAllId(book_id)
      }
      // 添加或者编辑小说
    } else if (this.current === 'add' || this.current === 'edit') {
      const { book_category_id } = this.$route.query
      this.book_category_id = book_category_id
      if (this.current === 'edit') {
        const query = this.$route.query
        for (const key in query) {
          if (key === 'thumb_url') {
            this.add.list = [{
              name: urlGetName(query[key]),
              url: query[key]
            }]
            this.add.form[key] = query[key]
          } else if (key === 'status' || key === 'is_fee') {
            this.add.form[key] = Number(query[key])
          } else if (key === 'book_length') {
            this.add.form[key] === query[key] / 10000
          } else if (key !== 'book_category_id') {
            this.$set(this.add.form, key, query[key])
          }
        }
        categoryList({
          size: 9999999
        }).then(res => {
          const pTree = []
          for (const item in res.data) {
            pTree.push(res.data[item])
          }
          let treeData = pTree
          // console.log('treeData',treeData )
          treeData.map((item,i)=>{
            item.children.map((list,j)=>{
              if(list.id == this.book_category_id){
                this.add.form.book_category_value = item.name +'-'+list.name
              }
            })
          })
        }).catch(err => {
          console.error('err: ', err)
        })
      }
    }
  },
  methods: {
    // 获取章节的所有id
    chapterAllId(book_id) {
      chapterAllId({
        book_id
      }).then(res => {
        this.ids = res.data
      })
    },
    // 上一章
    goFont() {
      const currentId = Number(this.currentId)
      if (this.ids.indexOf(currentId) === 0) {
        console.log(currentId)
        this.$message.warning('没有上一章')
        return
      }
      const index = this.ids.indexOf(currentId) - 1
      const id = this.ids[index]
      getNextChapter({
        id
      }).then(res => {
        console.log(res)
        this.story.add.form.id = res.data.id
        this.story.name = res.data.book_name
        this.story.add.form.name = res.data.name
        this.story.add.form.num = res.data.num
        this.story.add.form.chapter_num = res.data.chapter_num
        this.story.add.form.glod = res.data.glod
        this.story.add.form.is_pay = Number(res.data.is_pay)
        this.story.add.form.status = Number(res.data.status)
        this.currentId = res.data.id
        this.$refs.tinymce.setContent(res.data.content)
        this.chapterAllId(res.data.book_id)
      })
    },
    // 下一章
    goNext() {
      const currentId = Number(this.currentId)
      const index = this.ids.indexOf(currentId) + 1
      // console.log('index',index)
      if (index > this.ids.length - 1) {
        this.$message.warning('没有下一章')
        return
      }
      const id = this.ids[index]
      getNextChapter({
        id
      }).then(res => {
        console.log(res)
        this.story.add.form.id = res.data.id
        this.story.name = res.data.book_name
        this.story.add.form.name = res.data.name
        this.story.add.form.num = res.data.num
        this.story.add.form.chapter_num = res.data.chapter_num
        this.story.add.form.glod = res.data.glod
        this.story.add.form.is_pay = Number(res.data.is_pay)
        this.story.add.form.status = Number(res.data.status)
        this.currentId = res.data.id
        this.$refs.tinymce.setContent(res.data.content)
        this.chapterAllId(res.data.book_id)
      })
    },
    // 获取分类
    getCategory() {
      categoryListAll({
        category_name: ''
      }).then(res => {
        this.options.types = res.data.data
      })
    },
    // 导入删除时
    handleImportRemove(file, fileList) {
      this.storyImport.form.file = ''
    },
    // 导入上传成功后
    handleImportSuccess(res, file, fileList) {
      this.storyImport.list = fileList.splice(fileList.length - 1)
      this.storyImport.form.file = res.data.url
    },
    // 导入上传前
    handleImportBeforeUplod(file) {
      const isLt10M = file.size / 1024 / 1024 < 10
      if (!isLt10M) {
        this.$refs.storyImportUpload.clearFiles()
        this.$message.error('上传压缩包体积不能超过 10MB!')
        return false
      }
    },
    // 打开推广文案
    openTuiguangwenan(row) {
      this.story.tuiguang.visible = true
      this.story.tuiguang.id = row.id
      this.story.tuiguang.title = row.name
    },
    // 设置章节免费
    setfree() {
      this.story.loading = true
      setfree({
        num: this.story.handler.free,
        book_id: this.story.book_id
      }).then(res => {
        this.story.loading = false
        this.story.handler.free = ''
        this.$message.success(res.message)
        this.chapterList(this.story.book_id)
      }).catch(() => {
        this.story.loading = false
      })
    },
    // 切换章节上下架
    toggleStoryStatus(row) {
      const status = row.status === 1 ? 0 : 1
      this.story.table.loading = true
      chapterUpdate({
        id: row.id,
        status
      }).then(res => {
        this.story.table.loading = false
        this.$message.success(res.message)
        this.chapterList(this.story.book_id)
      }).catch(() => {
        this.story.table.loading = false
      })
    },
    // 切换章节是否收费
    togglePay(row) {
      const is_pay = row.is_pay === 1 ? 0 : 1
      this.story.table.loading = true
      chapterUpdate({
        id: row.id,
        is_pay
      }).then(res => {
        this.story.table.loading = false
        this.$message.success(res.message)
        this.chapterList(this.story.book_id)
      }).catch(() => {
        this.story.table.loading = false
      })
    },
    // 切换上下架
    toggleStatus(row) {
      const status = row.status === 1 ? 0 : 1
      this.table.loading = true
      bookUpdate({
        id: row.id,
        status
      }).then(res => {
        this.table.loading = false
        this.$message.success(res.message)
        this.getList(this.book_category_id)
      }).catch(() => {
        this.table.loading = false
      })
    },
    // 选中作者
    handleAuthorSelect(item) {
      this.update.form.author_id = item.id
    },
    // 搜索作者
    queryAuthorSearch(queryString, cb) {
      authorList({
        size: 9999999999,
        author: queryString
      }).then(res => {
        this.options.admin = res.data.data
        const data = res.data.data.map(item => {
          item.value = item.nickname
          return item
        })
        cb(data)
      })
    },
    // 保存推荐
    recommendSave() {
      this.$refs.recommend.validate(valid => {
        if (valid) {
          this.recommend.loading = true
          const book_ids = this.selections.map(item => {
            return item.id
          }).join(',')
          recommendAddBooks({
            book_ids,
            id: this.recommend.form.id
          }).then(res => {
            this.$refs.table.clearSelection()
            this.$refs.recommend.resetFields()
            this.$message.success(res.message)
            this.recommend.visible = false
            this.recommend.loading = false
            this.toggleCurrent('index', {
              book_category_id: this.book_category_id
            })
          }).catch(() => {
            this.recommend.loading = false
          })
        }
      })
    },
    // 保存推荐
    rankSave() {
      this.$refs.rank.validate(valid => {
        if (valid) {
          this.rank.loading = true
          const book_ids = this.selections.map(item => {
            return item.id
          }).join(',')
          rankAddbooks({
            book_ids,
            id: this.rank.form.id
          }).then(res => {
            this.$refs.table.clearSelection()
            this.$refs.rank.resetFields()
            this.$message.success(res.message)
            this.toggleCurrent('index', {
              book_category_id: this.book_category_id
            })
            this.rank.visible = false
            this.rank.loading = false
          }).catch(() => {
            this.rank.loading = false
          })
        }
      })
    },
    // 打开推荐小说下拉
    recommendVisibleChange(val) {
      if (val) {
        recommendList({
          size: 999999
        }).then(res => {
          this.options.recommend = res.data.data
        })
      }
    },
    // 打开榜单小说下拉
    rankVisibleChange(val) {
      // debugger
      if (val) {
        rankList({
          size: 999999
        }).then(res => {
          this.options.rank = res.data.data
        })
      }
    },
    // 点击推荐
    handleRecommend() {
      if (this.selections.length === 0) {
        this.$message.error('请选择要推荐的小说')
        return
      }
      this.recommend.visible = true
    },
    // 打开上榜小说模态窗
    handleRand() {
      if (this.selections.length === 0) {
        this.$message.error('请选择要上榜单的小说')
        return
      }
      this.rank.visible = true
    },
    // 获取推广链接
    getTuiguang(row) {
      this.story.tuiguanglianjie.form.entry = row.name
      this.story.tuiguanglianjie.visible = true
    },
    // 添加书籍
    bookAdd() {
      this.$refs.add.validate(valid => {
        if (valid) {
          this.add.loading = true
          console.log('this.add.form', this.add.form)
          let fee_time
          if (!isEmpty(this.add.form.fee_time)) {
            const date = new Date(this.add.form.fee_time)
            fee_time = Math.ceil(date.getTime() / 1000)
          }
          const data = Object.assign({}, this.add.form, { fee_time }, { book_category_id: this.book_category_id, book_length: this.add.form.book_length * 10000 })
          const submit = this.current === 'edit' ? bookUpdate : bookAdd
          submit(data).then(res => {
            this.$message.success(res.message)
            this.add.loading = false
            if (this.current === 'add') {
              this.$refs.add.resetFields()
              this.$refs.addUpload.clearFiles()
              this.toggleCurrent('index', { book_category_id: this.book_category_id })
            }
          }).catch(() => {
            this.add.loading = false
          })
        }
      })
    },
    // 切换编辑章节
    handleStoryEdit(row) {
      this.toggleCurrent('storyEdit', row)
    },
    // 添加编辑章节
    chapterAdd() {
      this.$refs.storyAdd.validate(valid => {
        if (valid) {
          this.story.add.addLoading = true
          const form = Object.assign({ book_id: this.story.book_id }, this.story.add.form)
          if (this.current === 'storyAdd') {
            chapterAdd(form).then(res => {
              /**
               * 不用resetFields是因为要让num每次新增+1
               */
              // this.$refs.storyAdd.resetFields()
              this.story.add.form.num++
              this.story.add.form.name = ''
              this.story.add.form.status = 1
              this.story.add.form.is_pay = 1
              this.$refs.tinymce.setContent('')
              this.story.add.addLoading = false
              this.$nextTick(() => {
                this.$refs.storyAdd.clearValidate()
              })
              this.$message.success(res.message)
            })
          } else if (this.current === 'storyEdit') {
            chapterUpdate(form).then(res => {
              this.$message.success(res.message)
              this.story.add.addLoading = false
            })
          }
        }
      })
    },
    // 章节删除
    sectionDelete() {
      this.story.loading = true
      sectionDelete({
        book_id: this.story.book_id,
        section: this.story.handler.remove
      }).then(res => {
        this.$message.success(res.message)
        this.story.loading = false
        this.story.handler.remove = ''
        this.chapterList(this.story.book_id)
      }).catch(() => {
        this.story.loading = false
      })
    },
    // 引入章节
    importChapter() {
      this.$refs.storyImport.validate(valid => {
        if (valid) {
          this.storyImport.loading = true
          const data = Object.assign({
            book_id: this.story.book_id
          }, this.storyImport.form)
          importChapter(data).then(res => {
            this.$message.success(res.message)
            this.storyImport.loading = false
            this.toggleCurrent('story', { id: this.story.book_id, description: this.story.description, name: this.story.name, chapter_num: this.story.chapter_num })
          }).catch(() => {
            this.storyImport.loading = false
          })
        }
      })
    },
    // 章节列表翻页
    storyPagein(data) {
      const { page, limit } = data
      this.story.table.page = page
      this.story.table.size = limit
      this.chapterList(this.story.book_id)
    },
    // 获取章节具体内容
    chapterContent(id) {
      chapterContent({
        id
      }).then(res => {
        this.story.add.form.content = res.data
        console.log('res', res)
      }).catch(() => {
        this.story.add.form.content = '<p>获取数据失败...</p>'
      })
    },
    // 获取书籍章节列表
    chapterList(book_id) {
      this.showPagin = false
      this.$nextTick(() => {
        this.showPagin = true
      })
      this.story.table.loading = true
      chapterList({
        book_id,
        page: this.story.table.page,
        size: this.story.table.size,
        is_pay: this.story.is_pay,
        name: this.story.chapter_name
      }).then(res => {
        this.story.table.total = res.data.total
        this.story.table.size = res.data.per_page
        this.story.table.data = res.data.data
        this.story.table.loading = false
      })
    },
    // 点击分类
    handlerCategory(data, node, VueComponent) {
      if (data.pid !== 0) {
        this.handleSelect(data)
        this.dialogTableVisible = false
      }
    },
    // 获取分类
    getCategoryList() {
      categoryList({
        size: 9999999
      }).then(res => {
        const pTree = []
        for (const item in res.data) {
          pTree.push(res.data[item])
        }
        this.treeData = pTree
        if (isEmpty(this.book_category_id)) {
          for (let i = 0; i < pTree.length; i++) {
            if (pTree[i].children && pTree[i].children.length !== 0) {
              this.book_category_id = pTree[i].children[0].id
              this.getList(this.book_category_id)
              break
            }
          }
        }
        console.log('this.treeData',this.treeData )
        this.$nextTick(() => {
          this.$refs.tree.setCurrentKey(this.book_category_id)
        })
      }).catch(err => {
        console.error('err: ', err)
      })
    },
    // index列表选中
    handleSelectionChange(selections) {
      this.selections = selections
    },
    // story章节被选中
    handleStorySelectionChange(selections) {
      this.story.selections = selections
    },
    // 批量设置
    massSet() {
      if (this.story.selections.length === 0) {
        this.$message.error('请选择设置章节')
        return
      } else if (this.story.handler.charge === '') {
        this.$message.error('请输入收费金额')
        return
      }
      const chapter_ids = this.story.selections.map(item => item.id).join(',')
      const data = {
        chapter_ids,
        book_id: this.story.book_id,
        glod: this.story.handler.charge
      }
      this.story.massSetLoading = true
      setcost(data).then(res => {
        this.$message.success(res.message)
        this.$refs.storyTable.clearSelection()
        this.story.handler.charge = ''
        this.story.massSetLoading = false
        this.chapterList(this.story.book_id)
      }).catch(() => {
        this.story.massSetLoading = false
      })
    },
    // 清除阅读量
    clearViews() {
      this.$confirm('清除阅读量?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.story.clearLoading = true
        clearRead({
          book_id: this.story.book_id
        }).then(res => {
          this.$message.success(res.message)
          this.story.clearLoading = false
        })
      }).catch(() => {
        //
      })
    },
    // 更新章节
    updateSelection(row) {
      this.$confirm('确认要更新章节吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message({
          type: 'success',
          message: '更新成功!'
        })
      }).catch(() => {
        //
      })
    },
    // 点击章节
    clickSection(row) {
      const { query } = this.$route
      this.toggleCurrent('storyEdit', { id: row.id, book_category_id: this.book_category_id, glod: row.glod, ...query })
    },
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
      this.copy.loading = true
      setTimeout(() => {
        this.copy.loading = false
      }, 5000)
    },
    handlePreview() {
      //
    },
    handleRemove() {
      this.$refs.addUpload.clearFiles()
      this.add.form.thumb_id = ''
    },
    // 新增或者编辑上传成功
    addUploadImgSuccess(res, file, fileList) {
      const { id, url } = res.data
      this.add.form.thumb_url = url
      this.add.form.thumb_id = id
      this.add.list = fileList.splice(fileList.length - 1)
    },
    // 复制删除
    handleCopyRemove() {
      this.$refs.copyUpload.clearFiles()
      this.copy.form.thumb_url = ''
      this.copy.form.thumb_id = ''
    },
    // 复制上传封面成功
    copyUploadImgSuccess(res, file, fileList) {
      this.add.list = fileList.splice(fileList.length - 1)
    },
    // 切换页面
    toggleCurrent(current = '', obj) {
      console.log('obj: ', obj)
      const { path } = this.$route
      this.$router.replace({
        path: '/redirect' + path,
        query: {
          current,
          ...obj
        }
      })
    },
    // 备注
    addRemark(row) {
      this.remark.form.id = row.id
      this.remark.form.remarks = row.remarks
      this.remark.visible = true
    },
    // 保存备注
    saveRemark() {
      this.remark.loading = true
      this.$refs.remark.validate(valid => {
        if (valid) {
          bookUpdate(this.remark.form).then(res => {
            this.$refs.remark.resetFields()
            this.remark.visible = false
            this.remark.loading = false
            this.$message.success(res.message)
            this.getList(this.book_category_id)
          }).catch(() => {
            this.remark.loading = false
          })
        }
        this.remark.loading = false
      })
    },
    // 翻页
    pagein(data) {
      const { page, limit } = data
      this.table.page = page
      this.table.size = limit
      this.getList(this.book_category_id)
    },
    // 获取列表
    getList(book_category_id) {
      console.log('book_category_id: ', book_category_id)
      this.table.loading = true
      bookList({
        page: this.table.page,
        size: this.table.size,
        book_category_id,
        ...this.search.form
      }).then(response => {
        this.table.data = response.data.data
        this.table.total = response.data.total
        this.table.loading = false
        this.table.size = response.data.per_size
      }).catch(() => {
        this.table.loading = false
      })
    },
    // 输入查询
    querySearch(queryString, cb) {
      // categoryList
      categoryListAll({
        category_name: queryString
      }).then(res => {
        cb(res.data.data.filter(item => {
          item.value = item.name
          return item.pid !== 0
        }))
      })
    },
    // 选择查询结果
    handleSelect(data) {
      this.dialogTableVisible = false
      this.book_category_id = data.id
      if(this.current == 'index'){
         this.getList(data.id)
      }else{
        this.treeData.map((item,i)=>{
          item.children.map((list,j)=>{
            if(list.id == this.book_category_id){
              this.add.form.book_category_value = item.name +'-'+list.name
            }
          })
        })
      }
    },
    // 更换作者
    toUpdate(row) {
      this.update.currentAuthor = row.author_name
      this.update.form.id = row.id
      this.update.visible = true
    },
    // 保存更换作者
    saveUpdate() {
      this.update.loading = true
      this.$refs.update.validate(valid => {
        if (valid) {
          this.update.loading = true
          bookUpdate(this.update.form).then(res => {
            this.$refs.update.resetFields()
            this.update.visible = false
            this.update.loading = false
            this.$message.success(res.message)
            this.getList(this.book_category_id)
          }).catch(() => {
            this.update.loading = false
          })
        }
        this.update.loading = false
      })
    },
    // 复制
    handleCopy(text, event) {
      clip(text, event)
    },
    // 删除章节
    handleStoryRemove(row) {
      this.$confirm('确认删除此记录吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.story.table.loading = true
        chapterDelete({
          id: row.id
        }).then(res => {
          this.$message({
            type: 'success',
            message: res.message
          })
          this.chapterList(this.story.book_id)
          this.story.table.loading = false
        })
      }).catch(() => {
        this.story.table.loading = false
      })
    },
    // 删除
    remove(row) {
      this.$confirm('确认删除此记录吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        bookDelete({
          id: row.id
        }).then(res => {
          if (res.code === 0) {
            this.$message({
              type: 'success',
              message: res.message
            })
            setTimeout(() => {
              this.getList(this.book_category_id)
            }, 1500)
          } else {
            this.$message({
              type: 'error',
              message: res.message
            })
          }
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
      this.toggleCurrent('edit', { ...row, book_category_id: this.book_category_id })
    }
  }
}
</script>

<style lang="scss" scoped>
  .novel-management{
    position: relative;
    .quick-entry{
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      width: 450px;
      margin: -87px 0 0 -225px;
      border: 1px solid #293846;
      border-radius: 4px;
      box-shadow: 0px 1px 2px rgba(0,0,0,0.1);
      .title{
        background-image: none;
        background: #293846;
        height: 32px;
        padding: 0px;
        line-height: 32px;
        font-size: 14px;
        color: #DFE4ED;
        text-align: left;
        text-indent: 1em;
      }
      .body{
        padding: 65px 0;
        text-align: center;
        background-color: #fff;
        .el-autocomplete{
          width: 300px;
        }
      }
    }
    .code{
      background-color: #F9F2F4;
      border-radius: 4px;
      color: #ca4440;
      font-size: 90%;
      padding: 2px 4px;
      white-space: nowrap;
      font-size: 12px;
    }
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
    /deep/ .el-tree--highlight-current .el-tree-node.is-current>.el-tree-node__content{
      background: #f00;
      color: #fff;
    }
  }
</style>
