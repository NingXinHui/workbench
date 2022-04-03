<template>
  <div v-if="!item.hidden">
    <template v-if="hasOneShowingChild(item.list,item) && (!onlyOneChild.list||onlyOneChild.noShowingchildrenList)">
      <!-- <app-link v-if="onlyOneChild.meta" :to="resolvePath(onlyOneChild.path)"> -->
      <el-menu-item :index="onlyOneChild.id"
                    :class="{'submenu-title-noDropdown':!isNest}">
        <item :title="onlyOneChild.regionName" />
      </el-menu-item>
      <!-- </app-link> -->
    </template>

    <el-submenu v-else
                ref="subMenu"
                :index="onlyOneChild.typeNo"
                popper-append-to-body>
      <template slot="title">
        <item :title="item.typeName" />
        <!-- <spam>烂到底</spam> -->
      </template>
      <sidebar-item v-for="child in item.list"
                    :key="child.typeNo"
                    :is-nest="true"
                    :item="child"
                    :base-path="resolvePath(child.path)"
                    class="nest-menu" />
    </el-submenu>
  </div>
</template>

<script>
import path from 'path'
import { isExternal } from '@/utils/validate'
import Item from './Item'
// import AppLink from './Link'
// import FixiOSBug from './FixiOSBug'

export default {
  name: 'SidebarItem',
  components: { Item },
  // mixins: [FixiOSBug],
  props: {
    // route object
    item: {
      type: Object,
      required: true
    },
    isNest: {
      type: Boolean,
      default: false
    },
    basePath: {
      type: String,
      default: ''
    }
  },
  data () {
    this.onlyOneChild = null
    return {}
  },
  methods: {
    hasOneShowingChild (childrenList = [], parent) {
      const showingchildrenList = childrenList.filter(item => {
        if (item.hidden) {
          return false
        } else {
          // Temp set(will be used if only has one showing child)
          this.onlyOneChild = item
          return true
        }
      })

      // When there is only one child router, the child router is displayed by default
      if (showingchildrenList.length === 1) {
        return true
      }

      // Show parent if there are no child router to display
      if (showingchildrenList.length === 0) {
        this.onlyOneChild = { ...parent, path: '', noShowingchildrenList: true }
        return true
      }

      return false
    },
    resolvePath (routePath) {
      // if (isExternal(routePath)) {
      //   return routePath
      // }
      // if (isExternal(this.basePath)) {
      //   return this.basePath
      // }
      // return path.resolve(this.basePath, routePath)
    }
  }
}
</script>
