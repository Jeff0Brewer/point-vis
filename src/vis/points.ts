import { mat4 } from 'gl-matrix'
import { initProgram, initBuffer, initFloatAttribute, initTexture } from '../lib/gl-wrap'
import vertSource from '../shaders/point-vert.glsl?raw'
import fragSource from '../shaders/point-frag.glsl?raw'

const PX_PER_POS = 3

class PointRenderer {
    program: WebGLProgram
    buffer: WebGLBuffer
    texture: WebGLTexture
    bindInds: () => void
    setProj: (m: mat4) => void
    setView: (m: mat4) => void
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

        // store closures to easily set potentially changing uniforms
        const projLoc = gl.getUniformLocation(this.program, 'proj')
        const viewLoc = gl.getUniformLocation(this.program, 'view')
        this.setProj = (mat: mat4): void => {
            gl.useProgram(this.program)
            gl.uniformMatrix4fv(projLoc, false, mat)
        }
        this.setView = (mat: mat4): void => {
            gl.useProgram(this.program)
            gl.uniformMatrix4fv(viewLoc, false, mat)
        }

        // set static uniforms
        const textureSizeLoc = gl.getUniformLocation(this.program, 'textureSize')
        const invDecodeScaleLoc = gl.getUniformLocation(this.program, 'invDecodeScale')
        gl.uniform2f(textureSizeLoc, textureSize, textureSize)
        gl.uniform1f(invDecodeScaleLoc, 1 / 4244897280) // temporary while testing random data
    }

    draw (gl: WebGLRenderingContext): void {
        gl.useProgram(this.program)

        gl.bindTexture(gl.TEXTURE_2D, this.texture)
        gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer)
        this.bindInds()

        gl.drawArrays(gl.POINTS, 0, this.numPoints)
    }
}

const checkTextureSize = (size: number): void => {
    const powerOfTwo = (size & (size - 1)) === 0
    if (!powerOfTwo) {
        throw new Error(`texture size must be power of two, recieved ${size}`)
    }
}

export default PointRenderer
