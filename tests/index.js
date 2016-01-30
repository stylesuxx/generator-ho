var test = require('tape');
var path = require('path');
var helpers = require('yeoman-test');
var fs = require('fs-extra');
var Promise = require('bluebird');

test('ho:app test', function (t) {
  t.plan(4);

  Promise.try(function() {
    return new Promise(function(resolve, reject) {
      helpers.run(path.join(__dirname, '../app'))
      .inTmpDir(function(tmpDir) {
        fs.copySync(path.join(__dirname, 'ho.json'), path.join(tmpDir, 'ho.json'));
      })
      .withArguments(['test'])
      .on('ready', function(gen) {
        var helpMessage = gen.help();

        var patternAction = /action \<name\> \(yo react-webpack-redux:action \<name\>\)/mi;
        var patternReducer = /reducer \<name\> \(yo react-webpack-redux:reducer \<name\>\)/mi;
        var patternComponent = /component \<name\> \(yo react-webpack:component \<name\>\)/mi;

        var resultAction = helpMessage.search(patternAction);
        var resultReducer = helpMessage.search(patternReducer);
        var resultComponent = helpMessage.search(patternComponent);

        t.ok(resultAction, 'Found action example command in help');
        t.ok(resultReducer, 'Found reducer example command in help');
        t.ok(resultComponent, 'Found component example command in help');
      })
      .on('error', function(err) {
        reject(err);
      });
    });
  }).catch(function(e) {
    var error = 'Error: You don\'t seem to have a generator with the name non-existent:imaginary installed.';
    e = e.toString();
    if(e.slice(0, error.length) === error) {
      t.pass('Throws missing generator error');
    }
  });
});

test('ho:ho', function(t) {
  t.plan(5);

  var aliasName = 'testAlias';
  var genName = 'testGen'
  var subgenName = 'testSubgen';

  helpers.run(path.join(__dirname, '../ho'))
    .withPrompts({
      'name': aliasName,
      'gen': genName,
      'subgen': subgenName,
      'params': ['testPar1', 'testPar2']
    })
    .on('end', function() {
      var resultHo = fs.readJsonSync('./ho.json');

      t.ok(!!resultHo, 'ho.json exists');

      var alias = resultHo[aliasName];
      t.ok(alias != null, 'valid alias name');
      t.ok(alias.generator === genName, 'valid generator name');
      // because prompting checks if there are at least few subgenerators
      // this prompt doesn't run at all, and subgen sets to default value
      t.ok(alias.subgen === 'app', 'valid subgenerator name');

      var params = alias['parameters'];
      t.ok(params.length === 2, 'valid number of params');
    });
});
