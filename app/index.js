var generators = require('yeoman-generator');

module.exports = generators.Base.extend({
  constructor: function () {
    generators.Base.apply(this, arguments);

    var cwd = this.env.cwd;
    this.commands = this.fs.exists(cwd + '/ho.json') ? require(cwd + '/ho.json') : {};
    var description ='Available commands to invoke:\n';
    for(var command in this.commands) {
      var current = this.commands[command];
      var params = '';
      for(var param of current.parameters) {
        params += [' <', param, '>'].join('');
      }
      description += '           + ' + command + params;
      description += ' (yo ' + this.commands[command].generator;
      description += this.commands[command].subgen ? ':' + this.commands[command].subgen : '';
      description += params;
      description += ')\n';
    }
    description += '\n         ';

    this.argument('command', {
      type: String,
      required: true,
      desc: description
    });
  },

  default: {
    invoke: function() {
      var chosen = this.commands[this.args.shift()];
      var generator = chosen.generator + (chosen.subgen ? ':' + chosen.subgen : '');

      this.composeWith(
        generator,
        { args: this.args, options: this.options },
        { link: 'strong' }
      );
    }
  }
});
