import { useState } from 'react'
import type { FC } from 'react'
import '../style/App.css'

const App: FC = () => {
    return (
        <main className="app">
            <Counter />
        </main>
    )
}

const Counter: FC = () => {
    const [count, setCount] = useState<number>(0)
    return (
        <div className="test-counter">
            <p>count: {count}</p>
            <button onClick={(): void => { setCount(count + 1) }}>
                increment
            </button>
        </div>
    )
}

export default App
