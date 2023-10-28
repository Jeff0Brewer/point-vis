import { initProgram, initBuffer, initFloatAttribute, initTexture } from '../lib/gl-wrap'
import vertSource from '../shaders/position-vert.glsl?raw'
import fragSource from '../shaders/position-frag.glsl?raw'

const PX_PER_POS = 3

class PointRenderer {
    program: WebGLProgram
    buffer: WebGLBuffer
    texture: WebGLTexture
    bindInds: () => void
    numPoints: number

    constructor (gl: WebGLRenderingContext, textureSize: number) {
        checkTextureSize(textureSize)

        this.program = initProgram(gl, vertSource, fragSource)
        this.bindInds = initFloatAttribute(gl, this.program, 'vertexInd', 1, 1, 0)
        this.numPoints = Math.floor(textureSize * textureSize / PX_PER_POS)

        // initialize texture containing position attributes
        const testData = new Uint8Array(textureSize * textureSize * 4)
        for (let i = 0; i < testData.length; i++) {
            testData[i] = Math.random() * 255
        }
        this.texture = initTexture(gl)
        gl.texImage2D(
            gl.TEXTURE_2D,
            0,
            gl.RGBA,
            textureSize,
            textureSize,
            0,
            gl.RGBA,
            gl.UNSIGNED_BYTE,
            testData
        )

        // initialize buffer of vertex indices, used to
        // look up attributes from texture in shader
        const vertexIndices = new Float32Array(this.numPoints)
        for (let i = 0; i < vertexIndices.length; i++) {
            vertexIndices[i] = i
        }
        this.buffer = initBuffer(gl)
        gl.bufferData(gl.ARRAY_BUFFER, vertexIndices, gl.STATIC_DRAW)
    }

    draw (gl: WebGLRenderingContext): void {
        gl.bindTexture(gl.TEXTURE_2D, this.texture)
        gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer)
        this.bindInds()

        gl.drawArrays(gl.POINTS, 0, this.numPoints)
    }
}

const isPowerOfTwo = (x: number): boolean => {
    return (x & (x - 1)) === 0
}

const checkTextureSize = (size: number): void => {
    if (!isPowerOfTwo(size)) {
        throw new Error(`texture size must be power of two, recieved ${size}`)
    }
}

export default PointRenderer
