<template>
  <div id="app" :style="{
  backgroundImage:'url(' + require('./assets/bg.png') + ')'
}">
<!--    <div style="background: url('./assets/bg.png')"></div>-->
<!--    <img alt="Vue logo" src="./assets/bg.png">-->
<!--    <HelloWorld msg="Welcome to Your Vue.js App"/>-->
    <div class="bg-blur-overlay"></div>
    <div class="main">
      <v-header :edit.sync="edit" @update="loadData" @addGroup="onAddGroup"></v-header>
      <div class="content">
        <el-row class="content-row">
          <div
                  :span="24"
                  :xl="12"
                  :lg="12"
                  class="group-wrapper"
                  v-for="(group, index) in siteGroupList"
                  :key="index"
          >

            <SiteGroup
              :data.sync="group" :edit="edit" @deleteGroup="() => onDeleteGroup(index)"></SiteGroup>
          </div>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script>
import vHeader from './components/header'
import SiteGroup from './components/SiteGroup'
import {getData, setData} from "./Utils/store"

export default {
  name: 'app',
  components: {
    vHeader,
    SiteGroup
  },
  data() {
    return {
      siteGroupList: [],
      edit: false
    }
  },
  watch: {
    siteGroupList: {
      deep: true,
      handler(val){
        setData(JSON.stringify(val))
      }
    }
  },
  created() {
    this.loadData()
  },
  methods: {
    loadData() {
      return new Promise((resolve, reject) => {
        try {
          getData().then(data => {
            const s = JSON.parse(data)
            if (s) {
              this.siteGroupList = s
              resolve()
            }else {
              this.siteGroupList = [...Array(9)].map(() => {
                return {
                  title: '分组',
                  data: [...Array(9)].map(() => {
                    return {
                      name: '',
                      url: ''
                    }
                  })
                }
              })
              resolve()
            }
          })
        } catch (e) {
          reject()
        }
      })
    },
    onAddGroup(name) {
      this.siteGroupList.push({
        title: name,
        data: []
      })
    },
    onDeleteGroup(index) {
      this.siteGroupList.splice(index, 1)
    }
  }
}
</script>

<style lang="scss">
#app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
    position: relative;
    background-color: #232728;
    background-size: 100% 100%
}

#app, body, html {
    height: 100%;
    width: 100%
}
  html, body{
    margin: 0;
    padding: 0;
  }
  .main{
    /*padding: 60px 100px;*/


    /*position: absolute;*/
    /*!* top: 0; *!*/
    /*bottom: 0;*/
    /*left: 0;*/
    /*right: 0;*/
    /*!* height: 30%; *!*/
    /*margin: auto;*/

    min-width: 1000px;
    min-height: 738px;
  }
  .content{
  width: 1000px;
  text-align: center;
  margin: 20px auto;
  overflow: auto;
  height: calc(100vh - 100px);
    .content-row {
      column-count: 2;
      column-gap: 0;
    }
    .group-wrapper {
      width: 100%;
      display: inline-block;

      vertical-align: top;
    }
  }
  .bg-blur-overlay{
    background-image: url(/img/bg.f3321c0b.png);
    /*min-height: 100vh;*/
    /*min-width: 100vw;*/
    z-index: 0;
    position: absolute;
    -webkit-filter: blur(6px);
    -moz-filter: blur(6px);
    -ms-filter: blur(6px);
    filter: blur(6px);
    filter: progid:DXImageTransform.Microsoft.Blur(PixelRadius=6, MakeShadow=false);

    background-size: 100% 100%;
    background-repeat: no-repeat;
    /*background-size: cover;*/
    min-height: 100%;
    min-width: 100%;
  }


@media screen and (min-width: 1024px) and (max-width: 1024px){

  .main {
    padding-top: 30px;
  }
  .bg-blur-overlay{
  }
}
@media screen and (min-width: 1025px) and (max-width: 1366px){
  .main {
    padding-top: 30px;
    /deep/ {
      .header {
        padding-bottom: 10px;
        .header-row {
          /*padding: 0 100px;*/
        }
      }
    }
  }
  .bg-blur-overlay{
  }
}
@media screen and (min-width: 1367px) and (max-width: 1440px){
  .main {
    padding-top: 18px;
    /deep/ {
      .header {
        padding-bottom: 10px;
        .header-row {
          /*padding: 0 130px;*/
        }
      }
    }
  }
  .bg-blur-overlay{
  }
}
@media screen and (min-width: 1441px) {
  .main {
    padding-top: 100px;
    /deep/ {
      .header {
        padding-bottom: 50px;
        .header-row {
          /*padding: 0 130px;*/
        }
      }
    }
  }
  .bg-blur-overlay{
  }
}

</style>
