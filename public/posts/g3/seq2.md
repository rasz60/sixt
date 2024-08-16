DB에 저장된 메뉴를 불러오기 위한 서버 설정을 마치고 이제 화면에 출력해보려고 한다.<br/>
헤더에 메뉴 버튼을 누르면 overlay로 구성된 메뉴가 toggle되는 형식으로 구현하였다.
<br/><br/>

/frontend/src/views/HeaderView.vue

```
<script setup>
import LoginDialog from "@/components/overlay/LoginDialog.vue";
import DropMenu from "@/components/overlay/DropMenu.vue";
</script>
<template>
  <v-overlay
    v-model="loginDisplay"
    id="overlay"
    scroll-strategy="block"
    persistent
  >
    <LoginDialog @sendMessage="setLoginDisplay" />
  </v-overlay>

  <!-- 메뉴 overlay 추가 -->
  <v-overlay v-model="menuDrop" id="menuOverlay" scroll-strategy="block">
    <DropMenu @sendMessage="setMenuDrop" />
  </v-overlay>

  <v-layout id="header">
    <v-app-bar id="headerMenu">
      <template v-slot:prepend>
        <v-app-bar-title id="logo">
          <a @click="fnMove('/')">
            <v-icon icon="mdi-alpha-r" class="logo-icons alpha" />
            <v-icon icon="mdi-alpha-m" class="logo-icons alpha" />
            <v-icon icon="mdi-alpha-f" class="logo-icons alpha" />
            <v-icon icon="mdi-alpha-r" class="logo-icons alpha" />
            <v-icon icon="mdi-help" class="logo-icons" />
          </a>
        </v-app-bar-title>
        <div id="drop">
          <v-btn
            prepend-icon="mdi-plus"
            id="menuDropdown"
            @click="fnOverlay(0)"
            text="Menus"
          />
        </div>
      </template>

      <template v-slot:append>
        <div id="buttonBox">
          <v-btn
            class="headerBtn"
            @click="fnMove('/signup')"
            v-show="!loginFlag"
          >
            <v-icon icon="mdi-account-plus"></v-icon>
            <v-tooltip location="bottom center" activator="parent">
              Signup
            </v-tooltip>
          </v-btn>

          <v-btn
            class="headerBtn"
            @click="fnMove('/settings')"
            v-show="loginFlag"
          >
            <v-icon icon="mdi-account-cog"></v-icon>
            <v-tooltip location="bottom center" activator="parent">
              Settings
            </v-tooltip>
          </v-btn>

          <v-btn
            class="headerBtn"
            @click.stop="fnOverlay(1)"
            v-show="!loginFlag"
          >
            <v-icon icon="mdi-key"></v-icon>
            <v-tooltip location="bottom center" activator="parent">
              login
            </v-tooltip>
          </v-btn>

          <v-btn class="headerBtn" @click.stop="fnLogout" v-show="loginFlag">
            <v-icon icon="mdi-logout"></v-icon>
            <v-tooltip location="bottom center" activator="parent">
              logout
            </v-tooltip>
          </v-btn>
        </div>
      </template>
    </v-app-bar>
  </v-layout>
</template>

<script>
export default {
  name: "headerView",
  data() {
    return {
      menuDrop: false,
      loginDisplay: false,
      loginFlag: false,
    };
  },
  created() {
    this.loginFlag = this.$loginInfo.login;
  },
  methods: {
    setLoginDisplay(obj) {
      this.menuDrop = false;
      this.loginDisplay = obj.loginDisplay;
    },
    fnLogout() {
      // 로컬 스토리지 loginInfo 초기화
      this.$loginInfo.login = false;
      this.$loginInfo.token = null;
      this.$loginInfo.expired = null;
      location.href = "/logout"; // spring security logout URL로 이동
    },
    fnMove(path) {
      this.menuDrop = false;
      this.$router.push(path);
    },

    /* 로그인 / 메뉴 overlay가 중복으로 나오지 않게 함 */
    fnOverlay(type) {
      // type = 0 : menuDrop, 1 : loginDisplay
      if (type == 0) {
        this.menuDrop = !this.menuDrop;
        this.loginDisplay = false;
      } else {
        this.menuDrop = false;
        this.loginDisplay = !this.loginDisplay;
      }
    },
    /* overlay에서 선택한 메뉴 이동 메서드 */
    setMenuDrop(obj) {
      this.menuDrop = obj.menuDrop;
      if (obj.path != "") this.$router.push(obj.path);
    },
  },
};
</script>

<style>
.findInfo {
  color: darkblue;
  text-decoration: underline;
}

.findInfo:hover {
  color: purple;
  cursor: pointer;
}

/* 메뉴 스타일 추가 */
#drop {
  color: #1d1d1d;
  margin-left: 0.3em;
  transition: transform 0.5s ease-in-out;
}
#drop:hover .v-btn__prepend {
  animation: rotation 2s linear infinite;
}

@keyframes rotation {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
```

<br/>

/frontend/src/components/overlay/DropMenu.vue

```
<template>
  <v-sheet id="menu">
    <v-row>
      <v-spacer></v-spacer>
      <v-col cols="3" v-for="i in 3" :key="i">
        <v-list>
          <v-list-item
            v-for="menu in menus.filter((m) => {
              if (m.menuSection == i) return m;
            })"
            :key="menu"
            :class="menu.menuClass"
            :prepend-icon="menu.menuType == 1 ? 'mdi-plus' : ''"
            :link="menu.menuType == 1"
            @click="fnMove(menu.menuLink)"
          >
            {{ menu.menuName }}
          </v-list-item>
        </v-list>
      </v-col>
      <v-spacer></v-spacer>
    </v-row>
  </v-sheet>
</template>

<script>
export default {
  data() {
    return {
      menus: [],
    };
  },
  async created() {
    await this.getMenus();
  },
  computed: {},
  methods: {
    async getMenus() {
      await this.axios
        .get("/rest/menuList")
        .then((res) => {
          this.menus = res.data;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    fnMove(path) {
      if (path) {
        var msg = {
          menuDrop: false,
          path: path,
        };

        this.$emit("sendMessage", msg);
      }
    },
  },
  watch: {},
};
</script>

<style lang="scss">
.v-overlay__scrim {
  top: 6em !important;
}

#menu {
  margin-top: 5em;
  .v-row {
    margin: 0;
    width: 100vw;
  }

  .titles {
    background-color: RGBA(239, 239, 255, 0.4);
    font-weight: 600;
  }

  .subMenus {
    padding-left: 1.5em;
    padding-bottom: 0;
    padding-top: 0;
    min-height: 2.5em;

    .v-list-item__prepend {
      width: 2em;
      font-size: 10px;
    }
  }

  .subMenus:hover .v-list-item__prepend > i {
    animation: rotation 1s linear infinite;
  }

  @keyframes rotation {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
}
</style>
```

메뉴 화면는 비교적 간단하여 script와 style을 따로 분리하지는 않았다.
<br/><br/>

3가지 섹션으로 분리되어 제목이 되는 타이틀 메뉴와 링크를 가지는 상세 메뉴로 구분되어 출력되며,<br/>
타이틀 메뉴는 음영 처리를 하고 상세 메뉴를 클릭 시 HeaderView.vue의 setMenuDrop() 메서드를 호출하여 페이지를 이동하도록 구현하였다.
<br/><br/>

기본 화면을 구성하기 위해서 공지사항 게시판과 빈 메뉴를 DB에 추가해보았다.<br/>

```
INSERT INTO rmfrdb.MENUS (menu_uuid, menu_auth, menu_link, menu_name, menu_section, menu_seq, menu_status, menu_type)
VALUES (1, 0, '', 'Boards', 1, 1, 0, 0);

INSERT INTO rmfrdb.MENUS (menu_uuid, menu_auth, menu_link, menu_name, menu_section, menu_seq, menu_status, menu_type)
VALUES (2, 0, '/board/notice', 'NoTiCe', 1, 2, 0, 1);

INSERT INTO rmfrdb.MENUS (menu_uuid, menu_auth, menu_link, menu_name, menu_section, menu_seq, menu_status, menu_type)
VALUES (3, 0, '', 'Test', 2, 3, 0, 0);

INSERT INTO rmfrdb.MENUS (menu_uuid, menu_auth, menu_link, menu_name, menu_section, menu_seq, menu_status, menu_type)
VALUES (4, 0, '/test', 'TeST', 2, 4, 0, 1);

INSERT INTO rmfrdb.MENUS (menu_uuid, menu_auth, menu_link, menu_name, menu_section, menu_seq, menu_status, menu_type)
VALUES (5, 0, '', 'Test', 3, 5, 0, 0);

INSERT INTO rmfrdb.MENUS (menu_uuid, menu_auth, menu_link, menu_name, menu_section, menu_seq, menu_status, menu_type)
VALUES (6, 0, '/test', 'TeST', 2, 6, 0, 1);
```

<br/>

다음으로는 본격적으로 게시판을 구현해보겠다.😎
