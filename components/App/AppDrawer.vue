<script setup lang="ts">
import AppDrawerItem from "~/components/App/AppDrawerItem.vue";

const drawerState = useState('drawer', () => false);
const { mobile, lgAndUp, width } = useDisplay();

const drawer = computed({
  get() {
    return drawerState.value || !mobile.value;
  },
  set(val: boolean) {
    drawerState.value = val;
  },
});

const rail = computed(() => !drawerState.value && !mobile.value);
const router = useRouter();
const { user } = useUserSession();

const routes = router.getRoutes().filter((r) => {
  const isTopLevel = r.path.lastIndexOf('/') === 0;

  if (r.meta?.requiredRoles) {
    const required = r.meta.requiredRoles;
    if (!user.value?.roles?.some((role: string) => required.includes(role))) {
      return false;
    }
  }

  return isTopLevel;
});

routes.sort((a, b) => (a.meta?.drawerIndex ?? 99) - (b.meta?.drawerIndex ?? 98));
const currentYear = new Date().getFullYear();
</script>

<template>
  <v-navigation-drawer
    v-model="drawer"
    :expand-on-hover="rail"
    :rail="rail"
    floating
  >
    <template #prepend>
      <v-list role="navigation" aria-label="Navigation">
        <v-list-item
          class="pa-1"
          :to="{ path: '/home' }"
          link
          aria-label="Go to the Bro World homepage"
          icon
          title="Open navigation menu"
        >
          <template #prepend>
            <v-icon
              icon="custom:world-logo"
              size="x-large"
              class="drawer-header-icon"
              color="primary"
              aria-hidden="true"
            />
          </template>
          <v-list-item-title
            class="text-h5 font-weight-bold"
            style="line-height: 2rem"
          >
            Bro <span class="text-primary">World</span>
          </v-list-item-title>
        </v-list-item>
      </v-list>
    </template>

    <v-list nav density="default">
      <AppDrawerItem
        v-for="route in routes"
        :key="route.name"
        :item="route"
        class="mb-2"
      />
    </v-list>

    <v-spacer />

    <template #append>
      <v-list-item class="drawer-footer px-0 d-flex flex-column justify-center">
        <div class="text-caption pt-6 pt-md-0 text-center text-no-wrap">
          &copy; {{ currentYear }} Copyright
          <a
            href="https://github.com/rami-aouinti"
            class="font-weight-bold text-primary"
            target="_blank"
          >
            Rami Aouinti
          </a>
        </div>
      </v-list-item>
    </template>
  </v-navigation-drawer>
</template>


<style scoped>
.v-navigation-drawer {
  transition-property: box-shadow, transform, visibility, width, height, left,
  right, top, bottom, border-radius;
  overflow: hidden;

  &.v-navigation-drawer--rail {
    border-top-right-radius: 0px;
    border-bottom-right-radius: 0px;

    &.v-navigation-drawer--is-hovering {
      border-top-right-radius: 15px;
      border-bottom-right-radius: 15px;
      box-shadow:
        0px 1px 2px rgba(0, 0, 0, 0.3),
        0px 1px 3px 1px rgba(0, 0, 0, 0.15);
    }

    &:not(.v-navigation-drawer--is-hovering) {
      .drawer-footer {
        transform: translateX(-160px);
      }

      .drawer-header-icon {
        height: 1em;
        width: 1em;
      }

      .v-list-group {
        --list-indent-size: 0px;
        --prepend-width: 0px;
      }
    }
  }

  .v-navigation-drawer__content {
    overflow-y: auto;
    @supports (scrollbar-gutter: stable) {
      scrollbar-gutter: stable;
      > .v-list--nav {
        padding-right: 0;
      }
    }

    &:hover {
      overflow-y: overlay;
    }
  }

  .drawer-footer {
    transition: transform 0.2s ease;
    min-height: 30px;
  }

  .drawer-header-icon {
    opacity: 1;
    height: 1.2em;
    width: 1.2em;
    transition: transform 0.2s ease, opacity 0.2s ease;
    margin-right: -10px;
  }

  .v-list-group {
    --prepend-width: 10px;
  }

  .v-list-item {
    transition: background-color 0.2s ease, transform 0.2s ease;
  }
}
</style>

