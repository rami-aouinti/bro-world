<template>
  <v-container fluid>
    <client-only>
      <teleport v-if="canTeleport" to="#menu-bar-world">
        <v-toolbar
          rounded="xl"
          class="d-flex align-center justify-space-between bg-gradient-primary shadow-primary px-4 py-2"
          color="transparent"
        >
          <v-app-bar-nav-icon color="primary">🏆</v-app-bar-nav-icon>
          <v-toolbar-title to="/quiz">
            {{ t('dashboard.quiz.title') }}
            <NuxtLink
              to="/game"
              class="text-primary text-decoration-none font-weight-bold ml-1"
            >
              {{ t('dashboard.quiz.link') }}
            </NuxtLink>
          </v-toolbar-title>
        </v-toolbar>
        <v-list class="bg-transparent py-6" role="list">
          <v-list-item
            v-for="(topUser, index) in topUsers"
            :key="topUser.userId?.id ?? index"
            variant="text"
            class="px-4"
            role="listitem"
            aria-label="Quiz ranking item"
          >
            <template #prepend>
              <v-avatar size="36">
                <span class="text-h6">
                  {{ trophies[index] || '🏅' }}
                </span>
              </v-avatar>
            </template>

            <template #default>
              <div class="d-flex align-center w-100">
                <span class="mx-2">
                  <UserAvatar :user="topUser.userId" size="26" color="primary" />
                </span>
                <span :class="topUser.userId?.id === user?.id ? 'text-primary font-weight-bold' : 'font-weight-medium'">
                  {{ topUser.userId?.firstName }} {{ topUser.userId?.lastName }}
                </span>
                <span class="text-body-2 ms-auto font-weight-bold" :class="topUser.userId?.id === user?.id ? 'text-primary' : ''">
                  {{ topUser.score }} pts
                </span>
              </div>
            </template>
          </v-list-item>
        </v-list>
      </teleport>
    </client-only>

    <v-card rounded="xl" class="bg-gradient-primary shadow-primary mx-3 mb-3 py-2" variant="text" elevation="10" mx-auto style="min-height: 480px;">
      <v-card-title class="text-h5 mb-2 d-flex align-center">
        🎓 Quiz
        <v-spacer />
        <v-btn variant="text" v-if="selectedCategory && !quizStarted" icon @click="selectedCategory = null" class="mb-2" aria-label="Back to categories">
          <v-icon color="primary">mdi-arrow-left</v-icon>
        </v-btn>
        <div v-if="selectedCategory && selectedLevel" class="text-red font-weight-bold">⏱️ {{ remainingTime }}s</div>
      </v-card-title>

      <div v-if="!selectedCategory && !quizStarted">
        <v-row>
          <v-col
            v-for="(cat, index) in categories"
            :key="cat.id"
          >
            <v-card :style="`background-color: ${getRandomColor(index)};`" rounded="xl" class="hover-card bg-gradient-primary shadow-primary mx-3" variant="text" elevation="10" @click="selectCategory(cat)">
              <v-card-title class="text-sm">{{ cat.name }}</v-card-title>
            </v-card>
          </v-col>
        </v-row>
      </div>

      <div v-else-if="!selectedLevel && !quizStarted">
        <v-row>
          <v-col
            v-for="(level, index) in levels"
            :key="level.id"
            cols="12" sm="6" md="4"
          >
            <v-card
              rounded="xl"
              class="hover-card bg-gradient-primary shadow-primary mx-3 d-flex align-center justify-center"
              variant="text"
              elevation="10"
              :style="`background-color: ${getRandomColor(index)}; height: 320px;`"
              @click="selectLevel(level)"
            >
              <v-card-title class="text-center text-h6">{{ level.label }}</v-card-title>
            </v-card>
          </v-col>
        </v-row>
      </div>


      <div v-else>
        <transition name="fade-slide" mode="out-in">
          <div v-if="currentQuestion" :key="currentQuestion.id">
            <div :key="currentQuestion.id">
              <v-progress-linear
                :model-value="progress"
                color="deep-purple-accent-4"
                height="8"
                class="mb-4"
                rounded
                striped
              />

              <div class="px-4 flex-grow-1" v-if="!validated">
                <div class="d-flex justify-space-between align-center px-4 mb-2">
                  <h3 class="text-h6">Question {{ currentIndex + 1 }} / {{ questions.length }}</h3>
                </div>

                <p class="mb-4 px-3 font-weight-medium">{{ currentQuestion.question }}</p>

                <v-radio-group
                  v-model="selectedAnswers[currentQuestion.id]"
                  :disabled="validated || hasExpired(currentQuestion.id)"
                >
                  <v-radio
                    class="px-4"
                    v-for="answer in currentQuestion.answers"
                    :key="answer.id"
                    :label="answer.answer"
                    :value="answer.id"
                    :color="validated && answer.isTrue ? 'success' : undefined"
                    :class="{
                  'text-success': validated && answer.isTrue,
                  'text-error': validated && selectedAnswers[currentQuestion.id] === answer.id && !answer.isTrue,
                }"
                  />
                </v-radio-group>

                <v-alert
                  v-if="hasExpired(currentQuestion.id) && !validated"
                  type="warning"
                  class="mt-2 mb-4"
                >
                  ⌛ Time's up for this question.
                </v-alert>
              </div>
              <v-card-text class="d-flex justify-center text-center" v-else>
                <span
                  class="text-h4 mt-6 text-center"
                  border="start"
                >
                🎯 Score: <strong>{{ score }}</strong> / {{ questions.length }}
              </span>
              </v-card-text>

              <div class="d-flex justify-end mt-4 mb-2 mx-4">
                <v-card-actions class="mt-auto px-4 pb-2">
                  <v-btn
                    v-if="!isLast"
                    @click="nextQuestion"
                    :disabled="!selectedAnswers[currentQuestion.id] && !hasExpired(currentQuestion.id)"
                    color="primary"
                  >
                    Next
                  </v-btn>
                  <v-btn
                    v-else-if="isLast && !validated"
                    @click="validateQuiz"
                    :disabled="!selectedAnswers[currentQuestion.id] && !hasExpired(currentQuestion.id)"
                    color="green"
                  >
                    ✅ Submit Quiz
                  </v-btn>
                </v-card-actions>
              </div>
              <div v-if="validated" class="d-flex justify-center mt-4 mb-2 mx-4">
                <v-btn
                  to="/home"
                  color="secondary"
                  class="mt-2"
                >
                  Go Home
                </v-btn>
                <v-btn
                  @click="resetQuiz"
                  color="primary"
                  class="mt-2"
                >
                  🔁 Start a new quiz
                </v-btn>
              </div>
            </div>
          </div>
        </transition>
      </div>
    </v-card>
    <v-dialog class="border-radius-xl overflow-visible"  v-model="loggedModal" max-width="400px">
      <v-card
        max-width="450"
        min-width="350"
        :loading="isRedirecting"
        class="border-radius-xl overflow-visible"
      >
        <v-sheet
          class="mx-auto"
          elevation="12"
          min-width="380"
          rounded="lg"
          color="primary"
        >
          <div class="mt-4 py-3">
            <div class="text-h4 font-weight-bold d-flex justify-center">
              Bro World
            </div>
          </div>
          <Social @redirect="isRedirecting = true" />
        </v-sheet>
        <div style="margin-top: -10px;">
          <v-card-text>
            You need to be logged in to submit your quiz score.
            <LoginForm :quiz="true" :payload="payload" />
          </v-card-text>
        </div>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from 'vue'
import UserAvatar from '~/components/App/UserAvatar.vue'
const { user, loggedIn } = useUserSession()
import { useI18n } from 'vue-i18n'
import LoginForm from "~/components/Auth/LoginForm.vue";
import Social from "~/components/Auth/Social.vue";
definePageMeta({
  layout: 'default',
  breadcrumb: 'disabled',
  title: 'Quiz',
  description: 'Welcome to the home page where you can find the latest posts and stories.',
  meta: [
    { name: 'description', content: 'Welcome to the home page where you can find the latest posts and stories.' },
    { name: 'keywords', content: 'home, posts, stories, social' },
  ],
  head: {
    title: 'Quiz - Bro World',
    meta: [
      { name: 'description', content: 'Welcome to the home page where you can find the latest posts and stories.' },
      { name: 'keywords', content: 'home, posts, stories, social' },
    ],
  },
  scrollToTop: true,
})
const { t, locale } = useI18n()
const TIMER_DURATION = 30
const topUsers = ref<{ userId: any; score: number }[]>([])
const trophies = ['🥇', '🥈', '🥉']
const selectedCategory = ref(null)
const selectedLevel = ref(null)
const payload = ref(null)
const quizStarted = ref(false)
const isRedirecting = ref(false)
const questions = ref<any[]>([])
const categories = ref<any[]>([])
const levels = ref<any[]>([])
const currentIndex = ref(0)
const selectedAnswers = ref<Record<string, string>>({})
const validated = ref(false)
const loggedModal = ref(false)
const score = ref(0)
const loading = ref(false)
const canTeleport = ref(false)
const remainingTime = ref(TIMER_DURATION)
const timer = ref<any>(null)
const expiredQuestions = ref<Record<string, boolean>>({})

const isLast = computed(() => currentIndex.value === questions.value.length - 1)
const currentQuestion = computed(() => questions.value[currentIndex.value])
const progress = computed(() => ((currentIndex.value + 1) / questions.value.length) * 100)

const levelColors = [
  // Coral Red
  '#D7CCC8','#FFCCBC', '#FF6F61',
  '#6A1B9A', // Purple Deep
  '#1E88E5', // Blue Bright
  '#43A047', // Green Vibrant
  '#F4511E', // Orange Accent
  '#709a3f', '#a0a844', '#a19639',
  '#00ACC1', // Cyan Bold
  '#FFCA28', // Yellow Gold
  '#8E24AA', // Purple Vibrant
  '#3949AB', // Indigo
  '#26C6DA', // Teal Light
  '#D81B60', // Pink Hot
  '#7CB342', // Lime Olive
  '#5E35B1', // Violet Intense
  '#FDD835', // Lemon
  '#FB8C00', // Orange Medium
  '#FFCDD2', '#F8BBD0', '#E1BEE7', '#D1C4E9', '#C5CAE9',
  '#C2185B', // Raspberry
  '#0097A7', // Deep Cyan
  '#00E676', // Neon Green
  '#651FFF', // Electric Indigo
  '#FF4081', // Bright Pink
]
function getRandomColor(index: number) {
  return levelColors[index % levelColors.length]
}

function selectCategory(cat: any) {
  selectedCategory.value = cat.id
}
function selectLevel(level: any) {
  selectedLevel.value = level.id
  startQuiz()
}
function hasExpired(id: string) {
  return expiredQuestions.value[id] === true
}
function markExpired(id: string) {
  expiredQuestions.value[id] = true
}
function startTimer() {
  remainingTime.value = TIMER_DURATION
  stopTimer()
  timer.value = setInterval(() => {
    if (remainingTime.value > 0) {
      remainingTime.value--
    } else {
      markExpired(currentQuestion.value.id)
      clearInterval(timer.value)
      if (!isLast.value) nextQuestion()
      else validateQuiz()
    }
  }, 1000)
}
function stopTimer() {
  if (timer.value) clearInterval(timer.value)
  timer.value = null
}
function resetTimer() {
  stopTimer()
  startTimer()
}

async function startQuiz() {
  loading.value = true
  try {
    const data = await $fetch('/api/quiz/generate', {
      params: {
        category: selectedCategory.value,
        level: selectedLevel.value
      }
    })
    questions.value = data
    quizStarted.value = true
    currentIndex.value = 0
    selectedAnswers.value = {}
    validated.value = false
    score.value = 0
    expiredQuestions.value = {}
    startTimer()
  } catch (err) {
    console.error(err)
  } finally {
    loading.value = false
  }
}

function nextQuestion() {
  if (currentIndex.value < questions.value.length - 1) {
    currentIndex.value++
    resetTimer()
  }
}

async function validateQuiz() {
  validated.value = true
  stopTimer()

  score.value = questions.value.reduce((total, q) => {
    const selectedId = selectedAnswers.value[q.id]
    const correct = q.answers.find(a => a.isTrue)?.id
    return total + (selectedId === correct ? 1 : 0)
  }, 0)
  payload.value = {
    score: score.value,
    questions: questions.value.map(q => ({
      questionId: q.id,
      isCorrect: selectedAnswers.value[q.id] === q.answers.find(a => a.isTrue)?.id
    }))
  }
  if (!user?.value?.id) {
    loggedModal.value = true;
  } else {
    payload.value.userId = user.value.id
    try {
      await $fetch('/api/quiz/submit-score', {
        method: 'POST',
        body: payload.value
      })
      await fetchScores()
    } catch (error) {
      console.error('Failed to submit score', error)
    }
  }
}

function resetQuiz() {
  quizStarted.value = false
  questions.value = []
  selectedCategory.value = null
  selectedLevel.value = null
  currentIndex.value = 0
  selectedAnswers.value = {}
  validated.value = false
  score.value = 0
  expiredQuestions.value = {}
  stopTimer()
}

async function loadCategories() {
  categories.value = await $fetch('/api/quiz/categories')
}
async function loadLevels() {
  levels.value = await $fetch('/api/quiz/levels')
}
const fetchScores = async () => {
  try {
    const data = await $fetch('/api/quiz/leaderboard')
    topUsers.value = data.leaderboard
  } catch (error) {
    console.error('Failed to fetch quiz rankings:', error)
  }
}

onMounted(async () => {
  await fetchScores()
  await loadCategories()
  await loadLevels()
  await nextTick()
  canTeleport.value = !!document.getElementById('menu-bar-world')
})
</script>

<style scoped>
.hover-card {
  cursor: pointer;
  transition: transform 0.2s ease;
}
.hover-card:hover {
  transform: scale(1.03);
}

.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.4s ease;
}
.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(10px);
}
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
