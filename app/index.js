var generator = require('yeoman-generator')
  , uri = require('url')
  , path = require('path')
  , fs = require('fs')
  , util = require('util')
  , existsSync = fs.existsSync || path.existsSync; // node <=0.6


function NodeGenerator(args, options) {
  generator.Base.apply(this, arguments);
  
  this.pkgDefaults = {
    'main': './lib',
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
  var self = this;
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
  }, {
    name: 'repositoryUrl',
    message: 'Repository URL',
    default: this.pkg && this.pkg.repository && this.pkg.repository.url ? this.pkg.repository.url : '',
    filter: function(input) {
      var url = uri.parse(input);
      if (url.protocol) { return uri.format(url); }
      var segments = url.pathname.split('/');
      switch (segments.length) {
      case 2:
        return 'git://github.com/' + segments.join('/') + '.git';
      case 3:
        return 'git://' + segments.join('/') + '.git';
      }
      return input;
    }
  }, {
    name: 'licenseType',
    message: 'License',
    default: function() {
      if (self.pkg && self.pkg.licenses && self.pkg.licenses[0]) { return self.pkg.licenses[0].type || 'MIT'; }
      return 'MIT';
    }
  }];
  
  this.prompt(prompts, function(props) {
    this.props = props;
    this.props.repositoryType = 'git';
    
    var repositoryUrl = uri.parse(props.repositoryUrl)
      , segments = repositoryUrl.pathname.slice(1).split('/')
    switch (repositoryUrl.hostname) {
      case 'github.com': {
        this.props.bugsUrl = 'http://github.com/' + segments[0] + '/' + segments[1].replace(/\.git$/, '') + '/issues';
        break;
      }
      default: {
        this.props.bugsUrl = this.pkg && this.pkg.bugs && this.pkg.bugs.url ? this.pkg.bugs.url : '';
        break;
      }
    }
    
    // TODO: Implement support for more license types
    if (props.licenseType == 'MIT') {
      props.licenseUrl = 'http://www.opensource.org/licenses/MIT';
    }
    
    this.props.main = this.pkg && this.pkg.main ? this.pkg.main : this.pkgDefaults.main;
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
