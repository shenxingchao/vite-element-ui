<template>
  <div class="dashboard-container">
    <el-alert class="dashboard-container-text" title="vite-element-ui 发布啦" type="success">
    </el-alert>
    <el-row :gutter="24">
      <el-col :md="4" :sm="8" :xs="12">
        <el-row class="item-box item-box-one" type="flex">
          <el-col class="item-box-left" :span="8">
            <el-row class="item-box-left-item" justify="center" align="middle" type="flex">
              <el-icon class="icon">
                <goods />
              </el-icon>
            </el-row>
          </el-col>
          <el-col class="item-box-right" :span="16">
            <el-container direction="vertical">
              <el-row class="item-box-right-number" justify="center" type="flex">
                929
              </el-row>
              <el-row class="item-box-right-text" justify="center" type="flex">
                上新
              </el-row>
            </el-container>
          </el-col>
        </el-row>
      </el-col>
      <el-col :md="4" :sm="8" :xs="12">
        <el-row class="item-box item-box-two" type="flex">
          <el-col class="item-box-left" :span="8">
            <el-row class="item-box-left-item" justify="center" align="middle" type="flex">
              <el-icon class="icon">
                <document />
              </el-icon>
            </el-row>
          </el-col>
          <el-col class="item-box-right" :span="16">
            <el-container direction="vertical">
              <el-row class="item-box-right-number" justify="center" type="flex">
                999+
              </el-row>
              <el-row class="item-box-right-text" justify="center" type="flex">
                消息
              </el-row>
            </el-container>
          </el-col>
        </el-row>
      </el-col>
      <el-col :md="4" :sm="8" :xs="12">
        <el-row class="item-box item-box-three" type="flex">
          <el-col class="item-box-left" :span="8">
            <el-row class="item-box-left-item" justify="center" align="middle" type="flex">
              <el-icon class="icon">
                <picture-rounded />
              </el-icon>
            </el-row>
          </el-col>
          <el-col class="item-box-right" :span="16">
            <el-container direction="vertical">
              <el-row class="item-box-right-number" justify="center" type="flex">
                5547
              </el-row>
              <el-row class="item-box-right-text" justify="center" type="flex">
                图库
              </el-row>
            </el-container>
          </el-col>
        </el-row>
      </el-col>
      <el-col :md="4" :sm="8" :xs="12">
        <el-row class="item-box item-box-four" type="flex">
          <el-col class="item-box-left" :span="8">
            <el-row class="item-box-left-item" justify="center" align="middle" type="flex">
              <el-icon class="icon">
                <link />
              </el-icon>
            </el-row>
          </el-col>
          <el-col class="item-box-right" :span="16">
            <el-container direction="vertical">
              <el-row class="item-box-right-number" justify="center" type="flex">
                165
              </el-row>
              <el-row class="item-box-right-text" justify="center" type="flex">
                链接
              </el-row>
            </el-container>
          </el-col>
        </el-row>
      </el-col>
      <el-col :md="4" :sm="8" :xs="12">
        <el-row class="item-box item-box-fine" type="flex">
          <el-col class="item-box-left" :span="8">
            <el-row class="item-box-left-item" justify="center" align="middle" type="flex">
              <el-icon class="icon">
                <lollipop />
              </el-icon>
            </el-row>
          </el-col>
          <el-col class="item-box-right" :span="16">
            <el-container direction="vertical">
              <el-row class="item-box-right-number" justify="center" type="flex">
                929
              </el-row>
              <el-row class="item-box-right-text" justify="center" type="flex">
                分类
              </el-row>
            </el-container>
          </el-col>
        </el-row>
      </el-col>
      <el-col :md="4" :sm="8" :xs="12">
        <el-row class="item-box item-box-six" type="flex">
          <el-col class="item-box-left" :span="8">
            <el-row class="item-box-left-item" justify="center" align="middle" type="flex">
              <el-icon class="icon">
                <timer />
              </el-icon>
            </el-row>
          </el-col>
          <el-col class="item-box-right" :span="16">
            <el-container direction="vertical">
              <el-row class="item-box-right-number" justify="center" type="flex">
                10
              </el-row>
              <el-row class="item-box-right-text" justify="center" type="flex">
                计划
              </el-row>
            </el-container>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
    <el-row :gutter="24" class="dashboard-container-other">
      <el-col :span="24">
        <el-calendar>
          <template #dateCell="{data}">
            <p :class="data.isSelected ? 'is-selected' : ''">
              {{ data.day.split('-').slice(1).join('-') }} {{ data.isSelected ? '✔️' : '' }}
            </p>
          </template>
        </el-calendar>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: 'Dashboard',
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 10px 30px;
    &-text {
      margin-bottom: 10px;
    }
    &-other {
      margin-top: 10px;
    }
    .item-box-one {
      .item-box-left {
        background: rgb(45, 140, 240);
      }
    }
    .item-box-two {
      .item-box-left {
        background: rgb(25, 190, 107);
      }
    }
    .item-box-three {
      .item-box-left {
        background: rgb(255, 153, 0);
      }
    }
    .item-box-four {
      .item-box-left {
        background: rgb(237, 63, 20);
      }
    }
    .item-box-fine {
      .item-box-left {
        background: rgb(228, 108, 187);
      }
    }
    .item-box-six {
      .item-box-left {
        background: rgb(154, 102, 228);
      }
    }
    .item-box {
      background: #ffffff;
      border: $border;
      height: 100%;
      border-radius: 4px;
      overflow: hidden;
      &-left {
        padding: 30px 0;
        &-item {
          .icon {
            font-size: 40px;
            color: #ffffff;
          }
        }
      }
      &-right {
        height: 100%;
        .el-container {
          height: 100%;
        }
        &-number,
        &-text {
          display: flex;
          align-items: center;
        }
        &-number {
          font-size: 40px;
          color: $h3c;
          flex: 0 0 66%;
        }
        &-text {
          color: $h3c;
          flex: 1;
        }
      }
    }
  }
}
</style>