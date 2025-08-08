<script setup lang="ts">
import UserAvatar from "~/components/App/UserAvatar.vue";
import RelativeTime from "~/components/App/RelativeTime.vue";
import { useI18n } from 'vue-i18n';
import { useLocalePath } from '#i18n';
import { useUserStore } from "~/stores/useUserStore";
import UserHoverCard from "~/components/App/UserHoverCard.vue";

const props = defineProps<{ user: any, status: any, publishedAt: any, size: any }>();
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
const loading = ref(true);
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
</template>
