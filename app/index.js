var generator = require('yeoman-generator')
  , path = require('path')
  , fs = require('fs')
  , util = require('util')
  , existsSync = fs.existsSync || path.existsSync; // node <=0.6


function NodeGenerator(args, options) {
  generator.Base.apply(this, arguments);
  
  this.pkgDefaults = {
    'dependencies': {
    },
    'devDependencies': {
      'mocha': '1.x.x',
      'chai': '1.x.x'
    },
    'engines': {
      'node': '*'
    },
    'scripts': {
      'test': 'node_modules/.bin/mocha --reporter spec --require test/bootstrap/node test/*.test.js'
    }
  }
  
  if (existsSync('package.json')) {
    try {
      this.pkg = JSON.parse(fs.readFileSync('package.json'));
    } catch (_) {}
  }
}

util.inherits(NodeGenerator, generator.Base);

NodeGenerator.prototype.doPrompt = function() {
  var done = this.async();

  var prompts = [{
    name: 'name',
    message: 'Name',
    default: this.pkg && this.pkg.name ? this.pkg.name : path.basename(process.cwd())
  }, {
    name: 'version',
    message: 'Version',
    default: this.pkg && this.pkg.version ? this.pkg.version : '0.0.0'
  }, {
    name: 'description',
    message: 'Description',
    default: this.pkg && this.pkg.description ? this.pkg.description : '',
    filter: function(input) { return input || 'TODO: No description specified'; }
  }, {
    name: 'keywords',
    message: 'Keywords',
    default: this.pkg && this.pkg.keywords ? this.pkg.keywords.join(', ') : '',
    filter: function(input) {
      if (!input) { return []; }
      var separators = [',', ' '];
      for (var i = 0, len = separators.length; i < len; i++) {
        var words = input.split(separators[i]);
        if (words.length > 1) {
          return words.map(function(word) { return word.trim(); });
        }
      }
      return [ input.trim() ];
    }
  }, {
    name: 'authorName',
    message: 'Author Name',
    default: this.pkg && this.pkg.author && this.pkg.author.name ? this.pkg.author.name : ''
  }, {
    name: 'authorEmail',
    message: 'Author Email',
    default: this.pkg && this.pkg.author && this.pkg.author.email ? this.pkg.author.email : ''
  }, {
    name: 'authorUrl',
    message: 'Author URL',
    default: this.pkg && this.pkg.author && this.pkg.author.url ? this.pkg.author.url : ''
  }];
  
  this.prompt(prompts, function(props) {
    this.props = props;
    
    this.props.dependencies = this.pkg && this.pkg.dependencies ? this.pkg.dependencies : this.pkgDefaults.dependencies;
    this.props.devDependencies = this.pkg && this.pkg.devDependencies ? this.pkg.devDependencies : this.pkgDefaults.devDependencies;
    this.props.engines = this.pkg && this.pkg.engines ? this.pkg.engines : this.pkgDefaults.engines;
    this.props.scripts = this.pkg && this.pkg.scripts ? this.pkg.scripts : this.pkgDefaults.scripts;
    
    done();
  }.bind(this));
};

NodeGenerator.prototype.doGenerate = function() {
  this.template('package.json', 'package.json');
  this.mkdir('lib');
  this.mkdir('test');
  this.mkdir('test/bootstrap');
  this.copy('test/bootstrap/node.js', 'test/bootstrap/node.js');
  this.template('test/package.test.js', 'test/package.test.js');
  
  this.copy('Makefile', 'Makefile');
  this.directory('support', 'support');
  
  this.copy('_gitignore', '.gitignore');
  this.copy('_jshintrc', '.jshintrc');
  this.copy('_npmignore', '.npmignore');
  this.copy('_travis.yml', '.travis.yml');
}

module.exports = NodeGenerator;
