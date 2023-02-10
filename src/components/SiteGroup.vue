<template>
  <div class="site-group">
    <el-row style="text-align: left;">
      <el-button class="title-btn" @click="onClickTitle">{{ this.data.title }}</el-button>
      <el-button-group>
        <el-button
          v-if="edit"
          type="primary"
          icon="el-icon-plus"
          round
          @click="onAddItem"
          @focus.native="handleFocus"/>
        <el-button
          v-if="edit"
          type="primary"
          icon="el-icon-close"
          round
          style=""
          @click="onDeleteGroup"
          @focus.native="handleFocus"/>
      </el-button-group>
    </el-row>
    <el-row v-for="(row,i) in tableData" :key="i" class="website-row">
      <div
        v-for="(c, j) in row"
        :key="j"
        :class="{
          'none': !c.name
        }"
        class="website"
        @click="onClick(c, i*3+j)"
      >{{ c.name }}
        <el-icon
          v-if="edit"
          type="primary"
          class="el-icon-close"
          round
          style="    float: right;"
          @click.native="(e) => onDelete(e, i*3+j)"
          @focus.native="handleFocus"/>
        </div>
    </el-row>

    <el-dialog :title="editGroupTitle? '编辑 - '+ this.data.title : editTitle" :close-on-click-modal="false" :visible.sync="dialogVisible">
      <el-form :model="form">
        <el-form-item label="名称" label-width="80px">
          <el-input v-model="form.name" clearable></el-input>
        </el-form-item>
        <el-form-item v-if="!editGroupTitle" label="网址" label-width="80px">
          <el-input v-model="form.url" clearable>
          </el-input>

        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="onSave">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="新增网址" :close-on-click-modal="false" :visible.sync="addDialogVisible">
      <el-form :model="addForm">
        <el-form-item label="名称" label-width="80px">
          <el-input v-model="addForm.name" clearable></el-input>
        </el-form-item>
        <el-form-item label="网址" label-width="80px">
          <el-input v-model="addForm.url" clearable></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="onAddWebsite">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import request from '../Utils/http'
  const REG_HTTP = new RegExp(/^http:\/\/.+/)
  const REG_HTTPS = new RegExp(/^https:\/\/.+/)
  // const REG_OTHER = new RegExp(/^(.+?:\/\/).*/)
  const REG_URL = new RegExp(/^([a-zA-z]+:\/\/)(.+)/)
  export default {
    name: "SiteGroup",
    props: {
      data: {
        type: Object,
        default: () => {
        }
        //   [...Array(9)].map(() => {
        //   return {
        //     url: '',
        //     name: 'none',
        //   }
        // })
      },
      edit: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        siteList: this.data,
        tableData: [],
        dialogVisible: false,
        editIndex: 0,
        editGroupTitle: false,
        form: {
          name: '',
          url: ''
        },
        addForm: {
          name: '',
          url: '',
        },
        addDialogVisible: false,
      }
    },
    computed: {
      editTitle() {
        const item = this.siteList.data[this.editIndex]
        return item ? ('编辑 - ' + item.name) : '新增'
      }
    },
    watch: {
      data(val) {
        this.siteList = val
        this.initData()
      },
      siteList: {
        deep: true,
        handler(val){
          this.$emit('update:data', val)
        }
      },
    },
    mounted() {
      this.initData()
    },
    methods: {

      initData() {
        const { title, data } = this.data
        const arr = []
        let j = -1
        if (!data) return []
        for (let i = 0; i < data.length; i++) {
          if (i % 3 === 0) {
            j += 1
            arr.push([])
          }
          arr[j].push(data[i])
        }
        this.tableData = arr
      },
      onClick(item, i) {
        console.log(item, i)
        if (this.edit){
          this.editGroupTitle = false
          this.editIndex = i
          this.form.name = this.siteList.data[i].name
          this.form.url = this.siteList.data[i].url
          this.dialogVisible = true
          return
        }
        // item.name += 'aaa'
        if (item.url) {
          const url = item.url
          // if (/^(chrome|chrome-extension):\/\/.*/.test(item.url)) {
          //   chrome.tabs.update({ url: item.url })
          // } else {
          //   window.open(item.url)
          // }
          if (REG_URL.test(url)) {
            if (REG_HTTPS.test(url) || REG_HTTP.test(url)) {
              window.open(url)
            } else {
              chrome.tabs.create({ url: item.url })
            }
          }
        }
      },
      onSave() {
        if (this.editGroupTitle){
          this.siteList.title = this.form.name
        } else {
          this.siteList.data[this.editIndex].name = this.form.name
          this.siteList.data[this.editIndex].url = this.form.url
        }
        this.dialogVisible = false
      },
      onClickTitle() {
        if (this.edit){
          this.editGroupTitle = true
          this.form.name = this.data.title
          this.dialogVisible = true
          return
        }
      },
      onChangeUrl(url) {
        if (url.replace(/ /g, '').length === 0) {
          return
        }
        let u = url
        if ((REG_HTTP.test(u) || REG_HTTPS.test(u)) && REG_URL.test(u)) {
          this.getTitle(u).then(title => {
            this.form.name = title
          })
        }
      },
      getTitle(url) {
        return new Promise((resolve) => {
          request.get(url).then(res => {
            // eslint-disable-next-line no-useless-escape
            const r = res.data.match(/\<title\>(.*?)\<\/title\>/)
            if (r) {
              resolve(r[1])
            }
          })
        })
      },
      handleFocus(e) {
        e.target.blur()
      },
      onDeleteGroup() {
        this.$emit('deleteGroup')
      },
      onAddItem() {
        this.addDialogVisible = true
      },
      onAddWebsite() {
        const { name, url } = this.addForm
        console.log('onAddWebsite', name, url)
        this.addDialogVisible = false
        this.siteList.data.push({
          name,
          url
        })
        this.addForm.name = ''
        this.addForm.url = ''
        this.initData()
        this.$forceUpdate()
      },
      onDelete(e, i) {
        console.log('onDelete', e, i)
        e.stopPropagation()
        e.preventDefault()
        this.siteList.data.splice(i, 1)
        this.initData()
        this.$forceUpdate()
      }
    }
  }
</script>

<style lang="scss" scoped>
  .site-group {
    margin: 10px 5px;
    .website-row {
      padding-right: 30px;
      .website{
          display: inline-block;
          margin: 2px;
          background: #fff;
          border: 1px solid #dcdfe6;
          border: none;
          color: #606266;
          width: calc(33% - 15px);
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          padding-left: 10px;
          padding-right: 10px;
          height: auto;
          line-height: 1.3;
          border-radius: 4px;
          cursor: pointer;
          -webkit-user-select: none;
          -moz-user-select: none;
          -ms-user-select: none;
          user-select: none;
          font-size: 14px;
          font-weight: bold;
          -webkit-transition-property: background-color, color, font-size;
          transition-property: background-color, color, font-size;
          -webkit-transition-duration: .2s;
          transition-duration: .2s;
          -webkit-transition-timing-function: ease;
          transition-timing-function: ease;
          width: 100%;
          text-align: left;
          background: transparent;
          color: #FFFFFF;
        &.none {
          background: transparent;
          border: 1px solid transparent;
          display: none;
        }
        &:hover{
          font-size: 17px;
          /*color: #409EFF;*/
          /*border-color: #c6e2ff;*/
          /*background-color: #ecf5ff;*/
          color: #ffffff;
          border-color: #c6e2ff00;
          background-color: #ecf5ff40;
          box-shadow: inset 0 0 2px 1px #ffffff1f;
        }
        span{
          font-size: inherit;
        }
      }
    }
    &:hover{
      .website.none, .title-btn {
        /*background: #FFF;*/
        /*border: 1px solid #DCDFE6;*/
        /*color: #606266;*/
      }
    }

    .title-btn{
      background: transparent;
      border: none;
      color: white;
      /*margin-left: 5px;*/
      /*text-shadow: 1px 1px 4px white;*/
    min-width: 33%;
    max-width: 90%;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    height: 40px;
    font-weight: 700;
    font-size: 15px;
    text-align: left;
    background-color: hsla(0, 0%, 100%, .02)
      &:hover{
        color: #409EFF;
        border-color: #c6e2ff;
        background-color: #ecf5ff;
      }
    }
  }
  .el-button{
    margin: 1px 1px;
  }

</style>
