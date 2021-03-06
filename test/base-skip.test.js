const { expect } = require('chai');
const Base = require('../src/base');

/** @test {CorrodeBase#skip} */
describe('CorrodeBase#skip', () => {
    beforeEach(function(){
        this.base = new Base();
        this.eqArray = require('./helpers/asserts').eqArray.bind(this);
        this.eqMultiArray = require('./helpers/asserts').eqMultiArray.bind(this);
    });

    it('allows us to skip content', function(done){
        this.base
            .uint8('var_1')
            .skip(2)
            .uint8('var_2')
            .skip(4)
            .uint8('var_3');

        this.eqArray([1, 0, 0, 2, 0, 0, 0, 0, 3], done, {
            var_1: 1,
            var_2: 2,
            var_3: 3
        });
    });

    /** @test {CorrodeBase#isSeeking} */
    it('prevents us from unskipping content with isSeeking = false', function(done){
        this.base
            .uint8('var_1')
            .skip(2)
            .uint8('var_2')
            .skip(-3)
            .uint8('var_3');

        expect(this.eqMultiArray.bind(this, [[1], [3], [0], [2]], done, {})).to.throw(RangeError);

        done();
    });

    /** @test {CorrodeBase#isSeeking} */
    it('allows us to unskip content with isSeeking = true', function(done){
        this.base.isSeeking = true;

        this.base
            .uint8('var_1')
            .skip(2)
            .uint8('var_2')
            .skip(-3)
            .uint8('var_3');

        this.eqArray([1, 3, 0, 2], done, {
            var_1: 1,
            var_2: 2,
            var_3: 3
        });
    });

    it('prevents us from unskipping too far', function(){
        this.base
            .uint8('var_1')
            .skip(-10);

        expect(this.eqArray.bind(this, [1, 2], () => {}, {})).to.throw(RangeError);
    });
});
