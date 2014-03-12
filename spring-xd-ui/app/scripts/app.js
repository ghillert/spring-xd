'use strict';

var xdApp = angular.module('App', [
  'App.Controllers',
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngRoute',
  'ui.router',
  'xdService',
  'cgBusy',
  'ajoslin.promise-tracker',
  'angular-growl'
]);

xdApp.run(function ($rootScope, $state, $stateParams, User, $log) {
  $rootScope.$state = $state;
  $rootScope.$stateParams = $stateParams;
  $rootScope.xdAdminServerUrl = window.location.protocol + '//' + window.location.host;
  $rootScope.authenticationEnabled = false;
  $rootScope.user = User;

  $rootScope.$on('$stateChangeStart', function(event, toState) {
      $log.info('Need to authenticate? ' + toState.data.authenticate);
      if ($rootScope.authenticationEnabled && toState.data.authenticate && !User.isLogged){
        // User is not authenticated
        $state.transitionTo('login');
        event.preventDefault();
      }
    });
});

xdApp.config(function ($stateProvider, $urlRouterProvider, $httpProvider) {

  $httpProvider.defaults.useXDomain = true;
  //delete $httpProvider.defaults.headers.common['X-Requested-With'];

  $urlRouterProvider.otherwise('/jobs/definitions');

  $stateProvider.state('home', {
    url : '/',
    abstract:true,
    templateUrl : 'views/home.html'
  })
  .state('home.jobs', {
    url : 'jobs',
    abstract:true,
    data:{
      authenticate: true
    },
    templateUrl : 'views/jobs/jobs.html',
  })
  .state('home.about', {
    url : 'about',
    templateUrl : 'views/about.html'
  })
  .state('login', {
    url : '/login',
    controller: 'LoginController',
    templateUrl : 'views/login.html',
    data:{
      authenticate: false
    }
  })
  .state('logout', {
    url : '/logout',
    controller: 'LogoutController',
    templateUrl : 'views/login.html',
    data:{
      authenticate: true
    }
  })
  .state('home.jobs.templates', {
    url : '/templates',
    templateUrl : 'views/jobs/templates.html',
    controller: 'TemplatesController'
  })
  .state('home.jobs.definitions', {
    url : '/definitions',
    templateUrl : 'views/jobs/definitions.html',
    controller: 'ListDefinitionController'
  })
  .state('home.jobs.deployments', {
    url : '/deployments',
    templateUrl : 'views/jobs/deployments.html',
    controller: 'ListJobDeploymentsController'
  })
  .state('home.jobs.scheduledJobs', {
    url : '/scheduled-jobs',
    templateUrl : 'views/jobs/scheduledJobs.html',
    controller: 'ScheduledJobsController'
  })
  .state('home.jobs.executions', {
    url : '/executions',
    templateUrl : 'views/jobs/executions.html',
    controller: 'ListJobExecutionsController'
  })
  .state('home.jobs.deployments.launch', {
    url : '/launch/{jobName}',
    templateUrl : 'views/jobs/launch.html',
    controller: 'LaunchJobController'
  });
});