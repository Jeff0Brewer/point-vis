type AudioAnalyzer = {
    playPause: () => void,
    getFrequencies: () => Uint8Array
}

const getAudioAnalyzer = async (path: string): Promise<AudioAnalyzer> => {
    const ctx = new AudioContext()
    const audioBuffer = await fetch(path)
        .then(res => res.arrayBuffer())
        .then(buf => ctx.decodeAudioData(buf))

    const audio = ctx.createBufferSource()
    audio.buffer = audioBuffer
    audio.connect(ctx.destination)

    const analyzer = ctx.createAnalyser()
    analyzer.fftSize = 2048
    audio.connect(analyzer)

    // make closure to easily get frequency data
    const frequencies = new Uint8Array(analyzer.fftSize)
    const getFrequencies = (): Uint8Array => {
        analyzer.getByteFrequencyData(frequencies)
        return frequencies
    }

    // make closure to abstract audio play / pausing
    // need to start the audioBuffer source only on first play
    // then toggle between play and pause
    let started = false
    let paused = false
    const playPause = (): void => {
        if (!started) {
            audio.start()
            started = true
        } else if (paused) {
            ctx.resume()
            paused = false
        } else {
            ctx.suspend()
            paused = true
        }
    }

    return {
        playPause,
        getFrequencies
    }
}

export type {
    AudioAnalyzer
}

export {
    getAudioAnalyzer
}
