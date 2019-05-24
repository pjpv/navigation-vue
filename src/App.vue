<template>
  <div id="app" :style="{
  backgroundImage:'url(' + require('./assets/bg.png') + ')'
}">
<!--    <div style="background: url('./assets/bg.png')"></div>-->
<!--    <img alt="Vue logo" src="./assets/bg.png">-->
<!--    <HelloWorld msg="Welcome to Your Vue.js App"/>-->
    <div class="main">
      <v-header :edit.sync="edit"></v-header>
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
    const s = JSON.parse(localStorage.getItem('sitelist'))
    if (s) {
      this.siteGroupList = s
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
}
  html, body{
    margin: 0;
    padding: 0;
    height: 100%;
    width: 100%;
  }
  .main{
    padding: 60px 100px;
  }
  .content{
    width: 1024px;
    text-align: center;
    margin: 0 auto;
  }
</style>
