<template>
  <div class="mixin-components-container">
    <el-container>
      <el-header>
        <el-button v-if="btnList[0].flag" type="primary" @click="addData">添加</el-button>
        <span style="margin-left:20px;">
          <el-input
            v-model="listQuery.title"
            placeholder="输入需查询的角色名"
            style="width: 200px;"
            class="filter-item"
          />
        </span>
        <el-button class="filter-item" type="primary" icon="el-icon-search" @click="search">搜索</el-button>
      </el-header>
      <el-main>
        <el-table v-loading="loading" :data="tableData" border style="width: 100%">
          <el-table-column prop="id" label="ID" width="80" align="center" />
          <el-table-column prop="title" label="角色名称" align="center" />
          <el-table-column label="状态" width="240" align="center">
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
          <el-table-column prop="create_time" label="添加时间" width="240" align="center" />
          <el-table-column prop="caozuo" label="操作" align="center">
            <template slot-scope="scope">
              <div  v-if="scope.row.id!=1">
                <el-button v-if="btnList[3].flag" size="mini" type="primary" @click="handleRight(scope.row)">权限分配</el-button>
                <el-button v-if="btnList[1].flag" size="mini" type="primary" @click="handleEdit(scope.row)">编辑</el-button>
                <el-button v-if="btnList[2].flag" size="mini" type="danger" @click="handleDelete(scope.row)">删除</el-button>
              </div>
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
    <!-- 新增编辑弹窗 -->
    <el-dialog :title="titlePop" :visible.sync="dialogTableVisible" width="60%">
      <el-form ref="formPop" :model="formPop" label-width="120px">
        <el-form-item label="角色名称：" style="width:80%">
          <el-input v-model="formPop.title" />
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
    <!-- 权限分配弹窗 -->
    <el-dialog title="权限分配" :visible.sync="dialogRightVisible" width="20%">
      <div class="tree-wrap-box" v-loading="rolePopLoading">
        <el-tree
          ref="tree"
          :data="treeData"
          show-checkbox
          node-key="id"
          default-expand-all
          :props="defaultProps"
          :default-checked-keys="defaultCheckedTree"
          @check-change="handleCheckChange"
        ></el-tree>
      </div>
       <div class="pop-bottom-btn">
        <el-button type="primary" @click="handleSure">确认分配</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {roleList,delList,addList,editorList,roleRightList,setRoleRightList} from "@/api//system/role-list";
import Pagination from "@/components/Pagination"; // 分页

export default {
  name: "Filtration",
  components: { Pagination },
  data() {
    return {
      loading: false,
      listQuery: {
          page: 1,
          size: 20,
          total: 0,
          title:'',
      },
      tableData: [],
      dialogTableVisible: false,
      jiexiurlzifucuan: "",
      dialogTableVisible: false,
      titlePop: "",
      formPop: {
        title: "",
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
      dialogRightVisible: false,
      treeData: [],
      defaultProps: {
        children: "children",
        label: "title"
      },
      checkoutTree:[],
      defaultCheckedTree:[],
      roleId:"",
      rolePopLoading:false,
      btnList:[
        {
          name:'/system/role-list/add',
          flag:false,
        },
        {
          name:'/system/role-list/edit',
          flag:false,
        },
        {
          name:'/system/role-list/delete',
          flag:false,
        },
        {
          name:'/system/role-list/auth',
          flag:false,
        }
      ]
    };
  },
  created() {
    this.$store.dispatch("user/showBtn",{name:'/system/role-list',btnName:''}).then(res=>{
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
        title:this.listQuery.title
      };
      roleList(params).then(response => {
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
    handleRight(row) {
        this.dialogRightVisible = true
        this.defaultCheckedTree = []
        this.roleId = row.id
        this.rolePopLoading = true
        let params ={
          rules:row.rules
        }
        console.log(params)
        roleRightList(params).then(res=>{
          this.treeData = res.data
          this.rolePopLoading = false
          this.treeData.map(item=>{
            if(item.isChecked == 'checked'){
              this.defaultCheckedTree.push(item.id)
            }
            if(item.children.length>0){
              item.children.map(item2=>{
                if(item2.isChecked == 'checked'){
                  this.defaultCheckedTree.push(item2.id)
                }
                if(item2.children.length>0){
                  item2.children.map(item3=>{
                    if(item3.isChecked == 'checked'){
                      this.defaultCheckedTree.push(item3.id)
                    }
                  })
                }
              })
            }
          })
        })
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
      this.editorId = row.id;
      this.formPop.title = row.title;
      this.formPop.status = row.status;
    },
    addData() {
      this.dialogTableVisible = true;
      this.titlePop = "添加";
      this.formPop.title = "";
      this.formPop.status = 0;
    },
    handleSave() {
      if (this.titlePop == "添加") {
        const params = {
          title: this.formPop.title,
          status: this.formPop.status
        };
        addList(params).then(res => {
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
          title: this.formPop.title,
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
    },
    handleCheckChange () {
      // let res = this.$refs.tree.getCheckedNodes()
      let res = this.$refs.tree.getHalfCheckedKeys().concat(this.$refs.tree.getCheckedKeys())
      console.log(res)
      // let arr = []
      // res.forEach((item) => {
      //   arr.push(item.id)
      // })
      
      this.checkoutTree = res
    },
    handleSure(){
      console.log('checkoutTree',this.checkoutTree)
      let params={
        id:this.roleId,
        rule_ids:this.checkoutTree.join(',')
      }
      setRoleRightList(params).then(res=>{
        if(res.code == 0){
          this.$message({
            message: "权限分配成功",
            type: "success"
          });
          this.dialogRightVisible = false
          this.getList();
        }
      })
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
  margin-top: 20px;
}
.tree-wrap-box {
  height: 500px;
  overflow-y: auto;
}
.tree-wrap-box::-webkit-scrollbar {
    width: 6px;
    height:1px;
    background-color:#eee;
    -webkit-border-radius: 2em;
    -moz-border-radius: 2em;
    border-radius:2em;
}
</style>
