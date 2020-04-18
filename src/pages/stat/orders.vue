<template>
  <div>
    <div class="card-wrap">
      <el-card>
        <div class="title">
          <div>
            今日充值
          </div>
          <div class="value">
            ￥100
          </div>
        </div>
        <div class="bot">
          <div class="block">
            <div class="label">普通充值</div>
            <div class="value">￥100</div>
          </div>
          <div class="block">
            <div class="label">促销充值</div>
            <div class="value">￥100</div>
          </div>
          <div class="block">
            <div class="label">季度会员</div>
            <div class="value">￥100</div>
          </div>
          <div class="block">
            <div class="label">年费会员</div>
            <div class="value">￥100</div>
          </div>
        </div>
      </el-card>
      <el-card>
        <div class="title">
          <div>
            昨日充值
          </div>
          <div class="value">
            ￥100
          </div>
        </div>
        <div class="bot">
          <div class="block">
            <div class="label">普通充值</div>
            <div class="value">￥100</div>
          </div>
          <div class="block">
            <div class="label">促销充值</div>
            <div class="value">￥100</div>
          </div>
          <div class="block">
            <div class="label">季度会员</div>
            <div class="value">￥100</div>
          </div>
          <div class="block">
            <div class="label">年费会员</div>
            <div class="value">￥100</div>
          </div>
        </div>
      </el-card>
      <el-card>
        <div class="title">
          <div>
            本月充值
          </div>
          <div class="value">
            ￥100
          </div>
        </div>
        <div class="bot">
          <div class="block">
            <div class="label">普通充值</div>
            <div class="value">￥100</div>
          </div>
          <div class="block">
            <div class="label">促销充值</div>
            <div class="value">￥100</div>
          </div>
          <div class="block">
            <div class="label">季度会员</div>
            <div class="value">￥100</div>
          </div>
          <div class="block">
            <div class="label">年费会员</div>
            <div class="value">￥100</div>
          </div>
        </div>
      </el-card>
      <el-card>
        <div class="title">
          <div>
            累计充值
          </div>
          <div class="value">
            ￥100
          </div>
        </div>
        <div class="bot">
          <div class="block">
            <div class="label">普通充值</div>
            <div class="value">￥100</div>
          </div>
          <div class="block">
            <div class="label">促销充值</div>
            <div class="value">￥100</div>
          </div>
          <div class="block">
            <div class="label">季度会员</div>
            <div class="value">￥100</div>
          </div>
          <div class="block">
            <div class="label">年费会员</div>
            <div class="value">￥100</div>
          </div>
        </div>
      </el-card>
    </div>
    <div>
      每日充值统计
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
            label: '普通充值',
            prop: 't1',
            align: 'right'
          },
          {
            label: '普通充值支付订单数',
            prop: 't2',
            align: 'right'
          },
          {
            label: '促销充值',
            prop: 't3',
            align: 'right'
          },
          {
            label: '促销充值支付订单数',
            prop: 't4',
            align: 'right'
          },
          {
            label: '季度VIP会员',
            prop: 't5',
            align: 'right'
          },
          {
            label: '季度VIP会员支付订单数',
            prop: 't6',
            align: 'right'
          },
          {
            label: '年费VIP会员',
            prop: 't7',
            align: 'right'
          },
          {
            label: '年费VIP会员支付订单数',
            prop: 't8',
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
        color: seagreen;
      }
      .title{
        font-size: 18px;
      }
      .bot{
        display: flex;
        margin-top: 10px;
        .block{
          flex: 1;
          margin-right: 20px;
        }
      }
    }
  }
</style>
