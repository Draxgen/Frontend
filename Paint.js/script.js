let canvas;
let ctx;
let savedImageData;
let dragging = false;
let strokeColor = 'black';
let fillColor = 'black';
let line_Width = 2;
let polygonSides = 6;
let currentTool = 'brush';
let canvasWidth = 600;
let canvasHeight = 600;

let usingBrush = false;
let brushXPoints = new Array();
let brushYPoints = new Array();
let brushDownPos = new Array();

class ShapeBoundingBox {
    contructor(left, top, width, height) {
        this.left = left;
        this.top = top;
        this.width = width;
        this.height = height;
    }
}

class MouseDownPos {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

class Location {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

class PolygonPoint {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

let shapeBoundingBox = new ShapeBoundingBox(0, 0, 0, 0);
let mouseDown = new MouseDownPos(0, 0);
let loc = new Location(0, 0);

document.addEventListener('DOMContentLoaded', setupCanvas);

function setupCanvas() {
    canvas = document.getElementById('my-canvas');
    ctx = canvas.getContext('2d');
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = line_Width;
    canvas.addEventListener("mousedown", ReactToMouseDown);
    canvas.addEventListener("mousemove", ReactToMouseMove);
    canvas.addEventListener("mouseup", ReactToMouseUp);
}

function ChangeTool(toolClicked) {
    document.getElementById('open').className = "";
    document.getElementById('save').className = "";
    document.getElementById('brush').className = "";
    document.getElementById('line').className = "";
    document.getElementById('rectangle').className = "";
    document.getElementById('circle').className = "";
    document.getElementById('ellipse').className = "";
    document.getElementById('polygon').className = "";
    document.getElementById(toolClicked).className = "selected";
    currentTool = toolClicked;
}

// Get mouse position
function GetMousePosition(x, y) {
    let canvasSizeData = canvas.getBoundingClientRect();
    return {
        x: (x - canvasSizeData.left) * (canvas.width / canvasSizeData.width),
        y: (y - canvasSizeData.top) * (canvas.height / canvasSizeData.height),
    }
}

//save canvas image
function SaveCanvasImage() {
    savedImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
}

//redraw canvas image
function RedrawCanvasImage() {
    ctx.putImageData(savedImageData, 0, 0);
}

// update rubberband size data
function UpdateRubberbandSizeData(loc) {
    shapeBoundingBox.width = Math.abs(loc.x - mouseDown.x);
    shapeBoundingBox.height = Math.abs(loc.y - mouseDown.y);

    if (loc.x > mouseDown.x) {
        shapeBoundingBox.left = mouseDown.x;
    } else {
        shapeBoundingBox.left = loc.x;
    }

    if (loc.y > mouseDown.y) {
        shapeBoundingBox.top = mouseDown.y;
    } else {
        shapeBoundingBox.top = loc.y;
    }
}

// get angle using x & y position
// x = Adjacent
// y = Opposite
// Tan(Angle) = Opposite / Adjacent
// Angle = ArcTan(Opposite/Adjacent)
function getAngleUsingXAndY(mouselocX, mouselocY) {
    let adjacent = mouseDown.x - mouselocX;
    let opposite = mouseDown.y - mouselocY;
    return radiansToDegrees(Math.atan2(opposite, adjacent));
}

// radians to degrees
function radiansToDegrees(rad) {
    return (rad * (180 / Math.PI)).toFixed(2);
}

//degrees to radians
function degreesToRadians(degrees) {
    return degrees * (Math.PI / 180);
}

function getPolygonPoints() {
    let angle = degreesToRadians(getAngleUsingXAndY(loc.x, loc.y));
    let radiusX = shapeBoundingBox.width;
    let radiusY = shapeBoundingBox.height;
    let polygonPoints = [];
    // X = mouseloc.x + radiusX * Sin(angle)
    // Y = mouseloc.y - radiusY * Cos(angle)
    for (let i = 0; i < polygonSides; i++) {
        polygonPoints.push(new PolygonPoint(loc.x + radiusX * Math.sin(angle), loc.y - radiusY * Math.cos(angle)));
        angle += 2 * Math.PI / polygonSides;
    }
    return polygonPoints;
}

function getPolygon() {
    let polygonPoints = getPolygonPoints();
    ctx.beginPath();
    ctx.moveTo(polygonPoints[0].x, polygonPoints[0].y);
    for (i = 1; i < polygonSides; i++) {
        ctx.lineTo(polygonPoints[i].x, polygonPoints[i].y);
    }
    ctx.closePath();
}

//draw rubberband shape
function drawRubberbandShape(loc) {
    ctx.strokeStyle = strokeColor;
    ctx.fillStyle = fillColor;

    if (currentTool === 'brush') {
        DrawBrush();
    } else if (currentTool === 'line') {
        ctx.beginPath();
        ctx.moveTo(mouseDown.x, mouseDown.y);
        ctx.lineTo(loc.x, loc.y);
        ctx.stroke();
    } else if (currentTool === 'rectangle') {
        ctx.strokeRect(shapeBoundingBox.left, shapeBoundingBox.top, shapeBoundingBox.width, shapeBoundingBox.height);
    } else if (currentTool === 'circle') {
        let radius = shapeBoundingBox.width;
        ctx.beginPath();
        ctx.arc(mouseDown.x, mouseDown.y, radius, 0, Math.PI * 2);
        ctx.stroke();
    } else if (currentTool === 'ellipse') {
        let radiusX = shapeBoundingBox.width / 2;
        let radiusY = shapeBoundingBox.height / 2;
        ctx.beginPath();
        ctx.ellipse(mouseDown.x, mouseDown.y, radiusX, radiusY, Math.PI / 4, 0, Math.PI * 2);
        ctx.stroke();
    } else if (currentTool === 'polygon') {
        getPolygon();
        ctx.stroke();
    }


}

//update rubberband on move
function UpdateRubberbandOnMove(loc) {
    UpdateRubberbandSizeData(loc);
    drawRubberbandShape(loc);
}

function AddBrushPoint(x, y, mouseDown) {
    brushXPoints.push(x);
    brushYPoints.push(y);
    brushDownPos.push(mouseDown);
}

function DrawBrush() {
    for (let i = 1; i < brushXPoints.length; i++) {
        ctx.beginPath();
        if (brushDownPos[i]) {
            ctx.moveTo(brushXPoints[i - 1], brushYPoints[i - 1]);
        } else {
            ctx.moveTo(brushXPoints[i] - 1, brushYPoints[i]);
        }
        ctx.lineTo(brushXPoints[i], brushYPoints[i]);
        ctx.closePath();
        ctx.stroke();
    }
}

//ReactToMouseDown
function ReactToMouseDown(e) {
    canvas.style.cursor = "crosshair";
    loc = GetMousePosition(e.clientX, e.clientY);
    SaveCanvasImage();
    mouseDown.x = loc.x;
    mouseDown.y = loc.y;
    dragging = true;

    if (currentTool === 'brush') {
        usingBrush = true;
        AddBrushPoint(loc.x, loc.y);
    }
}

//ReactToMouseMove
function ReactToMouseMove(e) {
    canvas.style.cursor = "crosshair";
    loc = GetMousePosition(e.clientX, e.clientY);
    if (currentTool === 'brush' && dragging && usingBrush) {
        if (loc.x > 0 && loc.x < canvasWidth && loc.y > 0 && loc.y < canvasHeight) {
            AddBrushPoint(loc.x, loc.y, true);
        }
        RedrawCanvasImage();
        DrawBrush();
    } else {
        if (dragging) {
            RedrawCanvasImage();
            UpdateRubberbandOnMove(loc);
        }
    }
}

//ReactToMouseUp
function ReactToMouseUp(e) {
    canvas.style.cursor = "default";
    loc = GetMousePosition(e.clientX, e.clientY);
    RedrawCanvasImage();
    UpdateRubberbandOnMove(loc);
    dragging = false;
    usingBrush = false;
}

// save image
function SaveImage() {
    var imageFile = document.getElementById('img-file');
    imageFile.setAttribute('download', 'image.png');
    imageFile.setAttribute('href', canvas.toDataURL());
    console.log(imageFile);
}

// open image
function OpenImage() {
    let img = new Image();
    img.onload = function () {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
    }
    //img.src = 'image.png';
    // get image data from img-gile element
    var imageFile = document.getElementById('img-file');
    img.src = imageFile.getAttribute('href');

    // clear the brush points arrays
    brushXPoints = new Array();
    brushYPoints = new Array();
    brushDownPos = new Array();

}
