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
      // this.fetchBaiduSug(queryString)
      this.fetchGoogleSug(queryString)
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
    loadAll() {
      return [
        { "value": "三全鲜食（北新泾店）", "address": "长宁区新渔路144号" },
        { "value": "Hot honey 首尔炸鸡（仙霞路）", "address": "上海市长宁区淞虹路661号" },
        { "value": "新旺角茶餐厅", "address": "上海市普陀区真北路988号创邑金沙谷6号楼113" },
        { "value": "泷千家(天山西路店)", "address": "天山西路438号" },
        { "value": "胖仙女纸杯蛋糕（上海凌空店）", "address": "上海市长宁区金钟路968号1幢18号楼一层商铺18-101" },
        { "value": "贡茶", "address": "上海市长宁区金钟路633号" },
        { "value": "豪大大香鸡排超级奶爸", "address": "上海市嘉定区曹安公路曹安路1685号" },
        { "value": "茶芝兰（奶茶，手抓饼）", "address": "上海市普陀区同普路1435号" },
        { "value": "十二泷町", "address": "上海市北翟路1444弄81号B幢-107" },
        { "value": "星移浓缩咖啡", "address": "上海市嘉定区新郁路817号" },
        { "value": "阿姨奶茶/豪大大", "address": "嘉定区曹安路1611号" },
        { "value": "新麦甜四季甜品炸鸡", "address": "嘉定区曹安公路2383弄55号" },
        { "value": "Monica摩托主题咖啡店", "address": "嘉定区江桥镇曹安公路2409号1F，2383弄62号1F" },
        { "value": "浮生若茶（凌空soho店）", "address": "上海长宁区金钟路968号9号楼地下一层" },
        { "value": "NONO JUICE  鲜榨果汁", "address": "上海市长宁区天山西路119号" },
        { "value": "CoCo都可(北新泾店）", "address": "上海市长宁区仙霞西路" },
        { "value": "快乐柠檬（神州智慧店）", "address": "上海市长宁区天山西路567号1层R117号店铺" },
        { "value": "Merci Paul cafe", "address": "上海市普陀区光复西路丹巴路28弄6号楼819" },
        { "value": "猫山王（西郊百联店）", "address": "上海市长宁区仙霞西路88号第一层G05-F01-1-306" },
        { "value": "枪会山", "address": "上海市普陀区棕榈路" },
        { "value": "纵食", "address": "元丰天山花园(东门) 双流路267号" },
        { "value": "钱记", "address": "上海市长宁区天山西路" },
        { "value": "壹杯加", "address": "上海市长宁区通协路" },
        { "value": "唦哇嘀咖", "address": "上海市长宁区新泾镇金钟路999号2幢（B幢）第01层第1-02A单元" },
        { "value": "爱茜茜里(西郊百联)", "address": "长宁区仙霞西路88号1305室" },
        { "value": "爱茜茜里(近铁广场)", "address": "上海市普陀区真北路818号近铁城市广场北区地下二楼N-B2-O2-C商铺" },
        { "value": "鲜果榨汁（金沙江路和美广店）", "address": "普陀区金沙江路2239号金沙和美广场B1-10-6" },
        { "value": "开心丽果（缤谷店）", "address": "上海市长宁区威宁路天山路341号" },
        { "value": "超级鸡车（丰庄路店）", "address": "上海市嘉定区丰庄路240号" },
        { "value": "妙生活果园（北新泾店）", "address": "长宁区新渔路144号" },
        { "value": "香宜度麻辣香锅", "address": "长宁区淞虹路148号" },
        { "value": "凡仔汉堡（老真北路店）", "address": "上海市普陀区老真北路160号" },
        { "value": "港式小铺", "address": "上海市长宁区金钟路968号15楼15-105室" },
        { "value": "蜀香源麻辣香锅（剑河路店）", "address": "剑河路443-1" },
        { "value": "北京饺子馆", "address": "长宁区北新泾街道天山西路490-1号" },
        { "value": "饭典*新简餐（凌空SOHO店）", "address": "上海市长宁区金钟路968号9号楼地下一层9-83室" },
        { "value": "焦耳·川式快餐（金钟路店）", "address": "上海市金钟路633号地下一层甲部" },
        { "value": "动力鸡车", "address": "长宁区仙霞西路299弄3号101B" },
        { "value": "浏阳蒸菜", "address": "天山西路430号" },
        { "value": "四海游龙（天山西路店）", "address": "上海市长宁区天山西路" },
        { "value": "樱花食堂（凌空店）", "address": "上海市长宁区金钟路968号15楼15-105室" },
        { "value": "壹分米客家传统调制米粉(天山店)", "address": "天山西路428号" },
        { "value": "福荣祥烧腊（平溪路店）", "address": "上海市长宁区协和路福泉路255弄57-73号" },
        { "value": "速记黄焖鸡米饭", "address": "上海市长宁区北新泾街道金钟路180号1层01号摊位" },
        { "value": "红辣椒麻辣烫", "address": "上海市长宁区天山西路492号" },
        { "value": "(小杨生煎)西郊百联餐厅", "address": "长宁区仙霞西路88号百联2楼" },
        { "value": "阳阳麻辣烫", "address": "天山西路389号" },
        { "value": "南拳妈妈龙虾盖浇饭", "address": "普陀区金沙江路1699号鑫乐惠美食广场A13" }
      ];
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
        const searchUrl = url.replace('%s', encodeURI(keyword))
        const newWindow = window.open(searchUrl);
        newWindow.focus();
        resolve()
      })
    },
    fetchBaiduSug(wd) {
      const url = `https://sp0.baidu.com/5a1Fazu8AA54nxGko9WTAnF6hhy/su?wd=${wd}&json=1`
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
      const url = `https://www.google.com/complete/search?wd=${wd}&client=psy-ab&hl=zh-CN&gs_ri=psy-ab&cp=4&gs_id=&gr=&q=${wd}&xhr=t`
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
    this.restaurants = this.loadAll();
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
