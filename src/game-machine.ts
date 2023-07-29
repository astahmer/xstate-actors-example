import { ActorRefFrom, assign, createMachine, send, spawn } from 'xstate'
import { playerMachine } from './player-machine'
import { pure, sendTo } from 'xstate/lib/actions'

export const gameMachine = createMachine(
  {
    id: 'GameMachine',
    initial: 'NotStarted',
    context: {
      players: [],
    },
    states: {
      NotStarted: {
        on: {
          START: { target: 'Playing', actions: ['spanwPlayers'] },
        },
      },
      Playing: {
        always: { target: 'GameOver', cond: 'isAllDead' },
        invoke: {
          src: (_ctx) => (callback, _onReceive) => {
            // Start the beeping activity
            const interval = setInterval(() => callback({ type: 'POISON_TICK' }), 1000)

            // Return a function that stops the beeping activity
            return () => clearInterval(interval)
          },
        },
        on: {
          PAUSE: 'Paused',
          POISON_TICK: { actions: 'poisonPlayers' },
          PLAYER_DEAD: { actions: 'removePlayer' },
        },
      },
      Paused: {
        on: {
          START: 'Playing',
        },
      },
      GameOver: { type: 'final' },
    },
    schema: {
      context: {} as {
        players: Array<ActorRefFrom<typeof playerMachine>>
      },
      events: {} as
        | { type: 'START' }
        | { type: 'PAUSE' }
        | { type: 'POISON_TICK' }
        | { type: 'PLAYER_DEAD'; params: { id: string } },
    },
    tsTypes: {} as import('./game-machine.typegen').Typegen0,
  },
  {
    guards: {
      isAllDead: (ctx) => ctx.players.length === 0,
    },
    actions: {
      spanwPlayers: assign({
        players: (_ctx) =>
          Array.from({ length: 2 }, (_, i) =>
            spawn(
              playerMachine.withContext({ id: `player-${i}`, health: i === (Math.random() > 0.5 ? 1 : 0) ? 50 : 100 }),
              `player-${i}`,
            ),
          ),
      }),
      poisonPlayers: pure((ctx) =>
        ctx.players.map((player) => sendTo(player.id, { type: 'DAMAGE', params: { base: 5, kind: 'poison' } })),
      ),
      removePlayer: assign({
        players: (ctx, event) => {
          return ctx.players.filter((p) => p.id !== event.params.id)
        },
      }),
    },
  },
)
