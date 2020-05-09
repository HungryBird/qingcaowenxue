<template>
  <div class="mixin-components-container">
    <el-container>
      <el-header>
        <el-button v-if="btnList[0].flag" type="primary" @click="addData">添加</el-button>
        <span style="margin-left:20px;">
          <el-input
            v-model="listQuery.username"
            placeholder="输入用户名称或真实姓名"
            style="width: 200px;"
            class="filter-item"
          />
        </span>
        <el-button class="filter-item" type="primary" icon="el-icon-search" @click="search">搜索</el-button>
      </el-header>
      <el-main>
        <el-table v-loading="loading" :data="tableData" border style="width: 100%">
          <el-table-column prop="id" label="ID" width="80" align="center" />
          <el-table-column prop="username" label="用户名称" align="center" />
          <el-table-column prop="password_show" label="真实密码" width="140" align="center" />
          <el-table-column prop="group_name" label="角色" width="140" align="center" />
          <el-table-column prop="last_time" label="上次登录时间" width="140" align="center" />
          <el-table-column prop="truename" label="真实姓名" width="140" align="center" />
          <!-- <el-table-column prop="percentage" label="抽成比例" width="140" align="center" /> -->
          <el-table-column label="状态" width="100" align="center">
            <template slot-scope="scope">
              <span
                v-if="scope.row.status==0"
                class="send-btn no-send"
                @click="handleStatus(scope.row)"
              >禁用</span>
              <span
                v-if="scope.row.status==1"
                class="send-btn already-send"
                @click="handleStatus(scope.row)"
              >开启</span>
            </template>
          </el-table-column>
          <el-table-column prop="caozuo" label="操作" align="center">
            <template slot-scope="scope">
              <!-- <el-button size="mini" type="primary" @click="handleWechat(scope.row)">推荐微信菜单</el-button>
              <el-button size="mini" type="primary" @click="handleWechatConf(scope.row)">微信配置</el-button> -->
              <el-button v-if="btnList[1].flag" size="mini" type="primary" @click="handleEdit(scope.row)">编辑</el-button>
              <el-button v-if="btnList[2].flag" size="mini" type="danger" @click="handleDelete(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <pagination
          v-show="listQuery.total>0"
          :total="listQuery.total"
          :page.sync="listQuery.page"
          :limit.sync="listQuery.size"
          @pagination="getList"
        />
      </el-main>
    </el-container>
    <el-dialog :title="titlePop" :visible.sync="dialogTableVisible" width="60%">
      <el-form ref="formPop" :model="formPop" label-width="120px">
        <el-form-item label="用户名称：" style="width:80%" v-if="titlePop==='添加'">
          <el-input v-model="formPop.username" />
        </el-form-item>
        <el-form-item label="角色：" style="width:80%">
          <el-select v-model="formPop.group_id" placeholder="请选择管理员角色" style="width:100%">
            <el-option v-for="(item,index) in roleList" :key="index" :value="item.id" :label="item.title"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="登录密码：" style="width:80%">
          <el-input v-model="formPop.password" />
        </el-form-item>
        <el-form-item label="真实姓名：" style="width:80%">
          <el-input v-model="formPop.truename" />
        </el-form-item>
        <el-form-item label="状态：" style="width:80%">
          <el-radio-group v-model="formPop.status">
            <el-radio
              v-for="(item,index) in statusList"
              :key="index"
              :label="item.id"
            >{{ item.label }}</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div class="pop-bottom-btn">
        <el-button type="primary" @click="handleSave">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {adminList,delList,addList,editorList} from "@/api//system/user-list";
import {roleList} from "@/api//system/role-list";
import Pagination from "@/components/Pagination"; // 分页

export default {
  name: "Filtration",
  components: { Pagination },
  data() {
    return {
      loading: false,
      listQuery:{
          username:'',
          page: 1,
          size: 20,
          total: 0
        },
      tableData: [],
      dialogTableVisible: false,
      jiexiurlzifucuan: "",
      dialogTableVisible: false,
      titlePop: "",
      formPop: {
        username: "",
        group_id:"",
        password: "",
        member: "",
        truename: "",
        status: 0
      },
      statusList: [
        {
          label: "开启",
          id: 1
        },
        {
          label: "禁用",
          id: 0
        }
      ],
      editorId: "",
      roleList:[],
       btnList:[
        {
          name:'/system/user-list/add',
          flag:false,
        },
        {
          name:'/system/user-list/edit',
          flag:false,
        },
        {
          name:'/system/user-list/delete',
          flag:false,
        }
      ]
    };
  },
  created() {
    this.$store.dispatch("user/showBtn",{name:'/system/user-list',btnName:''}).then(res=>{
      // console.log('res',res)
      let arr = res
      if(arr.children){
        this.btnList.map(list=>{
          arr.children.map((item,i)=>{
              if(list.name == item.name ){
                list.flag = true
              }
          })
        })
      }
    })
    this.getList();
    this.getRoleList()
  },
  methods: {
    getList(val) {
      this.loading = true;
      if (val != undefined) {
        const json = JSON.parse(JSON.stringify(val));
        this.listQuery.page = parseInt(json.page);
        this.listQuery.size = parseInt(json.limit);
      }
      let params = {
        page: this.listQuery.page,
        size: this.listQuery.size,
        username:this.listQuery.username
      };
      adminList(params).then(response => {
        // console.log(response);
        this.loading = false;
        this.tableData = response.data.data;
        this.listQuery.total = response.data.total;
      });
    },
    search(){
      this.listQuery.page = 1
      this.getList();
    },
    //获取角色列表
    getRoleList(){
      let params={
        title:'',
        page:1,
        size:999
      }
      roleList(params).then(res => {
        this.roleList = res.data.data;
      });
    },
    handleWechat(row) {
      this.$confirm(
        "确认要推荐微信菜单吗?此操作覆盖之前的菜单，新的菜单生效时间24小时内!",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(() => {})
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消"
          });
        });
    },
    handleWechatConf(row) {
      this.$router.push({ path: "/system/wechat-conf" });
    },
    handleDelete(row) {
      this.$confirm("确认要删除吗", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          const params = {
            id: row.id
          };
          delList(params).then(res => {
            if (res.message === "sucessfull!") {
              this.$message({
                type: "success",
                message: "删除成功!"
              });
              location.reload();
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消"
          });
        });
    },
    handleEdit(row) {
      console.log(row);
      this.dialogTableVisible = true;
      this.titlePop = "编辑";
      this.editorId = row.id
      this.formPop = {
        username: row.username,
        group_id:row.group_id,
        password: row.password_show,
        member: row.member,
        truename: row.truename,
        status:row.status
      }
    },
    addData() {
      this.dialogTableVisible = true;
      this.titlePop = "添加";
      this.formPop = {
        username: "",
        group_id:"",
        password: "",
        member: "",
        truename: "",
        status: 0
      }
    },
    handleSave() {
      if (this.titlePop == "添加") {
        addList(this.formPop).then(res => {
          if (res.code == 0) {
            this.$message({
              message: "添加成功",
              type: "success"
            });
            this.dialogTableVisible = false;
            this.getList();
          }
        });
      } else if (this.titlePop == "编辑") {
        const params = {
          id: this.editorId,
          username:  this.formPop.username,
          group_id: this.formPop.group_id,
          password:  this.formPop.password,
          member:  this.formPop.member,
          truename:  this.formPop.truename,
          status: this.formPop.status
        };
        editorList(params).then(res => {
          if (res.code == 0) {
            this.$message({
              message: "修改成功",
              type: "success"
            });
            this.dialogTableVisible = false;
            this.getList();
          }
        });
      }
    },
    handleStatus(row) {
      let status;
      if (row.status == 0) {
        status = 1;
      } else if (row.status == 1) {
        status = 0;
      }
      const params = {
        id: row.id,
        status: status
      };
      editorList(params).then(res => {
        if (res.code == 0) {
          this.$message({
            message: "修改成功",
            type: "success"
          });
          this.getList();
        }
      });
    }
  }
};
</script>

<style scoped>
.el-header {
  background-color: #ffffff;
  color: #333;
  text-align: left;
  line-height: 60px;
}

.small-reminder-img2 {
  width: 344px;
  height: 100px;
}
.send-btn {
  color: #fff;
  font-size: 10px;
  font-weight: 500;
  padding: 3px 8px;
  text-shadow: none;
  border-radius: 2px;
  cursor: pointer;
}
.no-send {
  background: #ed5565;
}
.already-send {
  background: #23c6c8;
}
.pop-bottom-btn {
  text-align: center;
}
</style>
