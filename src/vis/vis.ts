import { mat4 } from 'gl-matrix'
import { initGl } from '../lib/gl-wrap'
import type { AudioAnalyzer } from '../lib/audio'
import FrequencyRenderer from '../vis/frequency'
import PositionRenderer from '../vis/positions'
import PointRenderer from '../vis/points'

const FOV = Math.PI * 0.5
const NEAR = 0.01
const FAR = 10

class VisRenderer {
    gl: WebGLRenderingContext
    frequencies: FrequencyRenderer
    positions: PositionRenderer
    points: PointRenderer
    view: mat4
    proj: mat4

    constructor (
        canvas: HTMLCanvasElement,
        textureSize: number,
        analyzer: AudioAnalyzer
    ) {
        checkTextureSize(textureSize)
        this.gl = initGl(canvas)

        this.frequencies = new FrequencyRenderer(this.gl, analyzer)
        this.positions = new PositionRenderer(this.gl, textureSize)
        this.points = new PointRenderer(this.gl, textureSize)

        const aspect = canvas.width / canvas.height
        this.proj = mat4.perspective(mat4.create(), FOV, aspect, NEAR, FAR)
        this.view = mat4.lookAt(mat4.create(), [2, 2, 2], [0, 0, 0], [0, 0, 1])

        this.points.setProj(this.proj)
        this.points.setView(this.view)
    }

    draw (): void {
        this.gl.clear(this.gl.DEPTH_BUFFER_BIT | this.gl.COLOR_BUFFER_BIT)

        const frequencyTexture = this.frequencies.getTexture(this.gl)
        const positionTexture = this.positions.getTexture(this.gl, frequencyTexture)
        this.points.draw(this.gl, positionTexture)
    }

    resize (width: number, height: number): void {
        this.gl.viewport(0, 0, width, height)

        const aspect = width / height
        this.proj = mat4.perspective(mat4.create(), FOV, aspect, NEAR, FAR)

        this.points.setProj(this.proj)
    }
}

const checkTextureSize = (size: number): void => {
    const powerOfTwo = (size & (size - 1)) === 0
    if (!powerOfTwo) {
        throw new Error(`texture size must be power of two, recieved ${size}`)
    }
}

export default VisRenderer
