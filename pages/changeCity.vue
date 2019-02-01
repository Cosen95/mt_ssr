<template>
  <div class="page-changeCity">
    <el-row>
      <el-col :span="24">
        <iSelect />
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24"/>
    </el-row>
    <el-row>
      <el-col :span="24"/>
    </el-row>
  </div>
</template>

<script>
import iSelect from '@/components/changeCity/iselect.vue'
export default {
    components: {
        iSelect
    }
}
</script>

<style lang="css">

</style>

