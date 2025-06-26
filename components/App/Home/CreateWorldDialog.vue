<template>
  <v-dialog v-model="dialog">
    <v-card rounded="xl">
      <v-stepper v-model="step" class="mt-1">
        <v-stepper-header>
          <v-stepper-item :value="1" title="Name & Logo" />
          <v-stepper-item :value="2" title="Plugins" />
          <v-stepper-item :value="3" title="Finish" />
        </v-stepper-header>
        <v-stepper-window>
          <v-stepper-window-item :value="1">
            <RealTimeText
              :text="`Step 1: Choose a name and a logo for your World. This will represent your space.`"
              class="mb-2"
            />
            <v-text-field
              v-model="title"
              label="World Name"
              prepend-icon="mdi-earth"
              variant="outlined"
              rounded
              outlined
              required
              :disabled="!loggedIn"
            />
            <v-row>
              <v-col cols="12" md="6">
                <v-textarea
                  v-model="description"
                  label="Description"
                  prepend-icon="mdi-earth"
                  variant="outlined"
                  rounded
                  outlined
                  rows="4"
                  :disabled="!loggedIn"
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-file-upload
                  icon="mdi-upload"
                  v-model="files"
                  :title="$t('post.files')"
                  multiple
                  density="compact"
                  variant="compact"
                  show-size
                  rounded
                  outlined
                  :disabled="!loggedIn"
                  clearable
                />
              </v-col>
            </v-row>

          </v-stepper-window-item>
          <v-stepper-window-item :value="2">
            <RealTimeText
              :text="`Step 2: Select the plugins you want to activate in your World.`"
              class="mb-1"
            />
            <template v-if="loadingUser">
              <LoaderPlugin  />
            </template>
            <template v-else>
              <v-row dense>
                <v-col
                  v-for="plugin in plugins"
                  :key="plugin.name"
                  cols="6"
                  sm="3"
                  md="3"
                >
                  <PluginInstall :plugin="plugin"/>
                </v-col>
              </v-row>
            </template>
          </v-stepper-window-item>
          <v-stepper-window-item :value="3">
            <RealTimeText
              :text="`Step 3: All set! Here's a summary before launching your World.`"
              class="mb-1"
            />

            <p class="text-body-1" v-if="loggedIn">
              Hello <strong>{{ user?.firstName }},</strong>
            </p>
            <p class="text-body-1">
              Your World "<strong>{{ title }}</strong>" is ready with
              <strong>{{ activePlugins?.length }}</strong> plugins. Ready to go!
            </p>
          </v-stepper-window-item>
        </v-stepper-window>
        <v-card-actions class="mt-4">
          <v-btn
            v-if="step > 1"
            variant="text"
            color="grey-darken-1"
            @click="previousStep"
            :disabled="!loggedIn"
          >
            Previous
          </v-btn>
          <v-spacer />
          <v-btn
            v-if="!loggedIn"
            color="primary"
            variant="flat"
            @click="redirectToLogin"
          >
            Login to Continue
          </v-btn>

          <!-- Sinon bouton Next/Finish -->
          <v-btn
            v-else
            :disabled="isNextDisabled"
            color="primary"
            variant="flat"
            @click="nextStep"
          >
            {{ step === 3 ? 'Finish' : 'Next' }}
          </v-btn>
        </v-card-actions>
      </v-stepper>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, defineProps, defineEmits} from 'vue'
import { useRouter } from 'vue-router'
import RealTimeText from '~/components/App/RealTimeText.vue'
import LoaderPlugin from "~/components/App/Loader/Plugin/LoaderPlugin.vue";
import PluginInstall from "~/components/PluginInstall.vue";

const props = defineProps({ modelValue: Boolean, plugins: Array })
const emit = defineEmits(['update:modelValue'])
const files = ref<File[]>([])
const dialog = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
})
const loadingUser = ref(true)

// Auth
const { user, loggedIn } = useUserSession()


// Form & Stepper
const step = ref(1)
const title = ref('')
const description = ref('')

const activePlugins = computed(() => props.plugins.filter(p => p.active))

const isNextDisabled = computed(() =>
  !loggedIn || (step.value === 1 && !title.value)
)

// Navigation
const router = useRouter()

function previousStep() {
  if (step.value > 1) {
    step.value--
  }
}

async function nextStep() {
  if (step.value < 3) {
    step.value++
  } else {
    try {
      const formData = new FormData()

      if (Array.isArray(files.value)) {
        files.value.forEach(file => {
          formData.append('files[]', file)
        })
      }

      formData.append('title', title.value)
      formData.append('description', description.value)

      const {data, error} = await useFetch('/api/posts/blog/blogs', {
        method: 'POST',
        body: formData,
      })
      const slug = data?.value.slug
      if (slug) {
        dialog.value = false
        redirectToWorld(slug)
      }

    } catch (err) {
      console.error('Unexpected error:', err)
    }
  }
}
onMounted(async () => {
  loadingUser.value = false
})
function redirectToLogin() {
  router.push('/login')
}

function redirectToWorld(slug) {
  router.push(`/world/${slug}`)
}

</script>
