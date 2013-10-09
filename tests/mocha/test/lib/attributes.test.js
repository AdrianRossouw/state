// Generated by CoffeeScript 1.6.3
(function() {
  var ABSTRACT, CONCRETE, NIL, RootState, State, TransitionExpression, expect, state, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ref = state = require('../'), State = _ref.State, RootState = _ref.RootState, TransitionExpression = _ref.TransitionExpression;

  NIL = state.O.NIL;

  ABSTRACT = State.ABSTRACT, CONCRETE = State.CONCRETE;

  expect = require('chai').expect;

  describe("Attributes:", function() {
    var Child, Parent, _ref1;
    Parent = (function() {
      function Parent() {}

      state(Parent.prototype, 'abstract', {
        A: state('default'),
        B: state('initial'),
        C: state('conclusive', {
          CA: state,
          CB: state,
          CC: state('final', {
            CCA: state('initial')
          })
        })
      });

      return Parent;

    })();
    Child = (function(_super) {
      __extends(Child, _super);

      function Child() {
        _ref1 = Child.__super__.constructor.apply(this, arguments);
        return _ref1;
      }

      state(Child.prototype, 'concrete');

      return Child;

    })(Parent);
    describe("Abstraction:", function() {
      describe("An empty state with no literal or inherited attributes", function() {
        var o, s;
        state(o = {}, null);
        s = o.state();
        it("must implicitly bear the `concrete` attribute", function() {
          return expect(s.isConcrete()).to.be["true"];
        });
        return it("must implicitly negate the `abstract` attribute", function() {
          return expect(s.isAbstract()).to.be["false"];
        });
      });
      describe("The presence of `abstract`", function() {
        return it("must negate the `concrete` attribute that a state would otherwise bear via inheritance", function() {
          var s;
          s = Parent.prototype.state('');
          expect(s.isAbstract()).to.be["true"];
          return expect(s.isConcrete()).to.be["false"];
        });
      });
      describe("Literal `concrete` on the epistate of an `abstract` protostate", function() {
        return it("must negate the `abstract` attribute it would otherwise bear", function() {
          var s;
          s = Child.prototype.state('');
          expect(s.isConcrete()).to.be["true"];
          return expect(s.isAbstract()).to.be["false"];
        });
      });
      describe("An epistate with no literal attributes", function() {
        return it("must bear the same abstraction attributes as its protostate", function() {
          var c, s;
          c = new Child;
          s = c.state('');
          expect(s.isConcrete()).to.be["true"];
          expect(s.isAbstract()).to.be["false"];
          return expect(s.attributes & (ABSTRACT | CONCRETE)).to.equal(s.protostate().attributes & (ABSTRACT | CONCRETE));
        });
      });
      describe("An invalid production including both literal `abstract` and literal `concrete`", function() {
        var p;
        state(p = new Parent, 'abstract concrete', null);
        return it("must give precedence to `concrete` and negate `abstract`", function() {
          var s;
          s = p.state('');
          expect(s.isConcrete()).to.be["true"];
          return expect(s.isAbstract()).to.be["false"];
        });
      });
      return describe("Comparing inheritors of the same prototype that have differing literal abstraction attributes:", function() {
        describe("A second-level epistate", function() {
          var c;
          c = new Child;
          it("must override the abstraction attributes of its protostate", function() {
            return expect(c.state()).to.exist;
          });
          return it("which in turn must override those of the next protostate", function() {
            return expect(Child.prototype.state()).to.exist;
          });
        });
        return describe("Ordering a transition to the root state:", function() {
          describe("A cleanly inheriting instance", function() {
            var c;
            c = new Child;
            it("must complete a transition", function() {
              return expect(function() {
                return c.state('->');
              }).to.not["throw"](Error);
            });
            return it("must arrive at its root state", function() {
              return expect(c.state().name).to.equal('');
            });
          });
          return describe("An overriding instance", function() {
            var c;
            c = new Child;
            state(c, 'abstract', null);
            it("must complete a transition", function() {
              return expect(function() {
                return c.state('->');
              }).to.not["throw"](Error);
            });
            return it("must be redirected to the `default` substate", function() {
              var ds, root, s;
              root = c.state('');
              s = c.state();
              ds = root.defaultSubstate();
              c.state('->');
              expect(s).to.not.equal(root);
              return expect(s.path()).to.equal(ds.path());
            });
          });
        });
      });
    });
    describe("Destination:", function() {
      describe("The `initial` attribute", function() {
        it("must be inherited by an instance from its prototype’s tree", function() {
          var s;
          s = (new Parent).state();
          expect(s.name).to.equal('B');
          return expect(s.isInitial()).to.be["true"];
        });
        return describe("if applied ambiguously to multiple states in a state tree", function() {
          return it("must resolve in a depth-within-breadth-first manner", function() {
            var s;
            s = Parent.prototype.state();
            expect(s.name).to.equal('B');
            return expect(s.name).to.not.equal('CCA');
          });
        });
      });
      describe("The `conclusive` attribute", function() {
        it("must be inherited via protostate", function() {
          var p;
          p = new Parent;
          return expect(p.state('C').isConclusive()).to.be["true"];
        });
        it("must cause a state to prohibit transitions that would exit it", function() {
          var p, s;
          p = new Parent;
          p.state('-> C');
          p.state('-> B');
          s = p.state();
          expect(s.name).to.not.equal('B');
          expect(s.name).to.equal('C');
          return expect(s.isConclusive()).to.be["true"];
        });
        return it("must cause a state to allow transitions that wouldn’t exit it", function() {
          var p, s;
          p = new Parent;
          p.state('-> C');
          p.state('-> CB');
          s = p.state();
          return expect(s.name).to.equal('CB');
        });
      });
      return describe("The `final` attribute", function() {
        it("must be inherited via protostate", function() {
          var p, s;
          p = new Parent;
          p.state('-> CC');
          s = p.state();
          expect(s.owner).to.equal(p);
          expect(s.name).to.equal('CC');
          expect(s.isFinal()).to.be["true"];
          return expect(s.isVirtual()).to.be["true"];
        });
        it("must prohibit transitions that would depart a `final` state", function() {
          var p, s;
          p = new Parent;
          p.state('-> CC');
          p.state('-> CA');
          s = p.state();
          expect(s.name).to.equal('CC');
          expect(s.name).to.not.equal('CA');
          return expect(s.isFinal()).to.be["true"];
        });
        it("must not trap transitions that enter but do not arrive", function() {
          var p, s;
          p = new Parent;
          p.state('-> CCA');
          s = p.state();
          expect(s.name).to.equal('CCA');
          expect(s.name).to.not.equal('CC');
          return expect(s.isFinal()).to.be["false"];
        });
        return it("must allow transitions originating from a substate to exit", function() {
          var p, s;
          p = new Parent;
          p.state('-> CCA');
          p.state('-> CA');
          s = p.state();
          expect(s.name).to.equal('CA');
          expect(s.name).to.not.equal('CC');
          return expect(s.isFinal()).to.be["false"];
        });
      });
    });
    return describe("Mutability:", function() {
      var testFinitudeOf, testImmutabilityOf, testMutabilityOf;
      testMutabilityOf = function(s) {
        it("is marked `mutable`", function() {
          return expect(s.isMutable()).to.be["true"];
        });
        it("allows mutation of properties", function() {
          s["let"]('key', "value");
          expect(s.get('key')).to.equal("value");
          s["delete"]('key');
          return expect(s.get('key')).to.be.undefined;
        });
        it("allows mutation of methods", function() {
          var f;
          s.addMethod('m', f = function() {});
          expect(f).to.equal(s.method('m'));
          s.removeMethod('m');
          return expect(s.method('m')).to.be.undefined;
        });
        it("allows mutation of events", function() {
          var f, id;
          id = s.on('exit', f = function(transition) {});
          expect(f).to.equal(s.event('exit', id));
          s.off('exit', id);
          return expect(s.event('exit', id)).to.be.undefined;
        });
        it("allows mutation of guards", function() {
          s.addGuard('admit', function() {});
          expect(s.guard('admit')).to.be.ok;
          s.removeGuard('admit');
          return expect(s.guard('admit')).to.be.undefined;
        });
        it("allows mutation of substates", function() {
          s.addSubstate('A', {});
          expect(s.substate('A')).to.be["instanceof"](State);
          s.removeSubstate('A');
          return expect(s.substate('A')).to.be.undefined;
        });
        return it("allows mutation of transitions", function() {
          s.addTransition('T', {});
          expect(s.transition('T')).to.be["instanceof"](TransitionExpression);
          s.removeTransition('T');
          return expect(s.transition('T')).to.be.undefined;
        });
      };
      testFinitudeOf = function(s) {
        it("is marked `finite`", function() {
          return expect(s.isFinite()).to.be["true"];
        });
        it("allows mutation of properties", function() {
          s["let"]('key', "value");
          expect(s.get('key')).to.equal("value");
          s["delete"]('key');
          return expect(s.get('key')).to.be.undefined;
        });
        it("allows mutation of methods", function() {
          var f;
          s.addMethod('m', f = function() {});
          expect(f).to.equal(s.method('m'));
          s.removeMethod('m');
          return expect(s.method('m')).to.be.undefined;
        });
        it("allows mutation of events", function() {
          var f, id;
          id = s.on('exit', f = function(transition) {});
          expect(f).to.equal(s.event('exit', id));
          s.off('exit', id);
          return expect(s.event('exit', id)).to.be.undefined;
        });
        it("allows mutation of guards", function() {
          s.addGuard('admit', function() {});
          expect(s.guard('admit')).to.be.ok;
          s.removeGuard('admit');
          return expect(s.guard('admit')).to.be.undefined;
        });
        it("prohibits mutation of substates", function() {
          s.addSubstate('A', {});
          return expect(s.substate('A')).to.be.undefined;
        });
        return it("allows mutation of transitions", function() {
          s.addTransition('T', {});
          expect(s.transition('T')).to.be["instanceof"](TransitionExpression);
          s.removeTransition('T');
          return expect(s.transition('T')).to.be.undefined;
        });
      };
      testImmutabilityOf = function(s, weak) {
        if (!weak) {
          it("is marked `immutable`", function() {
            return expect(s.isImmutable()).to.be["true"];
          });
        }
        it("prohibits mutation of properties", function() {
          s["let"]('key', "value");
          return expect(s.get('key')).to.be.undefined;
        });
        it("prohibits mutation of methods", function() {
          s.addMethod('m', function() {});
          return expect(s.method('m')).to.be.undefined;
        });
        it("does allow mutation of events", function() {
          var f, id;
          id = s.on('exit', f = function(transition) {});
          expect(f).to.equal(s.event('exit', id));
          s.off('exit', id);
          return expect(s.event('exit', id)).to.be.undefined;
        });
        it("prohibits mutation of guards", function() {
          s.addGuard('admit', function() {});
          return expect(s.guard('admit')).to.be.undefined;
        });
        it("prohibits mutation of substates", function() {
          s.addSubstate('A', {});
          return expect(s.substate('A')).to.be.undefined;
        });
        return it("prohibits mutation of transitions", function() {
          s.addTransition('T', {});
          return expect(s.transition('T')).to.be.undefined;
        });
      };
      describe("A state unaffected by mutability attributes", function() {
        return describe("is weakly immutable, which", function() {
          var o, s, weak;
          state(o = {}, null);
          s = o.state('');
          it("does not mark the state as `immutable`", function() {
            return expect(s.isImmutable()).to.be["false"];
          });
          return testImmutabilityOf(s, weak = true);
        });
      });
      describe("The `mutable` attribute:", function() {
        describe("A state that is literal `mutable`", function() {
          var o;
          state(o = {}, 'mutable', null);
          return testMutabilityOf(o.state(''));
        });
        describe("A state that inherits `mutable` via superstate", function() {
          var o;
          state(o = {}, 'mutable', {
            A: state
          });
          return testMutabilityOf(o.state('A'));
        });
        describe("A state that inherits `mutable` via protostate", function() {
          var Class, o;
          Class = (function() {
            function Class() {}

            state(Class.prototype, 'mutable', null);

            return Class;

          })();
          o = new Class;
          return testMutabilityOf(o.state(''));
        });
        return describe("A state that inherits `mutable` via super- and proto-", function() {
          var Class, o;
          Class = (function() {
            function Class() {}

            state(Class.prototype, 'mutable', {
              A: state
            });

            return Class;

          })();
          o = new Class;
          return testMutabilityOf(o.state('A'));
        });
      });
      describe("The `finite` attribute:", function() {
        describe("in superior overruling position relative to `mutable`", function() {
          var o;
          state(o = {}, 'finite', {
            A: state('mutable')
          });
          return testFinitudeOf(o.state('A'));
        });
        describe("in inferior overruling position relative to `mutable`", function() {
          var o;
          state(o = {}, 'mutable', {
            A: state('finite')
          });
          return testFinitudeOf(o.state('A'));
        });
        describe("in prototypal overruling position relative to `mutable`", function() {
          var Class, o;
          Class = (function() {
            function Class() {}

            state(Class.prototype, 'finite');

            return Class;

          })();
          state(o = new Class, 'mutable');
          return testFinitudeOf(o.state(''));
        });
        return describe("in epitypal overruling position relative to `mutable`", function() {
          var Class, o;
          Class = (function() {
            function Class() {}

            state(Class.prototype, 'mutable');

            return Class;

          })();
          state(o = new Class, 'finite');
          return testFinitudeOf(o.state(''));
        });
      });
      return describe("The `immutable` attribute:", function() {
        describe("in superior overruling position relative to `mutable`", function() {
          var o;
          state(o = {}, 'immutable', {
            A: state('mutable')
          });
          return testImmutabilityOf(o.state('A'));
        });
        describe("in inferior overruling position relative to `mutable`", function() {
          var o;
          state(o = {}, 'mutable', {
            A: state('immutable')
          });
          return testImmutabilityOf(o.state('A'));
        });
        describe("in prototypal overruling position relative to `mutable`", function() {
          var Class, o;
          Class = (function() {
            function Class() {}

            state(Class.prototype, 'immutable');

            return Class;

          })();
          state(o = new Class, 'mutable');
          return testImmutabilityOf(o.state(''));
        });
        return describe("in epitypal overruling position relative to `mutable`", function() {
          var Class, o;
          Class = (function() {
            function Class() {}

            state(Class.prototype, 'mutable');

            return Class;

          })();
          state(o = new Class, 'immutable');
          return testImmutabilityOf(o.state(''));
        });
      });
    });
  });

}).call(this);