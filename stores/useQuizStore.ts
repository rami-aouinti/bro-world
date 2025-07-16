// stores/useQuizStore.ts
import { defineStore } from 'pinia'

export const useQuizStore = defineStore('quiz', {
  state: () => ({
    questions: [] as any[],
    currentIndex: 0,
    selectedAnswers: {} as Record<string, string>,
  }),
  actions: {
    async fetchQuiz(categoryId: string, levelId: string) {
      const { data } = await useFetch(`/platform/quiz/generate`, {
        query: { category: categoryId, level: levelId },
      })
      this.questions = data.value || []
      this.currentIndex = 0
      this.selectedAnswers = {}
    },
    selectAnswer(questionId: string, answerId: string) {
      this.selectedAnswers[questionId] = answerId
    },
    nextQuestion() {
      if (this.currentIndex < this.questions.length - 1) this.currentIndex++
    },
    prevQuestion() {
      if (this.currentIndex > 0) this.currentIndex--
    },
  },
  getters: {
    currentQuestion(state) {
      return state.questions[state.currentIndex]
    },
    isLast(state) {
      return state.currentIndex === state.questions.length - 1
    },
    score(state) {
      let score = 0
      for (const question of state.questions) {
        const selected = state.selectedAnswers[question.id]
        const correct = question.answers.find((a: any) => a.isTrue)
        if (selected && correct?.id === selected) score++
      }
      return score
    },
  },
})
