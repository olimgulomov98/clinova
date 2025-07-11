<template>
  <div class="card-container">
    <div class="image-section">
      <img src="https://www.shutterstock.com/image-photo/full-body-side-view-fun-600nw-2450166287.jpg" alt="">
    </div>
    <div class="title truncate">
      Anvar Abdullayev
    </div>
    <div class="description line-clamp-2">
      Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ab accusantium aliquid Lorem ipsum dolor sit amet,
      consectetur adipisicing elit. Consectetur enim ipsam magnam officia officiis quibusdam quidem rerum soluta
      voluptates. Repudiandae!
    </div>
    <div class="card-footer">
      <div class="avatar-group">
        <div class="avatar"></div>
        <div class="avatar"></div>
        <div class="avatar"></div>
        <div class="avatar"></div>
        <div class="avatar"></div>
        <el-dropdown>
          <div class="more">+10 others</div>
          <template #dropdown>
            <el-dropdown-menu class="!p-0">
              <el-dropdown-item>
                <div class="dropdown-item">
                  <div class="avatar"></div>
                  <div class="person-name truncate">
                    Sherzod Shukurovich
                  </div>
                </div>
              </el-dropdown-item>
              <el-dropdown-item>
                <div class="dropdown-item">
                  <div class="avatar"></div>
                  <div class="person-name truncate">
                    Sherzod Shukurovich
                  </div>
                </div>
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>

      <v-button type="primary" @click="navigateTo('/departments/detail')">
        See Detail
      </v-button>
    </div>
  </div>
</template>

<script setup lang="ts">

</script>

<style scoped lang="scss">
.card-container {
  width: 100%;
  border: 1px solid #E6E6E7;
  border-radius: 16px;
  display: flex;
  flex-flow: column;
  gap: 12px;
  padding: 12px;

  .image-section {
    width: 100%;
    border-radius: 12px;
    height: 230px;
    background: #e5e5e5;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: 12px;
    }
  }

  .title {
    font-size: 16px;
    font-family: "SourceSans3", sans-serif;
    font-weight: 600;
    color: #05080B;
  }

  .description {
    font-weight: 400;
    font-family: "SourceSans3", sans-serif;
    font-size: 14px;
    color: #87888A;
  }

  .card-footer {
    padding-top: 12px;
    border-top: 1px solid #E6E6E7;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .avatar-group {
      display: flex;
      align-items: center;

      .avatar {
        width: 24px;
        height: 24px;
        border: 1px solid #ffffff;
        border-radius: 50%;
        background-color: #aef5f5;
        margin-left: -6px;
        box-shadow: 0 0 0 1px #e0e0e0;

        &:first-child {
          margin-left: 0;
        }
      }

      .avatar:hover{
        z-index: 2;
      }

      .more {
        font-family: "SourceSans3", sans-serif;
        font-weight: 400;
        font-size: 12px;
        line-height: 150%;
        margin-left: 8px;
        white-space: nowrap;
        color: #87888A;
        cursor: pointer;
        outline: none;
      }

      .dropdown-item{
        display: flex;
        align-items: center;
        gap: 0 12px;

        .avatar {
          width: 24px;
          height: 24px;
          border: 1px solid #ffffff;
          border-radius: 50%;
          background-color: #aef5f5;
          margin-left: -6px;
          box-shadow: 0 0 0 1px #e0e0e0;

          &:first-child {
            margin-left: 0;
          }
        }

        .person-name{
          font-family: "SourceSans3", sans-serif;
          font-weight: 400;
          font-size: 12px;
          line-height: 150%;
          margin-left: 8px;
          white-space: nowrap;
          color: #05080B;
        }
      }
    }

  }
}
</style>