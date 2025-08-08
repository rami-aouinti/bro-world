<script setup lang="ts">
import DeleteDialog from "~/components/DeleteDialog.vue";
import BaseDialog from "~/components/BaseDialog.vue";
import { useI18n } from 'vue-i18n';
import { useLocalePath } from '#i18n';
import { useUserStore } from "~/stores/useUserStore";
import Editor from "~/components/App/Editor.vue";
import UserHoverCard from "~/components/App/UserHoverCard.vue";
import Author from "~/components/App/Author.vue";

const props = defineProps<{ post: any }>();
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
const deletePost = ref(false);
const editPost = ref(false);
const postContent = ref('');
const youtubeId = ref<string | null>(null);
const imageUrl = ref<string | null>(null);
const files = ref<File[]>([]);
const contentInput = ref(false);

const showFriendsCard = ref(false)
const showMenuCard = ref(false)

const friendsBtn = ref<HTMLElement | null>(null)
const menuBtn = ref<HTMLElement | null>(null)

function toggleFriends() {
  showFriendsCard.value = !showFriendsCard.value
  showMenuCard.value = false
}

function toggleMenu() {
  showMenuCard.value = !showMenuCard.value
  showFriendsCard.value = false
}

function onAction(action: string) {
  console.log('Action:', action)
  showFriendsCard.value = false
  showMenuCard.value = false

  if (action === 'sendMessage') {
    navigateTo(`/inbox/${props.post.user.firstName.toLowerCase()}`) // ou user.id
  }
}


function detectLinks() {
  if (youtubeId.value || imageUrl.value) return;

  const ytRegex = /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^\s&]+)/;
  const imgRegex = /(https?:\/\/.*\.(?:png|jpg|jpeg|gif|webp))/;

  const ytMatch = postContent.value.match(ytRegex);
  const imgMatch = postContent.value.match(imgRegex);

  if (ytMatch) {
    youtubeId.value = ytMatch[1];
    postContent.value = '';
  } else if (imgMatch) {
    imageUrl.value = imgMatch[1];
    postContent.value = '';
  }
}

function clearPreview() {
  youtubeId.value = null;
  imageUrl.value = null;
}

const formPayload = computed(() => {
  const payload: Record<string, any> = {};
  if (youtubeId.value) payload.url = `https://www.youtube.com/watch?v=${youtubeId.value}`;
  else if (imageUrl.value) payload.url = imageUrl.value;

  if (postContent.value.trim()) {
    if (!contentInput) {
      payload.title = postContent.value.trim();
    } else {
      payload.content = postContent.value.trim();
    }
  }
  return payload;
});

const handleSuccess = (data: any) => {
  postContent.value = '';
  imageUrl.value = null;
  youtubeId.value = null;
  Notify.success("Post updated!", user.photo ?? "", "/post/" + data.slug);
  emit('post-updated', data);
};

const handleSuccessDelete = () => {
  Notify.success("Post deleted!", user.photo ?? "", "");
  emit('post-delete', props.post.id);
};

const handleError = (error: any) => {
  Notify.error("Post failed!");
  console.error('Failed:', error);
};

const handleEdit = () => {
  postContent.value = props.post.title ? '' : props.post.content;
  if (props.post.content !== '') {
    contentInput.value = true;
  }
  editPost.value = true;
};

const handleDelete = () => {
  deletePost.value = true;
};

const refreshUser = async (userId: string, userName: string) => {
  await userStore.fetchProfile(userId, userName);
};

const changeFollowStatus = async (val) => {
  relationStatus.value = val
};

const checkFollowStatus = async () => {
  loading.value = true;
  try {
    relationStatus.value = props.post.status;
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
    await refreshUser(props.post.user.id, props.post.user.username);
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
    await refreshUser(props.post.user.id, props.post.user.username);
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
    await refreshUser(props.post.user.id, props.post.user.username);
    await refreshUser(user.value.id, user.value.username);
  } catch (error) {
    console.error('Error unfollowing:', error);
  }
};

const rejectRelationAction = () => {
  changeFollowStatus(0);
  toggleReject(props.post.user.id);
};

const handleRelationAction = () => {
  switch (relationStatus.value) {
    case 0:
      changeFollowStatus(2);
      toggleFollow(props.post.user.id);
    break;
    case 3:
      changeFollowStatus(1);
      toggleFollow(props.post.user.id);
      break;
    case 2:
      changeFollowStatus(0);
      toggleUnFollow(props.post.user.id);
    break;
    case 1:
      changeFollowStatus(0);
      toggleUnFollow(props.post.user.id);
    break;
  }
};

const redirectToLogin = () => {
  router.push({ path: '/login', query: { redirect: route.fullPath } });
};

watch(
  () => props.post.user?.id,
  () => {
    if (user.value && props.post.user?.id) {
      checkFollowStatus();
    }
  },
  { immediate: true }
);
</script>

<template>
  <div class="d-flex align-center px-4 my-1">
    <Author :status="props.post.status" :user="props.post.user" :published-at="props.post.publishedAt" :size="48" />

    <div class="text-end ms-auto" v-if="loggedIn">
      <v-menu v-if="props.post.user?.id === user?.id" location="bottom" max-width="68">
        <template #activator="{ props }">
          <v-btn icon variant="text" size="small" class="text-primary" v-bind="props">
            <v-icon icon="mdi-dots-vertical" size="20" />
          </v-btn>
        </template>

        <v-list class="pa-2">
          <v-list-item>
            <v-icon size="small" icon="mdi-pencil" color="warning" @click="handleEdit()" />
          </v-list-item>
          <v-list-item>
            <v-icon size="small" color="error" @click="handleDelete()">mdi-delete</v-icon>
          </v-list-item>
        </v-list>
      </v-menu>
      <v-menu v-else location="bottom" max-width="400">
        <template #activator="{ props }">
          <v-btn icon variant="text" size="small" class="text-primary" v-bind="props">
            <v-icon icon="mdi-dots-vertical" size="20" />
          </v-btn>
        </template>

        <v-list class="pa-2">
          <v-list-item>
            Report
          </v-list-item>
          <v-list-item>
            Ne plus afficher
          </v-list-item>
        </v-list>
      </v-menu>
      <BaseDialog
        v-model="editPost"
        title="Edit Post"
        color="primary"
        :closeButton="[{ text: 'Cancel', action: 'close' }]"
        :saveButton="[{ text: 'Post', color: 'primary', action: '/api/posts/post/edit/' + props.post.id }]"
        :files="files"
        :forms="formPayload"
        @success="handleSuccess"
        @error="handleError"
      >
        <v-card rounded="xl">
          <v-card-text>
            <v-text-field
              v-if="!contentInput"
              v-model="postContent"
              label="Post Title"
              variant="outlined"
              rounded
              required
              @input="detectLinks"
            />
            <Editor v-model="postContent" :api-key="''" v-else />
            <div v-if="youtubeId" class="my-4 text-center">
              <div class="d-flex justify-end">
                <v-btn icon @click="clearPreview" variant="text" size="small"><v-icon>mdi-close</v-icon></v-btn>
              </div>
              <iframe
                :src="`https://www.youtube.com/embed/${youtubeId}`"
                width="560"
                height="315"
                frameborder="0"
                allowfullscreen
                style="max-width: 100%"
              ></iframe>
            </div>
            <div v-if="imageUrl" class="my-4 text-center">
              <div class="d-flex justify-end">
                <v-btn icon @click="clearPreview" variant="text" size="small"><v-icon>mdi-close</v-icon></v-btn>
              </div>
              <NuxtImg :src="imageUrl" alt="preview" format="webp" loading="lazy" cover style="max-width: 100%; max-height: 300px" />
            </div>
          </v-card-text>
        </v-card>
      </BaseDialog>

      <DeleteDialog
        v-model="deletePost"
        :deleteUrl="`/api/posts/post/delete/${props.post.id}`"
        :closeButton="[{ text: 'Cancel', color: 'grey', action: 'close' }]"
        @deleted="handleSuccessDelete"
      />
    </div>
  </div>
</template>
