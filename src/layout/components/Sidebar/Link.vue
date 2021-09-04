<template>
  <component :is="type" v-bind="linkProps(to)">
    <slot />
  </component>
</template>

<script>
import { computed, defineComponent, reactive, toRefs } from 'vue'
import { isExternal } from '@/utils/validate'

export default defineComponent({
  components: {},
  props: {
    to: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const set = reactive({
      isExternal: computed(() => {
        return isExternal(props.to)
      }),
      type: computed(() => {
        if (props.isExternal) {
          return 'a'
        }
        return 'router-link'
      }),
    })

    const linkProps = (to) => {
      if (set.isExternal) {
        return {
          href: to,
          target: '_blank',
          rel: 'noopener',
        }
      }
      return {
        to: to,
      }
    }

    return {
      ...toRefs(set),
      linkProps,
    }
  },
})
</script>