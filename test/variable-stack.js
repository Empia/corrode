const expect = require('chai').expect;
const VarStack = require('../src/variable-stack');


beforeEach(function(){
    this.stack = new VarStack();
});

it('should start as an empty object', function(){
    expect(this.stack.stack).to.have.length.of(1);
    expect(this.stack.top.isRoot).to.be.true;
    expect(this.stack.value).to.be.object;
    expect(this.stack.value).to.be.empty;
});

it('should allow properties on layer 0', function(){
    this.stack.value.foo = 'bar';
    expect(this.stack.value.foo).to.equal('bar');
});

it('should allow object-descension', function(){
    this.stack.push('child');
    expect(this.stack.value).to.be.object;
    expect(this.stack.value).to.be.empty;
    expect(this.stack.top.name).to.equal('child');
    expect(this.stack.top.isRoot).to.be.false;
});

it('should have correct value-shortcut', function(){
    this.stack.push('child');
    this.stack.value.val = 'fixture';
    expect(this.stack.value).to.deep.equal(this.stack.top.value);
});

it('should allow deep-adding', function(){
    this.stack.push('child');
    this.stack.value.fixture = 'fixture';
    expect(this.stack.value.fixture).to.equal('fixture');
});

it('should allow object-popping', function(){
    this.stack.push('child');
    this.stack.pop();
    expect(this.stack.top.isRoot).to.be.true;
    expect(this.stack.value.child).to.be.object;
    expect(this.stack.value.child).to.be.empty;
});

it('should allow object-popping with values', function(){
    this.stack.push('child');
    this.stack.value.fixture = 'fixture';
    this.stack.pop();
    expect(this.stack.value.child.fixture).to.equal('fixture');
});

it('should allow multiple pushed objects', function(){
    this.stack.push('child-1');
    this.stack.value.fixture = 'fixture-1';
    this.stack.pop();

    this.stack.push('child-2');
    this.stack.value.fixture = 'fixture-2';
    this.stack.pop();

    expect(Object.keys(this.stack.value)).to.have.length.of(2);
    expect(this.stack.value['child-1']).to.be.object;
    expect(this.stack.value['child-1']).to.not.be.empty;
    expect(this.stack.value['child-2']).to.be.object;
    expect(this.stack.value['child-2']).to.not.be.empty;
    expect(this.stack.value['child-1'].fixture).to.equal('fixture-1');
    expect(this.stack.value['child-2'].fixture).to.equal('fixture-2');
});

it('should allow object-repushing', function(){
    this.stack.push('child');
    this.stack.value.val = 'fixture';
    this.stack.pop();
    this.stack.push('child');
    expect(this.stack.value).to.not.be.empty;
    expect(this.stack.value.val).to.equal('fixture');
});

it('should allow array-repushing', function(){
    this.stack.push('child', []);
    this.stack.value.push('fixture');
    this.stack.pop();
    this.stack.push('child');
    expect(this.stack.value).to.not.be.empty;
    expect(this.stack.value[0]).to.equal('fixture');
});

it('should allow primitive-repushing', function(){
    this.stack.push('child', 2);
    this.stack.value *= 2;
    this.stack.pop();
    this.stack.push('child');
    expect(this.stack.value).to.equal(4);
});

it('should repush the same instance', function(){
    this.stack.push('child-1');
    this.stack.value.val = 'fixture';
    expect(this.stack.peek()['child-1']).to.equal(this.stack.value);
    expect(this.stack.peek()['child-1'].val).to.equal(this.stack.value.val);

    this.stack.pop();
    this.stack.push('child-2', []);
    this.stack.pop();
    expect(this.stack.value['child-2']).to.be.array;
    expect(this.stack.value['child-2']).to.be.empty;
});

it('should allow object-repushing on user-defined objects', function(){
    this.stack.value.child = { val: 'fixture' };
    this.stack.push('child');
    expect(this.stack.value).to.not.be.empty;
    expect(this.stack.value.val).to.equal('fixture');
});

it('should allow layer-peeking & allPop', function(){
    this.stack.push('child');
    this.stack.value.val = 'val'
    expect(this.stack.peekLayer().isRoot).to.be.true;
    expect(this.stack.peek().child.val).to.equal('val');
    expect(this.stack.peek(0).val).to.equal('val');

    this.stack.push('child');
    expect(this.stack.peekLayer().isRoot).to.be.false;
    expect(this.stack.peekLayer(2).isRoot).to.be.true;

    this.stack.push('child');
    expect(this.stack.peekLayer().isRoot).to.be.false;
    expect(this.stack.peekLayer(2).isRoot).to.be.false;
    expect(this.stack.peekLayer(3).isRoot).to.be.true;

    this.stack.push('child');
    this.stack.value.fixture = 'fixture';
    expect(this.stack.peekLayer().isRoot).to.be.false;
    expect(this.stack.peekLayer(2).isRoot).to.be.false;
    expect(this.stack.peekLayer(3).isRoot).to.be.false;
    expect(this.stack.peekLayer(4).isRoot).to.be.true;

    this.stack.popAll();
    expect(this.stack.top.isRoot).to.be.true;
    expect(this.stack.value).to.not.be.empty;
    expect(this.stack.value.child.child.child.child.fixture).to.equal('fixture');
});

it('should prevent invalid popping', function(){
    expect(this.stack.pop.bind(this.stack)).to.throw(Error);

    this.stack.push('child');
    expect(this.stack.pop.bind(this.stack)).to.not.throw(Error);
});

it('should prevent invalid peeking', function(){
    expect(this.stack.peek.bind(this.stack)).to.throw(Error);

    this.stack.push('child');
    expect(this.stack.peek.bind(this.stack)).to.not.throw(Error);
});

it('should allow array pushing', function(){
    this.stack.push('child', []);
    this.stack.value.push('fixture');

    expect(this.stack.value).to.be.array;
    expect(this.stack.value).to.have.length.of(1);

    this.stack.pop();
    expect(this.stack.value.child[0]).to.equal('fixture');
});

it('should allow full primitive value-replacing', function(){
    this.stack.push('child');
    this.stack.value = 'fixture';

    expect(this.stack.value).to.equal('fixture');
});

it('should allow full object value-replacing', function(){
    this.stack.push('child');
    this.stack.value.fixture = 'fixture';

    this.stack.value = {};
    expect(this.stack.value).to.be.empty;
});

it('should allow full array value-replacing', function(){
    this.stack.push('child', []);
    this.stack.value.push('fixture');

    this.stack.value = [];
    expect(this.stack.value).to.be.empty;
});