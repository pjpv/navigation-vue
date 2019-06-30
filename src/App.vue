<template>
  <div id="app" :style="{
  backgroundImage:'url(' + require('./assets/bg.png') + ')'
}">
<!--    <div style="background: url('./assets/bg.png')"></div>-->
<!--    <img alt="Vue logo" src="./assets/bg.png">-->
<!--    <HelloWorld msg="Welcome to Your Vue.js App"/>-->
    <div class="bg-blur-overlay"></div>
    <div class="main">
      <v-header :edit.sync="edit" @update="loadData"></v-header>
      <div class="content">
        <el-row>
          <el-col
                  :span="8"
                  v-for="(group, index) in siteGroupList"
                  :key="index"
          >
            <SiteGroup :data.sync="group" :edit="edit"></SiteGroup>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script>
import vHeader from './components/header'
import SiteGroup from './components/SiteGroup'

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
        localStorage.setItem('sitelist', JSON.stringify(val))
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
          const s = JSON.parse(localStorage.getItem('sitelist'))
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
        } catch (e) {
          reject()
        }
      })
    }
  }
}
</script>

<style lang="scss">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /*text-align: center;*/
  color: #2c3e50;
  height: 100%;
  width: 100%;
  position: relative;
  background-color: #232728;
  background-size: 100% 100%;
}
  html, body{
    margin: 0;
    padding: 0;
    height: 100%;
    width: 100%;
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
    margin: 0 auto;
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
    padding-top: 80px;
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
