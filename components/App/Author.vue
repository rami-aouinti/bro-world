<script setup lang="ts">
import UserAvatar from "~/components/App/UserAvatar.vue";
import RelativeTime from "~/components/App/RelativeTime.vue";
import { useI18n } from 'vue-i18n';
import { useLocalePath } from '#i18n';
import { useUserStore } from "~/stores/useUserStore";
import UserHoverCard from "~/components/App/UserHoverCard.vue";

const props = defineProps<{ user: any, publishedAt: any, size: any }>();
const emit = defineEmits(['post-delete', 'post-updated']);

const { t } = useI18n();
const localePath = useLocalePath();
const { user, loggedIn } = await useUserSession();
const router = useRouter();
const route = useRoute();
const userStore = useUserStore();
const theme = useTheme()
const isDark = computed({
  get() {
    return theme.global.name.value === 'dark'
  },
  set(v) {
    theme.global.name.value = v ? 'dark' : 'light'
  },
})
const relationStatus = ref<number | null>(null); // 0: none, 1: follower, 2: following, 3: friend
const loading = ref(true);
const loadingReject = ref(false);
const files = ref<File[]>([]);

const showFriendsCard = ref(false)
const showMenuCard = ref(false)

function toggleFriends() {
  showFriendsCard.value = !showFriendsCard.value
  showMenuCard.value = false
}

function onAction(action: string) {
  console.log('Action:', action)
  showFriendsCard.value = false
  showMenuCard.value = false

  if (action === 'sendMessage') {
    navigateTo(`/inbox/${props.user.firstName.toLowerCase()}`) // ou user.id
  }
}

const refreshUser = async (userId: string, userName: string) => {
  await userStore.fetchProfile(userId, userName);
};

const changeFollowStatus = async (val) => {
  relationStatus.value = val
};

const checkFollowStatus = async () => {
  loading.value = true;
  try {
    relationStatus.value = props.user?.status;
  } catch (e) {
    console.error("Error checking follow status:", e);
    relationStatus.value = 0;
  } finally {
    loading.value = false;
  }
};

const toggleFollow = async (userId: string) => {
  if (!user.value) return redirectToLogin();
  loading.value = true;
  try {
    await $fetch(`/api/follow/follow/${userId}`, { method: 'POST' });
    await refreshUser(props.user.id, props.user.username);
    await refreshUser(user.value.id, user.value.username);
  } catch (error) {
    console.error('Error following:', error);
  }
  loading.value = false;
};

const toggleUnFollow = async (userId: string) => {
  if (!user.value) return redirectToLogin();
  loading.value = true;
  try {
    await $fetch(`/api/follow/unfollow/${userId}`, { method: 'POST' });
    loading.value = false;
    await refreshUser(props.user.id, props.user.username);
    await refreshUser(user.value.id, user.value.username);
  } catch (error) {
    console.error('Error unfollowing:', error);
  }
};

const toggleReject = async (userId: string) => {
  if (!user.value) return redirectToLogin();
  loadingReject.value = true;
  try {
    await $fetch(`/api/follow/unfollow/${userId}`, { method: 'POST' });
    loadingReject.value = false;
    await refreshUser(props.user.id, props.user.username);
    await refreshUser(user.value.id, user.value.username);
  } catch (error) {
    console.error('Error unfollowing:', error);
  }
};

const rejectRelationAction = () => {
  changeFollowStatus(0);
  toggleReject(props.user.id);
};

const handleRelationAction = () => {
  switch (relationStatus.value) {
    case 0:
      changeFollowStatus(2);
      toggleFollow(props.user.id);
    break;
    case 3:
      changeFollowStatus(1);
      toggleFollow(props.user.id);
      break;
    case 2:
      changeFollowStatus(0);
      toggleUnFollow(props.user.id);
    break;
    case 1:
      changeFollowStatus(0);
      toggleUnFollow(props.user.id);
    break;
  }
};

const redirectToLogin = () => {
  router.push({ path: '/login', query: { redirect: route.fullPath } });
};

watch(
  () => props.user?.id,
  () => {
    if (user.value && props.user?.id) {
      checkFollowStatus();
    }
  },
  { immediate: true }
);
</script>

<template>
  <UserHoverCard
    :author="props.user"
    @friends="toggleFriends"
    @message="onAction('sendMessage')"
    @block="onAction('block')"
    @report="onAction('report')"
  >
    <div class="d-flex align-center">
      <a :href="props.user?.username === user?.username ? '/profile' : `/user/${props.user.username}`">
        <UserAvatar :user="props.user" color="primary" :size="props.size" />
      </a>
      <div class="mx-4">
        <NuxtLink
          :to="props.user?.username === user?.username ? localePath('/profile') : localePath(`/user/${props.user.username}`)"
          class="font-weight-bolder text-decoration-none"
          :class="isDark ? 'text-white' : 'text-default'"
        >
          {{ props.user?.firstName }} {{ props.user?.lastName }}
        </NuxtLink>
        <RelativeTime :date="props.publishedAt" />
      </div>
    </div>
  </UserHoverCard>
  <div class="text-end ms-auto" v-if="props.user?.id !== user?.id && loggedIn">
    <v-btn
      :loading="loadingReject"
      variant="text"
      size="small"
      class="text-primary"
      @click="rejectRelationAction"
    >
      <template #default>
        <v-icon v-if="relationStatus === 3">mdi-account-minus</v-icon>
        <span class="ms-2 text-caption">
            {{
            relationStatus === 3 ? 'Reject' : ''
          }}
          </span>
      </template>
    </v-btn>
    <v-btn
      :loading="loading"
      variant="text"
      size="small"
      class="text-primary"
      @click="handleRelationAction"
    >
      <template #default>
        <v-icon v-if="relationStatus === 0">mdi-account-plus</v-icon>
        <v-icon v-if="relationStatus === 3">mdi-account-check</v-icon>
        <v-icon v-if="relationStatus === 2">mdi-clock</v-icon>
        <v-icon v-if="relationStatus === 1">mdi-account-multiple-check</v-icon>
        <span class="ms-2 text-caption">
            {{
            relationStatus === 0 ? 'Follow' :
              relationStatus === 1 ? 'Friend' :
                relationStatus === 2 ? 'Requested' :
                  relationStatus === 3 ? 'Accept' : ''
          }}
          </span>
      </template>
    </v-btn>
  </div>
</template>
