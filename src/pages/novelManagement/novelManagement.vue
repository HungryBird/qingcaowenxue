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
      <div v-else-if="current === 'story'">
        <el-row :gutter="22" style="padding-bottom: 10px;">
          <el-col :span="6">
            <el-row>
              <el-col :span="8">
                <el-image style="width: 100%;" />
              </el-col>
              <el-col :span="16">
                <div style="font-weight: bold;font-size: 14px;color: rgb(51, 122, 183);">
                  六界哀歌
                </div>
                <div>
                  章节数量：共<span class="code">747</span>章
                </div>
              </el-col>
            </el-row>
          </el-col>
          <el-col :span="18" style="border-left: 1px solid #e7eaec;line-height: 28px;">
            遥远的时空中流传着一个界面的传说。 宇宙空间是六维的六维空间形成了传闻中的六界。 第一界凌驾于其他五界之上操纵着每一界的生灵。 地球便是那第六界。 第一界在第六界上演了一场进化纪元整个第六界陷入了一场生化危机！ 2014年夏林墨正在家里玩着游戏忽然发现整个世界变成了末世而他。。莫名其妙的成了“天选者”之一。 六维世界？进化纪元？ 神秘的女杀手英姿飒爽的女警真正的身世惊天的阴谋死亡的威胁。 本文通篇以第一人称视角叙述行文流畅笔风幽默故事情让人耳目一新。从主角最开始经常发傻到后来渐渐成熟给读者一种真实的感觉。
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
              <el-button class="filter-item" style="margin-left: 10px;" type="primary" plain @click="toggleCurrent('storyAdd')">
                添加章节
              </el-button>
              <el-button class="filter-item" style="margin-left: 10px;" type="primary" plain @click="updateSelection(row)">
                更新章节
              </el-button>
              <el-button class="filter-item" style="margin-left: 10px;" type="primary" plain @click="clearViews(row)">
                清除阅读量
              </el-button>
              <el-button class="filter-item" style="margin-left: 10px;" type="danger" @click="toggleCurrent('')">
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
              <el-button slot="append" :loading="story.setLoading" @click="massSet">
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
            <el-table-column v-for="(sc, index) in story.table.columns" :key="sc.prop" :type="sc.type" :label="sc.label" :prop="sc.prop" :width="sc.width" :align="sc.align">
              <template slot-scope="{ row }">
                <div v-if="sc.prop === 'name'">
                  <a href="javascript:;" style="color: #337ab7;" @click="clickSection(row)">
                    <b style="color: #900;">
                      [{{ ++index }}]
                    </b>
                    测试测试
                    <i class="el-icon-trophy" />
                  </a>
                </div>
                <div v-else-if="sc.prop === 'tuiguang'">
                  <el-button size="mini" type="primary" plain @click="story.tuiguang.visible = true">
                    生成推广文案
                  </el-button>
                  <el-button size="mini" type="danger" plain @click="story.tuiguanglianjie.visible = true">
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
                  <el-button size="mini" type="primary" plain @click="story.edit.visible = true">
                    编辑
                  </el-button>
                  <el-button size="mini" type="danger" plain @click="remove(row)">
                    删除
                  </el-button>
                </div>
                <div v-else>
                  {{ row[sc.prop] }}
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <!-- 生成推广链接 -->
        <el-dialog :visible.sync="story.tuiguanglianjie.visible" title="生成推广链接">
          <el-form ref="tuiguanglianjie" :model="story.tuiguanglianjie.form" :rules="story.tuiguanglianjie.rules" label-width="150px">
            <el-form-item label="入口页面：" prop="entry">
              <el-input v-model="story.tuiguanglianjie.form.entry" />
            </el-form-item>
            <el-form-item label="备注：" prop="remark">
              <el-input v-model="story.tuiguanglianjie.form.entry" />
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
            <el-form-item label="首章显示章节：" prop="entry">
              <el-input v-model="story.tuiguanglianjie.form.entry" />
            </el-form-item>
            <el-form-item label="关注章节序号：" prop="entry">
              <el-input v-model="story.tuiguanglianjie.form.entry" placeholder="可选，如不填则使用小说默认设置" />
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
        <!-- 故事编辑？？？ -->
        <el-dialog :visible.sync="story.edit.visible" title="编辑章节" />
      </div>
      <!-- 添加或者编辑章节 -->
      <div v-else-if="current === 'storyAdd' || current === 'storyEdit'">
        <el-form ref="storyAdd" :model="story.add.form" :rules="story.add.rules" label-width="150px">
          <el-form-item label="章节标题：" prop="title">
            <el-input v-model="story.add.form.title" />
          </el-form-item>
          <el-form-item label="输入章节：" prop="section">
            <el-input v-model="story.add.form.section" />
          </el-form-item>
          <el-form-item label="章节内容：" prop="content">
            <tinymce v-model="story.add.form.content" :height="300" />
          </el-form-item>
          <el-form-item label="是否免费：" prop="isFree">
            <el-radio-group v-model="story.add.form.isFree">
              <el-radio label="yes">
                免费
              </el-radio>
              <el-radio label="no">
                收费
              </el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="状 态：" prop="status">
            <el-radio-group v-model="story.add.form.status">
              <el-radio label="on">
                开启
              </el-radio>
              <el-radio label="off">
                关闭
              </el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item>
            <el-button size="mini" type="primary">
              保存
            </el-button>
            <el-button size="mini" type="danger" @click="toggleCurrent('story', { id: story.id })">
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
      <div v-else-if="current === 'index'" style="position: relative;">
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
              <div v-else-if="cl.prop === 'name'" style="text-align: left;">
                <div>
                  <a href="javascript:;" style="font-size: 12px;color: #337ab7;cursor: pointer;" @click="toggleCurrent('story', { id: row.id })">小城女律师</a>
                  <span class="code">总裁豪门</span>
                </div>
                <div style="color: #999;">
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
import { categoryList } from '@/api/category-list'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import clip from '@/utils/clipboard' // use clipboard directly
import Tinymce from '@/components/Tinymce'
export default {
  components: { Pagination, Tinymce },
  mixins: [mix],
  data() {
    return {
      // 选择推广模式
      chooseTuiguang(mode) {
        const routeUrl = this.$router.resolve({
          path: `/tuiguang${mode}`,
          query: { id: 96 }
        })
        window.open(routeUrl.href, '_blank')
      },
      // 小说内容
      story: {
        id: '',
        // 按钮loading
        setLoading: false,
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
            title: '',
            section: '',
            content: '',
            isFree: 'yes',
            status: 'on'
          },
          rules: {
            title: [
              { required: true, message: '请输入小说标题' }
            ],
            section: [
              { required: true, message: '请输入小说ID' }
            ]
          }
        },
        // 推广链接
        tuiguanglianjie: {
          visible: false,
          form: {
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
              align: 'center'
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
              align: 'center'
            }
          ],
          data: [
            {}, {}, {}
          ],
          total: 0,
          page: 1,
          size: 10,
          limit: 10,
          loading: false
        }
      },
      // 复制小说
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
    this.getCategoryList()
    if (!this.current) {
      this.dialogTableVisible = true
    } else if (this.current === 'index') {
      this.getList()
    }
  },
  methods: {
    // 获取分类
    getCategoryList() {
      categoryList().then(res => {
        console.log('res: ', res)
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
      this.$message.success('设置成功')
      setTimeout(() => {
        this.toggleCurrent('story')
      }, 1500)
    },
    // 清除略度量
    clearViews(row) {
      this.$confirm('清除阅读量?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message({
          type: 'success',
          message: '清除成功!'
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
      this.toggleCurrent('storyEdit', { id: 1 })
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
    onUploadImgSuccess(res, file, fileList) {
      console.log('res: ', res, 'file: ', file, 'fileList: ', fileList)
      this.add.list = fileList
    },
    // 切换页面
    toggleCurrent(current = '', obj) {
      const { fullPath } = this.$route
      this.$router.replace({
        path: '/redirect' + fullPath,
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
