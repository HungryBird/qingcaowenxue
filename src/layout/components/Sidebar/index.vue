<template>
  <div :class="{'has-logo':showLogo}">
    <logo v-if="showLogo" :collapse="isCollapse" />
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        :background-color="variables.menuBg"
        :text-color="variables.menuText"
        :unique-opened="true"
        :active-text-color="variables.menuActiveText"
        :collapse-transition="false"
        mode="vertical"
      >
        <sidebar-item v-for="route in permission_routes" :key="route.path" :item="route" :base-path="route.path" />
        <!-- <sidebar-item v-for="list in route" :key="list.path" :item="list" :base-path="list.path" /> -->
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import Logo from "./Logo";
import SidebarItem from "./SidebarItem";
import variables from "@/styles/variables.scss";
import { getRouter } from "@/api/user";

export default {
  data() {
    return {
      route: []
    };
  },
  components: { SidebarItem, Logo },
  computed: {
    ...mapGetters(["permission_routes", "sidebar"]),
    activeMenu() {
      const route = this.$route;
      const { meta, path } = route;
      // if set path, the sidebar will highlight the path you set
      if (meta.activeMenu) {
        return meta.activeMenu;
      }
      return path;
    },
    showLogo() {
      return this.$store.state.settings.sidebarLogo;
    },
    variables() {
      return variables;
    },
    isCollapse() {
      return !this.sidebar.opened;
    }
  },
  mounted() {
    // this.getRouter();
  },
  methods: {
    async getRouter() {
      const menu = await this.$store.dispatch("user/getRouter");
      console.log("routerList", menu);
      menu.map(item => {
        let menu = {
          path: item.name,
          name: item.name,
          alwaysShow: true,
          children: [],
          meta: { title: item.title, icon: "fa " + item.icon }
        };
        if (item.children) {
          item.children.map(list => {
            let menu2 = {
              path: list.name,
              name: list.name,
              meta: { title: list.title }
            };
            menu.children.push(menu2);
          });
        }
        this.route.push(menu);
      });
    }
  }
};
</script>
