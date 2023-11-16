import { mat4 } from 'gl-matrix'
import { initGl } from '../lib/gl-wrap'
import AudioAnalyzer from '../lib/audio'
import FrequencyRenderer from '../vis/frequency'
import TexAttribRenderer from '../vis/tex-attrib'
import PointRenderer from '../vis/points'
import positionVert from '../shaders/position-vert.glsl?raw'
import positionFrag from '../shaders/position-frag.glsl?raw'

const FOV = Math.PI * 0.5
const NEAR = 0.01
const FAR = 10

class VisRenderer {
    gl: WebGLRenderingContext
    frequencies: FrequencyRenderer
    positions: TexAttribRenderer
    points: PointRenderer
    view: mat4
    proj: mat4
    width: number
    height: number

    constructor (
        canvas: HTMLCanvasElement,
        textureSize: number,
        analyzer: AudioAnalyzer
    ) {
        checkTextureSize(textureSize)
        this.gl = initGl(canvas)

        this.frequencies = new FrequencyRenderer(this.gl, analyzer)
        this.positions = new TexAttribRenderer(this.gl, positionVert, positionFrag, textureSize)
        this.points = new PointRenderer(this.gl, textureSize)

        const aspect = canvas.width / canvas.height
        this.proj = mat4.perspective(mat4.create(), FOV, aspect, NEAR, FAR)
        this.view = mat4.lookAt(mat4.create(), [0, 1, 0], [0, 0, 0], [0, 0, 1])

        this.points.setProj(this.proj)
        this.points.setView(this.view)

        this.width = canvas.width
        this.height = canvas.height
    }

    draw (): void {
        this.gl.clear(this.gl.DEPTH_BUFFER_BIT | this.gl.COLOR_BUFFER_BIT)

        const frequencyTexture = this.frequencies.getTexture(this.gl)
        const positionTexture = this.positions.getTexture(this.gl, frequencyTexture)
        this.points.draw(this.gl, positionTexture, this.width, this.height)
    }

    resize (width: number, height: number): void {
        this.width = width
        this.height = height

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
