/**
 * Run Ghost Inspector Test
 *
 * @type {*|lodash}
 * @private
 */
const _ = require( 'lodash' );
const request = require( 'request' );
const core = require("@actions/core");
const github = require("@actions/github");
const debug = require("debug")('ghost-inspector');

debug( 'github.context.payload', JSON.stringify(github.context.payload, undefined, 2) );

const options = {
  api_key: _.get( process, 'env.GHOSTINSPECTOR_API_KEY' ) || core.getInput('api_key'),
  suite: _.get( process, 'env.GHOSTINSPECTOR_SUITE' ) || core.getInput('suite')
}

debug( 'options', JSON.stringify(options, undefined, 2) );

let _requestOptions = {
  url: 'https://api.ghostinspector.com/v1/suites/' + options.suite + '/execute/',
  json: true,
  qs: {
    apiKey: options.api_key    
  }
};

if( core.getInput('start_url') ) {
  _.set( '_requestOptions.qs.startUrl', core.getInput('start_url') );
}

request( _requestOptions, handleResponse );

/**
 * Output API response.
 *
 * @param error
 * @param resp
 * @param body
 */
function handleResponse( error, resp, body ) {
  debug( 'handleResponse' );

  if( error ) {
    core.setFailed(error.message);
  }

  debug( 'data', require('util').inspect(_.get( body, 'data' ), {depth:5,colors:true}));

  core.setOutput('time', new Date().toTimeString());
  core.setOutput('executionTime', _.get( body, 'data[0].executionTime' ));
  core.setOutput('passing', _.get( body, 'data[0].passing' ));
  core.setOutput('name', _.get( body, 'data[0].name' ));
  core.setOutput('endUrl', _.get( body, 'data[0].endUrl' ));
  core.setOutput('screenshot', _.get( body, 'data[0].screenshot.original.defaultUrl' ));
  core.setOutput('code', _.get( body, 'code' ));

}
