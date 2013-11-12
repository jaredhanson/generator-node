var generator = require('yeoman-generator')
  , path = require('path')
  , fs = require('fs')
  , util = require('util')
  , existsSync = fs.existsSync || path.existsSync; // node <=0.6


function NodeGenerator(args, options) {
  generator.Base.apply(this, arguments);
  
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
    default: this.pkg && this.pkg.description ? this.pkg.description : ''
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
    props.description = props.description || 'TODO: No description specified';
    
    this.props = props;
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
