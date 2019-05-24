<template>
  <div class="site-group">
    <el-row style="text-align: left;">
      <el-button class="title-btn" @click="onClickTitle">{{ this.data.title }}</el-button>
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
      >{{ c.name }}</div>
    </el-row>

    <el-dialog :title="editGroupTitle? '编辑 - '+ this.data.title : editTitle" :visible.sync="dialogVisible">
      <el-form :model="form">
        <el-form-item label="名称" label-width="80px">
          <el-input v-model="form.name" clearable></el-input>
        </el-form-item>
        <el-form-item v-if="!editGroupTitle" label="网址" label-width="80px">
          <el-input v-model="form.url" clearable>
            <el-select v-model="protocol" slot="prepend" placeholder="请选择" style="width: 100px;">
              <el-option label="http://" :value="0"></el-option>
              <el-option label="https://" :value="1"></el-option>
            </el-select>
          </el-input>

        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="onSave">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  const REG_HTTP = new RegExp(/^http:\/\//)
  const REG_HTTPS = new RegExp(/^https:\/\//)
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
        protocol: 1,
        form: {
          name: '',
          url: ''
        }
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
      'form.url'(val) {
        if (val.match(REG_HTTP)) {
          this.form.url = val.replace(REG_HTTP, '')
          this.protocol = 0
        } else if(val.match(REG_HTTPS)) {
          this.form.url = val.replace(REG_HTTPS, '')
          this.protocol = 1
        }
      }
    },
    mounted() {
      this.initData()
      // this.siteList = [...Array(9)].map(() => {
      //   return {
      //     url: '',
      //     name: 'none',
      //   }
      // })
      // this.initData()
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
          window.open(item.url)
        }
      },
      onSave() {
        if (this.editGroupTitle){
          this.siteList.title = this.form.name
        } else {
          const protocol = this.protocol === 1 ? 'https://' : 'http://'
          this.siteList.data[this.editIndex].name = this.form.name
          this.siteList.data[this.editIndex].url = protocol + this.form.url
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
      }
    }
  }
</script>

<style lang="scss" scoped>
  .site-group {
    margin: 10px 5px;
    .website-row {
      .website{
        display: inline-block;
        margin: 2px;
        background: #FFF;
        border: 1px solid #DCDFE6;
        color: #606266;
        width: calc(33% - 15px);
        /*width: 100px;*/
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        padding-left: 5px;
        padding-right: 5px;
        min-height: 45px;
        height: 45px;
        line-height: 45px;
        border-radius: 4px;
        cursor: pointer;
        user-select: none;
        font-size: 14px;

        transition-property: background-color, color, font-size;
        transition-duration: 0.2s;
        transition-timing-function: ease;
        &.none {
          background: transparent;
          border: 1px solid transparent;
        }
        &:hover{
          font-size: 17px;
          color: #409EFF;
          border-color: #c6e2ff;
          background-color: #ecf5ff;
        }
        span{
          font-size: inherit;
        }
      }
    }
    &:hover{
      .website.none, .title-btn {
        background: #FFF;
        border: 1px solid #DCDFE6;
        color: #606266;
      }
    }

    .title-btn{
      background: transparent;
      border: none;
      color: white;
      /*margin-left: 5px;*/
      text-shadow: 1px 1px 4px white;
      min-width: 33%;
      max-width: 90%;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      height: 40px;
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
