<template>
  <div>
    <div class="card-wrap">
      <el-card>
        <div class="title">
          <div>
            今日新增
          </div>
          <div class="value">
            100
          </div>
        </div>
        <div class="bot">
          <div class="block">
            <div class="value">0</div>
            <div class="label">男性，</div>
          </div>
          <div class="block">
            <div class="value">0</div>
            <div class="label">女性，</div>
          </div>
          <div class="block">
            <div class="value">0</div>
            <div class="label">未知</div>
          </div>
        </div>
        <div>
          <div>已关注(总)：<span class="value">0</span></div>
          <div>已关注(净)：<span class="value">0</span></div>
          <div>已付费：<span class="value">0</span></div>
        </div>
      </el-card>
      <el-card>
        <div class="title">
          <div>
            昨日新增
          </div>
          <div class="value">
            100
          </div>
        </div>
        <div class="bot">
          <div class="block">
            <div class="value">0</div>
            <div class="label">男性，</div>
          </div>
          <div class="block">
            <div class="value">0</div>
            <div class="label">女性，</div>
          </div>
          <div class="block">
            <div class="value">0</div>
            <div class="label">未知</div>
          </div>
        </div>
        <div>
          <div>已关注(总)：<span class="value">0</span></div>
          <div>已关注(净)：<span class="value">0</span></div>
          <div>已付费：<span class="value">0</span></div>
        </div>
      </el-card>
      <el-card>
        <div class="title">
          <div>
            本月新增
          </div>
          <div class="value">
            100
          </div>
        </div>
        <div class="bot">
          <div class="block">
            <div class="value">0</div>
            <div class="label">男性，</div>
          </div>
          <div class="block">
            <div class="value">0</div>
            <div class="label">女性，</div>
          </div>
          <div class="block">
            <div class="value">0</div>
            <div class="label">未知</div>
          </div>
        </div>
        <div>
          <div>已关注(总)：<span class="value">0</span></div>
          <div>已关注(净)：<span class="value">0</span></div>
          <div>已付费：<span class="value">0</span></div>
        </div>
      </el-card>
      <el-card>
        <div class="title">
          <div>
            所有时间
          </div>
          <div class="value">
            100
          </div>
        </div>
        <div class="bot">
          <div class="block">
            <div class="value">0</div>
            <div class="label">男性，</div>
          </div>
          <div class="block">
            <div class="value">0</div>
            <div class="label">女性，</div>
          </div>
          <div class="block">
            <div class="value">0</div>
            <div class="label">未知</div>
          </div>
        </div>
        <div>
          <div>已关注(总)：<span class="value">0</span></div>
          <div>已关注(净)：<span class="value">0</span></div>
          <div>已付费：<span class="value">0</span></div>
        </div>
      </el-card>
    </div>
    <div>
      每日用户统计
    </div>
    <el-table
      v-loading="table.loading"
      :data="table.data"
      border
      fit
      highlight-current-row
      style="width: 100%;margin: 10px 0;"
    >
      <el-table-column v-for="cl in table.columns" :key="cl.prop" :prop="cl.prop" :label="cl.label" :width="cl.width" :align="cl.align">
        <template slot-scope="{ row }">
          {{ row[cl.prop] }}
        </template>
      </el-table-column>
    </el-table>
    <el-button type="primary">加载更多</el-button>
  </div>
</template>

<script>
export default {
  name: 'Recharge',
  props: {
    role: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      table: {
        data: [],
        total: 0,
        size: 50,
        page: 1,
        loading: false,
        columns: [
          {
            label: '日期',
            prop: 'id',
            align: 'left'
          },
          {
            label: '新增用户',
            prop: 't1',
            align: 'right'
          },
          {
            label: '已关注(总)',
            prop: 't2',
            align: 'right'
          },
          {
            label: '已关注(净)',
            prop: 't3',
            align: 'right'
          },
          {
            label: '已付费',
            prop: 't4',
            align: 'right'
          },
          {
            label: '男性',
            prop: 't5',
            align: 'right'
          },
          {
            label: '女性',
            prop: 't6',
            align: 'right'
          },
          {
            label: '未知',
            prop: 't7',
            align: 'right'
          }
        ]
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {

    }
  }
}
</script>

<style lang="scss" scoped>
  .card-wrap{
    display: flex;
    justify-content: space-between;
    margin: 0 0 15px 0;
    .el-card{
      flex: 1;
      &:not(:last-child){
        margin-right: 10px;
      }
      .value{
        color: rgb(138, 109, 59);
      }
      .title{
        font-size: 18px;
      }
      .bot{
        display: flex;
        margin: 10px 0;
        .block{
          display: flex;
        }
      }
    }
  }
</style>
