<template>
  <Menu class="personal-center-menu" theme="light" :active-name="currentSetting" @on-select="handleSelect">
    <MenuGroup title="个人中心">
      <MenuItem name="profileSettings">
        <Icon type="information"></Icon>
        个人信息
      </MenuItem>
      <MenuItem name="passwordSet">
        <Icon type="key"></Icon>
        修改密码
      </MenuItem>
    </MenuGroup>
  </Menu>
</template>

<script>
  export default {
    props:{
      currentSetting: {
        type: String,
        required: true
      },
    },
    methods: {
      handleSelect(name) {
        this.$router.push({name: name});
      }
    }
  }
</script>

<style lang="less">
  .personal-center-menu {
    border: solid 1px #dddee1;
    width: auto !important;
    /*border-radius: 20px;*/
  }
</style>
