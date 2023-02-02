// const {SerialPort} = require('serialport');
// const { autoDetect } = require('@serialport/bindings-cpp')
// tweak
//
const polka = require('polka');
const app = polka();
const compressor = require('./compressor');
/*
const state = [
"OperatingState",
   "CompressorState",
   "WarningNumber",
   "AlarmNumber",]
const sensors = [
   "CoolantIn",
   "CoollantOut",
   "Oil",
   "Helium",
   "LowP",
   "LowPavg",
   "HighP",
   "HighPavg",
   "DeltaP",
   "MotorCur",
];
*/
app.get('/', (req, res) => {
      res.end('Hello there !');
  })
app.get('/query/status', async(req, res) => {
    let stats = await compressor.readCompressor('/dev/ttyUSB0');
    // res.writeHead(200, { 'Content-Type': 'application/json' });
    // console.log(res);
    res.end(JSON.stringify(stats, null, "   "));
});
app.get('/query/state', async(req, res) => {
    let stats = await compressor.readCompressor('/dev/ttyUSB0');
    let out = {};
    compressor.states.forEach(elt=>out[elt]=stats[elt]); 
    res.end(JSON.stringify(out, null, "   "));
});
app.get('/query/sensors', async(req, res) => {
    let stats = await compressor.readCompressor('/dev/ttyUSB0');
    let out = {};
    compressor.sensors.forEach(elt=>out[elt]=stats[elt]); 
    res.end(JSON.stringify(out, null, "   "));
});


// Default route
app.get("*", (req, res) => {
    res.end("PAGE NOT FOUND");
});

// app.listen(3000)
app.listen(process.env.PORT || 3000, ()=> {
    console.log('polka server opened on ', process.env.POST || 3000)
});

/*
let Binding = autoDetect()
let portName = '/dev/ttyACM0'
let port;
let found;
function wait(ms) {
    return new Promise((resolve, reject)=>{setTimeout(resolve, ms);});
}
*/
