<template>
<div class="header">
  <el-row class="header-row" style="">
    <el-col :span="16">
      <el-autocomplete
              class="search-input"
              v-model="searchText"
              :fetch-suggestions="querySearch"
              :clearable="true"
              :select-when-unmatched="true"
              placeholder="请输入内容"
              @select="handleSelect"
      ></el-autocomplete>
      <el-button-group style="margin-left: 10px;">
        <el-button type="primary" @click="onSearchBaidu">百度</el-button>
        <el-button type="primary" @click="onSearchGoogle">Google</el-button>
      </el-button-group>
    </el-col>
    <el-col :span="8" style="text-align: right;">
      <el-alert v-if="edit"
                :closable="false"
                title="正在编辑"
                type="warning"
                show-icon
                style="width: 200px;margin: 0 auto;display: inline-flex;float: left"
      >
      </el-alert>
<!--      <el-button-group class="setting-button-group">-->
        <el-button type="primary" :icon="this.edit ? 'el-icon-close' : 'el-icon-edit'" round @click="handleEdit"></el-button>
<!--        <el-button type="primary" icon="el-icon-share"></el-button>-->
<!--        <el-button type="primary" icon="el-icon-delete"></el-button>-->
<!--      </el-button-group>-->
    </el-col>
  </el-row>
</div>
</template>

<script>
import {getJSONP} from "../Utils/jsonp"

const EMPTY = /(^\s*)|(\s*$)/g
export default {
  name: "header.vue",
  props: {
    edit: {
      type: Boolean,
    default: false
    }
  },
  data() {
    return {
      searchText: '',
      sugList: [],
      searchEngine: 'baidu'
    };
  },
  methods: {
    querySearch(queryString, cb) {
      // var restaurants = this.restaurants;
      // var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
      // // 调用 callback 返回建议列表的数据
      // cb(results);
      if (queryString.replace(EMPTY, '').length === 0) {
        cb(this.sugList)
        return
      }
      this.fetchBaiduSug(queryString)
      // this.fetchGoogleSug(queryString)
        .then(data => {
          this.sugList = data
          cb(data)
        })
    },
    createFilter(queryString) {
      return (restaurant) => {
        return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
      };
    },
    handleSelect(item) {
      const kw = item.value
      this.handleSearch(this.searchEngine)
      console.log(item);
    },
    handleEdit() {
      this.$emit('update:edit', !this.edit)
    },
    onSearchBaidu() {
      this.handleSearch('baidu')
      this.searchEngine = 'baidu'
    },
    onSearchGoogle() {
      this.handleSearch('google')
      this.searchEngine = 'google'
    },
    handleSearch(searchEngine) {
      return new Promise((resolve, reject) => {
        const keyword = this.searchText.replace(EMPTY, '')
        // if (!keyword || !keyword.length) {
        //   reject()
        //   return
        // }
        const ENGINE = {
          "baidu": 'https://www.baidu.com/s?ie=utf-8&wd=%s',
          "google": 'https://www.google.com/search?q=%s',
          "bing": 'https://cn.bing.com/search?q=%s'
        }
        const url = ENGINE[searchEngine]
        const searchUrl = url.replace('%s', encodeURIComponent(keyword))
        const newWindow = window.open(searchUrl);
        newWindow.focus();
        resolve()
      })
    },
    fetchBaiduSug(wd) {
      const url = `https://sp0.baidu.com/5a1Fazu8AA54nxGko9WTAnF6hhy/su?wd=${encodeURIComponent(wd)}&json=1`
      return new Promise(resolve => {
        getJSONP(url, 'cb').then(res => {
          const list = res.s.map(s => {
            return {
              value: s
            }
          })
          resolve(list)
        })
      })
    },
    fetchGoogleSug(wd) {
      const url = `https://www.google.com/complete/search?wd=${wd}&client=psy-ab&hl=zh-CN&gs_ri=psy-ab&cp=4&gs_id=&gr=&q=${encodeURIComponent(wd)}&xhr=t`
      return new Promise(resolve => {
        getJSONP(url, 'callback').then(data => {
          const list = []
          // res.s.map(s => {
          //   return {
          //     value: s
          //   }
          // })

          for (var i = 0; i < data[1].length && i < 5; i++) {
            list.push({
              value: data[1][i][0]
            });
          }
          resolve(list)
        })
      })
    }
  },
  mounted() {
  }
}
</script>

<style scoped>
  .header{
    padding-left: 20px;
    padding-right: 20px;
  }
  .header-row{
    min-width: 1024px;
    width: 60%;
    margin: 0 auto;
  }
.search-input{
  width: 400px;
}
</style>
