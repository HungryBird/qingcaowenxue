<template>
  <el-container style="height: calc(100vh - 84px);" class="novel-management">
    <el-aside width="200px">
      <el-tree
        :props="defaultProps"
        :data="treeData"
        default-expand-all
        highlight-current
        @node-click="handlerCategory"
      />
    </el-aside>
    <el-main style="position: relative;">
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
                <el-form-item label="封面图片：" prop="thumb_url">
                  <el-upload
                    class="upload-demo"
                    :multiple="false"
                    :limit="1"
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
                <el-image style="width: 100%;" />
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
              <el-button class="filter-item" style="margin-left: 10px;" type="primary">
                全部
              </el-button>
              <el-button class="filter-item" style="margin-left: 10px;" type="primary" plain>
                收费
              </el-button>
              <el-button class="filter-item" style="margin-left: 10px;" type="primary" plain>
                免费
              </el-button>
              <el-button class="filter-item" style="margin-left: 10px;" type="primary" plain @click="toggleCurrent('storyAdd', { num: story.table.total, book_id: story.book_id, description: story.description, name: story.name, chapter_num: story.chapter_num })">
                添加章节
              </el-button>
              <el-button class="filter-item" style="margin-left: 10px;" type="primary" plain @click="updateSelection">
                更新章节
              </el-button>
              <el-button class="filter-item" style="margin-left: 10px;" type="primary" plain @click="clearViews">
                清除阅读量
              </el-button>
              <el-button class="filter-item" style="margin-left: 10px;" type="danger" @click="toggleCurrent('', { id: story.book_id })">
                返回
              </el-button>
            </div>
            <div style="flex: 1;display: flex;flex-direction: row-reverse;">
              <div class="filter-item" style="margin-left: 10px;">
                <el-input placeholder="输入需查询的章节名称">
                  <el-button slot="append" icon="el-icon-search" />
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
          <el-button type="primary" class="filter-item" style="margin-left: 10px;">
            章节重排
          </el-button>
          <div class="filter-item" style="margin-left: 10px;">
            <el-input v-model="story.handler.free" placeholder="输入前多少章节免费">
              <el-button slot="append">
                提交
              </el-button>
            </el-input>
          </div>
          <div class="filter-item" style="margin-left: 10px;">
            <el-input v-model="story.handler.text" placeholder="请输入要处理的文字">
              <el-button slot="append">
                提交
              </el-button>
            </el-input>
          </div>
          <div class="filter-item" style="margin-left: 10px;">
            <el-input v-model="story.handler.remove" placeholder="输入要删除的章节区间：格式[1-20]" style="width: 330px;">
              <el-button slot="append">
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
                  <a href="javascript:;" style="color: #337ab7;" @click="handleStoryEdit({...row, num: story.table.total, book_id: story.book_id, description: story.description, book_name: story.name, chapter_num: story.chapter_num})">
                    <b style="color: #900;">
                      [{{ row['num'] }}]
                    </b>
                    {{ row[sc.prop] }}
                    <i class="el-icon-trophy" />
                  </a>
                </div>
                <div v-else-if="sc.prop === 'tuiguang'">
                  <el-button size="mini" type="primary" plain @click="story.tuiguang.visible = true">
                    生成推广文案
                  </el-button>
                  <el-button size="mini" type="danger" plain @click="getTuiguang(row)">
                    获取推广链接
                  </el-button>
                </div>
                <div v-else-if="sc.prop === 'shoufei'">
                  <el-button size="mini" :type="row[sc.prop] ? 'primary' : 'danger'">
                    {{ row[sc.prop] ? '是' : '否' }}
                  </el-button>
                </div>
                <div v-else-if="sc.prop === 'status'">
                  <el-button size="mini" :type="row[sc.prop] ? 'primary' : 'danger'">
                    {{ row[sc.prop] ? '开启' : '禁用' }}
                  </el-button>
                </div>
                <div v-else-if="sc.prop === 'action'">
                  <el-button size="mini" type="primary" plain @click="handleStoryEdit({...row, num: story.table.total, book_id: story.book_id, description: story.description, book_name: story.name, chapter_num: story.chapter_num})">
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
          <pagination v-show="story.table.total>0" :total="story.table.total" :page.sync="story.table.page" :limit.sync="story.table.size" @pagination="storyPagein" />
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
          <el-form-item label="输入章节：" prop="num">
            <el-input v-model="story.add.form.num" />
          </el-form-item>
          <el-form-item label="章节内容：" prop="content">
            <tinymce ref="tinymce" v-model="story.add.form.content" :height="300" />
          </el-form-item>
          <el-form-item label="是否免费：" prop="is_pay">
            <el-radio-group v-model="story.add.form.is_pay">
              <el-radio :label="1">
                免费
              </el-radio>
              <el-radio :label="0">
                收费
              </el-radio>
            </el-radio-group>
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
            <el-button size="mini" type="danger" @click="toggleCurrent('story', { id: story.book_id, description: story.description, name: story.name, chapter_num: story.chapter_num })">
              返回
            </el-button>
            <el-button v-if="current === 'storyEdit'" size="mini" type="primary">
              目录
            </el-button>
            <el-button v-if="current === 'storyEdit'" size="mini" type="primary">
              上一章
            </el-button>
            <el-button v-if="current === 'storyEdit'" size="mini" type="primary">
              下一章
            </el-button>
          </el-form-item>
        </el-form>
      </div>
      <div v-else-if="current === 'index'">
        <div class="filter-container">
          <el-button class="filter-item" type="primary" icon="el-icon-refresh" @click="refresh" />
          <el-button class="filter-item" style="margin-left: 10px;" type="primary" @click="toggleCurrent('add', { book_category_id })">
            添加本地小说
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
            <el-option :value="1">
              全部
            </el-option>
            <el-option :value="2">
              连载中
            </el-option>
            <el-option :value="3">
              已完结
            </el-option>
          </el-select>
          <div class="filter-item" style="margin-left: 10px;">
            <el-input placeholder="输入需查询的小说名称">
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
          <el-table-column width="55" type="selection" align="center" />
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
              <div v-else-if="cl.prop === 'is_fee'">
                {{ row[cl.prop] === 0 ? '否' : '是' }}
              </div>
              <div v-else-if="cl.prop === 'name'" style="text-align: left;">
                <div>
                  <a href="javascript:;" style="font-size: 12px;color: #337ab7;cursor: pointer;" @click="toggleCurrent('story', { id: row.id, description: row.description, name: row.name, chapter_num: row.chapter_num })">{{ row['name'] }}</a>
                  <span class="code">总裁豪门</span>
                </div>
                <div style="color: #999;">
                  <!-- 开始收费备注 -->
                  <!-- {{ row['description'] }} -->
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
                <el-button v-if="!row[cl.prop]" size="mini" type="danger">
                  下架
                </el-button>
                <el-button v-else size="mini" type="primary">
                  上架
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
                <el-form-item label="封面图片：" prop="thumb_url">
                  <el-upload
                    class="upload-demo"
                    :multiple="false"
                    :headers="headers"
                    :limit="1"
                    :action="uploadUrl"
                    name="image"
                    :on-preview="handlePreview"
                    :on-remove="handleRemove"
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
  </el-container>
</template>

<script>
import mix from '@/mixs/mix'
import { bookList, bookDelete, chapterList, chapterContent, setcost, sectionDelete, clearRead, importChapter, chapterAdd, chapterUpdate, bookAdd, chapterDelete } from '@/api/book/list'
import { categoryList } from '@/api/book/category'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import clip from '@/utils/clipboard' // use clipboard directly
import Tinymce from '@/components/Tinymce'
export default {
  components: { Pagination, Tinymce },
  mixins: [mix],
  data() {
    return {
      // 上传地址
      uploadUrl: 'http://admin_api.fuleien.com/main/common/upload_picture',
      // 上传头部
      headers: {
        token: ''
      },
      // 小说类型
      book_category_id: null,
      // 选择推广模式
      chooseTuiguang(mode) {
        const routeUrl = this.$router.resolve({
          path: `/tuiguang?mode=${mode}`,
          query: { id: 96 }
        })
        window.open(routeUrl.href, '_blank')
      },
      // 小说内容
      story: {
        // 小说id
        book_id: '',
        // 小说章节数量
        chapter_num: 0,
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
            content: '',
            is_pay: 1,
            status: 1
          },
          rules: {
            name: [
              { required: true, message: '请输入小说标题' }
            ],
            num: [
              { required: true, message: '请输入小说ID' }
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
          visible: false
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
              prop: 'views',
              align: 'center'
            },
            {
              label: '是否收费',
              prop: 'shoufei',
              align: 'center'
            },
            {
              label: '书币',
              prop: 'shubi',
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
          thumb_id: ''
        },
        rules: {
          name: [
            { required: true, message: '请输入小说名称' }
          ],
          description: [
            { required: true, message: '请输入小说描述' }
          ],
          thumb_url: [
            { required: true, message: '请您上传封面' }
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
        label: 'name',
        children: 'children'
      },
      categoryName: '',
      treeData: [],
      dialogTableVisible: false,
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
            prop: 'serial',
            align: 'center'
          },
          {
            label: '时间',
            prop: 'time',
            align: 'center'
          },
          {
            label: '限时免费',
            prop: 'is_fee',
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
        loading: false
      }
    }
  },
  created() {
    const { current } = this.$route.query
    this.headers.token = this.$store.getters.token
    this.current = current
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
        this.getList()
      }
    // 点击了某个作品
    } else if (this.current === 'story') {
      console.log('story: ', this.$route)
      const { id, description, chapter_num, name } = this.$route.query
      this.story.book_id = id
      this.story.description = description
      this.story.chapter_num = chapter_num
      this.story.name = name
      this.description = description
      this.chapterList(id)
    // 添加或者编辑章节
    } else if (this.current === 'storyAdd' || this.current === 'storyEdit') {
      const { num, book_id, description, chapter_num, name } = this.$route.query
      this.story.add.form.num = num + 1
      this.story.book_id = book_id
      this.story.description = description
      this.story.chapter_num = chapter_num
      this.story.name = name
      this.description = description
      if (this.current === 'storyEdit') {
        const { id, is_pay, status, name, book_name } = this.$route.query
        this.story.add.form.id = id
        this.story.name = book_name
        this.story.add.form.name = name
        this.story.add.form.is_pay = Number(is_pay)
        this.story.add.form.status = Number(status)
        this.chapterContent(id)
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
              name: '',
              url: query[key]
            }]
          } else if (key === 'status' || key === 'is_fee') {
            this.add.form[key] = Number(query[key])
          } else if (key === 'book_length') {
            this.add.form[key] === query[key] / 10000
          } else if (key !== 'book_category_id') {
            this.$set(this.add.form, key, query[key])
          }
        }
      }
    }
  },
  methods: {
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
          const data = Object.assign({}, this.add.form, { book_category_id: this.book_category_id, book_length: this.add.form.book_length * 10000 })
          bookAdd(data).then(res => {
            this.$message.success(res.message)
            this.add.loading = false
            this.$refs.add.resetFields()
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
      sectionDelete().then(res => {

      })
    },
    // 引入章节
    importChapter() {
      importChapter().then(res => {

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
      }).catch(() => {
        this.story.add.form.content = '<p>获取数据失败...</p>'
      })
    },
    // 获取书籍章节列表
    chapterList(book_id) {
      this.story.table.loading = true
      chapterList({
        book_id,
        page: this.story.table.page,
        size: this.story.table.size
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
      categoryList().then(res => {
        const pTree = []
        res.data.data.forEach(item => {
          if (item.pid === 0) {
            item.children = []
            pTree.push(item)
          }
        })
        for (const row of pTree) {
          for (const cRow of res.data.data) {
            if (cRow.pid === row.id) {
              row.children.push(cRow)
            }
          }
        }
        this.treeData = pTree
      }).catch(err => {
        console.error('err: ', err)
      })
    },
    // story章节被选中
    handleStorySelectionChange(selection) {
      this.story.selections = selection
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
        cost: this.story.handler.charge
      }
      this.story.massSetLoading = true
      setcost(data).then(res => {
        this.$message.success(res.mess)
        this.$refs.storyTable.clearSelection()
        this.story.handler.charge = ''
        this.story.massSetLoading = false
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
      this.toggleCurrent('storyEdit', { id: row.id, ...query })
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
      //
    },
    // 新增或者编辑上传成功
    addUploadImgSuccess(res, file, fileList) {
      const { id, url } = res.data
      this.add.form.thumb_url = url
      this.add.form.thumb_id = id
      this.add.list = fileList
    },
    // 复制上传封面成功
    copyUploadImgSuccess(res, file, fileList) {
      console.log('res: ', res, 'file: ', file, 'fileList: ', fileList)
      this.add.list = fileList
    },
    // 切换页面
    toggleCurrent(current = '', obj) {
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
    // 翻页
    pagein(data) {
      const { page, limit } = data
      this.table.page = page
      this.table.size = limit
      this.getList(this.book_category_id)
    },
    // 获取列表
    getList(book_category_id) {
      this.table.loading = true
      bookList({
        page: this.table.page,
        book_category_id
      }).then(response => {
        this.table.data = response.data.data
        this.table.total = response.data.total
        this.table.loading = false
        this.table.size = response.data.per_size
      })
    },
    // 输入查询
    querySearch(queryString, cb) {
      // categoryList
      categoryList({
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
      this.toggleCurrent('index', {
        book_category_id: data.id
      })
      this.book_category_id = data.id
      this.getList(data.id)
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
  }
</style>
