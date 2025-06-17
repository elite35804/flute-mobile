import { derived } from 'overmind';

export const state = {
  visible: false,
  title: '',
  message: '',
  type: undefined,
  payload: derived(({ title, message, type }) => {
    return {
      title: title,
      message: message,
      type: type,
    }
  }),
}