import { apiEndpoint } from '../config'
import { Topic } from '../types/Topic';
import { CreateTopicRequest } from '../types/CreateTopicRequest';
import Axios from 'axios'
import { UpdateTopicRequest } from '../types/UpdateTopicRequest';

export async function getTopics(idToken: string): Promise<Topic[]> {
  console.log('Fetching topics')

  const response = await Axios.get(`${apiEndpoint}/topics`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    },
  })
  console.log('topics:', response.data)
  return response.data.items
}

export async function createTopic(
  idToken: string,
  newTopic: CreateTopicRequest
): Promise<Topic> {
  const response = await Axios.post(`${apiEndpoint}/topics`,  JSON.stringify(newTopic), {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
  return response.data.item
}

export async function patchTopic(
  idToken: string,
  topicId: string,
  updatedTopic: UpdateTopicRequest
): Promise<void> {
  await Axios.patch(`${apiEndpoint}/topics/${topicId}`, JSON.stringify(updatedTopic), {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
}

export async function deleteTopic(
  idToken: string,
  topicId: string
): Promise<void> {
  await Axios.delete(`${apiEndpoint}/topics/${topicId}`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
}

export async function getUploadUrl(
  idToken: string,
  topicId: string
): Promise<string> {
  const response = await Axios.post(`${apiEndpoint}/topics/${topicId}/attachment`, '', {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
  return response.data.uploadUrl
}

export async function uploadFile(uploadUrl: string, file: Buffer): Promise<void> {
  await Axios.put(uploadUrl, file)
}
