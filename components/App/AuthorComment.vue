<script setup lang="ts">
import DeleteDialog from "~/components/DeleteDialog.vue";
import BaseDialog from "~/components/BaseDialog.vue";
import { useI18n } from 'vue-i18n';
import { useLocalePath } from '#i18n';
import { useUserStore } from "~/stores/useUserStore";
import Editor from "~/components/App/Editor.vue";
import Author from "~/components/App/Author.vue";

const props = defineProps<{ post: any, friends: any }>();
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
const deletePost = ref(false);
const editPost = ref(false);
const postContent = ref('');
const youtubeId = ref<string | null>(null);
const imageUrl = ref<string | null>(null);
const files = ref<File[]>([]);
const contentInput = ref(false);



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
const handleError = (error: any) => {
  Notify.error("Post failed!");
  console.error('Failed:', error);
};
const handleSuccessDelete = () => {
  Notify.success("Post deleted!", user.photo ?? "", "");
  emit('post-delete', props.post.id);
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
    <Author :friends="props.friends" :user="props.post.user" :published-at="props.post.publishedAt" :size="48" />

    <div class="text-end ms-auto" v-if="loggedIn">
      <v-menu v-if="props.post.user?.id === user?.id" location="bottom">
        <template #activator="{ props }">
          <v-btn icon variant="text" size="small" class="text-primary" v-bind="props">
            <v-icon icon="mdi-dots-vertical" size="20" />
          </v-btn>
        </template>
        <v-card rounded="xl" variant="text">
          <v-list rounded="xl" style="background-color: transparent;" dense nav>
            <v-list-item @click="handleEdit()">
              <v-list-item-title class="d-flex align-center">
                <v-icon class="me-2" size="20">mdi-pencil-outline</v-icon>
                Edit
              </v-list-item-title>
            </v-list-item>

            <v-list-item @click="handleDelete()">
              <v-list-item-title class="d-flex align-center">
                <v-icon class="me-2" size="20">mdi-delete-outline</v-icon>
                Delete
              </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-card>
      </v-menu>
      <v-menu v-else location="bottom" max-width="400">
        <template #activator="{ props }">
          <v-btn icon variant="text" size="small" class="text-primary" v-bind="props">
            <v-icon icon="mdi-dots-vertical" size="20" />
          </v-btn>
        </template>
        <v-card rounded="xl" variant="text">
          <v-list rounded="xl" style="background-color: transparent;" dense nav>
            <v-list-item @click="emit('unfollow')">
              <v-list-item-title class="d-flex align-center">
                <v-icon class="me-2" size="20">mdi-account-cancel-outline</v-icon>
                Blockieren
              </v-list-item-title>
            </v-list-item>

            <v-list-item @click="emit('removeFriend')">
              <v-list-item-title class="d-flex align-center">
                <v-icon class="me-2" size="20">mdi-message-outline</v-icon>
                Report
              </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-card>
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
