const _ = require( 'lodash' );
const request = require( 'request' );
const core = require("@actions/core");

Object.defineProperty(exports, "__esModule", { value: true });

// const payload = JSON.stringify(github.context.payload, undefined, 2)

request({
  url: 'https://api.ghostinspector.com/v1/suites/' + core.getInput('suite') + '/execute/',
  json: true,
  qs: {
    'apiKey': core.getInput('api_key')
}
}, handleResponse );

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

  core.setOutput('time', new Date().toTimeString());
  core.setOutput('code', _.get( body, 'code' ));

}