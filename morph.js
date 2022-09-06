// anime({
//     targets: "#triangle",
//     d: [
//         {value:"M125 62.5C125 73.8701 121.964 84.5311 116.658 93.7165C105.856 112.416 85.6477 125 62.5 125C39.3437 125 19.1287 112.407 8.32992 93.6955C3.03157 84.5149 0 73.8615 0 62.5C0 27.9822 27.9822 0 62.5 0C97.0178 0 125 27.9822 125 62.5Z"},
//         {value:"M98.732 62.5L116.658 93.7165H62.5H8.32992L26.268 62.5L62.5 0L98.732 62.5Z"}
//     ],
//     easing: "easeInOutQuint",
//     loop: true,
//     direction: "alternate",
//     duration: 5000
// })

var canvas, ctx, canvasHeight, canvasWidth

canvas = document.querySelector(".canvas")
ctx = canvas.getContext("2d")

canvasHeight = document.body.clientHeight
canvasWidth = document.body.clientWidth

canvas.height = 560
canvas.width = 560

var edge = canvas.width

var borderRadiusPercentage = 33.3, borderRadius = canvas.width * borderRadiusPercentage / 100
canvas.style.borderRadius = borderRadius + 'px'

var radius = Math.sqrt(Math.pow(edge/2, 2) + Math.pow(((edge/2) - borderRadius), 2))
// var radius = 250
    
function random(min, max) {
    return (Math.floor(Math.random() * (max - min + 1)) + min)
}

function particleObject(radius, x, y, dx, dy) {
    this.radius = radius
    this.x = x
    // this.oldX = x
    this.y = y
    // this.oldY = y
    this.dx = dx
    this.dy = dy

    this.distance = []
    this.strokeWidth = []
    this.strokeOpacity = []
}

var particleCount = 35, particle = [], defaultDistance = 250

// setInterval(distanceEditor, 5000)

canvas.addEventListener("click", distanceEditor)

// var distanceTxt = document.querySelector(".distanceCount")
// distanceTxt.innerHTML = defaultDistance

var adder = 25

function distanceEditor() {
    defaultDistance += adder
    // distanceTxt.innerHTML = defaultDistance

    if (defaultDistance > 250)
        adder *= -1
    else if (defaultDistance < 150)
        adder *= -1
}

function distanceCalculator() {
    for (var i=0; i<particle.length; i++)
    {
        for(var j=0; j<particle.length; j++)
        {
            particle[i].distance.push(Math.sqrt(Math.pow(particle[i].x - particle[j].x, 2) + Math.pow(particle[i].y - particle[j].y, 2)))
            particle[i].strokeOpacity.push(((particle[i].distance[j] / defaultDistance) - 1) * (-1))
            
            if (particle[i].distance[j] < defaultDistance / 4)
            {
                particle[i].strokeWidth.push(1.25)
            }
            else if (particle[i].distance[j] < defaultDistance / 2)
            {
                particle[i].strokeWidth.push(1)
            }
            else if (particle[i].distance[j] < 3 * defaultDistance / 4)
            {
                particle[i].strokeWidth.push(0.75)
            }
            else 
            {
                particle[i].strokeWidth.push(.5)
            }
        }
    }
}

// var color
// colorPicker()
// var colorID = 0

// function colorPicker() {
//     var mulColor = ["#D8A48F", "#BB8588", "#BBF1D1", "#FDB687"]
//     color = mulColor[colorID]
//     colorID++ 
// }

// canvas.addEventListener("click", colorPicker)

function particleGenerator() {
    var radius = random(30, 50) / 10
    if (Math.round(Math.random() * 3) == 3)
    {
        var dx = random(5, 18) / 10
        var dy = random(5, 18) / 10
    }
    else if (Math.round(Math.random() * 3) == 2)
    {
        var dx = random(-5, -19) / 10
        var dy = random(-5 , -19) / 10
    }
    else if (Math.round(Math.random() * 3) == 1)
    {
        var dx = random(5, 18) / 10
        var dy = random(-5 , -19) / 10
    }
    else
    {
        var dx = random(-5, -19) / 10
        var dy = random(5 , 18) / 10
    }
    var x = random(0 + radius, canvas.width - radius)
    var y = random(borderRadius + radius, canvas.height - borderRadius - radius)
    

    particle.push(new particleObject(radius, x, y, dx, dy))
}

function main() {

    for(let i=0; i<particleCount; i++)
    {
        particleGenerator()
    }

    distanceCalculator()

    draw()

    for(var i=0; i < particle.length; i++)
    {
        particle[i].distance.splice(0, particle.length)
        particle[i].strokeOpacity.splice(0, particle.length)
        particle[i].strokeWidth.splice(0, particle.length)
    }

    update()
}

function draw() {
    for (var i=0; i<particle.length; i++)
    {
        var p = particle[i]

        for (var j=0; j<particle.length; j++)
        {
            if (p.distance[j] < defaultDistance)
            {
                ctx.beginPath()
                ctx.moveTo(p.x, p.y)
                ctx.lineTo(particle[j].x, particle[j].y)
                ctx.strokeWidth = p.strokeWidth[j]
                ctx.strokeStyle = `rgba(248, 252, 55, ${p.strokeOpacity[j]})`
                ctx.closePath()
                ctx.stroke()
            }
        }
    }
    for (var i=0; i<particle.length; i++)
    {
        var p = particle[i]

        ctx.beginPath()
        ctx.fillStyle = "#00fff2"
        
        ctx.arc(p.x, p.y, p.radius, 0, 2 * Math.PI)
        ctx.fill()
        ctx.closePath()
    }
}



function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    for (var i=0; i<particle.length; i++)
    {
        var p = particle[i]

        var circleCenter = edge / 2
        

        if (p.x + p.radius > canvas.width || p.x - p.radius < 0)
            particle[i].dx *= -1
        
        if (p.y + p.radius > canvas.height || p.y - p.radius < 0)
            particle[i].dy *= -1

        particle[i].x += particle[i].dx
        particle[i].y += particle[i].dy 
        
        if (Math.sqrt(Math.pow(p.x - circleCenter, 2) + Math.pow(p.y - circleCenter, 2)) >= (radius - p.radius))
            {
                var v = Math.sqrt(p.dx * p.dx + p.dy * p.dy)
                var collisionAngle = Math.atan2(-p.y + circleCenter, p.x - circleCenter)
                var oldAngle = Math.atan2(-p.dy, p.dx)
                var newAngle = 2 * collisionAngle - oldAngle

                particle[i].dx = -v * Math.cos(newAngle)
                particle[i].dy = v * Math.sin(newAngle)

                particle[i].x += particle[i].dx
                particle[i].y += particle[i].dy 
            }

        
    }

    distanceCalculator()

    draw()

    for(var i=0; i < particle.length; i++)
    {
        particle[i].distance.splice(0, particle.length)
        particle[i].strokeOpacity.splice(0, particle.length)
        particle[i].strokeWidth.splice(0, particle.length)
    }

    requestAnimationFrame(update)
}

document.addEventListener("DOMContentLoaded", main)
