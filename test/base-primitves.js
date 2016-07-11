const expect = require('chai').expect;
const Base = require('../src/base');
const fixture = require('./fixtures/vars');
const fs = require('fs');

beforeEach(function(){
    this.base = new Base();

    this.buffer = buffer => {
        this.base.write(buffer);
        return this.base.vars;
    };

    this.eqFile = (file, done, obj) => {
        fs.createReadStream(__dirname + '/fixtures/' + file)
            .pipe(this.base)
            .on('finish', () => {
                if(typeof obj === 'function'){
                    obj.call(this, this.base.vars);
                } else {
                    expect(this.base.vars).to.deep.equal(obj);
                }
                done();
            });
    };
});


it('reads int8', function(done){
    this.base
        .int8('int8')
        .int8le('int8le')
        .int8be('int8be')
        .uint8('uint8')
        .uint8le('uint8le')
        .uint8be('uint8be')
        .int8('int8n')
        .int8le('int8len')
        .int8be('int8ben');

    this.eqFile('int8-seq.bin', done, {
        int8: 2,
        int8le: 4,
        int8be: 6,
        uint8: 8,
        uint8le: 10,
        uint8be: 12,
        int8n: -14,
        int8len: -16,
        int8ben: -18
    });
});

it('reads int16', function(done){
    this.base
        .int16('int16')
        .int16le('int16le')
        .int16be('int16be')
        .uint16('uint16')
        .uint16le('uint16le')
        .uint16be('uint16be')
        .int16('int16n')
        .int16le('int16len')
        .int16be('int16ben');

    this.eqFile('int16-seq.bin', done, {
        int16: 2000,
        int16le: 4000,
        int16be: 6000,
        uint16: 34000,
        uint16le: 36000,
        uint16be: 38000,
        int16n: -30000,
        int16len: -31000,
        int16ben: -32000
    });
});

it('reads int32', function(done){
    this.base
        .int32('int32')
        .int32le('int32le')
        .int32be('int32be')
        .uint32('uint32')
        .uint32le('uint32le')
        .uint32be('uint32be')
        .int32('int32n')
        .int32le('int32len')
        .int32be('int32ben');

    this.eqFile('int32-seq.bin', done, {
        int32: 100000,
        int32le: 110000,
        int32be: 120000,
        uint32: 3000000000,
        uint32le: 3100000000,
        uint32be: 3200000000,
        int32n: -1000000000,
        int32len: -1100000000,
        int32ben: -1200000000
    });
});

// http://www.ecma-international.org/ecma-262/5.1/#sec-8.5
it('reads int64', function(done){
    this.base
        .int64('int64')
        .int64le('int64le')
        .int64be('int64be')
        .uint64('uint64')
        .uint64le('uint64le')
        .uint64be('uint64be')
        .int64('int64n')
        .int64le('int64len')
        .int64be('int64ben');

    this.eqFile('int64-seq.bin', done, {
        int64: 100000,
        int64le: 110000,
        int64be: 120000,
        uint64: 3000000000,
        uint64le: 3100000000,
        uint64be: 3200000000,
        int64n: -1000000000,
        int64len: -1100000000,
        int64ben: -1200000000
    });
});

it('reads float', function(done){
    this.base
        .float('float')
        .floatle('floatle')
        .floatbe('floatbe');

    // floats are pretty unprecise
    this.eqFile('float-seq.bin', done, vars => {
        expect(vars.float).to.be.within(1.233, 1.235);
        expect(vars.floatle).to.be.within(5.677, 5.679);
        expect(vars.floatbe).to.be.within(9.1010, 9.1012);
    });
});

it('reads double', function(done){
    this.base
        .double('double')
        .doublele('doublele')
        .doublebe('doublebe');

    this.eqFile('double-seq.bin', done, {
        double: 1.234,
        doublele: 5.678,
        doublebe: 9.1011
    });
});

it('reads utf8-strings', function(done){
    this.base.string('string', 16, 'utf8');

    this.eqFile('string-utf8.bin', done, {
        string: 'asdfghjklyxc𝌆'
    });
});
