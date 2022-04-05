const {autoDetect} = require('@serialport/bindings-cpp')
// import {autoDetect} from '@serialport/bindings-cpp'
// const fs = require('fs')
const states = [
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

const Bindings = autoDetect()
const structure = {
    'OperatingState':[0, 2],
    'CompressorState':[2, 2],
    'WarningNumber':[4, 4],
    'AlarmNumber': [8, 4],
    'CoolantIn': [12, 4],
    'CoollantOut': [16, 4],
    'Oil': [20, 4],
    'Helium':[24, 4],
    'LowP': [28, 4],
    'LowPavg': [32, 4],
    'HighP': [36, 4],
    'HighPavg': [40, 4],
    'DeltaP':[44, 4],
    'MotorCur': [48, 4],
    'Hours': [52, 4],
}

function crc16(msg) {
  var crc = 0xFFFF
  var poly = 0xA001
  // console.log(crc)
  msg.forEach((element)=> 
  { 
      // console.log(element) 
      crc ^= element
      for (var index=0; index<8; index++) {
          //console.log(index)
        crc = (crc&0x0001) ? (crc>>1)^poly : (crc>>1)
      }
  });
//  console.log('0x'+crc.toString(16), (new Uint16Array([crc])).buffer)
  return crc;
}

async function main(port_path) {
    // await Bindings.list().then(res=>console.log(res))

    query = new Buffer.from([0x10,  //# Slave Address
        0x04,        // # Function Code  3= Read HOLDING registers, 4 read INPUT registers
        0x00,0x01,   // # The starting Register Number
        0x00,0x35,   // # How many to read
        0x62,0x9C])  // # Checksum

    // console.log(query)
    let addr = Buffer.alloc(1)
    let cmd = Buffer.alloc(1)
    let len = Buffer.alloc(1)
    let checksum = Buffer.alloc(2)

    let port = await Bindings.open({path:port_path, baudRate:115200});
    // console.log(port.isOpen)
    await port.write(query)
    response = await port.read(addr, 0, 1)
    // console.log(addr)
    response = await port.read(cmd, 0, 1)
    // console.log(cmd)
    response = await port.read(len, 0, 1)
    // console.log(len)
    let data = Buffer.alloc(len[0])
    async function readN(port, buffer, offset, left) {
        do {
            response = await port.read(buffer, offset, left)
            // console.log('readN response data', response);
            offset += response.bytesRead;
            left -= response.bytesRead;
            // console.log('readN left', left);
        } while (left>0);
    }
    await readN(port, data, 0, len[0]);
    await readN(port, checksum, 0, 2);
    await port.close()
    // console.log(port.isOpen)
    msg = Buffer.concat([addr, cmd, len, data]);    
    // console.log('calculate checksum');
    let crc = crc16(msg);
    // console.log('checksum', checksum, checksum.readUint16LE().toString(16));
    // console.log('0x'+crc.toString(16))
    // console.log('match', crc==checksum.readUint16LE());
    // console.log(data)
    data.swap16();
    // console.log(data)
    let results = {};
    for (const key in structure) {
        let offset = structure[key][0]
        let len = structure[key][1]
        let buf = data.slice(offset, offset+len);
        // console.log(typeof(buf), buf);
        let value = len==2 ? buf.readUint16LE() : buf.readFloatLE();
        // console.log(key, value);
        results[key] = value; 
    }
    // console.log(data[56], data[58], data.slice(60, 62).readUint16LE(), data[62], data[63], data[64], data[65]); 
    return results; 
}
// main('/dev/ttyUSB0')
exports.readCompressor = main;
exports.states = states;
exports.sensors = sensors;
