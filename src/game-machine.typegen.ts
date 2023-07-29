// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
  '@@xstate/typegen': true
  internalEvents: {
    '': { type: '' }
    'xstate.init': { type: 'xstate.init' }
  }
  invokeSrcNameMap: {}
  missingImplementations: {
    actions: never
    delays: never
    guards: never
    services: never
  }
  eventsCausingActions: {
    poisonPlayers: 'POISON_TICK'
    removePlayer: 'PLAYER_DEAD'
    spanwPlayers: 'START'
  }
  eventsCausingDelays: {}
  eventsCausingGuards: {
    isAllDead: ''
  }
  eventsCausingServices: {}
  matchesStates: 'GameOver' | 'NotStarted' | 'Paused' | 'Playing'
  tags: never
}
