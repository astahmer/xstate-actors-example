import { css } from '../styled-system/css'
import { button } from '../styled-system/recipes'
import { gameMachine } from './game-machine'
import { useActor, useMachine } from '@xstate/react'
import './panda.css'
import { Center, Container, HStack, Stack, styled } from '../styled-system/jsx'
import { JsonViewer } from '@textea/json-viewer'
import { ActorRefFrom } from 'xstate'
import { playerMachine } from './player-machine'

// let renderCount = 0

function App() {
  const [state, send] = useMachine(gameMachine)
  // console.log(++renderCount)

  return (
    <Center>
      <Container>
        {/* <styled.pre maxW="500px">{JSON.stringify(state.toJSON())}</styled.pre> */}
        <styled.div minW="400px" maxH="900px" overflow="auto" mr="4">
          <JsonViewer
            className={css({ pr: '4' })}
            enableClipboard={false}
            value={state.toJSON()}
            defaultInspectDepth={2}
          />
        </styled.div>
      </Container>
      <Stack>
        <HStack>
          <Stack>
            <styled.span fontWeight="bold">Game state: </styled.span>
            <styled.span color="red.400">{JSON.stringify(state.value)}</styled.span>
          </Stack>
          {state.can({ type: 'START' }) && (
            <button className={button({ shape: 'circle' })} onClick={() => send({ type: 'START' })}>
              {state.matches('NotStarted') ? 'Start game' : 'Continue game'}
            </button>
          )}
          {state.can('PAUSE') && (
            <button className={button({ shape: 'circle' })} onClick={() => send({ type: 'PAUSE' })}>
              Pause game
            </button>
          )}
          <button className={button({ shape: 'circle' })} onClick={() => console.log(state)}>
            Log state
          </button>
        </HStack>
        {!state.matches('NotStarted') && (
          <HStack>
            {state.context.players.map((player) => (
              <PlayerButton key={player.id} id={player.id} player={player} />
            ))}
          </HStack>
        )}
      </Stack>
    </Center>
  )
}

const PlayerButton = ({ id, player }: { id: string; player: ActorRefFrom<typeof playerMachine> }) => {
  const [state] = useActor(player)

  return (
    <styled.button
      className={button({ shape: 'square' })}
      bgColor="teal.400"
      onClick={() => console.log({ player, state })}
    >
      <Stack>
        <styled.span fontWeight="bold">{id}</styled.span>
        <styled.span color="red.400">Health: {state.context.health}</styled.span>
      </Stack>
    </styled.button>
  )
}

export default App
