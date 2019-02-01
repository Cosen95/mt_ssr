<template>
  <div class="m-iselect">
    <span class="name">按省份选择：</span>
    <el-select
      v-model="pvalue"
      placeholder="省份">
      <el-option
        v-for="item in province"
        :key="item.value"
        :label="item.label"
        :value="item.value"/>   
    </el-select>
    <el-select
      v-model="cvalue"
      :disabled="!city.length"
      placeholder="城市">
      <el-option
        v-for="item in city"
        :key="item.value"
        :label="item.label"
        :value="item.value" />
    </el-select>
    <el-autocomplete
      v-model="input"
      placeholder="请输入城市中文或拼音" />
  </div>
</template>

<script>
import _ from 'lodash'
export default {
    data() {
        return {
            province: [],
            pvalue: '',
            city: [],
            cvalue: '',
            input: '',
        }
    }
}
</script>

<style lang="scss">
    @import "@/assets/css/changeCity/iselect.scss"
</style>


