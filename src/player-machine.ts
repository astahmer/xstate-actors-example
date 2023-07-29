import { assign, createMachine } from 'xstate'
import { sendParent } from 'xstate/lib/actions'

export const playerMachine = createMachine(
  {
    id: 'PlayerMachine',
    initial: 'Alive',
    context: {
      id: '',
      health: 100,
    },
    states: {
      Alive: {
        always: [{ target: 'Dead', cond: 'isDead', actions: 'notifyGame' }],
        on: {
          DAMAGE: { actions: 'takeDamage' },
        },
      },
      Dead: {},
    },
    schema: {
      context: {} as {
        id: string
        health: number
      },
      events: {} as { type: 'DAMAGE'; params: { base: number; kind: 'normal' | 'poison' } },
    },
    tsTypes: {} as import('./player-machine.typegen').Typegen0,
  },
  {
    guards: {
      isDead: (ctx) => ctx.health <= 0,
    },
    actions: {
      takeDamage: assign({
        health: (ctx, event) => {
          let next = ctx.health - getRandomIntIn(event.params.base ?? 1, event.params.base + 4)
          if (event.params.kind === 'poison') {
            next -= 1
          }

          return Math.max(0, next)
        },
      }),
      notifyGame: sendParent((ctx) => ({ type: 'PLAYER_DEAD', params: { id: ctx.id } })),
    },
  },
)

function getRandomFloatIn(minOrMax: number, maxOptional?: number, decimals?: number) {
  const min = maxOptional === undefined ? 0 : minOrMax
  const max = maxOptional === undefined ? minOrMax : maxOptional
  const float = Math.random() * (max - min) + min
  return decimals ? roundTo(float, decimals) : float
}
const roundTo = (nb: number, pow = 2) => Math.round(nb * Math.pow(10, pow)) / Math.pow(10, pow)
const getRandomIntIn = (minOrMax: number, maxOptional?: number) => Math.floor(getRandomFloatIn(minOrMax, maxOptional))
