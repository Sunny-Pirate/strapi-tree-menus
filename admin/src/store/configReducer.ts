import produce from 'immer'

import { ACTION_RESOLVE_CONFIG } from '../constants'

const initialState = {
  isLoading: true,
  config: {
    maxDepth: null,
    layouts: {},
  },
  schema: {},
}

const configReducer = produce((previousState, action) => {
  const state = previousState ?? initialState
  switch (action.type) {
    case ACTION_RESOLVE_CONFIG:
      state.isLoading = false
      state.config = action.data.config
      state.schema = action.data.schema
      break

    default:
      return state
  }

  return state
})

export default configReducer
