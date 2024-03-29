import React from 'react'
import s from './canvas.module.css'
import {
  CircleType,
  LimitTypes,
  LocationType,
  RectangleType,
  FreqDataType,
  AxisDataType,
  LineGraphType,
} from '../redux/canvas-reducer'

function drawLimits(ctx: CanvasRenderingContext2D, limits: LimitTypes) {
  ctx.beginPath()
  // ctx.rect(
  //   limits.xMin + limits.shiftX,
  //   limits.yMin + limits.shiftY,
  //   limits.xMax - limits.xMin - 2 * limits.shiftX,
  //   limits.yMax - limits.yMin - 2 * limits.shiftY
  // )
  // ctx.fillStyle = 'lightblue'
  // ctx.fillRect(
  //   limits.xMin,
  //   limits.yMin,
  //   limits.xMax - limits.xMin,
  //   limits.yMax - limits.yMin
  // )
  ctx.strokeStyle = 'black'
  ctx.moveTo(limits.xMin, limits.yMin)
  ctx.lineTo(limits.xMax - 2 * limits.shiftX, limits.yMin)
  ctx.stroke()
}

function drawLocations(ctx: CanvasRenderingContext2D, location: LocationType) {
  ctx.fillStyle = 'deepskyblue'
  ctx.fillRect(location.x, location.y, 30, 30)
  // ctx.translate(location.x / SCALE - OFFSET, location.y / SCALE - OFFSET)
}

// function drawCircle(ctx: CanvasRenderingContext2D, circle: CircleType) {
//   if (circle.color) ctx.fillStyle = circle.color
//   if (circle.borderColor) ctx.strokeStyle = circle.borderColor
//   ctx.beginPath()
//   ctx.ellipse(
//     circle.x,
//     circle.y,
//     circle.radius,
//     circle.radius,
//     0,
//     0,
//     2 * Math.PI
//   )
//   if (circle.color) ctx.stroke()
//   if (circle.borderColor) ctx.fill()
// }

function drawRectangle(
  ctx: CanvasRenderingContext2D,
  rectangle: RectangleType
) {
  ctx.globalAlpha = rectangle.opacity
  if (rectangle.borderColor) ctx.strokeStyle = rectangle.borderColor
  ctx.fillStyle = rectangle.color
  ctx.beginPath()
  ctx.fillRect(rectangle.x, rectangle.y, rectangle.width, rectangle.height)
  if (rectangle.borderColor) ctx.stroke()
  ctx.globalAlpha = 1
}

function drawLineGraph(ctx: CanvasRenderingContext2D, graph: LineGraphType) {
  ctx.globalAlpha = graph.opacity
  ctx.fillStyle = graph.color
  if (graph.xy.length === 0) return
  let region = new Path2D()
  region.moveTo(graph.xy[0].x, 0)
  for (let i = 1; i < graph.xy.length; i++) {
    region.lineTo(graph.xy[i].x, graph.xy[i].y)
  }
  region.lineTo(graph.xy[graph.xy.length - 1].x, 0)

  region.closePath()
  ctx.fill(region)
  ctx.globalAlpha = 1
}

function drawFrequency(
  ctx: CanvasRenderingContext2D,
  freq: FreqDataType,
  duplex: number,
  heght: number,
  color: string
) {
  ctx.fillStyle = color
  ctx.fillRect(freq.f0, 0, freq.f1 - freq.f0, heght)
  ctx.fillRect(freq.f0 + duplex, 0, freq.f1 - freq.f0, heght)
}

function drawAxis(
  ctx: CanvasRenderingContext2D,
  axis: AxisDataType,
  scale: number
) {
  ctx.fillStyle = axis.fontColor
  ctx.strokeStyle = axis.fontColor
  ctx.font = 'bold 16px Arial'
  ctx.transform(1 / scale, 0, 0, -1 / scale, 0, 0)
  for (let i = 0; i <= axis.nx; i++) {
    ctx.moveTo(axis.xvals[i] * scale, -10)
    ctx.lineTo(axis.xvals[i] * scale, 10)
    ctx.stroke()
    ctx.fillText(axis.xlabels[i], axis.xvals[i] * scale - 10, 30)
  }
}

function draw(
  ctx: CanvasRenderingContext2D,
  props: CanvasPropType,
  scale: number
) {
  ctx.save()
  drawLimits(ctx, props.limits)
  props.rectangles.forEach((rectangle) => drawRectangle(ctx, rectangle))
  // props.circles.forEach((circle) => drawCircle(ctx, circle))
  props.locations.forEach((location) => drawLocations(ctx, location))
  drawFrequency(
    ctx,
    props.freqOne,
    props.duplex,
    (props.limits.yMax - props.limits.shiftY) * 0.9,
    'blue'
  )
  drawFrequency(
    ctx,
    props.freqTwo,
    props.duplex,
    (props.limits.yMax - props.limits.shiftY) * 0.9,
    'green'
  )
  props.lineGraphs.forEach((graph) => drawLineGraph(ctx, graph))

  drawAxis(ctx, props.axis, scale)
  ctx.restore()
}

export type CanvasPropType = {
  limits: LimitTypes
  duplex: number
  axis: AxisDataType
  rectangles: Array<RectangleType>
  lineGraphs: Array<LineGraphType>
  circles: Array<CircleType>
  locations: Array<LocationType>
  addLocation: any
  freqOne: FreqDataType
  freqTwo: FreqDataType
}

const CanvasMain: React.FC<CanvasPropType> = (props) => {
  const canvasRef = React.useRef(null)

  React.useEffect(() => {
    function handleResize() {
      if (canvasRef.current) {
        const canvas: HTMLCanvasElement = canvasRef.current
        const ctx = canvas.getContext('2d')
        if (canvas.parentElement && ctx) {
          let r = canvas.parentElement.getBoundingClientRect()
          canvas.width = r.width - 10
          // console.log(r.width, r.height)
          // ctx.fillRect(0, 0, canvas.width, canvas.height)
          let scaleX =
            (r.width - props.limits.paddingX * 2) /
            (props.limits.xMax - props.limits.xMin)
          canvas.height =
            (props.limits.yMax - props.limits.yMin) * scaleX +
            props.limits.paddingY * 2
          ctx.fillStyle = 'lightblue'
          ctx.fillRect(0, 0, canvas.width, canvas.height)
          ctx.setTransform(
            scaleX,
            0,
            0,
            -scaleX,
            props.limits.paddingX + -props.limits.xMin * scaleX,
            (props.limits.yMax - props.limits.yMin) * scaleX +
              props.limits.paddingY
          )
          draw(ctx, props, scaleX)
        }
      }
    }
    window.addEventListener('resize', handleResize)
    handleResize()
  }, [props])

  return (
    <div className={s.mainCanvas}>
      <canvas
        className={s.canvasSvg}
        ref={canvasRef}
        // width={window.innerWidth - 300}
        // height={window.innerHeight - 200}
        // onClick={(e) => {
        //   props.addLocation({ x: e.clientX, y: e.clientY })
        // }}
      ></canvas>
    </div>
  )
}

export default CanvasMain
