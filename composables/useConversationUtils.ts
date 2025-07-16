import { truncate } from '~/utils/stringUtils'

export function useConversationUtils() {
  const { user } = useUserSession()

  function getConversationTitle(conversation: any): string {
    const participants = conversation?.participants ?? []

    if (participants.length > 2) {
      return conversation.title
    }

    if (participants.length === 2) {
      const other = participants.find((p: any) => p.id !== user.value?.id)
      return truncate((other?.firstName ?? '') + ' ' + (other?.lastName ?? ''), 20) || conversation.title
    }

    return conversation.title
  }

  function getConversationAvatar(conversation: any): string {
    const participants = conversation?.participants ?? []

    if (participants.length > 2) {
      return 'https://placehold.net/avatar-5.svg'
    }

    if (participants.length === 2) {
      const other = participants.find((p: any) => p.id !== user.value?.id)
      return other?.avatar ?? 'https://placehold.net/avatar-5.svg'
    }

    return 'https://placehold.net/avatar-5.svg'
  }

  return {
    getConversationTitle,
    getConversationAvatar,
  }
}
