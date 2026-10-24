import type { Ref } from 'react'
import type { Conversation } from '@/api/schemas'
import { getInterlocutor } from '../helpers/getInterlocutor'
import { ConversationListItem } from './ConversationListItem'
import styles from './ConversationList.module.css'

interface ConversationListProps {
  conversations: Conversation[]
  loggedUserId: number
  selectedConversationId: number | null
  listRef?: Ref<HTMLUListElement>
}

export const ConversationList = ({
  conversations,
  loggedUserId,
  selectedConversationId,
  listRef,
}: ConversationListProps) => (
  <ul ref={listRef} className={styles.list}>
    {conversations.map((conversation) => (
      <ConversationListItem
        key={conversation.id}
        href={`/conversations/${conversation.id}`}
        interlocutorName={getInterlocutor(conversation, loggedUserId).nickname}
        lastMessageTimestamp={conversation.lastMessageTimestamp}
        isSelected={conversation.id === selectedConversationId}
      />
    ))}
  </ul>
)
