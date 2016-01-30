'use strict';

var yeoman = require('yeoman-generator');

module.exports = yeoman.Base.extend({
    constructor: function () {
        yeoman.Base.apply(this, arguments);

        this.description = 'Add new aliases to your ho.json using prompt. Create new ho.json if not exist';
    },

    initializing: function () {

        var current = this;
        var env = yeoman();
        var done = this.async();

        env.lookup(function () {
            var meta = env.getGeneratorsMeta();

            current.candidates = {};

            Object.keys(meta).forEach(function (generatorNamespace) {
                var names = generatorNamespace.split(':');
                var generatorName = names.shift();
                var subgeneratorName = names.shift();

                if (!generatorName || !subgeneratorName) {
                    return;
                }

                var gen = current.candidates[generatorName] || [];

                gen.push(subgeneratorName);
                current.candidates[generatorName] = gen;
            });
            done();
        });
    },

    prompting: {
        gen: function () {
            var done = this.async();

            this.prompt({
                'message': 'Choose generator to add:',
                'type': 'list',
                'name': 'gen',
                'choices': Object.keys(this.candidates)
            }, function (answers) {
                this.gen = answers.gen;

                done();
            }.bind(this));
        },

        subgen: function () {
            var done = this.async();

            var subgens = this.candidates[this.gen];

            if (!!subgens && subgens.length > 1) {
                this.prompt({
                    'message': 'Choose subgenerator',
                    'type': 'list',
                    'name': 'subgen',
                    'choices': this.candidates[this.gen]
                }, function (answers) {
                    this.subgen = answers.subgen;
                    done();
                }.bind(this));
            } else {
                this.subgen = !!subgens && subgens.length > 0 ? subgens[0] : 'app';
                done();
            }
        },

        name: function () {
            var done = this.async();

            this.prompt({
                'message': 'Enter new alias name: ',
                'type': 'input',
                'name': 'name',
                'default': 'ho'
            }, function (answers) {
                this.name = answers.name;
                done();
            }.bind(this));
        },

        params: function () {
            var done = this.async();

            this.prompt({
                'message': 'Enter all parameters: ',
                'type': 'input',
                'name': 'params',
                'filter': function (input) {
                    var str = input.trim();
                    return str === '' ? [] : str.split(' ');
                }
            }, function (answers) {
                this.params = answers.params;
                done();
            }.bind(this));
        }
    },

    writing: function () {

        var pathToHo = this.destinationPath('ho.json');

        var ho = this.fs.readJSON(pathToHo, {});
        ho[this.name] = {
            generator: this.gen,
            subgen: this.subgen,
            parameters: this.params
        };

        // forced rewrite ho.json without promt
        this.conflicter.force = true;

        this.fs.writeJSON(pathToHo, ho);
    }
});
