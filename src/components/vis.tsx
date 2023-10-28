import { useState, useEffect, useRef } from 'react'
import type { FC } from 'react'
import VisRenderer from '../vis/vis'
import '../style/vis.css'

const TEXTURE_SIZE = 2048

const Vis: FC = () => {
    const [width, setWidth] = useState<number>(0)
    const [height, setHeight] = useState<number>(0)
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const visRef = useRef<VisRenderer | null>(null)

    useEffect(() => {
        const fitToWindow = (): void => {
            const width = window.innerWidth * window.devicePixelRatio
            const height = window.innerHeight * window.devicePixelRatio

            setWidth(width)
            setHeight(height)

            visRef.current?.resize(width, height)
        }
        // initialize canvas size
        fitToWindow()

        // resize canvas and update projection matrices on window resize
        window.addEventListener('resize', fitToWindow)
        return () => {
            window.removeEventListener('resize', fitToWindow)
        }
    }, [])

    useEffect(() => {
        if (!canvasRef.current) {
            throw new Error('could not get reference to canvas')
        }
        visRef.current = new VisRenderer(canvasRef.current, TEXTURE_SIZE)
    }, [])

    return (
        <canvas
            width={width}
            height={height}
            ref={canvasRef}
            className="vis-canvas"
        />
    )
}

export default Vis
