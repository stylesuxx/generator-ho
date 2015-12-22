var generators = require('yeoman-generator');

module.exports = generators.Base.extend({
  constructor: function () {
    generators.Base.apply(this, arguments);

    var cwd = this.env.cwd;
    var commands = this.fs.exists(cwd + '/ho.json') ? require(cwd + '/ho.json') : {};
    var description ='Available commands to invoke:\n\n';
    for(var command in commands) {
      description += '           + ' + command;
      description += ' (yo ' + commands[command].generator;
      description += commands[command].subgen ? ':' + commands[command].subgen : '';
      description += ')\n';
    }
    description += '\n         ';

    this.argument('command', {
      type: String,
      required: true,
      desc: description
    });
  },

  initializing: function() {},
  prompting: {},
  configuring: {},
  default: {
    console.log(this)
    //var command =
  },
  writing: {},
  conflicts: {},
  install: {},
  end: {}
});
