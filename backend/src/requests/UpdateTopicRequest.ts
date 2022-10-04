/**
 * Fields in a request to update a single TOPIC item.
 */
export interface UpdateTopicRequest {
  name: string
  dueDate: string
  done: boolean
}