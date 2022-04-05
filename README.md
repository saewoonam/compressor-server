# compressor_server
## polka server on port 3000
### reads status of cyromech compressor over modbus serial interface
- ip:3000 -> hello there
- ip:3000/query/status  -> outputs json with all sensor readings and state of the fridge
- ip:3000/query/sensors  -> outputs json with all sensor readings
- ip:3000/query/state   -> outpus json with state of the compressor
#### Example of sensors output
```
{
   "CoolantIn": 72.70899963378906,
   "CoollantOut": 72.48200225830078,
   "Oil": 71.99500274658203,
   "Helium": 76.09600067138672,
   "LowP": 211.52481079101562,
   "LowPavg": 211.5123748779297,
   "HighP": 213.12380981445312,
   "HighPavg": 213.00091552734375,
   "DeltaP": 1.5989990234375,
   "MotorCur": 0.3707349896430969
}
```
