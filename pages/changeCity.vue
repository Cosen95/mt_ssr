<template>
  <div class="page-changeCity">
    <el-row>
      <el-col :span="24">
        <iSelect />
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <hot/>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24"/>
    </el-row>
  </div>
</template>

<script>
import iSelect from '@/components/changeCity/iselect.vue'
import Hot from '@/components/changeCity/hot.vue'
export default {
    components: {
        iSelect,
        Hot
    }
}
</script>

<style lang="css">

</style>

