import { FC, useState, useEffect } from 'react'
import { AudioAnalyzer, getAudioAnalyzer } from '../lib/audio'
import Vis from '../components/vis'
import '../style/app.css'

const App: FC = () => {
    const [audio, setAudio] = useState<AudioAnalyzer | null>(null)
    const [paused, setPaused] = useState<boolean>(true)

    const initAudio = async (): Promise<void> => {
        const audio = await getAudioAnalyzer('song.mp3')
        setAudio(audio)
    }

    const playPause = (): void => {
        if (!audio) { return }
        audio.playPause()
        setPaused(!paused)
    }

    useEffect(() => {
        initAudio()
    }, [])

    return (
        <main className="app">
            { audio && <Vis audio={audio} /> }
            <button className="playPause" onClick={playPause}>
                { paused ? 'play' : 'pause' }
            </button>
        </main>
    )
}

export default App
