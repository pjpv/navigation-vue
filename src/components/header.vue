<template>
  <div class="header">
    <el-row class="header-row" style="width: 984px;">
      <el-col :span="16" style="width: 590px;">
        <el-autocomplete
          ref="searchInput"
          v-model="searchText"
          :fetch-suggestions="querySearch"
          :clearable="true"
          :select-when-unmatched="true"
          :trigger-on-focus="true"
          :highlight-first-item="false"
          class="search-input"
          placeholder="请输入内容"
          @select="handleSelect"
        >
        </el-autocomplete>
        <el-button-group style="margin-left: 10px;">
          <el-button type="primary" @click="onSearchBaidu">百度</el-button>
          <el-button type="primary" @click="onSearchGoogle">Google</el-button>
        </el-button-group>
      </el-col>
      <el-col :span="8" style="text-align: right;width: 390px;float: right;">
        <el-alert v-if="edit"
                  :closable="false"
                  title="正在编辑"
                  type="warning"
                  show-icon
                  style="width: 200px;margin: 0 auto;display: inline-flex;float: left"
        >
        </el-alert>
        <el-button-group>
          <el-button
            v-if="edit"
            type="primary"
            icon="el-icon-plus"
            round
            @click="addDialogVisible = true"
            @focus.native="handleFocus"/>
          <el-button
            v-if="edit"
            type="primary"
            icon="el-icon-coin"
            round
            @click="handleExport"
            @focus.native="handleFocus"/>
          <el-button
            :icon="this.edit ? 'el-icon-close' : 'el-icon-edit'"
            type="primary"
            round
            @click="handleEdit"
            @focus.native="handleFocus"/>
        </el-button-group>
      </el-col>
    </el-row>
    <el-dialog
      title="导入导出"
      :visible.sync="dialogVisible"
      @open="loadData"
      width="30%">
      <el-input
        ref="textarea"
        :rows="10"
        type="textarea"
        placeholder="请输入内容"
        v-model="currentData">
      </el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="success" @click="handleDataCopy">复 制</el-button>
        <el-button type="primary" @click="handleDataPaste">粘 贴</el-button>
        <el-button type="warning" @click="handleDataUpdate">保 存</el-button>
      </span>
    </el-dialog>
    <el-dialog title="新增组" :close-on-click-modal="false" :visible.sync="addDialogVisible">
      <el-form :model="addForm">
        <el-form-item label="名称" label-width="80px">
          <el-input v-model="addForm.name" clearable></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="onAddGroup">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getJSONP } from '../Utils/jsonp'
import { getData, setData } from '../Utils/store'

const EMPTY = /(^\s*)|(\s*$)/g
export default {
  name: 'header.vue',
  props: {
    edit: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      searchText: '',
      sugList: [],
      searchEngine: 'baidu',
      dialogVisible: false,
      currentData: '{}',
      addDialogVisible: false,

      addForm: {
        name: '',
        url: '',
      },
    }
  },
  computed: {
    // data: {
    //   get() {
    //     const s = localStorage.getItem('sitelist')
    //     debugger
    //     return s
    //   },
    //   set(val) {
    //     debugger
    //     localStorage.setItem('sitelist', val)
    //   }
    // }
  },
  watch: {
    // '$refs.searchInput.highlightedIndex'(val,oVal) {
    //   debugger
    //   console.log(val, oVal)
    // }
  },
  created() {
    this.loadData()
  },
  methods: {
    querySearch(queryString, cb) {
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
    handleSelect() {
      this.handleSearch(this.searchEngine)
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
      return new Promise((resolve) => {
        const keyword = this.searchText.replace(EMPTY, '')
        // if (!keyword || !keyword.length) {
        //   reject()
        //   return
        // }
        const ENGINE = {
          'baidu': 'https://www.baidu.com/s?ie=utf-8&wd=%s',
          'google': 'https://www.google.com/search?q=%s',
          'bing': 'https://cn.bing.com/search?q=%s',
        }
        const url = ENGINE[searchEngine]
        const searchUrl = url.replace('%s', encodeURIComponent(keyword))
        const newWindow = window.open(searchUrl)
        newWindow.focus()
        resolve()
      })
    },
    fetchBaiduSug(wd) {
      const url = `https://sp0.baidu.com/5a1Fazu8AA54nxGko9WTAnF6hhy/su?wd=${encodeURIComponent(wd)}&json=1`
      return new Promise(resolve => {
        getJSONP(url, 'cb').then(res => {
          const list = res.s.map(s => {
            return {
              value: s,
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
              value: data[1][i][0],
            })
          }
          resolve(list)
        })
      })
    },
    handleExport() {
      this.dialogVisible = true
    },
    handleFocus(e) {
      e.target.blur()
    },
    loadData() {
      // this.currentData = localStorage.getItem('sitelist')
      getData().then(data => {
        this.currentData = data
      })
    },
    handleDataUpdate() {
      // localStorage.setItem('sitelist', this.currentData)
      setData(this.currentData)
        .then(() => {
          this.dialogVisible = false
          this.$emit('update')
          this.$message.success('修改成功')
        })
    },
    handleDataPaste() {

      const ele = this.$refs.textarea.$el.children[0]
      if (!ele) return
      try {
        ele.select()
        ele.readOnly = false
        if (document.execCommand('paste')) {
          this.$message.success('粘贴成功')
        } else {
          this.$message.error('粘贴失败')
        }
      } catch (e) {
        this.$message.success('粘贴失败')
      }
      ele.readOnly = true
    },
    handleDataCopy() {
      try {
        this.$refs.textarea.$el.children[0].select()
        document.execCommand('Copy') // 执行浏览器复制命令
        this.$message.success('复制成功')
      } catch (e) {
        this.$message.success('复制失败')
      }
    },
    onAddGroup() {
      this.$emit('addGroup', this.addForm.name)
    }
  },
  mounted() {
  },
}
</script>

<style scoped>
.header {
  padding-left: 20px;
  padding-right: 20px;
}

.header-row {
  /*min-width: 90%;*/
  width: 60%;
  margin: 0 auto;
}

.search-input {
  width: 400px;
}
</style>
