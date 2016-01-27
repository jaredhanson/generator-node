var generator = require('yeoman-generator')
  , uri = require('url')
  , fs = require('fs');


module.exports = generator.Base.extend({
  
  constructor: function () {
    generator.Base.apply(this, arguments);
    
    this.option('test', {
      desc: 'Test framework to use for project',
      defaults: 'mocha',
      type: String
    });
    
    this.option('assert', {
      desc: 'Assertion library to use in test suite',
      defaults: 'chai',
      type: String
    });
    
    this.option('lint', {
      desc: 'Linter to use for project',
      defaults: 'jshint',
      type: String
    });
    
    this.option('ci', {
      desc: 'Continuous integration service to use for project',
      defaults: 'travis-ci',
      type: String
    });
  },
  
  initializing: function () {
    this.props = {};
    this.props.year = (new Date()).getFullYear();
    
    this.props.main = './lib';
    
    switch (this.options.test) {
    case 'mocha':
      this.props.devDependencies = this.props.devDependencies || {};
      this.props.devDependencies.mocha = '^2.0.0';
      this.props.scripts = this.props.scripts || {};
      this.props.scripts.test = 'node_modules/.bin/mocha --require test/bootstrap/node test/*.test.js';
      break;
    case 'none':
      this.props.scripts = this.props.scripts || {};
      this.props.scripts.test = 'echo \\"Error: no test specified\\" && exit 1';
    }
    
    if (this.options.test !== 'none') {
      switch (this.options.assert) {
      case 'chai':
        this.props.devDependencies = this.props.devDependencies || {};
        this.props.devDependencies.chai = '^3.0.0';
        break;
      }
    }
    
    
    var path = this.destinationPath('package.json')
      , pkg;
    if (fs.existsSync(path)) {
      try {
        pkg = JSON.parse(fs.readFileSync(path));
        
        this.props.name = pkg.name;
        this.props.version = pkg.version;
        this.props.description = pkg.description;
        this.props.keywords = pkg.keywords;
        this.props.authorName = pkg.author && pkg.author.name;
        this.props.authorEmail = pkg.author && pkg.author.email;
        this.props.authorUrl = pkg.author && pkg.author.url;
        this.props.repositoryUrl = pkg.repository && pkg.repository.url;
        this.props.bugsUrl = pkg.bugs && pkg.bugs.url;
        
        this.props.main = pkg.main;
        this.props.dependencies = pkg.dependencies
        this.props.devDependencies = pkg.devDependencies;
        this.props.engines = pkg.engines;
        this.props.scripts = pkg.scripts;
      } catch (_) {}
    }
  },
  
  prompting: function() {
    var done = this.async();
    
    this.prompt([
      { type    : 'input',
        name    : 'name',
        message : 'Name',
        default : this.props.name || this.appname // default to name of current directory
      }, {
        type    : 'input',
        name    : 'version',
        message : 'Version',
        default : this.props.version || '0.0.0'
      }, {
        type    : 'input',
        name    : 'description',
        message : 'Description',
        default : this.props.description || ''
      },{
        name: 'keywords',
        message: 'Keywords',
        default: this.props.keywords ? this.props.keywords.join(', ') : '',
        filter: function(input) {
          if (!input) { return ''; }
          
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
        type    : 'input',
        name    : 'authorName',
        message : 'Author Name',
        default : this.props.authorName,
        store   : this.props.authorName !== undefined ? false : true
      }, {
        type    : 'input',
        name    : 'authorEmail',
        message : 'Author Email',
        default : this.props.authorEmail,
        store   : this.props.authorEmail !== undefined ? false : true
      }, {
        type    : 'input',
        name    : 'authorUrl',
        message : 'Author URL',
        default : this.props.authorUrl,
        store   : this.props.authorUrl !== undefined ? false : true
      }, {
        type    : 'input',
        name    : 'repositoryUrl',
        message : 'Repository URL',
        default : this.props.repositoryUrl,
        filter: function(input) {
          if (input.length == 0) { return input; }
          
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
        type    : 'list',
        name    : 'licenseType',
        message : 'License',
        choices : [ 'MIT', 'UNLICENSED' ],
        default : this.props.licenceType || 'MIT'
      }
    ], function (answers) {
      this.props.name = answers.name;
      this.props.version = answers.version;
      this.props.description = answers.description;
      this.props.authorName = answers.authorName;
      this.props.authorEmail = answers.authorEmail;
      this.props.authorUrl = answers.authorUrl;
      this.props.repositoryUrl = answers.repositoryUrl || undefined;
      this.props.licenseType = answers.licenseType;
      
      
      var url, segments;
      
      if (this.props.repositoryUrl) {
        this.props.repositoryType = 'git';

        url = uri.parse(answers.repositoryUrl);
        segments = url.pathname.slice(1).split('/');
        
        switch (url.hostname) {
        case 'github.com':
          this.props.bugsUrl = this.props.bugsUrl || 'http://github.com/' + segments[0] + '/' + segments[1].replace(/\.git$/, '') + '/issues';
          break;
        }
      }
      
      switch (this.props.licenseType) {
      case 'MIT':
        this.props.licenseUrl = 'http://opensource.org/licenses/MIT';
        break;
      }
      
      done();
    }.bind(this));
  },
  
  writing: function() {
    this.fs.copyTpl(this.templatePath('package.json'), this.destinationPath('package.json'), this.props);
    this.fs.copy(this.templatePath('Makefile'), this.destinationPath('Makefile'));
    this.fs.copy(this.templatePath('_gitignore'), this.destinationPath('.gitignore'));
    this.fs.copy(this.templatePath('_npmignore'), this.destinationPath('.npmignore'));
  
    switch (this.props.licenseType) {
    case 'MIT':
      this.fs.copyTpl(this.templatePath('licenses/MIT'), this.destinationPath('LICENSE'), this.props);
      break;
    case 'UNLICENSED':
      this.fs.copyTpl(this.templatePath('licenses/UNLICENSED'), this.destinationPath('LICENSE'), this.props);
      break;
    default:
      break;
    }
  
    switch (this.options.lint) {
    case 'jshint':
      this.fs.copy(this.templatePath('_jshintrc'), this.destinationPath('.jshintrc'));
      break;
    }
    
    switch (this.options.ci) {
    case 'travis-ci':
      this.fs.copy(this.templatePath('_travis.yml'), this.destinationPath('.travis.yml'));
      break;
    }
    
    // TODO:
    /*
    if (!existsSync('README.md')) {
      this.template('README.md', 'README.md');
    }
  
    this.template('package.json', 'package.json');
    this.mkdir('lib');
    this.mkdir('test');
    this.mkdir('test/bootstrap');
    this.copy('test/bootstrap/node.js', 'test/bootstrap/node.js');
    if (!existsSync('test/package.test.js')) {
      this.template('test/package.test.js', 'test/package.test.js');
    }
    */
  }
  
});
