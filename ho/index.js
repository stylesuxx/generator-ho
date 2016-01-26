'use strict';

var generators = require('yeoman-generator'),
    environment = require('yeoman-environment'),
    extend = require('deep-extend');

module.exports = generators.Base.extend({
    constructor: function () {
        generators.Base.apply(this, arguments);

        this.description = 'Add new aliases to your ho.json using prompt. Create new ho.json if not exist';
    },

    initializing: function () {

        var current = this,
            env = environment.createEnv(),
            done = this.async();

        env.lookup(function () {
            var meta = env.getGeneratorsMeta();

            current.candidates = {};

            Object.keys(meta).forEach(function (generatorNamespace) {
                var names = generatorNamespace.split(':'),
                    generatorName = names.shift(),
                    subgeneratorName = names.shift(),
                    gen;

                if (!generatorName || !subgeneratorName) {
                    return;
                }

                gen = current.candidates[generatorName] || [];

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

            if (this.candidates[this.gen].length > 1) {
                this.prompt({
                    'message': 'Choose subgenerator',
                    'type': 'list',
                    'name': 'subgen',
                    'choices': this.candidates[this.gen],
                }, function (answers) {
                    this.subgen = answers.subgen;
                    done();
                }.bind(this));
            } else {
                this.subgen = this.candidates[this.gen][0];
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

        var result = {},
            pathToHo,
            ho;

        result[this.name] = {
            generator: this.gen,
            subgen: this.subgen,
            parameters: this.params
        };

        pathToHo = this.destinationPath('ho.json');

        ho = this.fs.readJSON(pathToHo, {});

        extend(ho, result);

        // forced rewrite ho.json without promt
        this.conflicter.force = true;

        this.fs.writeJSON(pathToHo, ho);
    }
});
