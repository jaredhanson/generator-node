var generator = require('yeoman-generator')
  , path = require('path')
  , util = require('util');


function NodeGenerator(args, options) {
  generator.Base.apply(this, arguments);
}

util.inherits(NodeGenerator, generator.Base);

NodeGenerator.prototype.doPrompt = function() {
  var done = this.async();

  var prompts = [{
    name: 'name',
    message: 'Name',
    default: path.basename(process.cwd())
  }, {
    name: 'version',
    message: 'Version',
    default: '0.0.0'
  }, {
    name: 'description',
    message: 'Description',
    default: ''
  }, {
    name: 'authorName',
    message: 'Author Name',
    default: ''
  }, {
    name: 'authorEmail',
    message: 'Author Email',
    default: ''
  }, {
    name: 'authorUrl',
    message: 'Author URL',
    default: ''
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
  
  this.mkdir('support');
  this.mkdir('support/mk');
  
  this.copy('_gitignore', '.gitignore');
}

module.exports = NodeGenerator;
