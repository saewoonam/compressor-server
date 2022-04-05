# compressor_server
## polka server on port 3000
* reads status of cyromech compressor over modbus serial interface
ip:3000 -> hello there
ip:3000/query/status  -> outputs json with all sensor readings and state of the fridge
ip:3000/query/sensors  -> outputs json with all sensor readings
ip:3000/query/state   -> outpus json with state of the compressor
